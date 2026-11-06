import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret-test-secret-test-secret-123456";

const TEST_URI = process.env.TEST_MONGODB_URI || "mongodb://127.0.0.1:27017/mit_test";
const X = { "X-Requested-With": "XMLHttpRequest" };
const PASS = "Str0ngPassw0rd";

let app: any;
let agent: ReturnType<typeof request.agent>;
let editorAgent: ReturnType<typeof request.agent>;

beforeAll(async () => {
  const { connectDB } = await import("../config/db.js");
  const { createApp } = await import("../app.js");
  const { seedContent } = await import("../seed/seed.js");
  const { User } = await import("../models/User.js");
  await connectDB(TEST_URI);
  await mongoose.connection.dropDatabase();
  await mongoose.syncIndexes();
  await seedContent();
  await User.create({ name: "Root", email: "root@test.com", password: PASS, role: "superadmin" });
  await User.create({ name: "Ed", email: "ed@test.com", password: PASS, role: "editor" });
  app = createApp();
  agent = request.agent(app);
  editorAgent = request.agent(app);
  await agent.post("/api/auth/login").send({ email: "root@test.com", password: PASS }).expect(200);
  await editorAgent.post("/api/auth/login").send({ email: "ed@test.com", password: PASS }).expect(200);
});
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe("health & public content comes from MongoDB", () => {
  it("health reports connected DB", async () => {
    const r = await request(app).get("/api/health").expect(200);
    expect(r.body.database.connected).toBe(true);
  });
  it.each([
    ["courses", 16], ["branches", 7], ["placements", 64], ["partners", 47], ["faqs", 31],
    ["blogs", 6], ["legal", 5], ["team", 8], ["reviews", 16]
  ])("GET /api/%s returns seeded rows", async (path, n) => {
    const r = await request(app).get(`/api/${path}`).expect(200);
    expect(r.body.data.length).toBe(n);
  });
  it("filters by scope and kind", async () => {
    const f = await request(app).get("/api/faqs?scope=support").expect(200);
    expect(f.body.data.every((x: any) => x.scope === "support")).toBe(true);
    const v = await request(app).get("/api/reviews?kind=video").expect(200);
    expect(v.body.data.every((x: any) => x.kind === "video")).toBe(true);
  });
  it("single course by slug + legal by slug + settings", async () => {
    const c = await request(app).get("/api/courses/data-science").expect(200);
    expect(c.body.data.name).toMatch(/Data Science/);
    await request(app).get("/api/legal/privacy-policy").expect(200);
    const s = await request(app).get("/api/settings").expect(200);
    expect(s.body.data.companyName).toBeTruthy();
  });
  it("blog list hides content body, detail has it", async () => {
    const l = await request(app).get("/api/blogs").expect(200);
    expect(l.body.data[0].content).toBeUndefined();
    await request(app).get(`/api/blogs/${l.body.data[0].slug}`).expect(200);
  });
  it("is not vulnerable to NoSQL operator injection via query string", async () => {
    const r = await request(app).get("/api/courses?category[$ne]=x").expect(200);
    expect(r.body.data.length).toBe(16);
  });
  it("public cannot list inactive records via ?active=false", async () => {
    const r = await request(app).get("/api/courses?active=false").expect(200);
    expect(r.body.data.every((c: any) => c.active)).toBe(true);
  });
});

