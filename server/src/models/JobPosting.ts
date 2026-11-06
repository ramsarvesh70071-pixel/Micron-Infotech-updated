import mongoose, { Schema } from "mongoose";
import { baseOptions } from "./_base.js";

export const JOB_STATUSES = ["review", "active", "filled", "expired"] as const;

const JobPostingSchema = new Schema(
  {
    companyName: { type: String, required: true, trim: true },
    recruiterName: { type: String, required: true, trim: true },
    officialEmail: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    jobTitle: { type: String, required: true, trim: true },
    openings: { type: String, default: "" },
    experience: { type: String, default: "" },
    ctcRange: { type: String, default: "" },
    skills: { type: String, required: true },
    location: { type: String, default: "" },
    description: { type: String, default: "", maxlength: 6000 },
    status: { type: String, enum: JOB_STATUSES, default: "review", index: true }
  },
  baseOptions
);

export const JobPosting = mongoose.model("JobPosting", JobPostingSchema);
