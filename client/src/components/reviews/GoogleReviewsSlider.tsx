"use client";

import React, { useState } from "react";
import { Star, ChevronLeft, ChevronRight, CheckCircle2, MessageSquareQuote } from "lucide-react";
import { useList } from "@/hooks/useApi";
import { getReviews } from "@/services/api";
import { toGoogleReview, GoogleReview } from "@/lib/adapters";
import { DataBoundary } from "../DataState";

export default function GoogleReviewsSlider() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  const q = useList<GoogleReview>(() => getReviews({ kind: "google" }).then((r) => ({ ...r, data: (r.data || []).map(toGoogleReview) })));
  const GOOGLE_REVIEWS = q.items;

  const categories = [
    { id: "all", label: "All Reviews" },
    { id: "Google Verified", label: "Google Reviews" },
    { id: "DevOps & Cloud", label: "DevOps & Cloud" },
    { id: "Data Analytics", label: "Data Science & AI" },
    { id: "Full Stack", label: "Full Stack & Web" }
  ];

  const filteredReviews = GOOGLE_REVIEWS.filter((rev) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "Google Verified") return true;
    return rev.tag?.toLowerCase().includes(activeCategory.toLowerCase()) ||
           rev.role?.toLowerCase().includes(activeCategory.toLowerCase());
  });

  const pageSize = 6;
  const totalPages = Math.ceil(filteredReviews.length / pageSize);
  const currentReviews = filteredReviews.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <section id="student-reviews-feed" className="py-10 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header matching user request */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-[#2E2EF2] text-xs font-bold uppercase tracking-wider">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>GENUINE STUDENT EXPERIENCES & REVIEWS</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111827] tracking-tight">
            Our Students have cracked it! We made it <br className="hidden sm:inline" />
            possible for them.
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 font-normal max-w-xl mx-auto leading-relaxed">
            Discover why learners worldwide choose Micron Info Tech for career transformations, industry-ready skills, and dedicated placement support.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setCurrentPage(0);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-[#2E2EF2] text-white shadow-xs scale-102"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Grid (6 visible on screen) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentReviews.map((review) => (
            <div
              key={review.id}
              className="bg-[#f0f4fd] rounded-2xl p-6 sm:p-7 border border-[#e0e8fd] shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Top Header: Avatar, Name, Role, Package, Google Logo */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-xs flex-shrink-0 bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/avatars/vibhu.svg";
                        }}
                      />
                    </div>

                    {/* Name & Package */}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-[14.5px] text-[#111827] leading-tight">
                          {review.name}
                        </h4>
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 fill-blue-100" />
                      </div>
                      <p className="text-[11.5px] text-slate-600 font-semibold mt-0.5">
                        <span className="text-[#2E2EF2] font-black">{review.lpa}</span> • {review.company}
                      </p>
                    </div>
                  </div>

                  {/* Official Google 'G' icon */}
                  <div className="w-6 h-6 flex-shrink-0" title="Verified Google Review">
                    <svg viewBox="0 0 24 24" className="w-full h-full">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-[12.5px] sm:text-[13px] text-slate-700 leading-relaxed font-normal">
                  &quot;{review.review}&quot;
                </p>
              </div>

              {/* Bottom: 5 Stars + Relative Date */}
              <div className="flex items-center justify-between mt-5 pt-3 border-t border-blue-200/60">
                <div className="flex items-center gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 text-[#16a34a] fill-[#16a34a]"
                    />
                  ))}
                  <span className="text-[11px] font-bold text-emerald-700 ml-1">5.0</span>
                </div>
                <span className="text-[11px] font-medium text-slate-500">
                  {review.timeAgo}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination & Controls */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">
              ⭐ Rated 4.9/5 from 20,839+ Verified Alumni & Students
            </span>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={prevPage}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer transition-colors"
                aria-label="Previous reviews"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold text-slate-600 px-2">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={nextPage}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer transition-colors"
                aria-label="Next reviews"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
