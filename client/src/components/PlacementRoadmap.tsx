"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  UserCheck, 
  FileText, 
  Video, 
  Award, 
  ArrowRight,
  Sparkles,
  CheckCircle2
} from "lucide-react";

export default function PlacementRoadmap({ onEnrollClick }: { onEnrollClick?: () => void }) {
  const steps = [
    {
      step: "01",
      title: "Real-World Hands-on Training",
      desc: "Learn through 10+ industry capstone projects, cloud sandboxes, and modern tools matching current tech stacks.",
      icon: BookOpen,
      accent: "from-blue-600 to-cyan-500"
    },
    {
      step: "02",
      title: "1-on-1 Mentorship from MNC Leads",
      desc: "Get code reviews and architecture guidance from working engineers at Amazon, Microsoft, Infosys, and TCS.",
      icon: UserCheck,
      accent: "from-indigo-600 to-purple-600"
    },
    {
      step: "03",
      title: "ATS-Optimized Profile Building",
      desc: "We reconstruct your resume, GitHub portfolio, and LinkedIn to consistently score 90+ on recruiter ATS filters.",
      icon: FileText,
      accent: "from-fuchsia-600 to-pink-600"
    },
    {
      step: "04",
      title: "Rigorous Mock Interview Rounds",
      desc: "Face real-time technical rounds, DSA problems, behavioral questions, and salary negotiation drills with expert feedback.",
      icon: Video,
      accent: "from-amber-500 to-orange-600"
    },
    {
      step: "05",
      title: "Exclusive Interview Drives & Offers",
      desc: "Direct referrals to 2,000+ hiring partners until you secure your dream offer letter with maximum salary hike.",
      icon: Award,
      accent: "from-emerald-500 to-teal-600"
    }
  ];

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background glowing gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>HOW WE ENSURE 95% PLACEMENT SUCCESS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            The Micron Info Tech <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
              5-Step Career Placement Blueprint
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-normal">
            A proven, battle-tested system designed to take you from beginner or career switcher to a placed IT specialist.
          </p>
        </div>

        {/* 5 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative rounded-2xl bg-slate-800/80 border border-slate-700/80 p-6 flex flex-col justify-between hover:border-blue-500 hover:bg-slate-800 transition-all duration-300 group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-slate-500 group-hover:text-cyan-400 transition-colors">
                      {s.step}
                    </span>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${s.accent} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {s.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-700/60 flex items-center text-[11px] font-semibold text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  <span>Verified Milestones</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA bar */}
        <div className="mt-14 text-center">
          <button
            onClick={onEnrollClick}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm tracking-wide shadow-xl shadow-blue-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <span>JOIN MICRON INFO TECH TODAY</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
