"use client";

import React, { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { useList } from "@/hooks/useApi";
import { getFaqs } from "@/services/api";
import { toFaq } from "@/lib/adapters";

export default function ReviewFaqSection() {
  const q = useList<any>(() => getFaqs({ scope: "reviews" }).then((r) => ({ ...r, data: (r.data || []).map(toFaq) })));
  const REVIEW_FAQS = q.items;
  const [openIds, setOpenIds] = useState<string[]>([]);
  React.useEffect(() => setOpenIds(REVIEW_FAQS.map((f: any) => f.id)), [REVIEW_FAQS.length]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleFaq = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = REVIEW_FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="review-faqs" className="py-14 sm:py-20 bg-white border-t border-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search & Filter Header Bar */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reviews questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2E2EF2] focus:border-transparent transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpenIds(REVIEW_FAQS.map((f) => f.id))}
              className="text-xs px-3 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer transition-colors"
            >
              Expand All
            </button>
            <button
              onClick={() => setOpenIds([])}
              className="text-xs px-3 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* 7 Questions & Answers List matching exact screenshot format */}
        <div className="space-y-8">
          {filteredFaqs.map((faq) => {
            const isOpen = openIds.includes(faq.id);

            return (
              <div
                key={faq.id}
                className="space-y-2.5 transition-all duration-200 pb-6 border-b border-slate-100 last:border-b-0"
              >
                {/* Question */}
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-start justify-between text-left gap-4 group cursor-pointer"
                >
                  <h3 className="text-base sm:text-[17px] font-bold text-[#111827] group-hover:text-[#2E2EF2] transition-colors leading-snug">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 group-hover:text-[#2E2EF2] transition-transform duration-200 flex-shrink-0 mt-0.5 ${
                      isOpen ? "rotate-180 text-[#2E2EF2]" : ""
                    }`}
                  />
                </button>

                {/* Answer */}
                {isOpen && (
                  <p className="text-xs sm:text-[13.5px] text-[#4b5563] leading-relaxed font-normal pt-1">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-sm">
              No matching questions found for &quot;{searchQuery}&quot;.
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

