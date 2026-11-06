"use client";

import React from "react";

interface MitLogoProps {
  className?: string;
}

export default function MitLogo({ className = "w-10 h-10" }: MitLogoProps) {
  return (
    <div
      className={`relative ${className} rounded-xl bg-gradient-to-tr from-[#1428A0] via-[#2E2EF2] to-[#4F46E5] flex items-center justify-center text-white shadow-sm border border-white/25 overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}
    >
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full p-1"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="mitDotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#818CF8" />
          </linearGradient>
        </defs>

        {/* "M" */}
        <path
          d="M22 82V38h11l11 22 11-22h11v44H56V54L45 74h-2L32 54v28H22z"
          fill="#FFFFFF"
        />

        {/* "i" dot with electric cyan/indigo glow */}
        <circle cx="73" cy="42" r="5" fill="url(#mitDotGrad)" />

        {/* "i" stem */}
        <rect x="69" y="52" width="8" height="30" rx="3" fill="#FFFFFF" />

        {/* "T" */}
        <path d="M81 46h24v8h-8v28h-8V54h-8v-8z" fill="#FFFFFF" />
      </svg>
    </div>
  );
}
