import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, X, Loader2, RefreshCw, Eye, UploadCloud, Image as ImageIcon } from "lucide-react";
import { adminCreate, adminDelete, adminList, adminUpdate, errorMessage, uploadImage } from "../../services/api";
import { useAdminAuth } from "../context/AdminAuthContext";

export type FieldType = "text" | "textarea" | "number" | "boolean" | "select" | "lines" | "tags" | "json" | "datetime" | "image";

export interface FieldDef {
  key: string;
  label: string;
  type?: FieldType;
  options?: string[];
  required?: boolean;
  help?: string;
  placeholder?: string;
  readOnly?: boolean; // shown in the form but never sent back
  wide?: boolean; // spans both columns
}
export interface ColumnDef {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
  toggle?: boolean; // inline checkbox that saves immediately
  select?: string[]; // inline dropdown that saves immediately (e.g. status)
}
export interface ResourceDef {
  resource: string; // permission + API name (/api/admin/<resource>)
  singular: string;
  titleKey: string; // used in delete confirmation
  fields: FieldDef[];
  columns: ColumnDef[];
  filters?: { key: string; label: string; options: string[] }[];
  defaults?: Record<string, unknown>;
  canCreate?: boolean;
  searchPlaceholder?: string;
  headerActions?: React.ReactNode;
}

// ---- conversion between API values and form strings ----
const toForm = (f: FieldDef, v: any): any => {
  switch (f.type) {
    case "lines": return Array.isArray(v) ? v.join("\n") : "";
    case "tags": return Array.isArray(v) ? v.join(", ") : "";
    case "json": return v === undefined || v === null ? "[]" : JSON.stringify(v, null, 2);
    case "boolean": return Boolean(v);
    case "number": return v === undefined || v === null ? "" : String(v);
    case "datetime": return v ? new Date(v).toISOString().slice(0, 16) : "";
    default: return v ?? "";
  }
};
const fromForm = (f: FieldDef, v: any): any => {
  switch (f.type) {
    case "lines": return String(v).split("\n").map((x) => x.trim()).filter(Boolean);
    case "tags": return String(v).split(",").map((x) => x.trim()).filter(Boolean);
    case "json":
      try { return JSON.parse(v || "[]"); } catch { throw new Error(`"${f.label}" is not valid JSON.`); }
    case "number": return v === "" ? undefined : Number(v);
    case "datetime": return v ? new Date(v).toISOString() : undefined;
    default: return v;
  }
};

const inputCls = "w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-[#2E2EF2] focus:ring-2 focus:ring-[#2E2EF2]/15 shadow-2xs transition disabled:bg-slate-50 disabled:opacity-60";

