import type { Response } from "express";
import mongoose from "mongoose";
import { User, USER_ROLES } from "../models/User.js";
import { asyncHandler, HttpError } from "../utils/asyncHandler.js";
import type { AuthRequest } from "../middleware/auth.js";

const countActiveSuperadmins = (excludeId?: string) =>
  User.countDocuments({ role: "superadmin", isActive: true, ...(excludeId ? { _id: { $ne: excludeId } } : {}) });

export const listUsers = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const users = await User.find().sort({ createdAt: 1 });
  res.json({ success: true, count: users.length, data: users });
});

export const createUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, email, password, role, phone, isActive } = req.body;
  if (!USER_ROLES.includes(role)) throw new HttpError(400, `Role must be one of: ${USER_ROLES.join(", ")}`);
  if (await User.exists({ email: String(email).toLowerCase() })) throw new HttpError(409, "A user with this email already exists.");
  const user = await User.create({ name, email, password, role, phone: phone || "", isActive: isActive !== false });
  res.status(201).json({ success: true, message: "User created successfully", data: user });
});

export const updateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, "Invalid id.");
  const user = await User.findById(id).select("+password");
  if (!user) throw new HttpError(404, "User not found.");

  const { name, email, password, role, phone, isActive } = req.body;
  const losesSuperadmin =
    user.role === "superadmin" && user.isActive && ((role && role !== "superadmin") || isActive === false);
  if (losesSuperadmin && (await countActiveSuperadmins(id)) === 0) {
    throw new HttpError(400, "You cannot demote or deactivate the last active super admin.");
  }
  if (id === req.user!.id && isActive === false) throw new HttpError(400, "You cannot deactivate your own account.");

  if (role !== undefined) {
    if (!USER_ROLES.includes(role)) throw new HttpError(400, `Role must be one of: ${USER_ROLES.join(", ")}`);
    user.role = role;
  }
  if (name) user.name = name;
  if (email) user.email = String(email).toLowerCase();
  if (phone !== undefined) user.phone = phone;
  if (isActive !== undefined) user.isActive = Boolean(isActive);
  if (password) user.password = password; // hashed by the pre-save hook
  await user.save();
  res.json({ success: true, message: "User updated successfully", data: user });
});

export const deleteUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, "Invalid id.");
  if (id === req.user!.id) throw new HttpError(400, "You cannot delete your own account.");
  const user = await User.findById(id);
  if (!user) throw new HttpError(404, "User not found.");
  if (user.role === "superadmin" && user.isActive && (await countActiveSuperadmins(id)) === 0) {
    throw new HttpError(400, "You cannot delete the last active super admin.");
  }
  await user.deleteOne();
  res.json({ success: true, message: "User deleted successfully" });
});
