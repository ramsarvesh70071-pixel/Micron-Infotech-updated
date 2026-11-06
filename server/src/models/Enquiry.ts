import mongoose, { Schema } from "mongoose";
import { baseOptions } from "./_base.js";

export const ENQUIRY_TYPES = ["enrollment", "general", "corporate"] as const;
export const ENQUIRY_STATUSES = ["new", "contacted", "in_progress", "converted", "closed"] as const;

const EnquirySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    course: { type: String, default: "General Consultation" },
    mode: { type: String, default: "" },
    branch: { type: String, default: "" },
    comments: { type: String, default: "", maxlength: 4000 },
    type: { type: String, enum: ENQUIRY_TYPES, default: "enrollment", index: true },
    status: { type: String, enum: ENQUIRY_STATUSES, default: "new", index: true },
    companyName: { type: String, default: "" },
    teamSize: { type: String, default: "" },
    notes: { type: String, default: "" },
    assignedTo: { type: String, default: "" }
  },
  baseOptions
);
EnquirySchema.index({ createdAt: -1 });

export const Enquiry = mongoose.model("Enquiry", EnquirySchema);
