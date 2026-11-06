import React, { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { AdminLayout } from "../components/AdminLayout";
import { getAdminSettings, updateSettings, errorMessage } from "../../services/api";

const input = "w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-[#2E2EF2] focus:ring-2 focus:ring-[#2E2EF2]/15 shadow-2xs transition";
const Label = ({ children }: { children: React.ReactNode }) => <label className="block text-[11px] font-bold text-slate-700 mb-1">{children}</label>;

export default function AdminSiteSettingsPage() {
  const [s, setS] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    getAdminSettings().then((r) => setS(r.data)).catch((e) => setMsg({ ok: false, text: errorMessage(e) }));
  }, []);

  const set = (path: string, value: any) =>
    setS((prev: any) => {
      const next = { ...prev };
      const parts = path.split(".");
      if (parts.length === 1) next[path] = value;
      else next[parts[0]] = { ...(prev[parts[0]] || {}), [parts[1]]: value };
      return next;
    });
  const setRow = (key: "heroStats" | "trustStats", i: number, field: string, value: string) =>
    setS((prev: any) => ({ ...prev, [key]: prev[key].map((row: any, idx: number) => (idx === i ? { ...row, [field]: value } : row)) }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const { _id, key, createdAt, updatedAt, id, ...body } = s;
      await updateSettings(body);
      setMsg({ ok: true, text: "Saved. The website now shows the new details." });
    } catch (err) {
      setMsg({ ok: false, text: errorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  const text = (path: string, label: string, ph = "") => {
    const [a, b] = path.split(".");
    const val = b ? s[a]?.[b] : s[a];
    return (
      <div>
        <Label>{label}</Label>
        <input className={input} value={val ?? ""} placeholder={ph} onChange={(e) => set(path, e.target.value)} />
      </div>
    );
  };

  return (
    <AdminLayout title="Site Settings" subtitle="Contact details, top banner and headline numbers shown across the public website">
      {!s ? (
        msg ? <p className="text-red-300 text-sm">{msg.text}</p> : <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
      ) : (
        <form onSubmit={save} className="space-y-6 max-w-4xl">
          <section className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-2xs">
            <h3 className="text-sm font-black text-[#111827]">Company & contact details</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {text("companyName", "Company name")} {text("tagline", "Tagline")}
              {text("phone", "Phone (shown on site)", "+91 ...")} {text("whatsapp", "WhatsApp number (digits only)", "917676765421")}
              {text("email", "General email")} {text("supportEmail", "Support email (optional)", "falls back to general email")}
              {text("legalEmail", "Legal / privacy email (optional)")} {text("placementEmail", "Placement email (optional)")}
            </div>
            {text("address", "Head office address / area")}
            <div className="grid sm:grid-cols-2 gap-4">
              {text("social.facebook", "Facebook URL")} {text("social.instagram", "Instagram URL")} {text("social.linkedin", "LinkedIn URL")}
              {text("social.youtube", "YouTube URL")} {text("social.twitter", "X / Twitter URL")}
            </div>
          </section>

          <section className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-[#111827]">Top announcement banner</h3>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-[#2E2EF2] rounded" checked={Boolean(s.banner?.enabled)} onChange={(e) => set("banner.enabled", e.target.checked)} /> Show banner on public site
              </label>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {text("banner.highlight", "Highlight text")} {text("banner.text", "Main text")} {text("banner.suffix", "Suffix text")} {text("banner.ctaLabel", "Button label")}
            </div>
          </section>

          <section className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-2xs">
            <h3 className="text-sm font-black text-[#111827]">Headline numbers</h3>
            <p className="text-[11.5px] text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200 font-medium">Only publish numbers you can prove. Misleading placement claims can create legal trouble.</p>
            <div className="grid sm:grid-cols-3 gap-4">
              {text("homeStats.ratingValue", "Average rating")} {text("homeStats.ratingCount", "Number of reviews")} {text("homeStats.placedCount", "Students placed")}
            </div>
            <h4 className="text-xs font-bold text-slate-800 pt-2">Placement page stat boxes</h4>
            {(s.heroStats || []).map((r: any, i: number) => (
              <div key={i} className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <input className={input} value={r.value} onChange={(e) => setRow("heroStats", i, "value", e.target.value)} placeholder="Value" />
                <input className={input} value={r.line1} onChange={(e) => setRow("heroStats", i, "line1", e.target.value)} placeholder="Line 1" />
                <input className={input} value={r.line2} onChange={(e) => setRow("heroStats", i, "line2", e.target.value)} placeholder="Line 2" />
                <input className={input} value={r.bg} onChange={(e) => setRow("heroStats", i, "bg", e.target.value)} placeholder="#16a34a" />
              </div>
            ))}
            <h4 className="text-xs font-bold text-slate-800 pt-2">Reviews page counters</h4>
            {(s.trustStats || []).map((r: any, i: number) => (
              <div key={i} className="grid grid-cols-2 gap-2">
                <input className={input} value={r.value} onChange={(e) => setRow("trustStats", i, "value", e.target.value)} placeholder="Value" />
                <input className={input} value={r.label} onChange={(e) => setRow("trustStats", i, "label", e.target.value)} placeholder="Label" />
              </div>
            ))}
          </section>

          <section className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-2xs">
            <h3 className="text-sm font-black text-[#111827]">SEO & meta details</h3>
            {text("seo.title", "Browser tab title")} {text("seo.description", "Meta description")}
          </section>

          {msg && (
            <p role="alert" className={`rounded-xl px-4 py-2.5 text-xs font-medium border ${msg.ok ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-600"}`}>
              {msg.text}
            </p>
          )}
          <button disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2E2EF2] hover:bg-[#2020d4] text-white text-xs font-black shadow-xs hover:shadow disabled:opacity-70 cursor-pointer transition active:scale-[0.98]">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save settings
          </button>
        </form>
      )}
    </AdminLayout>
  );
}
