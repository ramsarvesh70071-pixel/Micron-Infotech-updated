import dotenv from "dotenv";
import crypto from "node:crypto";

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || "development";
const isProd = NODE_ENV === "production";
const isTest = NODE_ENV === "test";

function resolveJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim();
  if (secret) {
    if (isProd && secret.length < 32) {
      throw new Error("JWT_SECRET must be at least 32 characters long in production.");
    }
    return secret;
  }
  if (isProd) {
    throw new Error(
      "JWT_SECRET is required in production. Generate one with: node -e \"console.log(require('crypto').randomBytes(48).toString('hex'))\""
    );
  }
  // Development / test: random per-process secret (admin sessions reset on every restart).
  if (!isTest) {
    console.warn(
      "[Config] JWT_SECRET is not set - using a temporary random secret (you will be logged out on every restart). Copy .env.example to .env to fix this."
    );
  }
  return crypto.randomBytes(48).toString("hex");
}

const mongoUri = process.env.MONGODB_URI?.trim() || (isProd ? "" : "mongodb://127.0.0.1:27017/micron_infotech");
if (!mongoUri) {
  throw new Error("MONGODB_URI is required in production.");
}

const sameSiteRaw = (process.env.COOKIE_SAMESITE || "lax").toLowerCase();
const sameSite = (["lax", "strict", "none"].includes(sameSiteRaw) ? sameSiteRaw : "lax") as "lax" | "strict" | "none";

export const env = {
  NODE_ENV,
  isProd,
  isTest,
  PORT: Number(process.env.PORT || 5000),
  MONGODB_URI: mongoUri,
  JWT_SECRET: resolveJwtSecret(),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "12h",
  ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS || "http://localhost:5173,http://127.0.0.1:5173")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  COOKIE_NAME: "mit_admin_session",
  COOKIE_SAMESITE: sameSite,
  // Used only by the seed script (never hard-coded in source):
  SEED_ADMIN_EMAIL: (process.env.SEED_ADMIN_EMAIL || "").trim().toLowerCase(),
  SEED_ADMIN_PASSWORD: process.env.SEED_ADMIN_PASSWORD || "",
  SEED_ADMIN_NAME: process.env.SEED_ADMIN_NAME || "Super Admin"
};
