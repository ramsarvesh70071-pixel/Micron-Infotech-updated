import type { Request, Response } from "express";
import { SiteSetting } from "../models/SiteSetting.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getOrCreate = async () =>
  SiteSetting.findOneAndUpdate({ key: "main" }, { $setOnInsert: { key: "main" } }, { upsert: true, new: true, setDefaultsOnInsert: true });

const EDITABLE = [
  "companyName", "tagline", "phone", "whatsapp", "email", "supportEmail", "legalEmail", "placementEmail", "address",
  "social", "banner", "heroStats", "trustStats", "homeStats", "seo"
];

/** GET /api/settings (public) */
export const getPublicSettings = asyncHandler(async (_req: Request, res: Response) => {
  const doc = await getOrCreate();
  res.json({ success: true, data: doc });
});

/** PUT /api/admin/settings */
export const updateSettings = asyncHandler(async (req: Request, res: Response) => {
  const doc = await getOrCreate();
  const body: Record<string, unknown> = {};
  for (const k of EDITABLE) if (req.body?.[k] !== undefined) body[k] = req.body[k];
  doc.set(body);
  await doc.save();
  res.json({ success: true, message: "Settings saved", data: doc });
});
