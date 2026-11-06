import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Phone, 
  Search, 
  Menu, 
  X,
  BookOpen,
  Star,
  Award,
  FileText,
  MapPin
} from "lucide-react";
import MitLogo from "./MitLogo";
import { useSiteSettings, telHref } from "../context/SiteSettingsContext";

interface NavbarProps {
  onOpenSearch?: () => void;
  onCallClick?: () => void;
}

export default function Navbar({ onOpenSearch, onCallClick }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const site = useSiteSettings();
  const location = useLocation();

  const currentPath = location.pathname;
  const currentHash = location.hash;

  const isActive = (path: string) => {
    if (path.includes("#courses")) {
      return currentHash === "#courses" || currentPath === "/job-oriented-courses" || currentPath === "/courses";
    }
    if (path === "/students-placements") {
      return currentPath === "/students-placements" || currentPath === "/placement" || currentPath === "/placements";
    }
    if (path === "/student-reviews") {
      return currentPath === "/student-reviews";
    }
    if (path === "/blog") {
      return currentPath.startsWith("/blog");
    }
    if (path === "/contact") {
      return currentPath === "/contact";
    }
    return false;
  };

  const navLinkStyle =
    "relative py-1 text-slate-700 hover:text-[#2E2EF2] font-semibold text-[14.5px] transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[2px] after:bg-[#2E2EF2] after:transition-all after:duration-200 cursor-pointer whitespace-nowrap";

  const activeNavLinkStyle =
    "relative py-1 text-[#2E2EF2] font-bold text-[14.5px] transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#2E2EF2] cursor-pointer whitespace-nowrap";

  const navItems = [
    { name: "Job Oriented Courses", path: "/#courses" },
    { name: "Student Reviews", path: "/student-reviews" },
    { name: "Placements", path: "/students-placements" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group focus:outline-none flex-shrink-0">
            <MitLogo className="w-10 h-10" />
            <div className="flex flex-col">
              <span className="text-xl sm:text-[22px] font-black tracking-tight text-[#111827]">
                MICRON INFO TECH
              </span>
              <span className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase -mt-0.5">
                LEARN SKILLS • GET PLACED
              </span>
            </div>
          </Link>

          {/* Desktop Navigation: Exactly the 5 requested items */}
          <nav className="hidden lg:flex items-center gap-7 lg:gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={isActive(item.path) ? activeNavLinkStyle : navLinkStyle}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Group: Search Icon + Call Pill Button + Mobile Hamburger Menu */}
          <div className="flex items-center gap-2 sm:gap-3.5 flex-shrink-0">
            <button
              onClick={onOpenSearch}
              className="p-2 rounded-full text-slate-600 hover:text-[#2E2EF2] hover:bg-blue-50 transition-colors cursor-pointer"
              title="Search courses, placements, blogs..."
              aria-label="Search"
            >
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>

            {/* Dark Blue Phone Pill Button */}
            <a
              href={telHref(site.phone || "")}
              onClick={(e) => {
                if (onCallClick) {
                  e.preventDefault();
                  onCallClick();
                }
              }}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-[#173bb5] hover:bg-[#122f93] text-white font-bold text-xs sm:text-[13px] active:scale-95 transition-all shadow-xs whitespace-nowrap cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 fill-current" />
              <span>Call: {site.phone}</span>
            </a>

            {/* Mobile Menu Hamburger Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-700 hover:text-[#2E2EF2] focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <div className="flex flex-col space-y-1.5 text-sm">
            <Link
              to="/#courses"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-blue-50 font-bold text-slate-800 hover:text-[#2E2EF2] transition-colors"
            >
              <BookOpen className="w-4 h-4 text-[#2E2EF2]" />
              <span>Job Oriented Courses</span>
            </Link>

            <Link
              to="/student-reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-blue-50 font-bold text-slate-800 hover:text-[#2E2EF2] transition-colors"
            >
              <Star className="w-4 h-4 text-amber-500" />
              <span>Student Reviews</span>
            </Link>

            <Link
              to="/students-placements"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-blue-50 font-bold text-slate-800 hover:text-[#2E2EF2] transition-colors"
            >
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Placements</span>
            </Link>

            <Link
              to="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-blue-50 font-bold text-slate-800 hover:text-[#2E2EF2] transition-colors"
            >
              <FileText className="w-4 h-4 text-purple-600" />
              <span>Blog</span>
            </Link>

            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-blue-50 font-bold text-slate-800 hover:text-[#2E2EF2] transition-colors"
            >
              <MapPin className="w-4 h-4 text-rose-600" />
              <span>Contact</span>
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <a
              href={telHref(site.phone || "")}
              className="w-full py-2.5 rounded-xl bg-[#2E2EF2] text-white text-center font-bold text-sm shadow-sm flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 fill-current" />
              <span>Call: {site.phone}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
