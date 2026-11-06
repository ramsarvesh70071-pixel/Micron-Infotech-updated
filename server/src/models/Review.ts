import mongoose, { Schema } from "mongoose";
import { baseOptions } from "./_base.js";

export const REVIEW_KINDS = ["written", "video", "google"] as const;

/** One collection for every kind of testimonial (written, video, google-style). */
const ReviewSchema = new Schema(
  {
    kind: { type: String, enum: REVIEW_KINDS, default: "written", index: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    role: { type: String, default: "", trim: true },
    company: { type: String, default: "", trim: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    reviewText: { type: String, default: "", maxlength: 4000 },
    course: { type: String, default: "" },
    avatar: { type: String, default: "" },
    hike: { type: String, default: "" },
    packageLpa: { type: String, default: "" },
    // google-style extras
    timeAgo: { type: String, default: "" },
    location: { type: String, default: "" },
    tag: { type: String, default: "" },
    // video extras
    title: { type: String, default: "" },
    thumbnail: { type: String, default: "" },
    videoUrl: { type: String, default: "" },
    duration: { type: String, default: "" },
    badge: { type: String, default: "" },
    subBadge: { type: String, default: "" },
    // moderation
    isApproved: { type: Boolean, default: false, index: true },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
  },
  baseOptions
);

export const Review = mongoose.model("Review", ReviewSchema);
