import type { Request, Response, NextFunction, CookieOptions } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User, UserRole } from "../models/User.js";
import { PERMISSIONS, Resource, Action } from "./permissions.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}
export interface AuthRequest extends Request {
  user?: AuthUser;
}

export const generateToken = (userId: string): string =>
  jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] });

export const cookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: env.isProd || env.COOKIE_SAMESITE === "none",
  sameSite: env.COOKIE_SAMESITE,
  path: "/",
  maxAge: 12 * 60 * 60 * 1000
});

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/**
 * Authenticates the admin via httpOnly cookie (browser) or Bearer token (API tools).
 * The user is always re-loaded from the database, so deactivated / deleted accounts and
 * role changes take effect immediately instead of after the token expires.
 */
export const requireAuth = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const bearer = header && header.startsWith("Bearer ") ? header.slice(7) : undefined;
  const cookieToken = (req as any).cookies?.[env.COOKIE_NAME] as string | undefined;
  const token = bearer || cookieToken;

  if (!token) {
    res.status(401).json({ success: false, message: "Authentication required." });
    return;
  }

  // CSRF defence for cookie sessions: state-changing requests must carry a custom header,
  // which browsers only allow from origins permitted by our CORS policy.
  if (!bearer && !SAFE_METHODS.has(req.method) && req.headers["x-requested-with"] !== "XMLHttpRequest") {
    res.status(403).json({ success: false, message: "Missing CSRF header." });
    return;
  }

  let payload: jwt.JwtPayload;
  try {
    payload = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired session. Please log in again." });
    return;
  }

  const user = await User.findById(payload.sub);
  if (!user || !user.isActive) {
    res.status(401).json({ success: false, message: "Account not found or deactivated." });
    return;
  }

  req.user = { id: user.id, email: user.email, role: user.role, name: user.name };
  next();
});

/** RBAC guard: `requireAccess("courses", "write")` */
export const requireAccess =
  (resource: Resource, action: Action) =>
  (req: AuthRequest, res: Response, next: NextFunction): void => {
    const allowed = PERMISSIONS[resource]?.[action] ?? [];
    if (!req.user || !allowed.includes(req.user.role)) {
      res.status(403).json({ success: false, message: `Your role does not have permission to ${action} ${resource}.` });
      return;
    }
    next();
  };
