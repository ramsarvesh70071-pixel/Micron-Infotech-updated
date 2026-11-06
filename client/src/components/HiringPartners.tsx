"use client";

import React from "react";

import { useList } from "../hooks/useApi";
import { getPartners } from "../services/api";

export default function HiringPartners({ onCorporateEnquiry }: { onCorporateEnquiry?: () => void }) {
  const { items: brandsRow1, loading } = useList<any>(() => getPartners({ kind: "hiring" }));
  return (
    <section id="hiring-partners" className="py-16 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto space-y-2 mb-10">
          <div className="text-xs font-bold tracking-widest text-[#6b7280] uppercase">
            HIRING PARTNERS
          </div>

          {/* Heading with exact requested font details */}
          <h2
            className="text-[#111827] tracking-tight leading-snug"
            style={{
              fontFamily: 'Inter, "Inter Fallback", Inter, sans-serif',
              fontSize: "38px",
              fontStyle: "normal",
              fontWeight: 700
            }}
          >
            Top Unicorns, Brands, MNCs Trust <br />
            Micron Info Tech for the best.
          </h2>

          <p className="text-xs sm:text-[13px] text-[#4b5563] font-normal max-w-xl mx-auto">
            Top unicorns and brands trust Micron Info Tech for elite training, industry-aligned curriculum, expert mentorship, and proven placement assistance.
          </p>
        </div>

        {/* Logos Marquee Row with Local Brand SVG Logos */}
        <div className="relative w-full overflow-hidden py-4">
          <div className="flex gap-8 items-center animate-marquee whitespace-nowrap">
            {[...brandsRow1, ...brandsRow1].map((brand, i) => (
              <div
                key={i}
                className="inline-flex items-center justify-center px-6 py-2 flex-shrink-0 cursor-default min-w-[130px]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-10 sm:h-11 max-w-[170px] object-contain transition-transform hover:scale-105"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
