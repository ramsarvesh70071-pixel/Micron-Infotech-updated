import mongoose, { Schema } from "mongoose";
import { baseOptions } from "./_base.js";

const NewsletterSubscriberSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    active: { type: Boolean, default: true },
    source: { type: String, default: "footer" }
  },
  baseOptions
);

export const NewsletterSubscriber = mongoose.model("NewsletterSubscriber", NewsletterSubscriberSchema);
