import type { Request, Response } from "express";
import { User, verifyPassword } from "../models/User.js";
import { asyncHandler, HttpError } from "../utils/asyncHandler.js";
import { AuthRequest, cookieOptions, generateToken } from "../middleware/auth.js";
import { env } from "../config/env.js";
import { permissionsForRole } from "../middleware/permissions.js";

const publicUser = (u: any) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
  avatar: u.avatar,
  phone: u.phone,
  lastLogin: u.lastLogin,
  permissions: permissionsForRole(u.role)
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  const user = await User.findOne({ email }).select("+password");
  // Same message for unknown email / wrong password / inactive: do not reveal which accounts exist.
  const ok = user ? await verifyPassword(user, password) : false;
  if (!user || !ok || !user.isActive) {
    throw new HttpError(401, "Invalid email or password.");
  }
  user.lastLogin = new Date();
  await user.save();
  const token = generateToken(user.id);
  res.cookie(env.COOKIE_NAME, token, cookieOptions());
  res.json({ success: true, message: "Authentication successful", token, user: publicUser(user) });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  const { maxAge: _m, ...opts } = cookieOptions();
  res.clearCookie(env.COOKIE_NAME, opts);
  res.json({ success: true, message: "Logged out" });
});

export const me = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user!.id);
  if (!user) throw new HttpError(404, "User not found.");
  res.json({ success: true, user: publicUser(user) });
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, phone, avatar, currentPassword, newPassword } = req.body as Record<string, string | undefined>;
  const user = await User.findById(req.user!.id).select("+password");
  if (!user) throw new HttpError(404, "User not found.");
  if (name) user.name = name.trim().slice(0, 100);
  if (phone !== undefined) user.phone = phone.trim().slice(0, 30);
  if (avatar !== undefined) user.avatar = avatar.trim().slice(0, 500);
  if (newPassword) {
    if (!currentPassword || !(await verifyPassword(user, currentPassword))) {
      throw new HttpError(400, "Current password is incorrect.");
    }
    user.password = newPassword;
  }
  await user.save();
  res.json({ success: true, message: "Profile updated successfully", user: publicUser(user) });
});
