import mongoose, { Schema } from "mongoose";
import { baseOptions } from "./_base.js";

const BlogPostSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, required: true },
    content: { type: String, default: "" },
    author: { type: String, default: "" },
    category: { type: String, default: "Career Trends", index: true },
    tags: [{ type: String, trim: true }],
    image: { type: String, default: "" },
    readTime: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true, index: true },
    publishedAt: { type: Date, default: Date.now }
  },
  baseOptions
);

export const BlogPost = mongoose.model("BlogPost", BlogPostSchema);
