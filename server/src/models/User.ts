import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { baseOptions } from "./_base.js";

export const USER_ROLES = ["superadmin", "admin", "editor", "counselor", "support"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  avatar?: string;
  phone?: string;
  lastLogin?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: USER_ROLES, default: "editor" },
    isActive: { type: Boolean, default: true },
    avatar: { type: String, default: "" },
    phone: { type: String, default: "" },
    lastLogin: { type: Date }
  },
  {
    ...(baseOptions as object),
    // Never serialise the password hash, even by accident.
    toJSON: {
      virtuals: true,
      transform: (_doc: unknown, ret: Record<string, unknown>) => {
        delete ret.password;
        return ret;
      }
    }
  } as any
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

/** Compares a plain password with the stored hash (the document must have been loaded with `.select("+password")`). */
export const verifyPassword = (user: { password: string }, candidate: string): Promise<boolean> =>
  bcrypt.compare(candidate, user.password);

export const User = mongoose.model<IUser>("User", UserSchema);
