"use client";

import React, { useEffect } from "react";
import { X, Star, Play, CheckCircle2, Award, Briefcase, IndianRupee } from "lucide-react";
import type { VideoReview } from "@/lib/adapters";

interface VideoModalProps {
  review: VideoReview | null;
  onClose: () => void;
  onEnroll: () => void;
}

export default function VideoModal({ review, onClose, onEnroll }: VideoModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (review) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [review, onClose]);

  if (!review) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close video player"
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video Player Area */}
        <div className="relative aspect-video bg-black w-full overflow-hidden flex items-center justify-center group">
          {/* Simulated HD video player with custom student interview background */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={review.thumbnail}
            alt={review.title}
            className="w-full h-full object-cover filter brightness-75 scale-105 group-hover:scale-100 transition-transform duration-700"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60" />

          {/* Live Playing State Indicator */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600/90 text-white text-xs font-bold tracking-wider uppercase backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>Success Story • Verified Video</span>
          </div>

          {/* Big Center Play / Simulation button */}
          <div className="absolute z-10 flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-[#2E2EF2] text-white flex items-center justify-center shadow-2xl shadow-blue-500/50 hover:scale-110 active:scale-95 transition-transform duration-300">
              <Play className="w-9 h-9 fill-white ml-1" />
            </div>
            <span className="text-white text-xs tracking-wider uppercase font-semibold bg-black/60 px-3 py-1 rounded-full border border-white/20">
              Duration: {review.duration}
            </span>
          </div>

          {/* Bottom Title Bar inside player */}
          <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-white text-lg sm:text-xl font-bold tracking-tight">
                {review.title}
              </p>
              <p className="text-blue-300 text-xs sm:text-sm font-medium">
                {review.role} @ {review.company} • {review.lpa}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-black/60 px-3 py-1.5 rounded-lg border border-white/20">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              ))}
              <span className="text-white text-xs font-bold ml-1.5">5.0 / 5.0</span>
            </div>
          </div>
        </div>

        {/* Video Details & Action Panel */}
        <div className="p-6 bg-slate-900 border-t border-white/10 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {review.company}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {review.lpa} Package
              </span>
            </div>
            <p className="text-slate-300 text-sm italic">
              &quot;{review.quote || "The comprehensive hands-on guidance and placement training helped me crack high-paying interview rounds."}&quot;
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onEnroll();
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#2E2EF2] hover:bg-[#1f1fe0] text-white font-extrabold text-xs tracking-wider uppercase transition-all shadow-lg shadow-blue-600/30 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              Start Your Career →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

