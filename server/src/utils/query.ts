/** Query-string helpers: Express parses `?a[$ne]=x` into objects, so never trust raw req.query values. */
export const qs = (value: unknown): string | undefined => (typeof value === "string" && value.trim() !== "" ? value.trim() : undefined);

export const qBool = (value: unknown): boolean | undefined => {
  const v = qs(value);
  if (v === "true") return true;
  if (v === "false") return false;
  return undefined;
};

export const qInt = (value: unknown, fallback: number, min: number, max: number): number => {
  const n = parseInt(String(value ?? ""), 10);
  if (Number.isNaN(n)) return fallback;
  return Math.min(max, Math.max(min, n));
};

/** Escapes user input before it is used inside a RegExp (prevents regex injection / ReDoS). */
export const escapeRegex = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
