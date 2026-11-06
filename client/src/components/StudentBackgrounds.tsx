"use client";

import React, { useState } from "react";
import { Users, Sparkles, TrendingUp, CheckCircle2 } from "lucide-react";

interface BackgroundSegment {
  id: string;
  label: string;
  percentage: number;
  color: string;
  count: string;
  description: string;
  transition: string;
}

export default function StudentBackgrounds() {
  const [activeSegment, setActiveSegment] = useState<string>("freshers");

  const segments: BackgroundSegment[] = [
    {
      id: "freshers",
      label: "Freshers / College Passout / Job Seekers",
      percentage: 42,
      color: "#1e3a8a", // Deep Blue from screenshot
      count: "18,900+ Students",
      description: "College graduates and entry-level seekers with zero corporate experience.",
      transition: "Placed at TCS, Infosys, Cognizant with starting offers of 5 to 8 LPA."
    },
    {
      id: "working-it",
      label: "Working IT Professionals",
      percentage: 27,
      color: "#2563eb", // Medium Blue from screenshot
      count: "12,150+ Students",
      description: "Support, QA, and operations engineers upgrading to Cloud, DevOps, and AI.",
      transition: "Achieved average 140% salary hike, peaking at 40 LPA (Amazon & Salesforce)."
    },
    {
      id: "non-it",
      label: "Non IT with ZERO Coding Skills",
      percentage: 13,
      color: "#67e8f9", // Cyan from screenshot
      count: "5,850+ Students",
      description: "B.Com, B.Sc, and Arts graduates starting code from absolute zero.",
      transition: "Successfully transitioned into Full Stack & ServiceNow with 5 - 7.5 LPA packages."
    },
    {
      id: "dropouts",
      label: "Intermediate / Dropouts",
      percentage: 9,
      color: "#cbd5e1", // Light Slate from screenshot
      count: "4,050+ Students",
      description: "Candidates with education breaks or non-traditional degrees.",
      transition: "Hired based on verified GitHub portfolio projects and technical aptitude."
    },
    {
      id: "housewives",
      label: "Housewives",
      percentage: 5,
      color: "#f472b6", // Soft Pink from screenshot
      count: "2,250+ Students",
      description: "Women restarting careers after 2 to 7 years of family career gaps.",
      transition: "Restarted careers in QA Automation and Digital Marketing at 6 - 10 LPA."
    },
    {
      id: "service-workers",
      label: "Service Workers",
      percentage: 4,
      color: "#818cf8", // Lavender from screenshot
      count: "1,800+ Students",
      description: "Workers from retail, hospitality, sales, and non-tech service sectors.",
      transition: "Transitioned from minimum wages to 8 LPA Performance Marketer roles."
    }
  ];

  const current = segments.find((s) => s.id === activeSegment) || segments[0];

  // SVG calculations
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  return (
    <section id="backgrounds" className="py-16 bg-[#ffffff] border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <div className="text-xs font-bold tracking-widest text-[#6b7280] uppercase">
            STUDENT BACKGROUNDS
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-black text-[#111827] tracking-tight">
            Our Students Come From Diverse <br />
            Background and Condition.
          </h2>

          <p className="text-xs sm:text-[13px] text-[#4b5563] font-normal">
            Our diverse students emerge as professionals from various backgrounds, honing skills for success in their dedicated fields.
          </p>
        </div>

        {/* Visual Chart Card */}
        <div className="bg-[#f8fafc] rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Interactive Donut Chart */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
              
              {/* SVG Donut */}
              <svg className="w-full h-full -rotate-90 filter drop-shadow-sm" viewBox="0 0 200 200">
                {segments.map((seg) => {
                  const strokeDasharray = `${(seg.percentage / 100) * circumference} ${circumference}`;
                  const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
                  accumulatedPercent += seg.percentage;

                  const isSelected = activeSegment === seg.id;

                  return (
                    <circle
                      key={seg.id}
                      cx="100"
                      cy="100"
                      r={radius}
                      fill="transparent"
                      stroke={seg.color}
                      strokeWidth={isSelected ? "32" : "25"}
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-300 cursor-pointer hover:opacity-90"
                      onClick={() => setActiveSegment(seg.id)}
                      onMouseEnter={() => setActiveSegment(seg.id)}
                    />
                  );
                })}
              </svg>

              {/* Inner Center Circle with Dynamic Percentage */}
              <div className="absolute inset-0 m-auto w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-white shadow-md flex flex-col items-center justify-center p-3 text-center border border-slate-100 pointer-events-none">
                <span className="text-3xl sm:text-4xl font-black text-[#111827] leading-none">
                  {current.percentage}%
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase leading-tight line-clamp-2 mt-1">
                  {current.label}
                </span>
                <span className="text-[9px] font-semibold text-[#2E2EF2] mt-0.5">
                  {current.count}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-4 text-center">
              Hover over or click segments to view transformation details
            </p>
          </div>

          {/* Right Column: Breakdown Cards with Progress Bars */}
          <div className="lg:col-span-6 space-y-2.5">
            
            {/* Active Detail Showcase Box */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-[#2E2EF2] shadow-sm space-y-2 mb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: current.color }}
                  />
                  <h4 className="font-black text-sm sm:text-base text-slate-900">
                    {current.label}
                  </h4>
                </div>
                <span className="text-xl font-black text-[#2E2EF2]">
                  {current.percentage}%
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {current.description}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-start gap-2 text-xs text-emerald-800 bg-emerald-50/70 p-2.5 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Proven Result:</strong> {current.transition}
                </span>
              </div>
            </div>

            {/* Compact List of All 6 Categories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {segments.map((seg) => {
                const isSelected = activeSegment === seg.id;
                return (
                  <button
                    key={seg.id}
                    onClick={() => setActiveSegment(seg.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#2E2EF2] text-white border-[#2E2EF2] shadow-sm"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden mr-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: isSelected ? "#ffffff" : seg.color }}
                      />
                      <span className="text-xs font-semibold truncate">
                        {seg.label}
                      </span>
                    </div>
                    <span className="text-xs font-black flex-shrink-0">
                      {seg.percentage}%
                    </span>
                  </button>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
