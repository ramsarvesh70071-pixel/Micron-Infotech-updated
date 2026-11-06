import mongoose, { Schema } from "mongoose";
import { baseOptions } from "./_base.js";

export const PARTNER_KINDS = ["hiring", "media", "top", "grid"] as const;

/** Logo walls: hiring partners, media partners, top placed companies, hiring brand grid. */
const PartnerSchema = new Schema(
  {
    kind: { type: String, enum: PARTNER_KINDS, required: true, index: true },
    name: { type: String, required: true, trim: true },
    logo: { type: String, required: true },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  baseOptions
);
PartnerSchema.index({ kind: 1, name: 1 }, { unique: true });

export const Partner = mongoose.model("Partner", PartnerSchema);
