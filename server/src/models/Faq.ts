import mongoose, { Schema } from "mongoose";
import { baseOptions } from "./_base.js";

export const FAQ_SCOPES = ["home", "placement", "reviews", "support", "general"] as const;

const FaqSchema = new Schema(
  {
    scope: { type: String, enum: FAQ_SCOPES, default: "general", index: true },
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true },
    category: { type: String, default: "" },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  baseOptions
);

export const Faq = mongoose.model("Faq", FaqSchema);
