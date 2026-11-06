import mongoose, { Schema } from "mongoose";
import { baseOptions } from "./_base.js";

export const APPLICATION_STATUSES = ["new", "reviewed", "shortlisted", "rejected", "onboarded"] as const;

const ApplicationSchema = new Schema(
  {
    type: { type: String, enum: ["trainer", "franchise"], required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    status: { type: String, enum: APPLICATION_STATUSES, default: "new", index: true },
    // trainer
    technology: { type: String, default: "" },
    experience: { type: String, default: "" },
    currentCompany: { type: String, default: "" },
    mode: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    message: { type: String, default: "", maxlength: 4000 },
    // franchise
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    capital: { type: String, default: "" },
    space: { type: String, default: "" },
    background: { type: String, default: "", maxlength: 4000 },
    notes: { type: String, default: "" }
  },
  baseOptions
);

export const Application = mongoose.model("Application", ApplicationSchema);
