import path from "node:path";
import fs from "node:fs";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { getDbStatus } from "./config/db.js";
import { buildRouter } from "./routes/index.js";
import { apiLimiter } from "./middleware/rateLimits.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

export const createApp = (): Express => {
  const app = express();
  app.disable("x-powered-by");
  if (env.isProd) app.set("trust proxy", 1); // Render / Railway / Nginx: real client IP for rate limiting

  app.use(
    helmet({
      // The API only serves JSON; when the SPA is served from here a CSP should be set at the proxy/CDN.
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: "cross-origin" }
    })
  );

  app.use(
    cors({
      origin: (origin, cb) => {
        // No Origin header = same-origin, curl, server-to-server, mobile apps.
        if (!origin || env.ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
        return cb(null, false); // not allowed: browser blocks it (no CORS headers returned)
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
    })
  );

  if (!env.isTest) app.use(morgan(env.isProd ? "combined" : "dev"));
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: false, limit: "1mb" }));
  app.use(cookieParser());

  // Static uploads directory for Multer uploaded images
  const uploadsDir = path.resolve("uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use("/uploads", express.static(uploadsDir));

  app.use("/api", apiLimiter);

  app.get("/api/health", (_req: Request, res: Response) => {
    const db = getDbStatus();
    res.status(db.connected ? 200 : 503).json({
      status: db.connected ? "UP" : "DEGRADED",
      name: "Micron InfoTech API",
      version: "2.0.0",
      database: db,
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString()
    });
  });

  app.use("/api", buildRouter());
  app.use("/api", notFoundHandler);

  // Optional: serve the built React app from this same server (single-host deployment).
  if (process.env.SERVE_CLIENT === "true") {
    const dist = path.resolve(process.env.CLIENT_DIST || path.join(__dirname, "..", "..", "client", "dist"));
    if (fs.existsSync(path.join(dist, "index.html"))) {
      app.use(express.static(dist, { maxAge: "1h", index: false }));
      app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));
    } else {
      console.warn(`[Server] SERVE_CLIENT=true but no build found at ${dist}. Run "npm run build" in /client first.`);
    }
  }

  app.use(errorHandler);
  return app;
};
