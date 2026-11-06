import mongoose, { Schema } from "mongoose";
import { baseOptions } from "./_base.js";

const LegalDocSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    lastUpdated: { type: String, default: "" },
    sections: [
      {
        heading: { type: String, required: true },
        content: [{ type: String }],
        _id: false
      }
    ],
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  baseOptions
);

export const LegalDoc = mongoose.model("LegalDoc", LegalDocSchema);
