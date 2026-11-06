import mongoose, { Schema } from "mongoose";
import { baseOptions } from "./_base.js";

/** "team" = leadership shown on About page, "mentor" = trainer/mentor profiles. */
const TeamMemberSchema = new Schema(
  {
    kind: { type: String, enum: ["team", "mentor"], default: "team", index: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, default: "" },
    bio: { type: String, default: "" },
    initials: { type: String, default: "" },
    color: { type: String, default: "from-blue-600 to-indigo-600" },
    photo: { type: String, default: "" },
    specialization: { type: String, default: "" },
    experienceYears: { type: Number, default: 0 },
    companies: [{ type: String }],
    studentsTrained: { type: String, default: "" },
    rating: { type: Number, min: 0, max: 5 },
    skills: [{ type: String }],
    achievements: [{ type: String }],
    quote: { type: String, default: "" },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  baseOptions
);

export const TeamMember = mongoose.model("TeamMember", TeamMemberSchema);
