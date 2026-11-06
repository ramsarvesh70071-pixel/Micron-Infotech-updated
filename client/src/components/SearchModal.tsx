import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, X, BookOpen, MapPin, ArrowRight } from "lucide-react";
import { useList } from "../hooks/useApi";
import { getCourses, getBranches } from "../services/api";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const { items: COURSES_LIST } = useList<any>(() => getCourses());
  const { items: BRANCHES_DATA } = useList<any>(() => getBranches());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const filteredCourses = q
    ? COURSES_LIST.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.highlights.some((h) => h.toLowerCase().includes(q))
      ).slice(0, 6)
    : COURSES_LIST.slice(0, 4);

  const filteredBranches = q
    ? BRANCHES_DATA.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.city.toLowerCase().includes(q) ||
          b.address.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[82vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 gap-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses, branch locations..."
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs font-semibold text-slate-500 bg-slate-200/70 hover:bg-slate-300 rounded-md transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Search Results List */}
        <div className="overflow-y-auto p-4 space-y-5">
          {/* Courses Section */}
          {filteredCourses.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                <BookOpen className="w-3.5 h-3.5 text-[#2E2EF2]" />
                Job-Oriented Courses
              </div>
              <div className="space-y-1.5">
                {filteredCourses.map((c) => (
                  <Link
                    key={c._id}
                    to="/#courses"
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50/60 border border-transparent hover:border-blue-100 transition-all group"
                  >
                    <div>
                      <div className="font-semibold text-sm text-slate-900 group-hover:text-[#2E2EF2] flex items-center gap-2">
                        {c.name}
                        {c.badge && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-[#2E2EF2]">
                            {c.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-3 mt-0.5">
                        <span>Duration: {c.duration}</span>
                        <span>•</span>
                        <span className="font-medium text-slate-700">{c.fee}</span>
                        <span>•</span>
                        <span>100% Placement</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#2E2EF2] group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Branches Section */}
          {filteredBranches.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                Branches & Locations
              </div>
              <div className="space-y-1.5">
                {filteredBranches.map((b) => (
                  <Link
                    key={b._id}
                    to="/contact"
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-amber-50/50 border border-transparent hover:border-amber-100 transition-all group"
                  >
                    <div>
                      <div className="font-semibold text-sm text-slate-900 group-hover:text-amber-700">
                        {b.name}
                      </div>
                      <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {b.address}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700 group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {q && filteredCourses.length === 0 && filteredBranches.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <p className="font-medium text-sm">No results found for "{query}"</p>
              <p className="text-xs mt-1 text-slate-400">Try searching for "Data Science", "Python", "Full Stack", or "Gorakhpur"</p>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>Need direct help? Call our counselors: <strong className="text-slate-800 font-semibold">7676765421</strong></span>
          <Link to="/contact" onClick={onClose} className="text-[#2E2EF2] font-semibold hover:underline">
            View Gorakhpur Center →
          </Link>
        </div>
      </div>
    </div>
  );
}

