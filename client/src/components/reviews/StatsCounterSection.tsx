"use client";

import React from "react";

import { useSiteSettings } from "../../context/SiteSettingsContext";

export default function StatsCounterSection() {
  const stats = useSiteSettings().trustStats;
  return (
    <section className="py-12 sm:py-16 bg-white border-t border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 text-center">
          {stats.map((item, index) => (
            <div key={index} className="flex flex-col items-center justify-center space-y-1 sm:space-y-2 group">
              <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#111827] tracking-tight group-hover:text-[#2E2EF2] transition-colors duration-300">
                {item.value}
              </span>
              <p className="text-xs sm:text-sm text-slate-600 font-medium tracking-normal max-w-[200px] sm:max-w-none">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

