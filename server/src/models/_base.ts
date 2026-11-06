import type { SchemaOptions } from "mongoose";

/** Shared schema options: timestamps, no __v, and a virtual `id` alongside `_id` in JSON output. */
export const baseOptions: SchemaOptions = {
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
};

export const slugify = (text: string): string =>
  String(text || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
