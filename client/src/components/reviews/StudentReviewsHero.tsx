import React from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

interface StudentReviewsHeroProps {
  onEnrollClick?: () => void;
  onPlacementsClick?: () => void;
}

export default function StudentReviewsHero({
  onEnrollClick,
  onPlacementsClick
}: StudentReviewsHeroProps) {
  return (
    <section className="pt-10 sm:pt-14 pb-8 bg-white text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-5">
        
        {/* Main Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111827] tracking-tight">
          India&apos;s <span className="text-[#2E2EF2]">Most Loved</span> Training Institute
        </h1>

        {/* 5 Green Stars & Rating Text */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 text-[#16a34a] fill-[#16a34a]"
              />
            ))}
          </div>
          <span className="text-xs sm:text-sm font-semibold text-slate-700">
            4.9 out of 5 based on 20839 Reviews
          </span>
        </div>

        {/* Paragraph Description with Micron Info Tech */}
        <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-3xl mx-auto">
          People adore Micron Info Tech for its commitment to excellence. Known for its expert courses, flexible learning, and strong job support, it&apos;s a leader in education. Students love its easy-to-follow lessons, practical experience, and globally respected certificates. Plus, its friendly community encourages teamwork and progress, making everyone feel supported and confident. Join Micron Info Tech to reach your goals with ease.
        </p>

        {/* Two CTAs side-by-side */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={onEnrollClick}
            className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-md bg-[#2E2EF2] hover:bg-[#1f1fe0] text-white font-extrabold text-xs tracking-wider uppercase active:scale-95 transition-all shadow-xs cursor-pointer"
          >
            ENROLL NOW
          </button>

          <Link
            to="/placement"
            onClick={onPlacementsClick}
            className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-md bg-white border border-[#2E2EF2] text-[#2E2EF2] hover:bg-blue-50 font-extrabold text-xs tracking-wider uppercase active:scale-95 transition-all shadow-xs cursor-pointer"
          >
            PLACEMENTS
          </Link>
        </div>

      </div>
    </section>
  );
}
