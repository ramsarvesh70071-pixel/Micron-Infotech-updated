// One-command setup: creates server/.env (random secrets), installs dependencies, seeds the database.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const run = (cmd, cwd) => spawnSync(cmd, { cwd, stdio: "inherit", shell: true }).status === 0;

const major = Number(process.versions.node.split(".")[0]);
if (major < 18) {
  console.error(`Node.js 18.18+ is required (you have ${process.versions.node}). Install the LTS version from https://nodejs.org`);
  process.exit(1);
}

const envPath = path.join(root, "server", ".env");
if (!fs.existsSync(envPath)) {
  const pick = (chars, n) => Array.from(crypto.randomBytes(n), (b) => chars[b % chars.length]).join("");
  const password = `${pick("ABCDEFGHJKLMNPQRSTUVWXYZ", 3)}${pick("abcdefghijkmnopqrstuvwxyz", 6)}${pick("23456789", 3)}${pick("abcdefghijkmnopqrstuvwxyz23456789", 4)}`;
  let env = fs.readFileSync(path.join(root, "server", ".env.example"), "utf8");
  env = env.replace(/^JWT_SECRET=.*$/m, `JWT_SECRET=${crypto.randomBytes(48).toString("hex")}`);
  env = env.replace(/^SEED_ADMIN_PASSWORD=.*$/m, `SEED_ADMIN_PASSWORD=${password}`);
  fs.writeFileSync(envPath, env);
  console.log("\n[setup] Created server/.env with a random JWT secret.");
  console.log(`[setup] Admin login ->  email: admin@microninfotech.com   password: ${password}`);
  console.log("[setup] (both are stored in server/.env - change the password after your first login)\n");
} else {
  console.log("[setup] server/.env already exists - keeping it.");
}

console.log("[setup] Installing server dependencies...");
if (!run("npm install --no-audit --no-fund", path.join(root, "server"))) process.exit(1);
console.log("[setup] Installing client dependencies...");
if (!run("npm install --no-audit --no-fund", path.join(root, "client"))) process.exit(1);

console.log("[setup] Seeding the database (needs MongoDB running)...");
if (!run("npm run seed", path.join(root, "server"))) {
  console.log("\n[setup] Seeding failed - is MongoDB running? Start it (or set MONGODB_URI to an Atlas URL in server/.env) and run:  npm run seed\n");
} else {
  console.log("\n[setup] Done!  Start everything with:  npm run dev");
  console.log("        Website : http://localhost:5173");
  console.log("        Admin   : http://localhost:5173/admin/login\n");
}
