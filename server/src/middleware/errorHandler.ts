import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { env } from "../config/env.js";

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({ success: false, message: `Resource not found: ${req.method} ${req.originalUrl.split("?")[0]}` });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction): void => {
  let status: number = err.statusCode || err.status || 500;
  let message: string = err.message || "Internal Server Error";
  let errors: unknown = err.errors;

  if (err instanceof mongoose.Error.ValidationError) {
    status = 400;
    message = "Validation failed";
    errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
  } else if (err instanceof mongoose.Error.CastError) {
    status = 400;
    message = `Invalid value for ${err.path}`;
    errors = undefined;
  } else if (err?.code === 11000) {
    status = 409;
    const fields = Object.keys(err.keyPattern || err.keyValue || {});
    message = `Duplicate value${fields.length ? ` for: ${fields.join(", ")}` : ""}. It must be unique.`;
    errors = undefined;
  } else if (err?.type === "entity.parse.failed") {
    status = 400;
    message = "Malformed JSON body";
  } else if (err?.type === "entity.too.large") {
    status = 413;
    message = "Request body too large";
  }

  if (status >= 500) {
    console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);
    if (env.isProd) message = "Internal Server Error"; // never leak internals in production
  }

  res.status(status).json({ success: false, message, errors: errors || undefined });
};
