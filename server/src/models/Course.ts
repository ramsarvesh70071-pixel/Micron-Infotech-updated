import mongoose, { Schema } from "mongoose";
import { baseOptions } from "./_base.js";

const ModuleSchema = new Schema({ title: { type: String, required: true, trim: true }, topics: [{ type: String, trim: true }] }, { _id: false });

const CourseSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, required: true, trim: true },
    categorySlug: { type: String, required: true, lowercase: true, trim: true, index: true },
    location: { type: String, default: "Bangalore & Online" },
    fee: { type: String, default: "" }, // display string e.g. "₹34,999" (admin controlled)
    duration: { type: String, required: true, trim: true },
    badge: { type: String, default: "" },
    rating: { type: Number, min: 0, max: 5 }, // optional - only shown when admin sets a real value
    studentsCount: { type: String, default: "" },
    placementGuaranteed: { type: Boolean, default: false },
    internshipIncluded: { type: Boolean, default: false },
    mode: { type: String, default: "Classroom / Online" },
    highlights: [{ type: String, trim: true }],
    description: { type: String, default: "" },
    syllabus: [ModuleSchema],
    image: { type: String, default: "" },
    popular: { type: Boolean, default: false },
    active: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0 }
  },
  baseOptions
);
CourseSchema.index({ name: "text", category: "text", description: "text" });

export const Course = mongoose.model("Course", CourseSchema);
