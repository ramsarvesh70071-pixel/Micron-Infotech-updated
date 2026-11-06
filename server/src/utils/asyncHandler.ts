import type { Request, Response, NextFunction, RequestHandler } from "express";

/** Wraps async route handlers so rejected promises reach the central error handler. */
export const asyncHandler =
  (fn: (req: any, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export class HttpError extends Error {
  statusCode: number;
  errors?: unknown;
  constructor(statusCode: number, message: string, errors?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}
