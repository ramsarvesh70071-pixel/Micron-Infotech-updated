"use client";

import React, { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { useList } from "@/hooks/useApi";
import { getFaqs } from "@/services/api";
import { toFaq } from "@/lib/adapters";

export default function FaqSection() {
  const q = useList<any>(() => getFaqs({ scope: "placement" }).then((r) => ({ ...r, data: (r.data || []).map(toFaq) })));
  const FAQS_DATA = q.items;
  const [openIds, setOpenIds] = useState<string[]>([]);
  React.useEffect(() => setOpenIds(FAQS_DATA.slice(0, 3).map((f: any) => f.id)), [FAQS_DATA.length]);
  const [faqSearch, setFaqSearch] = useState("");

  const toggleFaq = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = FAQS_DATA.filter(
    (faq) =>
      faq.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      faq.answer.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <section id="faq" className="py-16 bg-white border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search frequently asked questions..."
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-[#2E2EF2]"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setOpenIds(FAQS_DATA.map((f) => f.id))}
              className="text-[11px] px-2.5 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Expand All
            </button>
            <button
              onClick={() => setOpenIds([])}
              className="text-[11px] px-2.5 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* FAQs List matching original text-focused layout */}
        <div className="space-y-6">
          {filteredFaqs.map((faq) => {
            const isOpen = openIds.includes(faq.id);

            return (
              <div
                key={faq.id}
                className="border-b border-slate-200 pb-5"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none group"
                >
                  <h3 className="font-bold text-sm sm:text-base text-[#111827] group-hover:text-[#2E2EF2] transition-colors leading-snug">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 group-hover:text-[#2E2EF2] transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <p className="mt-3 text-xs sm:text-[13px] text-[#4b5563] leading-relaxed">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
