import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShieldCheck, FileText, ArrowRight, Sparkles, Mail, Phone } from "lucide-react";
import TopBanner from "../components/TopBanner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EnrollModal from "../components/EnrollModal";
import SearchModal from "../components/SearchModal";
import { useFetch, useList } from "../hooks/useApi";
import { getLegalDoc, getLegalDocs } from "../services/api";
import { DataBoundary } from "../components/DataState";
import { useSiteSettings } from "../context/SiteSettingsContext";

interface LegalDoc { slug: string; title: string; lastUpdated: string; sections: { heading: string; content: string[] }[] }

export default function LegalPage() {
  const location = useLocation();
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Normalize slug from pathname, e.g. /legal/privacy-policy -> privacy-policy
  const currentSlug = location.pathname.replace(/^\/legal\/?/, "").replace(/\/$/, "");
  const site = useSiteSettings();
  const { items: allDocs } = useList<any>(() => getLegalDocs());
  const slug = currentSlug || "privacy-policy";
  const docQ = useFetch<LegalDoc | null>(() => getLegalDoc(slug), (r) => (r.data as LegalDoc) || null, [slug]);
  const currentDoc: LegalDoc = docQ.data || { slug, title: "", lastUpdated: "", sections: [] };

  const legalLinks = allDocs.map((d: any) => ({ slug: d.slug, label: d.title.replace(/^MicronInfoTech\s+/i, "") }));

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-[#2E2EF2] selection:text-white">
      <TopBanner onSelectCourse={() => setEnrollModalOpen(true)} />
      <Navbar
        onOpenSearch={() => setSearchModalOpen(true)}
        onCallClick={() => setEnrollModalOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-12 lg:py-16 bg-gradient-to-b from-blue-50/70 via-white to-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#2E2EF2] text-xs font-bold tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>LEGAL & COMPLIANCE</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {currentDoc.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-500">
              Last Updated & Effective: <strong className="text-slate-700">{currentDoc.lastUpdated}</strong>
            </p>
          </div>
        </section>

        {/* Legal Document Content & Nav Sidebar */}
        <section className="py-14 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* Left Column: Legal Navigation Sidebar */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2 sticky top-28">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Legal Agreements:
                  </div>

                  {legalLinks.map((item) => (
                    <Link
                      key={item.slug}
                      to={`/legal/${item.slug}`}
                      className={`flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all ${
                        currentDoc.slug === item.slug
                          ? "bg-[#2E2EF2] text-white shadow-xs"
                          : "text-slate-700 hover:bg-slate-200/60"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 opacity-80" />
                        {item.label}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                    </Link>
                  ))}

                  <div className="pt-4 mt-4 border-t border-slate-200 text-xs text-slate-600 space-y-2">
                    <div className="font-bold text-slate-900">Legal Contact Desk:</div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail className="w-3.5 h-3.5 text-[#2E2EF2]" />
                      <span>{site.legalEmail || site.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-[#2E2EF2]" />
                      <span>{site.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Legal Document Content */}
              <div className="lg:col-span-8">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xs space-y-8">
                  <DataBoundary loading={docQ.loading} error={docQ.error} empty={!docQ.loading && !docQ.error && currentDoc.sections.length === 0} emptyLabel="This document is not available." onRetry={docQ.reload}>
                  {currentDoc.sections.map((section, idx) => (
                    <div key={idx} className="space-y-3">
                      <h2 className="text-lg sm:text-xl font-black text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                        <span className="text-[#2E2EF2] text-sm font-bold">0{idx + 1}.</span>
                        <span>{section.heading}</span>
                      </h2>
                      <div className="space-y-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                        {section.content.map((p, pIdx) => (
                          <p key={pIdx}>{p}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                  </DataBoundary>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />

      <EnrollModal
        isOpen={enrollModalOpen}
        onClose={() => setEnrollModalOpen(false)}
      />
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </div>
  );
}

