import crypto from "node:crypto";
import { env } from "../config/env.js";
import { connectDB, disconnectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { Course } from "../models/Course.js";
import { Branch } from "../models/Branch.js";
import { Review } from "../models/Review.js";
import { Placement } from "../models/Placement.js";
import { Partner } from "../models/Partner.js";
import { Faq } from "../models/Faq.js";
import { BlogPost } from "../models/BlogPost.js";
import { LegalDoc } from "../models/LegalDoc.js";
import { TeamMember } from "../models/TeamMember.js";
import { SiteSetting } from "../models/SiteSetting.js";
import courses from "./data/courses.js";
import branches from "./data/branches.js";
import reviews from "./data/reviews.js";
import placements from "./data/placements.js";
import partners from "./data/partners.js";
import faqs from "./data/faqs.js";
import blogs from "./data/blogs.js";
import legalDocs from "./data/legalDocs.js";
import team from "./data/team.js";
import settings from "./data/settings.js";

const PASSWORD_RX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,128}$/;

/** Inserts the seed rows only when the collection is empty (safe to run many times). */
const fill = async (label: string, model: any, rows: any[], reset: boolean) => {
  if (reset) await model.deleteMany({});
  if ((await model.estimatedDocumentCount()) > 0) {
    console.log(`  - ${label}: already has data, skipped`);
    return;
  }
  await model.insertMany(rows);
  console.log(`  + ${label}: ${rows.length} inserted`);
};

export const seedContent = async (reset = false) => {
  await fill("courses", Course, courses, reset);
  await fill("branches", Branch, branches, reset);
  await fill("reviews", Review, reviews, reset);
  await fill("placements", Placement, placements, reset);
  await fill("partners", Partner, partners, reset);
  await fill("faqs", Faq, faqs, reset);
  await fill("blogs", BlogPost, blogs, reset);
  await fill("legal docs", LegalDoc, legalDocs, reset);
  await fill("team & mentors", TeamMember, team, reset);
  if (reset) await SiteSetting.deleteMany({});
  if (!(await SiteSetting.exists({ key: "main" }))) {
    await SiteSetting.create(settings);
    console.log("  + site settings: created");
  }
};

export const seedAdmin = async () => {
  if (await User.exists({ role: "superadmin" })) {
    console.log("  - super admin already exists, skipped");
    return;
  }
  const email = env.SEED_ADMIN_EMAIL || "admin@microninfotech.com";
  let password = env.SEED_ADMIN_PASSWORD;
  let generated = false;
  if (!password) {
    if (env.isProd) throw new Error("Set SEED_ADMIN_PASSWORD (min 10 chars, upper+lower+digit) to create the first admin in production.");
    password = `Mit-${crypto.randomBytes(6).toString("hex")}A1`;
    generated = true;
  }
  if (!PASSWORD_RX.test(password)) throw new Error("SEED_ADMIN_PASSWORD must be 10+ chars with upper, lower and a digit.");
  await User.create({ name: env.SEED_ADMIN_NAME, email, password, role: "superadmin", isActive: true });
  console.log(`  + super admin created: ${email}`);
  if (generated) console.log(`    TEMPORARY PASSWORD (shown once, change it after login): ${password}`);
};

const main = async () => {
  const reset = process.argv.includes("--reset");
  await connectDB();
  console.log(`[Seed] Database: ${env.MONGODB_URI.replace(/\/\/[^@]*@/, "//***:***@")}${reset ? "  (RESET content collections)" : ""}`);
  await seedAdmin();
  await seedContent(reset);
  await disconnectDB();
  console.log("[Seed] Done.");
};

if (process.argv[1] && /seed\.(ts|js)$/.test(process.argv[1])) {
  main().catch((e) => {
    console.error("[Seed] Failed:", e.message || e);
    process.exit(1);
  });
}
