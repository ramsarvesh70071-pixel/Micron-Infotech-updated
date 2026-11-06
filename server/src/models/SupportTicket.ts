import mongoose, { Schema } from "mongoose";
import { baseOptions } from "./_base.js";

export const TICKET_STATUSES = ["Open", "In Progress", "Resolved", "Closed"] as const;
export const TICKET_PRIORITIES = ["Low", "Normal", "High", "Urgent"] as const;

const SupportTicketSchema = new Schema(
  {
    ticketNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: "" },
    studentId: { type: String, default: "" },
    category: { type: String, default: "" },
    priority: { type: String, enum: TICKET_PRIORITIES, default: "Normal" },
    description: { type: String, required: true, maxlength: 6000 },
    status: { type: String, enum: TICKET_STATUSES, default: "Open", index: true },
    responseNotes: { type: String, default: "" },
    resolvedAt: { type: Date }
  },
  baseOptions
);

export const SupportTicket = mongoose.model("SupportTicket", SupportTicketSchema);
