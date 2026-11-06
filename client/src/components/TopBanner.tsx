"use client";

import React, { useState } from "react";
import { TrendingUp, ArrowRight, X } from "lucide-react";
import { useSiteSettings } from "../context/SiteSettingsContext";

interface TopBannerProps {
  onSelectCourse?: () => void;
}

export default function TopBanner({ onSelectCourse }: TopBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const { banner } = useSiteSettings();

  if (!isVisible || !banner.enabled || !(banner.highlight || banner.text)) return null;

  return (
    <aside aria-label="Announcement" className="bg-[#2E2EF2] text-white text-xs sm:text-[13px] py-2 px-4 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left message exactly matching user's image */}
        <div className="flex items-center gap-2 overflow-hidden mx-auto sm:mx-0">
          <TrendingUp className="w-4 h-4 text-white flex-shrink-0" />
          <span className="font-normal text-white">
            {banner.highlight}
          </span>
          <span className="text-white/80 font-bold">-</span>
          <span className="font-bold text-white">
            {banner.text}
          </span>
          <span className="text-white/80 font-normal hidden md:inline">
            {banner.suffix ? `- ${banner.suffix}` : ""}
          </span>
        </div>

        {/* Right button: White rounded pill with blue text matching screenshot */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onSelectCourse}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-[#2E2EF2] font-bold text-xs px-4 py-1.5 rounded-full transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <span>{banner.ctaLabel || "SELECT COURSE"}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#2E2EF2]" />
          </button>
          <button
            onClick={() => setIsVisible(false)}
            aria-label="Close Announcement Banner"
            className="text-white/70 hover:text-white p-1 transition-colors rounded hover:bg-white/10 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </aside>
  );
}
