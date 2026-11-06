"use client";

import React, { useState } from "react";

interface StudentAvatarProps {
  name: string;
  seed: string;
  gender: "m" | "f";
  size?: "sm" | "md" | "lg";
  gradient?: string;
  imageUrl?: string;
}

export default function StudentAvatar({
  name,
  seed,
  gender,
  size = "md",
  gradient = "from-blue-400 to-indigo-600",
  imageUrl
}: StudentAvatarProps) {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: "w-10 h-10 text-xs",
    md: "w-16 h-16 sm:w-18 sm:h-18 text-base",
    lg: "w-24 h-24 text-xl"
  };

  // Get initials for fallback
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // CDN image source: use provided imageUrl or default to RandomUser CDN portraits
  const defaultCdnUrl = `https://randomuser.me/api/portraits/${gender === "f" ? "women" : "men"}/${Math.abs(
    seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 90
  ) + 1}.jpg`;

  const finalImgSrc = imageUrl || defaultCdnUrl;

  return (
    <div
      className={`relative ${sizeClasses[size]} mx-auto rounded-full p-0.5 bg-gradient-to-tr ${gradient} shadow-xs group-hover:scale-105 transition-transform duration-300`}
    >
      <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden relative border-2 border-white shadow-inner">
        {!imgError ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={finalImgSrc}
            alt={`${name} photo`}
            className="w-full h-full object-cover rounded-full"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          /* High Quality Stylized Illustrated Avatar Fallback */
          <div className="w-full h-full flex items-center justify-center bg-[#EBF4FF] text-slate-700 relative overflow-hidden">
            {gender === "f" ? (
              <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
                <circle cx="50" cy="50" r="50" fill="#FCE7F3" />
                <path d="M25 88c0-14 11-25 25-25s25 11 25 25" fill="#EC4899" />
                <circle cx="50" cy="42" r="20" fill="#FBBF24" />
                <path d="M30 40c0-12 9-22 20-22s20 10 20 22c0 2-4 5-8 5-4 0-4-3-12-3s-8 3-12 3c-4 0-8-3-8-5z" fill="#4B5563" />
                <circle cx="43" cy="42" r="2.5" fill="#1F2937" />
                <circle cx="57" cy="42" r="2.5" fill="#1F2937" />
                <path d="M46 51c2 2 6 2 8 0" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
                <circle cx="50" cy="50" r="50" fill="#E0E7FF" />
                <path d="M24 88c0-14 12-25 26-25s26 11 26 25" fill="#3B82F6" />
                <circle cx="50" cy="43" r="20" fill="#FBBF24" />
                <path d="M30 35c2-10 10-16 20-16s18 6 20 16c-3-2-8-3-14-3-8 0-14 2-26 3z" fill="#1F2937" />
                <circle cx="43" cy="42" r="2.5" fill="#1F2937" />
                <circle cx="57" cy="42" r="2.5" fill="#1F2937" />
                <path d="M46 52c2 1.5 6 1.5 8 0" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
