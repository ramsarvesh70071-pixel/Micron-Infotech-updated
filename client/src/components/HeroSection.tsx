"use client";

import React from "react";

interface HeroSectionProps {
  onEnrollClick?: () => void;
  onExploreCourses?: () => void;
}

import { useSiteSettings } from "../context/SiteSettingsContext";

export default function HeroSection({ onEnrollClick, onExploreCourses }: HeroSectionProps) {
  const stats = useSiteSettings().heroStats;
  return (
    <section className="relative overflow-hidden pt-6 sm:pt-8 lg:pt-10 pb-6 bg-[#ffffff]">
      {/* Subtle background circular arc on the left matching reference */}
      <div className="absolute -left-28 top-6 w-[360px] h-[360px] rounded-full bg-slate-100/70 -z-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main 2-Column Hero: Left has Heading, Paragraph, Buttons AND the 4 Stat Cards; Right has the Tall Standing Student Girl */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-end">
          
          {/* Left Column: Top Content + Bottom 4 Stat Cards in 1 row on sm+ */}
          <div className="md:col-span-8 lg:col-span-9 flex flex-col justify-between space-y-5 lg:space-y-6">
            
            {/* Heading, Paragraph, and Buttons */}
            <div className="space-y-4 sm:space-y-5 text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black text-[#111827] tracking-tight leading-[1.12]">
                Best Courses, Best Jobs <br />
                <span className="text-[#2E2EF2]">Successful</span> Careers
              </h1>

              <p className="text-sm sm:text-[15px] text-[#4b5563] max-w-2xl leading-relaxed font-normal">
                Micron Info Tech excels in placement assistance, guiding students toward lucrative career opportunities. With personalized training, practical learning modules, and industry-relevant certifications, it equips individuals with in-demand skills.
              </p>

              {/* CTAs matching exact screenshot style */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
                <button
                  onClick={onEnrollClick}
                  className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-md bg-[#2E2EF2] hover:bg-[#1f1fe0] text-white font-extrabold text-xs tracking-wider uppercase active:scale-95 transition-all shadow-xs cursor-pointer"
                >
                  ENROLL NOW
                </button>

                <button
                  onClick={onExploreCourses}
                  className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-md bg-white text-[#2E2EF2] border-2 border-[#2E2EF2] hover:bg-blue-50/50 font-extrabold text-xs tracking-wider uppercase active:scale-95 transition-all cursor-pointer"
                >
                  OUR COURSES
                </button>
              </div>
            </div>

            {/* 4 Stat Cards directly beneath the buttons (4 in a single horizontal row on sm and up) */}
            <div className="pt-2 sm:pt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-4">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  style={{ backgroundColor: stat.bg || "#2E2EF2" }}
                  className={`rounded-2xl p-4 sm:p-5 text-white shadow-xs transition-transform duration-200 hover:-translate-y-1 flex flex-col justify-between h-[135px] sm:h-[155px] lg:h-[170px]`}
                >
                  <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-[42px] font-black tracking-tight leading-none mb-1 whitespace-nowrap">
                    {stat.value}
                  </div>
                  <div className="text-[11px] sm:text-xs lg:text-[13px] font-semibold text-white/95 leading-tight">
                    {stat.line1} <br />
                    {stat.line2}
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Right Column: Tall Vector Illustration of Student Girl standing next to the entire hero */}
          <div className="hidden md:flex md:col-span-4 lg:col-span-3 items-end justify-center lg:justify-end">
            <div className="relative w-full max-w-[240px] lg:max-w-[290px] h-[440px] lg:h-[500px] flex items-end justify-center">
              
              <svg
                viewBox="0 0 240 560"
                className="w-full h-full object-contain"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Floor Shadow beneath feet */}
                <ellipse cx="125" cy="535" rx="85" ry="8" fill="#e2e8f0" />

                {/* Shoes */}
                {/* Left Shoe */}
                <path d="M 80 522 C 80 532, 110 532, 110 522 L 105 514 L 85 514 Z" fill="#2d3748" />
                {/* Right Shoe */}
                <path d="M 140 522 C 140 532, 170 532, 170 522 L 165 514 L 145 514 Z" fill="#2d3748" />

                {/* Mint-Green Wide-Leg Trousers matching exact color and straight cut */}
                <path
                  d="M 75 230 L 175 230 L 185 516 L 132 516 L 125 275 L 118 516 L 65 516 Z"
                  fill="#bbf7d0"
                />
                {/* Center Crease lines down each leg */}
                <line x1="91" y1="245" x2="91" y2="514" stroke="#86efac" strokeWidth="2" strokeLinecap="round" />
                <line x1="158" y1="245" x2="158" y2="514" stroke="#86efac" strokeWidth="2" strokeLinecap="round" />

                {/* Sky Blue Backpack (Body behind back and shoulder) */}
                <path d="M 170 140 C 202 140, 214 165, 214 195 C 214 225, 196 235, 172 230 Z" fill="#60a5fa" />
                <ellipse cx="188" cy="188" rx="16" ry="32" fill="#93c5fd" />
                {/* Backpack Strap over shoulder */}
                <path d="M 158 140 C 148 165, 154 195, 168 220" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" fill="none" />

                {/* Cream / Pale Yellow Blouse */}
                <path d="M 80 138 L 170 138 L 175 230 L 75 230 Z" fill="#fef9c3" />
                {/* Short Sleeve (Left) */}
                <path d="M 75 140 L 52 188 L 78 198 L 90 150 Z" fill="#fef08a" />

                {/* Shirt Collar */}
                <path d="M 98 138 L 118 155 L 108 138 Z" fill="#fef08a" />
                <path d="M 118 155 L 138 138 L 128 138 Z" fill="#fef08a" />

                {/* Neck */}
                <path d="M 108 116 L 128 116 L 126 138 L 106 138 Z" fill="#fed7aa" />

                {/* Long Flowing Dark Brown Hair (Back Layer) */}
                <path
                  d="M 145 52 C 185 52, 210 75, 210 120 C 210 165, 195 205, 202 240 C 205 250, 190 255, 180 240 C 170 225, 172 190, 170 155 C 168 135, 162 120, 152 110 Z"
                  fill="#2b170e"
                />

                {/* Head Base (Peachy Skin Tone) */}
                <path
                  d="M 102 70 C 102 50, 122 40, 142 40 C 162 40, 174 55, 174 75 C 174 98, 162 118, 140 118 C 122 118, 102 102, 102 82 Z"
                  fill="#fed7aa"
                />

                {/* Face Profile Details (Facing Left, Cute Pointed Nose, Smiling) */}
                <path d="M 104 76 L 90 85 L 103 89 L 102 98 L 109 106 L 118 108" fill="#fed7aa" stroke="#fed7aa" strokeWidth="2.5" strokeLinejoin="round" />
                
                {/* Eye (Almond with pupil & reflection) */}
                <ellipse cx="112" cy="78" rx="3.5" ry="4.5" fill="#1e293b" />
                <circle cx="110.5" cy="76.5" r="1.5" fill="#ffffff" />
                {/* Eyebrow */}
                <path d="M 106 70 Q 114 66, 122 70" stroke="#3b1d11" strokeWidth="2" strokeLinecap="round" fill="none" />
                
                {/* Happy Open Smile with White Teeth */}
                <path d="M 100 95 Q 108 104, 118 95" fill="#f87171" stroke="#991b1b" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M 102 95 Q 108 98, 116 95 Z" fill="#ffffff" />
                
                {/* Cheerful Blush */}
                <circle cx="120" cy="88" r="6" fill="#f87171" opacity="0.35" />

                {/* Front & Top Hair Cap */}
                <path
                  d="M 125 40 C 100 40, 85 55, 85 75 C 85 85, 90 88, 98 80 C 102 65, 112 55, 130 50 C 150 45, 165 52, 170 68 C 172 60, 168 48, 155 43 C 145 39, 135 40, 125 40 Z"
                  fill="#3b1d11"
                />
                <path
                  d="M 135 42 C 155 42, 175 55, 178 78 C 182 105, 170 135, 175 165 C 178 175, 170 178, 164 170 C 158 158, 160 135, 158 115 Z"
                  fill="#3b1d11"
                />

                {/* Arms and Forearm holding the books */}
                <path d="M 100 150 L 70 185 L 82 198 L 115 168 Z" fill="#fed7aa" />

                {/* Books / Folders held in hands (Tilted at angle) */}
                <g transform="translate(50, 172) rotate(-16)">
                  {/* Under Book (White / Light Grey) */}
                  <rect x="-10" y="10" width="76" height="50" rx="3" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
                  
                  {/* Top Book (Golden/Tan with darker spine & badge matching reference) */}
                  <rect x="0" y="0" width="80" height="52" rx="4" fill="#d97706" />
                  <rect x="2" y="2" width="76" height="48" rx="3" fill="#f59e0b" />
                  <line x1="8" y1="2" x2="8" y2="50" stroke="#b45309" strokeWidth="2.5" />
                  <circle cx="40" cy="26" r="7" fill="#d97706" />
                </g>

                {/* Fingers wrapping around the book */}
                <path d="M 76 200 C 68 206, 68 216, 78 216 C 88 216, 92 210, 90 202 Z" fill="#fed7aa" />
              </svg>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
