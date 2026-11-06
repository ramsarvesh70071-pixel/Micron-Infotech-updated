import mongoose, { Schema } from "mongoose";
import { baseOptions } from "./_base.js";

/** Singleton document (key = "main") holding site-wide editable content. */
const SiteSettingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "main" },
    companyName: { type: String, default: "Micron Info Tech" },
    tagline: { type: String, default: "" },
    phone: { type: String, default: "" },
    whatsapp: { type: String, default: "" }, // digits only, e.g. 917676765421
    email: { type: String, default: "" },
    supportEmail: { type: String, default: "" },
    legalEmail: { type: String, default: "" },
    placementEmail: { type: String, default: "" },
    address: { type: String, default: "" },
    social: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      youtube: { type: String, default: "" },
      twitter: { type: String, default: "" }
    },
    banner: {
      enabled: { type: Boolean, default: true },
      highlight: { type: String, default: "" },
      text: { type: String, default: "" },
      suffix: { type: String, default: "" },
      ctaLabel: { type: String, default: "SELECT COURSE" }
    },
    heroStats: [
      { value: { type: String, required: true }, line1: { type: String, default: "" }, line2: { type: String, default: "" }, bg: { type: String, default: "" }, _id: false }
    ],
    trustStats: [{ value: { type: String, required: true }, label: { type: String, default: "" }, _id: false }],
    homeStats: {
      ratingValue: { type: String, default: "" },
      ratingCount: { type: String, default: "" },
      placedCount: { type: String, default: "" }
    },
    seo: { title: { type: String, default: "" }, description: { type: String, default: "" } }
  },
  baseOptions
);

export const SiteSetting = mongoose.model("SiteSetting", SiteSettingSchema);
