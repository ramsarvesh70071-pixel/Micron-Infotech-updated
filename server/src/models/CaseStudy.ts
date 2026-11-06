import mongoose, { Schema } from "mongoose";
import { baseOptions } from "./_base.js";

const CaseStudySchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    client: { type: String, required: true, trim: true },
    logo: { type: String, default: "" },
    industry: { type: String, default: "" },
    trainingDomain: { type: String, default: "" },
    cohortSize: { type: String, default: "" },
    duration: { type: String, default: "" },
    challenge: { type: String, default: "" },
    solution: { type: String, default: "" },
    impactMetrics: [{ label: { type: String, required: true }, value: { type: String, required: true }, _id: false }],
    testimonial: {
      quote: { type: String, default: "" },
      author: { type: String, default: "" },
      role: { type: String, default: "" }
    },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  baseOptions
);

export const CaseStudy = mongoose.model("CaseStudy", CaseStudySchema);
