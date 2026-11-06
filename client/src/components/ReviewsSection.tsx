"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote, CheckCircle2, TrendingUp, Building2 } from "lucide-react";

export default function ReviewsSection() {
  const reviews = [
    {
      name: "Joseph Fernandes",
      role: "AWS DevOps Engineer",
      package: "40 LPA",
      company: "Amazon Web Services",
      rating: 5,
      review: "I joined Micron Info Tech with 8 LPA as a basic sysadmin. The hands-on Kubernetes, Terraform and AWS live infrastructure labs gave me the confidence to crack Amazon's bar-raiser interviews. Secured a 400% jump!",
      hike: "+400% Hike",
      batch: "Batch 2026"
    },
    {
      name: "Jayanthi R.",
      role: "Digital Marketing Specialist",
      package: "20 LPA",
      company: "Zomato",
      rating: 5,
      review: "From a non-IT content writing role at 4.2 LPA to 20 LPA at Zomato. The real budget campaigns we ran during training gave me real numbers to discuss during executive interviews. Highly recommend Micron Info Tech!",
      hike: "+376% Hike",
      batch: "Batch 2026"
    },
    {
      name: "Rahul Rai",
      role: "Senior Data Scientist",
      package: "16 LPA",
      company: "Atlys",
      rating: 5,
      review: "The curriculum is updated with the latest in GenAI, LangChain, and real ML deployment. The placement team arranged 6 interview calls within two weeks of course completion. Truly life-changing mentorship.",
      hike: "+190% Hike",
      batch: "Batch 2026"
    }
  ];

  return (
    <section id="reviews" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>4.9 / 5 RATED BY 12,000+ ALUMNI</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Real Stories. Real Hikes. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Unstoppable Career Trajectories.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-normal">
            Read how professionals and freshers transformed their lives through <strong className="text-slate-900">Micron Info Tech</strong>.
          </p>
        </div>

        {/* 3 Featured Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-slate-50 rounded-3xl p-7 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Rating & Hike Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {rev.hike}
                  </span>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed italic">
                  &ldquo;{rev.review}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{rev.name}</h4>
                  <p className="text-xs text-slate-500">{rev.role}</p>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-blue-600 text-sm">{rev.package}</span>
                  <p className="text-[11px] font-semibold text-slate-600">{rev.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
