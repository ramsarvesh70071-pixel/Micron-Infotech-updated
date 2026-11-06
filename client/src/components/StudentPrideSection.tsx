"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown } from "lucide-react";
import { useList } from "@/hooks/useApi";
import { getPlacements } from "@/services/api";
import { toStudentPlacement, StudentPlacement, PLACEMENT_CATEGORY_LABELS } from "@/lib/adapters";
import { DataBoundary } from "./DataState";
import StudentAvatar from "./StudentAvatar";

interface StudentPrideSectionProps {
  onSelectStudent?: (student: StudentPlacement) => void;
}

export default function StudentPrideSection({ onSelectStudent }: StudentPrideSectionProps = {}) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [packageFilter, setPackageFilter] = useState<number>(0);
  const [visibleCount, setVisibleCount] = useState<number>(24);
  const placedQ = useList<StudentPlacement>(() => getPlacements().then((r) => ({ ...r, data: (r.data || []).filter((p: any) => p.marqueeRow === 0).map(toStudentPlacement) })));
  const STUDENTS_DATA = placedQ.items;
  const CATEGORIES = [
    { id: "all", label: "All Placements" },
    ...Array.from(new Set(STUDENTS_DATA.map((s) => s.category))).map((id) => ({ id, label: PLACEMENT_CATEGORY_LABELS[id] || id }))
  ];

  // Filter logic
  const filteredStudents = useMemo(() => {
    return STUDENTS_DATA.filter((student) => {
      const matchesCategory =
        selectedCategory === "all" || student.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        student.name.toLowerCase().includes(q) ||
        student.role.toLowerCase().includes(q) ||
        student.company.toLowerCase().includes(q) ||
        student.package.toLowerCase().includes(q);

      const matchesPackage = student.packageNum >= packageFilter;

      return matchesCategory && matchesSearch && matchesPackage;
    });
  }, [STUDENTS_DATA, selectedCategory, searchQuery, packageFilter]);

  const displayedStudents = filteredStudents.slice(0, visibleCount);

  return (
    <section id="placements" className="py-16 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="text-xs font-bold tracking-widest text-[#4b5563] uppercase">
            OUR STUDENT PRIDE
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[#111827] tracking-tight leading-snug">
            We love them the most <br />
            Provides the best for them.
          </h2>

          <p className="text-xs sm:text-[13px] text-[#4b5563] font-normal max-w-xl mx-auto">
            Students choose Micron Info Tech for career growth due to practical training, industry connections, mentorship, and successful placement assistance.
          </p>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="bg-[#f8fafc] rounded-xl p-3 sm:p-4 border border-[#e2e8f0] mb-8">
          <div className="flex flex-col md:flex-row items-center gap-3 justify-between">
            
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search student, role, company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-[#2E2EF2]"
              />
            </div>

            {/* Package selector */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              <span className="text-[11px] font-semibold text-slate-500 mr-1">Package:</span>
              {[
                { label: "All", min: 0 },
                { label: "5+ LPA", min: 5 },
                { label: "8+ LPA", min: 8 },
                { label: "15+ LPA", min: 15 },
                { label: "25+ LPA", min: 25 }
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setPackageFilter(p.min)}
                  className={`text-[11px] px-2.5 py-1 rounded font-medium transition-all cursor-pointer ${
                    packageFilter === p.min
                      ? "bg-[#2E2EF2] text-white"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

          </div>

          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-3 border-t border-slate-200 mt-3 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-[11px] px-3 py-1 rounded-full whitespace-nowrap font-medium transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#111827] text-white"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Column Student Placement Cards Grid with Real Local Brand Logos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {displayedStudents.map((student) => (
            <div
              key={student.id}
              className="group relative bg-[#edf1fb] hover:bg-[#e4ebfa] rounded-2xl p-5 border border-transparent hover:border-[#2E2EF2]/40 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between text-center"
            >
              {/* Top Right: Light Green LPA Badge */}
              <div className="flex justify-end mb-2">
                <span className="px-2 py-0.5 rounded-full bg-[#dcfce7] border border-[#bbf7d0] text-[#15803d] font-bold text-[11px] leading-tight">
                  {student.package}
                </span>
              </div>

              {/* Center Avatar */}
              <div className="my-1">
                <StudentAvatar
                  name={student.name}
                  seed={student.avatarSeed}
                  gender={student.avatarGender}
                  gradient={student.avatarBg}
                  imageUrl={student.image}
                  size="md"
                />
              </div>

              {/* Student Name */}
              <div className="mt-3 mb-2 space-y-0.5">
                <h3 className="text-sm sm:text-[15px] font-bold text-[#111827]">
                  {student.name}
                </h3>
                <p className="text-[11px] text-[#4b5563] font-normal leading-tight">
                  {student.package} • {student.role}
                </p>
              </div>

              {/* Company Local Brand Logo at Bottom (Downloaded & Loaded Locally) */}
              <div className="mt-auto pt-3 border-t border-[#dce3f5] flex items-center justify-center min-h-[34px]">
                {student.logo ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={student.logo}
                    alt={student.company}
                    className="h-5 max-w-[110px] object-contain transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <span
                    className="font-extrabold text-xs sm:text-[13px] tracking-tight"
                    style={{ color: student.companyColor }}
                  >
                    {student.company}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {filteredStudents.length > visibleCount && (
          <div className="text-center mt-10">
            <button
              onClick={() => setVisibleCount((prev) => prev + 24)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#111827] hover:bg-[#2E2EF2] text-white font-semibold text-xs tracking-wide transition-colors cursor-pointer"
            >
              <span>VIEW ALL {filteredStudents.length} PLACEMENTS</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
