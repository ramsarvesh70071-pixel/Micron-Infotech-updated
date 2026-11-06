import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Award, 
  CheckCircle2, 
  Users, 
  Building2, 
  Target, 
  HeartHandshake, 
  Star, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  PhoneCall
} from "lucide-react";
import TopBanner from "../components/TopBanner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EnrollModal from "../components/EnrollModal";
import SearchModal from "../components/SearchModal";
import { useSiteSettings } from "../context/SiteSettingsContext";
import { useList } from "../hooks/useApi";
import { getTeam } from "../services/api";
import HiringPartners from "../components/HiringPartners";

export default function AboutPage() {
  const site = useSiteSettings();
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const { items: teamMembers } = useList<any>(() => getTeam({ kind: "team" }));

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-[#2E2EF2] selection:text-white">
      <TopBanner onSelectCourse={() => setEnrollModalOpen(true)} />
      <Navbar
        onOpenSearch={() => setSearchModalOpen(true)}
        onCallClick={() => setEnrollModalOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 lg:py-20 bg-gradient-to-b from-blue-50/80 via-white to-white border-b border-slate-100 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-[#2E2EF2] text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>LET'S MEET {site.companyName.toUpperCase()}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                India's Leading & Best Rated <span className="text-[#2E2EF2]">Software Training</span> Institute
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                Founded by <strong>Safura Begam in 2010</strong>, MicronInfoTech provides world-class practical software training and skill development courses that bridge the divide between classroom academics and enterprise demands.
              </p>

              {/* Badges strip */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>4.9 / 5 based on 20,839+ Student Reviews</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>In Partnership with NASSCOM®</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-16 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2E2EF2] bg-blue-50 px-3 py-1 rounded-full">
                  Our Mission & Vision
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                  Helping Students Learn Something Better
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Our mission at MicronInfoTech is simple: to bridge the gap between skills and industry needs. We aim to provide top-notch skill development training that colleges often miss out on, ensuring our learners are well-prepared for the professional world.
                </p>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Over the past 14+ years, we have trained over <strong>11,540+ professionals</strong>, helped more than 10,500 students get placed in top MNCs, and partnered with over 2,000 hiring brands across Bangalore, Chennai, and PAN-India.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-2xl font-black text-[#2E2EF2]">500+</div>
                    <div className="text-xs text-slate-600 font-bold mt-0.5">Skill Courses</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-2xl font-black text-emerald-600">100%</div>
                    <div className="text-xs text-slate-600 font-bold mt-0.5">Placement Assistance</div>
                  </div>
                </div>
              </div>

              {/* Three Quality Pillars */}
              <div className="lg:col-span-6 space-y-4">
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs hover:border-blue-300 transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-[#2E2EF2] font-black text-sm">
                      01
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900">Quality in Our Courses</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Updated and industry-aligned curricula designed with real-time enterprise tools, ensuring hands-on practical lab mastery rather than rote theory.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs hover:border-blue-300 transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 font-black text-sm">
                      02
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900">Quality in Our Teachers</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Over 200+ seasoned trainers and subject matter experts from Google, Microsoft, TCS, Wipro, and Accenture providing personalized 1-on-1 mentorship.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs hover:border-blue-300 transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700 font-black text-sm">
                      03
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900">Quality in Our Placement</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Over 2,000 corporate hiring partners actively hiring our students. Complete resume building, mock interviews, and scheduled client interview drives.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Meet Our Leadership Team */}
        <section className="py-16 bg-slate-50/70 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2E2EF2] bg-blue-100 px-3 py-1 rounded-full">
                Our Foundation
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
                Meet Our Leadership Team
              </h2>
              <p className="text-slate-600 text-sm mt-2">
                The visionary leadership steering student excellence, corporate partnerships, and educational innovation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member: any, i: number) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs text-center space-y-4 hover:shadow-md transition-all"
                >
                  <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-tr ${member.color} text-white flex items-center justify-center font-black text-xl shadow-sm`}>
                    {member.initials}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">{member.name}</h3>
                    <div className="text-xs text-[#2E2EF2] font-bold mt-0.5">{member.role}</div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2,000+ Hiring Partners */}
        <HiringPartners onCorporateEnquiry={() => setEnrollModalOpen(true)} />

        {/* Bottom CTA */}
        <section className="bg-gradient-to-r from-[#2E2EF2] to-[#173bb5] text-white py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ready to Accelerate Your Career with MicronInfoTech?
            </h2>
            <p className="max-w-2xl mx-auto text-blue-100 text-sm">
              Speak with our senior academic counselors or visit any of our 6 learning centers in Bangalore and Chennai.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setEnrollModalOpen(true)}
                className="px-8 py-3.5 rounded-full bg-white text-[#2E2EF2] font-black text-sm tracking-wide shadow-md hover:bg-blue-50 transition-all cursor-pointer"
              >
                Book a Free Demo Class
              </button>
              <Link
                to="/contact"
                className="px-6 py-3.5 rounded-full bg-blue-900/60 hover:bg-blue-900 text-white font-bold text-sm border border-blue-400/40 transition-all cursor-pointer"
              >
                Visit Our Centers →
              </Link>
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