describe("public form submissions are stored in the database", () => {
  it("enquiry: validates then saves", async () => {
    await request(app).post("/api/enquiries").send({ name: "A", email: "bad", phone: "1" }).expect(400);
    const r = await request(app).post("/api/enquiries").send({ name: "Ravi Kumar", email: "ravi@x.com", phone: "+91 98765 43210", course: "AWS", type: "enrollment" }).expect(201);
    expect(r.body.success).toBe(true);
    const list = await agent.get("/api/admin/enquiries").expect(200);
    expect(list.body.data.some((e: any) => e.email === "ravi@x.com" && e.status === "new")).toBe(true);
  });
  it("honeypot submissions are silently dropped", async () => {
    await request(app).post("/api/enquiries").send({ name: "Bot Bot", email: "bot@x.com", phone: "9999999999", website: "spam.com" }).expect(201);
    const list = await agent.get("/api/admin/enquiries?search=bot@x.com").expect(200);
    expect(list.body.data.length).toBe(0);
  });
  it("newsletter subscription saves to db", async () => {
    await request(app).post("/api/newsletter").send({ email: "sub@x.com" }).expect(201);
    await request(app).post("/api/newsletter").send({ email: "sub@x.com" }).expect(201); // idempotent
    const n = await agent.get("/api/admin/newsletter").expect(200);
    expect(n.body.data.filter((s: any) => s.email === "sub@x.com").length).toBe(1);
  });
  it("reviews are created UNAPPROVED even if the client asks otherwise", async () => {
    await request(app).post("/api/reviews").send({ name: "Spammer", rating: 5, reviewText: "Great course really!", isApproved: true, kind: "video" }).expect(201);
    const pub = await request(app).get("/api/reviews").expect(200);
    expect(pub.body.data.some((r: any) => r.name === "Spammer")).toBe(false);
    const adm = await agent.get("/api/admin/reviews?search=Spammer").expect(200);
    expect(adm.body.data[0].isApproved).toBe(false);
    expect(adm.body.data[0].kind).toBe("written");
  });
  it("support ticket tracking needs ticket number AND matching email", async () => {
    const t = await request(app).post("/api/support").send({ name: "Stu Dent", email: "stu@x.com", description: "Cannot access LMS portal" }).expect(201);
    expect(t.body.ticketNumber).toMatch(/^MIC-[A-Z0-9]{8}$/);
    await request(app).post("/api/support/track").send({ ticketNumber: t.body.ticketNumber, email: "other@x.com" }).expect(404);
    const ok = await request(app).post("/api/support/track").send({ ticketNumber: t.body.ticketNumber, email: "stu@x.com" }).expect(200);
    expect(ok.body.data.description).toBeUndefined();
  });
});

describe("admin authentication & authorisation", () => {
  it("rejects anonymous and bad credentials", async () => {
    await request(app).get("/api/admin/enquiries").expect(401);
    await request(app).post("/api/auth/login").send({ email: "root@test.com", password: "wrong" }).expect(401);
  });
  it("cookie is httpOnly; password hash never leaks", async () => {
    const r = await request(app).post("/api/auth/login").send({ email: "root@test.com", password: PASS }).expect(200);
    expect(String(r.headers["set-cookie"])).toMatch(/HttpOnly/i);
    expect(JSON.stringify(r.body)).not.toMatch(/\$2[aby]\$/);
    const users = await agent.get("/api/admin/users").expect(200);
    expect(JSON.stringify(users.body)).not.toMatch(/\$2[aby]\$/);
  });
  it("cookie sessions require the CSRF header on writes", async () => {
    await agent.post("/api/admin/faqs").send({ question: "q?", answer: "a" }).expect(403);
    await agent.post("/api/admin/faqs").set(X).send({ question: "q?", answer: "a" }).expect(201);
  });
  it("RBAC: editor can edit content but not leads, users or settings", async () => {
    await editorAgent.post("/api/admin/faqs").set(X).send({ question: "q2?", answer: "a" }).expect(201);
    await editorAgent.get("/api/admin/enquiries").expect(403);
    await editorAgent.get("/api/admin/users").expect(403);
    await editorAgent.put("/api/admin/settings").set(X).send({ companyName: "Hacked" }).expect(403);
    await editorAgent.delete("/api/admin/faqs/000000000000000000000000").set(X).expect(403);
  });
  it("deactivating a user locks them out immediately (no waiting for token expiry)", async () => {
    const users = await agent.get("/api/admin/users").expect(200);
    const ed = users.body.data.find((u: any) => u.email === "ed@test.com");
    await agent.put(`/api/admin/users/${ed._id}`).set(X).send({ isActive: false }).expect(200);
    await editorAgent.get("/api/auth/me").expect(401);
    await agent.put(`/api/admin/users/${ed._id}`).set(X).send({ isActive: true }).expect(200);
  });
  it("cannot demote / delete the last super admin or yourself; weak passwords rejected", async () => {
    const users = await agent.get("/api/admin/users").expect(200);
    const root = users.body.data.find((u: any) => u.email === "root@test.com");
    await agent.put(`/api/admin/users/${root._id}`).set(X).send({ role: "editor" }).expect(400);
    await agent.delete(`/api/admin/users/${root._id}`).set(X).expect(400);
    await agent.post("/api/admin/users").set(X).send({ name: "W", email: "w@test.com", password: "short", role: "editor" }).expect(400);
  });
  it("logout clears access", async () => {
    const a = request.agent(app);
    await a.post("/api/auth/login").send({ email: "root@test.com", password: PASS }).expect(200);
    await a.post("/api/auth/logout").expect(200);
    await a.get("/api/auth/me").expect(401);
  });
});

