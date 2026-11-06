import type { Request, Response } from "express";
import type { Model } from "mongoose";
import mongoose from "mongoose";
import { asyncHandler, HttpError } from "../utils/asyncHandler.js";
import { escapeRegex, qBool, qInt, qs } from "../utils/query.js";
import { slugify } from "../models/_base.js";

export interface CrudOptions {
  model: Model<any>;
  /** Fields searched (case-insensitive) when `?search=` is supplied. */
  searchFields?: string[];
  /** Fields that may be filtered by exact string match via the query string. */
  filterFields?: string[];
  /** Boolean fields that may be filtered via `?field=true|false`. */
  boolFilters?: string[];
  /** Always applied to PUBLIC reads (e.g. { active: true }). */
  publicFilter?: () => Record<string, unknown>;
  /** Fields hidden from PUBLIC reads. */
  publicSelect?: string;
  sort?: Record<string, 1 | -1>;
  /** Auto-generate a unique slug from another field when none is supplied. */
  slugFrom?: string;
  /** Alternative public lookup key (default: slug if schema has it, else id). */
  publicKey?: string;
  /** Whitelist of fields editable via admin update. Default: every schema path except system fields. */
  updatableFields?: string[];
  /** Post-save hook (e.g. set resolvedAt). */
  beforeUpdate?: (doc: any, body: Record<string, unknown>) => void;
  /** Disallow admin create (for records that only come from public forms). */
  creatable?: boolean;
}

const SYSTEM_FIELDS = new Set(["_id", "id", "createdAt", "updatedAt", "__v"]);

const buildFilter = (opts: CrudOptions, query: Request["query"]) => {
  const filter: Record<string, unknown> = {};
  for (const f of opts.filterFields || []) {
    const v = qs(query[f]);
    if (v && v !== "all" && v !== "All") filter[f] = v;
  }
  for (const f of opts.boolFilters || []) {
    const v = qBool(query[f]);
    if (v !== undefined) filter[f] = v;
  }
  const search = qs(query.search);
  if (search && opts.searchFields?.length) {
    const rx = new RegExp(escapeRegex(search.slice(0, 80)), "i");
    filter.$or = opts.searchFields.map((f) => ({ [f]: rx }));
  }
  return filter;
};

const pickBody = (opts: CrudOptions, body: Record<string, unknown>) => {
  const allowed = opts.updatableFields ?? Object.keys(opts.model.schema.paths).filter((p) => !SYSTEM_FIELDS.has(p));
  const top = new Set(allowed.map((p) => p.split(".")[0]));
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(body || {})) {
    if (top.has(k) && !SYSTEM_FIELDS.has(k)) out[k] = v;
  }
  return out;
};

const uniqueSlug = async (model: Model<any>, base: string, ignoreId?: string) => {
  let slug = slugify(base) || "item";
  let candidate = slug;
  let n = 1;
  // eslint-disable-next-line no-await-in-loop
  while (await model.exists({ slug: candidate, ...(ignoreId ? { _id: { $ne: ignoreId } } : {}) })) {
    candidate = `${slug}-${n++}`;
  }
  return candidate;
};

const hasSlug = (m: Model<any>) => Boolean(m.schema.path("slug"));

/** PUBLIC read handlers (only published / active records). */
export const publicHandlers = (opts: CrudOptions) => ({
  list: asyncHandler(async (req: Request, res: Response) => {
    const filter = { ...buildFilter(opts, req.query), ...(opts.publicFilter ? opts.publicFilter() : {}) };
    const limit = qInt(req.query.limit, 500, 1, 1000);
    let q = opts.model.find(filter).sort(opts.sort || { createdAt: -1 }).limit(limit);
    if (opts.publicSelect) q = q.select(opts.publicSelect);
    const data = await q.lean({ virtuals: true });
    res.json({ success: true, count: data.length, data });
  }),

  get: asyncHandler(async (req: Request, res: Response) => {
    const key = String(req.params.key);
    const or: Record<string, unknown>[] = [];
    if (hasSlug(opts.model)) or.push({ slug: key.toLowerCase() });
    if (mongoose.isValidObjectId(key)) or.push({ _id: key });
    if (!or.length) throw new HttpError(404, "Not found.");
    const doc = await opts.model.findOne({ $or: or, ...(opts.publicFilter ? opts.publicFilter() : {}) }).lean({ virtuals: true });
    if (!doc) throw new HttpError(404, "Not found.");
    res.json({ success: true, data: doc });
  })
});

/** ADMIN handlers (RBAC is applied by the router). */
export const adminHandlers = (opts: CrudOptions) => ({
  list: asyncHandler(async (req: Request, res: Response) => {
    const filter = buildFilter(opts, req.query);
    const limit = qInt(req.query.limit, 200, 1, 1000);
    const page = qInt(req.query.page, 1, 1, 100000);
    const [data, total] = await Promise.all([
      opts.model.find(filter).sort(opts.sort || { createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean({ virtuals: true }),
      opts.model.countDocuments(filter)
    ]);
    res.json({ success: true, count: data.length, total, page, data });
  }),

  get: asyncHandler(async (req: Request, res: Response) => {
    if (!mongoose.isValidObjectId(req.params.id)) throw new HttpError(400, "Invalid id.");
    const doc = await opts.model.findById(req.params.id);
    if (!doc) throw new HttpError(404, "Not found.");
    res.json({ success: true, data: doc });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    if (opts.creatable === false) throw new HttpError(405, "Creating records here is not allowed.");
    const body = pickBody(opts, req.body);
    if (hasSlug(opts.model) && opts.slugFrom) {
      const base = (body.slug as string) || (body[opts.slugFrom] as string);
      if (!base) throw new HttpError(400, `${opts.slugFrom} is required.`);
      body.slug = await uniqueSlug(opts.model, base);
    }
    const doc = await opts.model.create(body);
    res.status(201).json({ success: true, message: "Created successfully", data: doc });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    if (!mongoose.isValidObjectId(req.params.id)) throw new HttpError(400, "Invalid id.");
    const doc = await opts.model.findById(req.params.id);
    if (!doc) throw new HttpError(404, "Not found.");
    const body = pickBody(opts, req.body);
    if (body.slug === "") delete body.slug; // empty slug input = keep the current one
    if (hasSlug(opts.model) && typeof body.slug === "string" && body.slug !== doc.get("slug")) {
      body.slug = await uniqueSlug(opts.model, body.slug, doc.id);
    }
    doc.set(body);
    opts.beforeUpdate?.(doc, body);
    await doc.save();
    res.json({ success: true, message: "Updated successfully", data: doc });
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    if (!mongoose.isValidObjectId(req.params.id)) throw new HttpError(400, "Invalid id.");
    const doc = await opts.model.findByIdAndDelete(req.params.id);
    if (!doc) throw new HttpError(404, "Not found.");
    res.json({ success: true, message: "Deleted successfully" });
  })
});
