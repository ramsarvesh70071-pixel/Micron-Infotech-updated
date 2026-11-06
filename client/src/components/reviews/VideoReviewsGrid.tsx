"use client";

import React, { useState } from "react";
import { Play, Star } from "lucide-react";
import { useList } from "@/hooks/useApi";
import { getReviews } from "@/services/api";
import { toVideoReview, VideoReview } from "@/lib/adapters";
import VideoModal from "./VideoModal";

interface VideoReviewsGridProps {
  onEnroll?: () => void;
}

export default function VideoReviewsGrid({ onEnroll }: VideoReviewsGridProps) {
  const [selectedReview, setSelectedReview] = useState<VideoReview | null>(null);
  const q = useList<VideoReview>(() => getReviews({ kind: "video" }).then((r) => ({ ...r, data: (r.data || []).map(toVideoReview) })));
  const VIDEO_REVIEWS = q.items;

  return (
    <section id="video-reviews" className="py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 8 Video Cards in 4-column responsive grid matching exact screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {VIDEO_REVIEWS.map((review) => (
            <div
              key={review.id}
              onClick={() => setSelectedReview(review)}
              className="group cursor-pointer bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={review.thumbnail}
                  alt={review.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                  loading="lazy"
                />

                {/* Subtle dark vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                {/* Custom Banner Badges from screenshot */}
                {review.badge && (
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="inline-block bg-[#2E2EF2]/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                      {review.badge}
                    </span>
                  </div>
                )}

                {/* Sub Badge if available (e.g., SAP Key moments) */}
                {review.subBadge && (
                  <div className="absolute bottom-2.5 left-2.5 z-10 max-w-[85%]">
                    <span className="inline-block bg-black/75 backdrop-blur-xs text-white text-[9px] font-semibold px-2 py-0.5 rounded truncate">
                      {review.subBadge}
                    </span>
                  </div>
                )}

                {/* Center Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#2E2EF2] text-white flex items-center justify-center shadow-lg shadow-blue-900/40 group-hover:scale-115 group-hover:bg-[#1f1fe0] transition-all duration-300">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Duration Tag */}
                <span className="absolute bottom-2 right-2 z-10 bg-black/80 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                  {review.duration}
                </span>
              </div>

              {/* Card Meta Content matching exact screenshot */}
              <div className="p-4 flex flex-col justify-between flex-1 space-y-2">
                <div>
                  <h3 className="font-bold text-[14px] sm:text-[15px] text-[#111827] group-hover:text-[#2E2EF2] transition-colors leading-snug line-clamp-1">
                    {review.title}
                  </h3>
                  <p className="text-[12px] text-slate-500 font-normal mt-0.5 truncate">
                    {review.role} @ {review.company} • {review.lpa}
                  </p>
                </div>

                {/* 5 Solid Green Stars */}
                <div className="flex items-center gap-1 pt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 text-[#16a34a] fill-[#16a34a]"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Video Modal Player */}
      <VideoModal
        review={selectedReview}
        onClose={() => setSelectedReview(null)}
        onEnroll={() => {
          setSelectedReview(null);
          if (onEnroll) onEnroll();
        }}
      />
    </section>
  );
}

