import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { useList } from "@/hooks/useApi";
import { getPartners, getPlacements } from "@/services/api";
import { toPlacementCard, StudentPlacementCard } from "@/lib/adapters";
import HiringPartners from "../HiringPartners";

function PlacementCard({ student }: { student: StudentPlacementCard }) {
  const [imgSrc, setImgSrc] = useState(student.avatar);

  return (
    <div className="w-[230px] sm:w-[250px] flex-shrink-0 bg-[#f0f4fd] rounded-2xl p-5 border border-[#e0e8fd] shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col items-center text-center justify-between group select-none">
      {/* Top Right Package Tag */}
      <div className="w-full flex justify-end">
        <span className="text-[10px] sm:text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-emerald-100/90 text-emerald-800 border border-emerald-300">
          {student.package}
        </span>
      </div>

      {/* Student Portrait Avatar */}
      <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full p-0.5 bg-white border-2 border-blue-100 shadow-xs mt-1 mb-3 overflow-hidden group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={student.name}
          className="w-full h-full object-cover rounded-full"
          loading="lazy"
          onError={() => {
            // Graceful fallback to SVG avatar if offline or blocked
            setImgSrc(`/avatars/${student.gender === "f" ? "vihaana.svg" : "pramod.svg"}`);
          }}
        />
      </div>

      {/* Student Name & Role Details */}
      <div className="space-y-1 mb-3">
        <h3 className="font-bold text-[14px] sm:text-[15px] text-[#111827] line-clamp-1">
          {student.name}
        </h3>
        <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
          {student.package} • {student.role}
        </p>
      </div>

      {/* Bottom Company Logo */}
      <div className="w-full pt-3 border-t border-[#e0e8fd] flex items-center justify-center h-9">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={student.logo}
          alt={student.company}
          className="max-h-5 sm:max-h-6 max-w-[95px] object-contain opacity-85 group-hover:opacity-100 transition-opacity"
        />
      </div>
    </div>
  );
}

export default function PlacedStudentsReviewGrid() {
  const { items: topPartnerLogos } = useList<any>(() => getPartners({ kind: "top" }));
  const placedQ = useList<StudentPlacementCard>(() => getPlacements().then((r) => ({ ...r, data: (r.data || []).filter((p: any) => p.marqueeRow > 0).map((p: any) => ({ ...toPlacementCard(p), row: p.marqueeRow })) })));
  const PLACED_ROW_1 = placedQ.items.filter((p: any) => p.row === 1);
  const PLACED_ROW_2 = placedQ.items.filter((p: any) => p.row === 2);

  // Infinite duplicate arrays for seamless auto marquee scrolling
  const marqueeRow1 = [...PLACED_ROW_1, ...PLACED_ROW_1, ...PLACED_ROW_1];
  const marqueeRow2 = [...PLACED_ROW_2, ...PLACED_ROW_2, ...PLACED_ROW_2];

  return (
    <section id="placed-students" className="py-14 sm:py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Placement Record Eyebrow & Title */}
        <div className="text-center space-y-4 mb-10">
          {/* Eyebrow badge with sparkle */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-amber-300 bg-amber-50/70 text-amber-700 text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>PLACEMENT RECORD</span>
          </div>

          {/* Heading with 6,622 badge */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111827] tracking-tight flex flex-wrap items-center justify-center gap-2.5">
            <span>How we have placed</span>
            <span className="px-3.5 py-1 rounded-md bg-[#2E2EF2] text-white font-black text-2xl sm:text-3xl lg:text-4xl shadow-xs">
              6,622
            </span>
            <span>Students?</span>
          </h2>
        </div>
        


      </div>

      {/* Horizontal Auto Smooth Scrolling Marquee Container matching cgdfhgdfhggh.mp4 */}
      <div className="relative w-full space-y-5">
        
        {/* Left & Right subtle edge fade gradient */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white to-transparent z-10" />

        {/* Row 1: Smooth Auto Scrolling (Leftward) */}
        <div className="overflow-hidden no-scrollbar">
          <div className="flex gap-5 animate-marquee py-1 hover:[animation-play-state:paused] cursor-grab active:cursor-grabbing">
            {marqueeRow1.map((student, idx) => (
              <PlacementCard key={`r1-${idx}`} student={student} />
            ))}
          </div>
        </div>

        {/* Row 2: Smooth Auto Scrolling (Rightward or Leftward offset for dynamic flow) */}
        <div className="overflow-hidden no-scrollbar">
          <div className="flex gap-5 animate-marquee-reverse py-1 hover:[animation-play-state:paused] cursor-grab active:cursor-grabbing">
            {marqueeRow2.map((student, idx) => (
              <PlacementCard key={`r2-${idx}`} student={student} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