export function ResourceManager({ def }: { def: ResourceDef }) {
  const { can } = useAdminAuth();
  const canWrite = can(def.resource, "write");
  const canDelete = can(def.resource, "delete");
  const canCreate = canWrite && def.canCreate !== false;

  const [rows, setRows] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<any | null>(null); // row or {} for new
  const [values, setValues] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setQuery(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminList(def.resource, { search: query, ...filters });
      setRows(res.data || []);
      setTotal(res.total ?? res.count ?? 0);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [def.resource, query, filters]);
  useEffect(() => { load(); }, [load]);

  const openForm = (row: any | null) => {
    const base: Record<string, any> = {};
    def.fields.forEach((f) => (base[f.key] = toForm(f, row ? row[f.key] : def.defaults?.[f.key])));
    setValues(base);
    setFormError("");
    setEditing(row || {});
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      const body: Record<string, unknown> = {};
      def.fields.filter((f) => !f.readOnly).forEach((f) => {
        const v = fromForm(f, values[f.key]);
        if (v !== undefined) body[f.key] = v;
      });
      if (editing?._id) await adminUpdate(def.resource, editing._id, body);
      else await adminCreate(def.resource, body);
      setEditing(null);
      await load();
    } catch (err) {
      setFormError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (fieldKey: string, file: File) => {
    setUploadingField(fieldKey);
    setFormError("");
    try {
      const res = await uploadImage(file);
      if (res?.url) {
        setValues((p) => ({ ...p, [fieldKey]: res.url }));
      }
    } catch (err) {
      setFormError(errorMessage(err));
    } finally {
      setUploadingField(null);
    }
  };

  const quickUpdate = async (row: any, patch: Record<string, unknown>) => {
    setRows((prev) => prev.map((r) => (r._id === row._id ? { ...r, ...patch } : r))); // optimistic
    try {
      await adminUpdate(def.resource, row._id, patch);
    } catch (err) {
      setError(errorMessage(err));
      load(); // roll back to server truth
    }
  };

  const remove = async (row: any) => {
    if (!window.confirm(`Delete "${row[def.titleKey] ?? def.singular}"? This cannot be undone.`)) return;
    try {
      await adminDelete(def.resource, row._id);
      await load();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const filterBar = useMemo(
    () =>
      (def.filters || []).map((f) => (
        <select
          key={f.key}
          value={filters[f.key] || ""}
          onChange={(e) => setFilters((p) => ({ ...p, [f.key]: e.target.value }))}
          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs focus:outline-none focus:border-[#2E2EF2] cursor-pointer"
          aria-label={f.label}
        >
          <option value="">{f.label}: All</option>
          {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      )),
    [def.filters, filters]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={def.searchPlaceholder || "Search..."}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2E2EF2] focus:ring-2 focus:ring-[#2E2EF2]/15 shadow-2xs transition"
          />
        </div>
        {filterBar}
        <button
          onClick={load}
          className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#2E2EF2] hover:bg-slate-50 shadow-2xs cursor-pointer transition"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#2E2EF2]" : ""}`} />
        </button>
        {def.headerActions}
        {canCreate && (
          <button
            onClick={() => openForm(null)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2E2EF2] hover:bg-[#2020d4] text-white text-xs font-black shadow-xs hover:shadow transition active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add {def.singular}
          </button>
        )}
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs text-red-600 font-medium">
          {error}
        </p>
      )}
      <p className="text-[11.5px] text-slate-500 font-medium">{loading ? "Loading records..." : `Showing ${rows.length} of ${total} records`}</p>

      <div className="overflow-x-auto rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[10.5px] font-bold border-b border-slate-200">
            <tr>
              {def.columns.map((c) => (
                <th key={c.key} className="text-left font-bold px-4 py-3 whitespace-nowrap">
                  {c.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={def.columns.length + 1} className="px-4 py-12 text-center text-slate-400 font-medium">
                  No records found matching your filters.
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row._id} className="hover:bg-blue-50/40 transition">
                {def.columns.map((c) => (
                  <td key={c.key} className="px-4 py-3 text-slate-700 align-top max-w-[280px]">
                    {c.toggle ? (
                      <input
                        type="checkbox"
                        checked={Boolean(row[c.key])}
                        disabled={!canWrite}
                        onChange={(e) => quickUpdate(row, { [c.key]: e.target.checked })}
                        className="w-4 h-4 accent-[#2E2EF2] cursor-pointer rounded"
                        aria-label={c.label}
                      />
                    ) : c.select ? (
                      <select
                        value={row[c.key] || ""}
                        disabled={!canWrite}
                        onChange={(e) => quickUpdate(row, { [c.key]: e.target.value })}
                        className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 shadow-2xs focus:outline-none focus:border-[#2E2EF2] cursor-pointer"
                      >
                        {c.select.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    ) : c.render ? (
                      c.render(row)
                    ) : (
                      <span className="line-clamp-2 break-words">{String(row[c.key] ?? "")}</span>
                    )}
                  </td>
                ))}
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button
                    onClick={() => openForm(row)}
                    className="p-1.5 rounded-lg bg-blue-50 text-[#2E2EF2] hover:bg-blue-100 cursor-pointer transition shadow-2xs"
                    title={canWrite ? "Edit" : "View"}
                  >
                    {canWrite ? <Pencil className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  {canDelete && (
                    <button
                      onClick={() => remove(row)}
                      className="ml-1.5 p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer transition shadow-2xs"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <form onSubmit={save} className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl my-8 shadow-2xl overflow-hidden animate-in fade-in duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <h3 className="text-base font-black text-[#111827]">
                {editing._id ? (canWrite ? "Edit" : "View") : "Add"} {def.singular}
              </h3>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-200/50 cursor-pointer transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {def.fields.map((f) => {
                const disabled = f.readOnly || !canWrite;
                const wide = f.wide || ["textarea", "lines", "json"].includes(f.type || "");
                const isImage =
                  f.type === "image" ||
                  /image|avatar|thumbnail|logo|photo/i.test(f.key);

                return (
                  <div key={f.key} className={wide ? "sm:col-span-2" : ""}>
                    {f.type === "boolean" ? (
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer pt-4">
                        <input
                          type="checkbox"
                          checked={Boolean(values[f.key])}
                          disabled={disabled}
                          onChange={(e) => setValues((p) => ({ ...p, [f.key]: e.target.checked }))}
                          className="w-4 h-4 accent-[#2E2EF2] rounded"
                        />
                        {f.label}
                      </label>
                    ) : (
                      <>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          {f.label}{f.required && " *"}
                        </label>
                        {isImage ? (
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                required={f.required}
                                disabled={disabled}
                                value={values[f.key] ?? ""}
                                placeholder={f.placeholder || "Paste image URL or upload photo..."}
                                onChange={(e) => setValues((p) => ({ ...p, [f.key]: e.target.value }))}
                                className={inputCls}
                              />
                              <label
                                className={`relative inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-[#2E2EF2] text-xs font-bold rounded-xl border border-[#2E2EF2]/20 shadow-2xs transition whitespace-nowrap ${
                                  disabled || uploadingField === f.key ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                                }`}
                              >
                                {uploadingField === f.key ? (
                                  <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...
                                  </>
                                ) : (
                                  <>
                                    <UploadCloud className="w-3.5 h-3.5" /> Upload Photo
                                  </>
                                )}
                                <input
                                  type="file"
                                  accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/avif"
                                  disabled={disabled || uploadingField === f.key}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleFileUpload(f.key, file);
                                    e.target.value = "";
                                  }}
                                  className="sr-only"
                                />
                              </label>
                            </div>
                            {values[f.key] && (
                              <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                                <img
                                  src={values[f.key]}
                                  alt="Preview"
                                  className="w-12 h-12 rounded-lg object-contain bg-white border border-slate-200 p-0.5"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLElement).style.display = "none";
                                  }}
                                />
                                <span className="text-[11px] text-slate-600 truncate flex-1 font-mono">
                                  {values[f.key]}
                                </span>
                                {!disabled && (
                                  <button
                                    type="button"
                                    onClick={() => setValues((p) => ({ ...p, [f.key]: "" }))}
                                    className="text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1 cursor-pointer"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        ) : f.type === "textarea" || f.type === "lines" || f.type === "json" ? (
                          <textarea
                            rows={f.type === "json" ? 8 : f.type === "textarea" ? 5 : 4}
                            required={f.required}
                            disabled={disabled}
                            value={values[f.key] ?? ""}
                            placeholder={f.placeholder}
                            onChange={(e) => setValues((p) => ({ ...p, [f.key]: e.target.value }))}
                            className={`${inputCls} ${f.type === "json" ? "font-mono text-xs" : ""}`}
                          />
                        ) : f.type === "select" ? (
                          <select
                            required={f.required}
                            disabled={disabled}
                            value={values[f.key] ?? ""}
                            onChange={(e) => setValues((p) => ({ ...p, [f.key]: e.target.value }))}
                            className={inputCls}
                          >
                            {!f.required && <option value="">-</option>}
                            {(f.options || []).map((o) => (
                              <option key={o} value={o}>{o}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={f.type === "number" ? "number" : f.type === "datetime" ? "datetime-local" : "text"}
                            step={f.type === "number" ? "any" : undefined}
                            required={f.required}
                            disabled={disabled}
                            value={values[f.key] ?? ""}
                            placeholder={f.placeholder}
                            onChange={(e) => setValues((p) => ({ ...p, [f.key]: e.target.value }))}
                            className={inputCls}
                          />
                        )}
                        {f.help && <p className="text-[10px] text-slate-500 mt-1">{f.help}</p>}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
            {formError && (
              <p role="alert" className="mx-6 mb-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs text-red-600 font-medium">
                {formError}
              </p>
            )}
            <div className="p-5 border-t border-slate-100 flex justify-end gap-2.5 bg-slate-50/70">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer shadow-2xs transition"
              >
                {canWrite ? "Cancel" : "Close"}
              </button>
              {canWrite && (
                <button
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#2E2EF2] hover:bg-[#2020d4] text-white text-xs font-black shadow-xs hover:shadow disabled:opacity-70 cursor-pointer transition active:scale-[0.98]"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
