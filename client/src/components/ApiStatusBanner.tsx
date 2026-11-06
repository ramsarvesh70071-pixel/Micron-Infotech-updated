import React from "react";
import { useLocation } from "react-router-dom";
import { useSiteStatus } from "../context/SiteSettingsContext";

/** Shown on public pages when the API cannot be reached, instead of silently showing empty sections. */
export default function ApiStatusBanner() {
  const { failed, retry } = useSiteStatus();
  const { pathname } = useLocation();
  if (!failed || pathname.startsWith("/admin")) return null;
  return (
    <div role="alert" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] max-w-md w-[92%] rounded-xl bg-red-600 text-white text-xs font-semibold shadow-xl px-4 py-3 flex items-center justify-between gap-3">
      <span>We could not load the latest content from the server.</span>
      <button onClick={retry} className="px-3 py-1 rounded-lg bg-white text-red-700 font-bold cursor-pointer">Retry</button>
    </div>
  );
}
