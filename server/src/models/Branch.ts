import mongoose, { Schema } from "mongoose";
import { baseOptions } from "./_base.js";

const BranchSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    landmark: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    timings: { type: String, default: "" },
    mapQuery: { type: String, default: "" },
    isHeadquarter: { type: Boolean, default: false },
    active: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0 }
  },
  baseOptions
);

export const Branch = mongoose.model("Branch", BranchSchema);
