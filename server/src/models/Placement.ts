import mongoose, { Schema } from "mongoose";
import { baseOptions } from "./_base.js";

/** Placed-student cards ("Student Pride" grid + home page marquee rows). */
const PlacementSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    package: { type: String, default: "" }, // display e.g. "12 LPA"
    packageNum: { type: Number, default: 0 },
    role: { type: String, default: "" },
    company: { type: String, default: "" },
    logo: { type: String, default: "" },
    image: { type: String, default: "" },
    category: { type: String, default: "other", index: true },
    batchYear: { type: String, default: "" },
    previousBg: { type: String, default: "" },
    hike: { type: String, default: "" },
    avatarBg: { type: String, default: "" },
    avatarSeed: { type: String, default: "" },
    avatarGender: { type: String, enum: ["m", "f"], default: "m" },
    companyColor: { type: String, default: "" },
    marqueeRow: { type: Number, enum: [0, 1, 2], default: 0, index: true }, // 0 = grid only, 1/2 = home marquee rows
    active: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0 }
  },
  baseOptions
);

export const Placement = mongoose.model("Placement", PlacementSchema);
