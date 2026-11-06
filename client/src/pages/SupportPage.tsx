import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  MessageCircle, 
  Phone, 
  Ticket, 
  Mail, 
  HelpCircle, 
  CheckCircle2, 
  Sparkles, 
  Send, 
  FileQuestion, 
  ChevronDown, 
  Clock 
} from "lucide-react";
import TopBanner from "../components/TopBanner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EnrollModal from "../components/EnrollModal";
import SearchModal from "../components/SearchModal";
import { useSubmit } from "../hooks/useSubmit";
import { useList } from "../hooks/useApi";
import { useSiteSettings, telHref, waHref } from "../context/SiteSettingsContext";
import { getFaqs, getBranches } from "../services/api";
import TicketTracker from "../components/TicketTracker";
import { FormError, Honeypot, honeypotValue } from "../components/FormError";
import { submitSupportTicket, trackSupportTicket, errorMessage } from "../services/api";

export default function SupportPage() {
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Ticket Form State
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("Batch Timing & Schedule");
  const [priority, setPriority] = useState("Normal");
  const [description, setDescription] = useState("");
  const { submit, submitting, error, done: ticketSubmitted, result: ticketResult, reset } = useSubmit<any>();
  const ticketId: string = ticketResult?.ticketNumber || "";

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trap = honeypotValue(e);
    await submit(() => submitSupportTicket({ name, email, studentId, category, priority, description, website: trap }));
  };

  const site = useSiteSettings();
  const { items: faqItems } = useList<any>(() => getFaqs({ scope: "support" }));
  const supportFaqs = faqItems.map((f: any) => ({ q: f.question, a: f.answer }));
  const { items: branchList } = useList<any>(() => getBranches());
  const branchCities = Array.from(new Set(branchList.map((b: any) => b.city))).join(", ");

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-[#2E2EF2] selection:text-white">
      <TopBanner onSelectCourse={() => setEnrollModalOpen(true)} />
      <Navbar
        onOpenSearch={() => setSearchModalOpen(true)}
        onCallClick={() => setEnrollModalOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 lg:py-20 bg-gradient-to-b from-blue-50/80 via-white to-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-[#2E2EF2] text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>STUDENT HELP & ASSISTANCE CENTER</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight max-w-3xl mx-auto">
              Need Any Help? <span className="text-[#2E2EF2]">We Are Always Here.</span>
            </h1>

            <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Feeling stuck in your coursework or have queries regarding batch timings, LMS portal, or placement interviews? Our student support team is ready to assist you.
            </p>
          </div>
        </section>

        {/* 4 Support Channels from PDF */}
        <section className="py-12 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Channel 1: WhatsApp Chat */}
              <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex flex-col justify-between hover:shadow-md transition-all">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900">WhatsApp Chat</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Connect directly with our support team to resolve queries quickly on WhatsApp.
                  </p>
                </div>
                <div className="pt-4 mt-2">
                  <a
                    href={waHref(site.whatsapp, `Hello ${site.companyName} Support`)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs text-center transition-colors shadow-xs"
                  >
                    Chat Now
                  </a>
                </div>
              </div>

              {/* Channel 2: Phone Call */}
              <div className="p-6 rounded-2xl bg-blue-50/60 border border-blue-200 flex flex-col justify-between hover:shadow-md transition-all">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#2E2EF2] text-white flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900">Call Support</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Speak directly with a support counselor via direct telephone line: {site.phone}.
                  </p>
                </div>
                <div className="pt-4 mt-2">
                  <a
                    href={telHref(site.phone || "")}
                    className="inline-block w-full py-2.5 rounded-lg bg-[#2E2EF2] hover:bg-[#1a1ae4] text-white font-bold text-xs text-center transition-colors shadow-xs"
                  >
                    Call Us
                  </a>
                </div>
              </div>

              {/* Channel 3: Create Ticket */}
              <div className="p-6 rounded-2xl bg-indigo-50/60 border border-indigo-200 flex flex-col justify-between hover:shadow-md transition-all">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                    <Ticket className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900">Create Ticket</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Log an official support ticket for batch issues, recordings, or certificates.
                  </p>
                </div>
                <div className="pt-4 mt-2">
                  <a
                    href="#ticket"
                    className="inline-block w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs text-center transition-colors shadow-xs"
                  >
                    Open Ticket
                  </a>
                </div>
              </div>

              {/* Channel 4: Email Support */}
              <div className="p-6 rounded-2xl bg-purple-50/60 border border-purple-200 flex flex-col justify-between hover:shadow-md transition-all">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900">Email Support</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Write to our support desk with your enrollment receipt for formal assistance.
                  </p>
                </div>
                <div className="pt-4 mt-2">
                  <a
                    href={`mailto:${site.supportEmail || site.email}`}
                    className="inline-block w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs text-center transition-colors shadow-xs"
                  >
                    Email Us
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Ticket Submission Form & FAQs */}
        <section id="ticket" className="py-14 bg-slate-50/80 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* Left Column: Interactive Ticket Form */}
              <div className="lg:col-span-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2E2EF2] mb-1">
                    <Ticket className="w-3.5 h-3.5" />
                    <span>Live Ticket Portal</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Submit a Support Ticket
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 mb-6">
                    Describe your issue and our support team will get back to you. Keep your ticket number to track progress.
                  </p>

                  {ticketSubmitted ? (
                    <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                      <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                      <h4 className="font-bold text-emerald-900">Ticket Created: {ticketId}</h4>
                      <p className="text-xs text-emerald-700">
                        Thank you <strong>{name}</strong>. Please note your ticket number and use the tracker below with <strong>{email}</strong> to check progress. Our student operations desk will update you shortly.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleTicketSubmit} className="space-y-3.5 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Your Full Name *</label>
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="eg. Priya Menon"
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2E2EF2] text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Student Enrollment ID</label>
                          <input
                            type="text"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            placeholder="Your enrollment ID (if any)"
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2E2EF2] text-slate-900"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Registered Email *</label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="priya@example.com"
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2E2EF2] text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Issue Category</label>
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2E2EF2] text-slate-900 bg-white"
                          >
                            <option value="Batch Timing & Schedule">Batch Timing & Rescheduling</option>
                            <option value="LMS / Portal Access">LMS / Recording Video Access</option>
                            <option value="Certificate Verification">Certificate Verification</option>
                            <option value="Placement Cell Assistance">Placement Cell & Resume Review</option>
                            <option value="Fee / Invoice Query">Fee Receipt / Invoice Query</option>
                            <option value="General Query">Other General Query</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Detailed Description of Query *</label>
                        <textarea
                          rows={4}
                          required
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Please provide specifics such as batch dates, course name, or exact error message encountered..."
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2E2EF2] text-slate-900"
                        />
                      </div>

                      <Honeypot />
                      <FormError message={error} />
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3.5 rounded-lg bg-[#2E2EF2] hover:bg-[#1a1ae4] text-white font-black text-xs tracking-wider uppercase transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2 mt-2"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Support Ticket</span>
                      </button>
                    </form>
                  )}
                </div>
                <TicketTracker />
              </div>

              {/* Right Column: Support FAQs */}
              <div className="lg:col-span-6 space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2E2EF2] mb-1">
                    <FileQuestion className="w-3.5 h-3.5" />
                    <span>Self-Service Knowledge Base</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Frequently Asked Support Questions
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Quick answers to common questions about schedules, study materials, and certificates.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {supportFaqs.map((faq, i) => (
                    <div
                      key={i}
                      className="border border-slate-200 rounded-xl overflow-hidden bg-white"
                    >
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full p-4 text-left font-bold text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                      >
                        <span className="text-xs sm:text-sm">{faq.q}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 transition-transform ${
                            openFaq === i ? "rotate-180 text-[#2E2EF2]" : ""
                          }`}
                        />
                      </button>
                      {openFaq === i && (
                        <div className="px-4 pb-4 text-xs text-slate-600 border-t border-slate-100 pt-3 leading-relaxed">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Direct Branch Visit Callout */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                  <div>
                    <h4 className="font-bold text-sm">Prefer In-Person Support?</h4>
                    <p className="text-xs text-blue-200 mt-0.5">
                      Visit our coordinators at our centres{branchCities ? `: ${branchCities}` : ""}.
                    </p>
                  </div>
                  <Link
                    to="/contact"
                    className="px-4 py-2 rounded-full bg-white text-[#2E2EF2] font-bold text-xs whitespace-nowrap hover:bg-blue-50 transition-colors shadow-xs"
                  >
                    View Branches →
                  </Link>
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

