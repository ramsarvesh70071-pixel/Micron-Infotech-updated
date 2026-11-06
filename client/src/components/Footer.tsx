import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, Phone, Mail, MapPin, CheckCircle, Send } from "lucide-react";
import { subscribeNewsletter, errorMessage } from "../services/api";
import { useSiteSettings, telHref } from "../context/SiteSettingsContext";
import { useList } from "../hooks/useApi";
import { getBranches } from "../services/api";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [subError, setSubError] = useState("");
  const site = useSiteSettings();
  const { items: branches } = useList<any>(() => getBranches());

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    setSubError("");
    try {
      await subscribeNewsletter(email);
      setSubscribed(true);
      setTimeout(() => {
        setEmail("");
        setSubscribed(false);
      }, 4000);
    } catch (err) {
      setSubError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#2E2EF2] text-white pt-16 pb-12 border-t border-blue-600 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-white/20 text-xs sm:text-[13px]">
          
          {/* Column 1: FOR STUDENTS */}
          <div className="space-y-3">
            <h4 className="font-black text-xs tracking-wider uppercase text-white/90 pb-1 border-b border-white/10">
              FOR STUDENTS
            </h4>
            <ul className="space-y-2 text-blue-100">
              <li>
                <Link to="/#courses" className="hover:text-white hover:underline transition-colors block py-0.5">
                  Job Oriented Courses
                </Link>
              </li>
              <li>
                <Link to="/student-reviews" className="hover:text-white hover:underline transition-colors block py-0.5">
                  Reviews & Ratings (4.9★)
                </Link>
              </li>
              <li>
                <Link to="/students-placements" className="hover:text-white hover:underline transition-colors block py-0.5">
                  Placement Statistics
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: QUICK LINKS */}
          <div className="space-y-3">
            <h4 className="font-black text-xs tracking-wider uppercase text-white/90 pb-1 border-b border-white/10">
              QUICK LINKS
            </h4>
            <ul className="space-y-2 text-blue-100">
              <li>
                <Link to="/contact" className="hover:text-white hover:underline transition-colors block py-0.5">
                  Our Center & Map
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-white hover:underline transition-colors block py-0.5">
                  Help & Support Desk
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white hover:underline transition-colors block py-0.5">
                  Tech Blog & Articles
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: OUR COMPANY & POLICIES */}
          <div className="space-y-3">
            <h4 className="font-black text-xs tracking-wider uppercase text-white/90 pb-1 border-b border-white/10">
              OUR COMPANY
            </h4>
            <ul className="space-y-2 text-blue-100">
              <li>
                <Link to="/about" className="hover:text-white hover:underline transition-colors block py-0.5">
                  About Us & Leadership
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white hover:underline transition-colors block py-0.5">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/legal/privacy-policy" className="hover:text-white hover:underline transition-colors block py-0.5">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/legal/terms-conditions" className="hover:text-white hover:underline transition-colors block py-0.5">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/legal/cookie-policy" className="hover:text-white hover:underline transition-colors block py-0.5">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/legal/refund-policy" className="hover:text-white hover:underline transition-colors block py-0.5">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/legal/gdpr-policy" className="hover:text-white hover:underline transition-colors block py-0.5">
                  GDPR Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: FOLLOW US & NEWSLETTER */}
          <div className="space-y-3 col-span-2 md:col-span-1">
            <h4 className="font-black text-xs tracking-wider uppercase text-white/90 pb-1 border-b border-white/10">
              FOLLOW US
            </h4>
            <p className="text-blue-100 text-[11px] leading-relaxed">
              Get Latest Updates, Placement Drives & Job Openings directly in your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2 pt-1">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="w-full px-3 py-2 rounded-lg bg-blue-900/60 border border-blue-400/50 text-white placeholder:text-blue-200 text-xs focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2 px-3 rounded-lg bg-white disabled:opacity-70 hover:bg-blue-50 text-[#2E2EF2] font-black text-xs tracking-wide transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {subscribed ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Subscribed!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3 h-3" />
                    <span>Join Newsletter</span>
                  </>
                )}
              </button>
            </form>
            {subError && <p className="text-[11px] text-red-200" role="alert">{subError}</p>}

            <div className="pt-3 text-[11px] text-blue-100 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <Phone className="w-3 h-3 text-white" />
                {site.phone && <a href={telHref(site.phone)}>Call: {site.phone}</a>}
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-blue-200" />
                {site.email && <a href={`mailto:${site.email}`}>{site.email}</a>}
              </div>
              <div className="flex items-start gap-1.5 text-blue-200">
                <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5" />
                <span>{branches.length ? branches.map((b: any) => b.city).filter((c: string, i: number, a: string[]) => a.indexOf(c) === i).join(", ") : site.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Scroll to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-100">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} {site.companyName}. All Rights Reserved.
          </p>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-800/80 hover:bg-blue-800 text-white text-xs font-semibold transition-colors cursor-pointer border border-blue-400/30"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
