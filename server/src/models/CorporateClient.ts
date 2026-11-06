import mongoose, { Schema } from "mongoose";
import { baseOptions } from "./_base.js";

const CorporateClientSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    logo: { type: String, default: "" },
    course: { type: String, default: "" },
    description: { type: String, default: "" },
    badge: { type: String, default: "" },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  baseOptions
);

export const CorporateClient = mongoose.model("CorporateClient", CorporateClientSchema);
