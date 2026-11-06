"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Clock, 
  Briefcase, 
  Award, 
  ArrowRight, 
  CheckCircle,
  Cpu,
  Cloud,
  Code2,
  Workflow,
  ShieldCheck,
  Megaphone
} from "lucide-react";

interface CoursesSectionProps {
  onSelectCourse: (courseName: string) => void;
}

export default function CoursesSection({ onSelectCourse }: CoursesSectionProps) {
  const courses = [
    {
      id: "ai-data",
      title: "Generative AI, ML & Data Science",
      subtitle: "Become an industry-ready AI Engineer building LLMs, computer vision, and neural networks.",
      duration: "6 Months",
      avgPackage: "8 - 18 LPA",
      icon: Cpu,
      gradient: "from-blue-600 to-cyan-500",
      tag: "Highest Salary",
      skills: ["Python", "PyTorch", "Hugging Face", "LangChain", "MLOps", "Pandas"]
    },
    {
      id: "cloud-devops",
      title: "AWS Cloud & DevOps Engineering",
      subtitle: "Master cloud infrastructure automation, CI/CD pipelines, Kubernetes and multi-cloud scaling.",
      duration: "5 Months",
      avgPackage: "9 - 25 LPA",
      icon: Cloud,
      gradient: "from-indigo-600 to-blue-500",
      tag: "Top Recruited",
      skills: ["AWS", "Docker", "Kubernetes", "Terraform", "GitHub Actions", "Linux"]
    },
    {
      id: "fullstack",
      title: "Full Stack Next.js & React Mastery",
      subtitle: "Build modern, fast, scalable enterprise web and mobile apps with TypeScript & Cloud APIs.",
      duration: "4.5 Months",
      avgPackage: "7 - 16 LPA",
      icon: Code2,
      gradient: "from-emerald-600 to-teal-500",
      tag: "Most Popular",
      skills: ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind"]
    },
    {
      id: "servicenow",
      title: "ServiceNow Developer & Admin",
      subtitle: "Enterprise workflow automation, ITSM, Scripting, and CSA/CAD certification readiness.",
      duration: "4 Months",
      avgPackage: "6 - 14 LPA",
      icon: Workflow,
      gradient: "from-rose-600 to-red-500",
      tag: "Zero Coding Req",
      skills: ["ITSM", "Client Scripts", "Business Rules", "Flow Designer", "Integration Hub"]
    },
    {
      id: "qa-tosca",
      title: "TOSCA Automation & QA Specialist",
      subtitle: "No-code enterprise test automation for global banking and retail multinational organizations.",
      duration: "3.5 Months",
      avgPackage: "5.5 - 12 LPA",
      icon: ShieldCheck,
      gradient: "from-purple-600 to-indigo-500",
      tag: "Fast Track",
      skills: ["Tricentis Tosca", "AS1 & AS2", "API Automation", "Test Design", "Jira"]
    },
    {
      id: "digital-marketing",
      title: "Digital & Performance Marketing",
      subtitle: "Growth marketing, SEO architecture, high-ROI Paid Ads, Analytics and CRO.",
      duration: "3.5 Months",
      avgPackage: "5 - 12 LPA",
      icon: Megaphone,
      gradient: "from-amber-500 to-orange-500",
      tag: "Non-Tech Friendly",
      skills: ["Google Ads", "Meta Ads", "SEO", "Google Analytics 4", "Email Flows"]
    }
  ];

  return (
    <section id="courses" className="py-20 bg-slate-50 relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>JOB ORIENTED PROGRAMS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Curriculum Engineered for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              High-Paying Placements
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-normal">
            Every program at <strong className="text-slate-900 font-semibold">Micron Info Tech</strong> includes real-world projects, 1-on-1 mentor guidance, and 100% placement interview drives.
          </p>
        </div>

        {/* 6 Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, idx) => {
            const Icon = course.icon;
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${course.gradient} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {course.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 mb-5 leading-relaxed">
                    {course.subtitle}
                  </p>

                  {/* Program Specs */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs mb-5">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                      <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Avg: {course.avgPackage}</span>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {course.skills.map((s, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action */}
                <button
                  onClick={() => onSelectCourse(course.title)}
                  className="w-full py-3 rounded-xl bg-slate-900 group-hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-sm"
                >
                  <span>Explore Syllabus & Enroll</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
