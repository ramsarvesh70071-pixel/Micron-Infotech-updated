import { env } from "./config/env.js";
import { connectDB, disconnectDB } from "./config/db.js";
import { createApp } from "./app.js";

const start = async () => {
  try {
    console.log(`[Database] Connecting to MongoDB (${env.MONGODB_URI.replace(/\/\/[^@]*@/, "//***:***@")}) ...`);
    await connectDB();
  } catch (err: any) {
    console.error("\n================ DATABASE CONNECTION FAILED ================");
    console.error(err?.message || err);
    console.error("MongoDB is required (there is no in-memory fallback, so your data is always safe).");
    console.error("  - Local: install & start MongoDB Community Server, or");
    console.error("  - Cloud: create a free MongoDB Atlas cluster and put its URI in server/.env as MONGODB_URI");
    console.error("============================================================\n");
    process.exit(1);
  }

  const app = createApp();
  const server = app.listen(env.PORT, () => {
    console.log(`[Server] Micron InfoTech API running on http://localhost:${env.PORT}  (${env.NODE_ENV})`);
    console.log(`[Server] Health check: http://localhost:${env.PORT}/api/health`);
  });

  const shutdown = (signal: string) => {
    console.log(`\n[Server] ${signal} received, shutting down...`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
};

start();
