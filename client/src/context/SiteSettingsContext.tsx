import React, { createContext, useContext, useEffect, useState } from "react";
import { getSettings } from "../services/api";

export interface SiteSettings {
  companyName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  supportEmail: string;
  legalEmail: string;
  placementEmail: string;
  address: string;
  social: Record<string, string>;
  banner: { enabled: boolean; highlight: string; text: string; suffix: string; ctaLabel: string };
  heroStats: { value: string; line1: string; line2: string; bg: string }[];
  trustStats: { value: string; label: string }[];
  homeStats: { ratingValue: string; ratingCount: string; placedCount: string };
  seo: { title: string; description: string };
}

const EMPTY: SiteSettings = {
  companyName: "Micron Info Tech", tagline: "", phone: "", whatsapp: "", email: "", supportEmail: "", legalEmail: "", placementEmail: "",
  address: "", social: {}, banner: { enabled: false, highlight: "", text: "", suffix: "", ctaLabel: "" }, heroStats: [], trustStats: [],
  homeStats: { ratingValue: "", ratingCount: "", placedCount: "" },
  seo: { title: "", description: "" }
};

interface Ctx { settings: SiteSettings; loaded: boolean; failed: boolean; retry: () => void }
const SiteSettingsContext = createContext<Ctx>({ settings: EMPTY, loaded: false, failed: false, retry: () => {} });

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ settings: SiteSettings; loaded: boolean; failed: boolean }>({ settings: EMPTY, loaded: false, failed: false });
  const [tick, setTick] = useState(0);
  useEffect(() => {
    getSettings()
      .then((r) => {
        const s = { ...EMPTY, ...(r.data || {}), homeStats: { ...EMPTY.homeStats, ...(r.data?.homeStats || {}) } } as SiteSettings;
        setState({ settings: s, loaded: true, failed: false });
        if (s.seo?.title) document.title = s.seo.title;
      })
      .catch(() => setState({ settings: EMPTY, loaded: true, failed: true }));
  }, [tick]);
  return <SiteSettingsContext.Provider value={{ ...state, retry: () => setTick((t) => t + 1) }}>{children}</SiteSettingsContext.Provider>;
}

export const useSiteSettings = () => useContext(SiteSettingsContext).settings;
export const useSiteStatus = () => { const { loaded, failed, retry } = useContext(SiteSettingsContext); return { loaded, failed, retry }; };

/** Helpers for contact links: fall back to the general email / phone when a specific one is not set. */
export const telHref = (phone: string) => `tel:${phone.replace(/[^+\d]/g, "")}`;
export const waHref = (wa: string, text = "") => `https://wa.me/${wa.replace(/\D/g, "")}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
