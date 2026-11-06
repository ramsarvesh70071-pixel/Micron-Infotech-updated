import mongoose from "mongoose";
import { env } from "./env.js";

export interface DatabaseStatus {
  connected: boolean;
  state: string;
  host?: string;
  name?: string;
}

const STATES: Record<number, string> = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };

export const getDbStatus = (): DatabaseStatus => {
  const c = mongoose.connection;
  return {
    connected: c.readyState === 1,
    state: STATES[c.readyState] || "unknown",
    host: c.host || undefined,
    name: c.name || undefined
  };
};

/**
 * Connects to MongoDB.
 * There is deliberately NO in-memory fallback: all data must always live in the real database,
 * otherwise records silently disappear on restart.
 */
export const connectDB = async (uri: string = env.MONGODB_URI): Promise<void> => {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000, maxPoolSize: 20 });
};

export const disconnectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
};
