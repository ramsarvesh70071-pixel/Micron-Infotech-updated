"use client";

import React, { useState, useEffect } from "react";
import { X, CheckCircle, Phone, Mail, User, BookOpen, Send } from "lucide-react";
import confetti from "canvas-confetti";

import { submitEnquiry, getCourses, getBranches } from "../services/api";
import { useList } from "../hooks/useApi";
import { useSubmit } from "../hooks/useSubmit";
import { FormError, Honeypot, honeypotValue } from "./FormError";

interface EnrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCourse?: string;
  initialCourse?: string;
}

export default function EnrollModal({ isOpen, onClose, defaultCourse, initialCourse }: EnrollModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [course, setCourse] = useState(initialCourse || defaultCourse || "General Consultation");
  const [branch, setBranch] = useState("");
  const [mode, setMode] = useState<"classroom" | "online">("classroom");
  const { submit, submitting, error, done: submitted, reset } = useSubmit();
  const { items: courses } = useList<any>(() => getCourses());
  const { items: branches } = useList<any>(() => getBranches());

  // Keep the dropdown in sync when the modal is opened for a different course.
  useEffect(() => {
    if (isOpen) setCourse(initialCourse || defaultCourse || "General Consultation");
  }, [isOpen, initialCourse, defaultCourse]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trap = honeypotValue(e);
    const res = await submit(() =>
      submitEnquiry({
        name, email, phone, course, mode, type: "enrollment", website: trap,
        branch: mode === "classroom" ? branch : "Online"
      })
    );
    if (!res) return; // error is shown inline; nothing is faked
    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch {
      /* canvas not available */
    }
    setTimeout(() => {
      reset();
      setName("");
      setEmail("");
      setPhone("");
      onClose();
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#2E2EF2] text-white p-6 relative">
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="text-[11px] font-bold tracking-widest uppercase bg-white/20 px-2.5 py-0.5 rounded-full">
            Limited Batch Offer
          </span>
          <h3 className="text-xl font-black mt-2">
            Enroll Now & Get Early Bird Scholarship
          </h3>
          <p className="text-blue-100 text-xs mt-1">
            Talk to our senior career counselors and book a free demo session.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                Application Received!
              </h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Our career counsellor will contact you at <strong className="text-slate-900">{phone}</strong> shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2E2EF2]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2E2EF2]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2E2EF2]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Select Course
                </label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2E2EF2] bg-white cursor-pointer"
                  >
                    <option value="General Consultation">General Consultation</option>
                    {courses.map((c: any) => (
                      <option key={c._id} value={c.name}>{c.name}</option>
                    ))}
                    {course !== "General Consultation" && !courses.some((c: any) => c.name === course) && <option value={course}>{course}</option>}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Training Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMode("classroom")}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border cursor-pointer transition-all ${
                      mode === "classroom"
                        ? "bg-[#2E2EF2] text-white border-[#2E2EF2]"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    🏢 Classroom
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("online")}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border cursor-pointer transition-all ${
                      mode === "online"
                        ? "bg-[#2E2EF2] text-white border-[#2E2EF2]"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    💻 Live Online (Interactive)
                  </button>
                </div>
              </div>

              {mode === "classroom" && branches.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Preferred Centre</label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2E2EF2] bg-white"
                  >
                    <option value="">No preference</option>
                    {branches.map((b: any) => (
                      <option key={b._id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <Honeypot />
              <FormError message={error} />

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-[#2E2EF2] hover:bg-[#1f1fe0] text-white font-extrabold text-xs tracking-wider uppercase disabled:opacity-70 active:scale-95 transition-all shadow-md cursor-pointer mt-2 flex items-center justify-center gap-2"
              >
                <span>{submitting ? "SENDING..." : "CLAIM EARLY BIRD OFFER"}</span>
                <Send className="w-3.5 h-3.5" />
              </button>

              <p className="text-[10px] text-center text-slate-400">
                🔒 We respect your privacy. No spam guaranteed.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