describe("admin CRUD edits what the public site shows", () => {
  it("create → public sees it → update → delete; mass-assignment is ignored", async () => {
    const c = await agent.post("/api/admin/courses").set(X).send({
      name: "Rust Backend Bootcamp", category: "Popular IT Courses 2026", categorySlug: "popular", duration: "30 Days", fee: "₹9,999",
      _id: "000000000000000000000001", createdAt: "2000-01-01"
    }).expect(201);
    expect(c.body.data.slug).toBe("rust-backend-bootcamp");
    expect(c.body.data._id).not.toBe("000000000000000000000001");
    expect((await request(app).get("/api/courses/rust-backend-bootcamp").expect(200)).body.data.fee).toBe("₹9,999");
    await agent.put(`/api/admin/courses/${c.body.data._id}`).set(X).send({ active: false }).expect(200);
    await request(app).get("/api/courses/rust-backend-bootcamp").expect(404);
    await agent.delete(`/api/admin/courses/${c.body.data._id}`).set(X).expect(200);
  });
  it("duplicate slug gets a unique suffix; invalid ids → 400", async () => {
    const body = { name: "Dup Course", category: "X", categorySlug: "x", duration: "1 Day" };
    const a = await agent.post("/api/admin/courses").set(X).send(body).expect(201);
    const b = await agent.post("/api/admin/courses").set(X).send(body).expect(201);
    expect(a.body.data.slug).not.toBe(b.body.data.slug);
    await agent.get("/api/admin/courses/not-an-id").expect(400);
  });
  it("site settings update is reflected publicly", async () => {
    await agent.put("/api/admin/settings").set(X).send({ phone: "+91 11111 22222" }).expect(200);
    expect((await request(app).get("/api/settings").expect(200)).body.data.phone).toBe("+91 11111 22222");
  });
  it("dashboard aggregates real numbers", async () => {
    const r = await agent.get("/api/admin/dashboard/stats").expect(200);
    expect(r.body.data.totals.enquiries).toBeGreaterThanOrEqual(1);
    expect(r.body.data.totals.courses).toBeGreaterThan(10);
  });
  it("CSV export neutralises spreadsheet formulas", async () => {
    await request(app).post("/api/enquiries").send({ name: "=HYPERLINK(evil)", email: "csv@x.com", phone: "9999999999" }).expect(201);
    const r = await agent.get("/api/admin/enquiries/export/csv").expect(200);
    expect(r.text).toContain("\"'=HYPERLINK(evil)\"");
    expect(r.headers["content-type"]).toMatch(/text\/csv/);
  });
  it("multer image upload requires auth and saves file with /uploads/ URL", async () => {
    await request(app).post("/api/admin/upload").expect(401);
    const pngBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52]);
    const res = await agent
      .post("/api/admin/upload")
      .set(X)
      .attach("image", pngBuffer, "test-avatar.png")
      .expect(201);
    expect(res.body.success).toBe(true);
    expect(res.body.url).toMatch(/^\/uploads\/test-avatar-/);
    const getFile = await request(app).get(res.body.url).expect(200);
    expect(getFile.headers["content-type"]).toMatch(/image\/png/);
  });
});
