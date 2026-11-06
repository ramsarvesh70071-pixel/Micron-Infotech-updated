import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Check, 
  CheckCircle2, 
  Star, 
  Award, 
  TrendingUp, 
  Users, 
  Building2, 
  ChevronRight, 
  PhoneCall, 
  Sparkles,
  ChevronDown,
  Play,
  Cpu,
  GraduationCap,
  FileCheck,
  Headphones,
  Sliders,
  FolderGit2,
  Briefcase,
  ShieldCheck,
  MessageCircle
} from "lucide-react";
import TopBanner from "../components/TopBanner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EnrollModal from "../components/EnrollModal";
import SearchModal from "../components/SearchModal";
import { useList } from "../hooks/useApi";
import { getCourses, getFaqs, getPartners, getPlacements } from "../services/api";
import { DataBoundary } from "../components/DataState";
import { useSiteSettings, telHref, waHref } from "../context/SiteSettingsContext";

interface StudentPlacementCard { id?: string; _id?: string; name: string; package: string; role: string; company: string; logo: string; image: string }

function StudentMarqueeCard({ student }: { student: StudentPlacementCard; key?: React.Key }) {
  const [imgSrc, setImgSrc] = useState(student.image);

  return (
    <div className="w-[230px] sm:w-[250px] flex-shrink-0 bg-[#f0f4fd] rounded-2xl p-5 border border-[#e0e8fd] shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col items-center text-center justify-between group select-none">
      {/* Top Right Package Tag */}
      <div className="w-full flex justify-end">
        <span className="text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
          {student.package}
        </span>
      </div>

      {/* Real Student Portrait Avatar */}
      <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full p-0.5 bg-white border-2 border-blue-200 shadow-xs mt-1 mb-3 overflow-hidden group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
        <img
          src={imgSrc}
          alt={student.name}
          className="w-full h-full object-cover rounded-full"
          loading="lazy"
          onError={() => {
            setImgSrc("https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1");
          }}
        />
      </div>

      {/* Student Name & Role Details */}
      <div className="space-y-0.5 mb-3">
        <h3 className="font-extrabold text-[14px] sm:text-[15px] text-[#111827] line-clamp-1">
          {student.name}
        </h3>
        <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
          {student.role}
        </p>
      </div>

      {/* Bottom Company Logo */}
      <div className="w-full pt-3 border-t border-[#e0e8fd] flex items-center justify-center h-8">
        <img
          src={student.logo}
          alt={student.company}
          className="max-h-5 sm:max-h-6 max-w-[95px] object-contain opacity-85 group-hover:opacity-100 transition-opacity"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>
    </div>
  );
}

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [selectedCourseForModal, setSelectedCourseForModal] = useState<string>("Data Science & Generative AI");
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleOpenEnroll = (courseName?: string) => {
    if (courseName) {
      setSelectedCourseForModal(courseName);
    }
    setEnrollModalOpen(true);
  };

  const site = useSiteSettings();
  const coursesQ = useList<any>(() => getCourses());
  const COURSES_LIST = coursesQ.items;
  // Category tabs are derived from the courses in the database (in order of first appearance).
  const COURSE_CATEGORIES = [
    { id: "all", name: "All Courses" },
    ...COURSES_LIST.reduce((acc: { id: string; name: string }[], c: any) => (acc.some((a) => a.id === c.categorySlug) ? acc : [...acc, { id: c.categorySlug, name: c.category }]), [])
  ];
  const filteredCourses = selectedCategory === "all" ? COURSES_LIST : COURSES_LIST.filter((c: any) => c.categorySlug === selectedCategory);

  const { items: faqItems } = useList<any>(() => getFaqs({ scope: "home" }));
  const homeFaqs = faqItems.map((f: any) => ({ q: f.question, a: f.answer }));

  const placedQ = useList<StudentPlacementCard>(() => getPlacements({ marqueeRow: undefined }));
  const PLACED_ROW_1 = placedQ.items.filter((p: any) => p.marqueeRow === 1);
  const PLACED_ROW_2 = placedQ.items.filter((p: any) => p.marqueeRow === 2);
  const marqueeRow1 = [...PLACED_ROW_1, ...PLACED_ROW_1];
  const marqueeRow2 = [...PLACED_ROW_2, ...PLACED_ROW_2];

  // Real CDN Media Partner Logos
  const { items: mediaPartners } = useList<any>(() => getPartners({ kind: "media" }));

  // Real Top Placed Company Logos
  const { items: topPartnerLogos } = useList<any>(() => getPartners({ kind: "top" }));

  // Grid Company Logos for Section 10
  const { items: allHiringBrands } = useList<any>(() => getPartners({ kind: "grid" }));

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-[#2E2EF2] selection:text-white overflow-x-hidden">
      {/* Top Announcement Bar */}
      <TopBanner onSelectCourse={() => handleOpenEnroll("Job Oriented Course")} />

      {/* Main Navigation Bar */}
      <Navbar
        onOpenSearch={() => setSearchModalOpen(true)}
        onCallClick={() => handleOpenEnroll("General Consultation")}
      />

      {/* SECTION 1: HERO SECTION matching actual inventateq.com */}
      <section className="relative overflow-hidden bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Hero Column */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1 text-xs font-bold text-[#2E2EF2]">
                <span>#</span>
                <span>Certification Training and Guaranteed Placement</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0f1629] tracking-tight leading-[1.2]">
                Certification Training and <span className="text-[#2E2EF2]">Guaranteed</span> Placement
              </h1>

              {/* Subtitle */}
              <p className="text-[15px] sm:text-[16px] text-gray-600 leading-[1.7] max-w-2xl font-normal">
                MicronInfoTech is the India's Most Trusted and Best Software Training Institute. Your gateway from Learning Skills Practically to Getting a Job! We are here for your career growth.
              </p>

              {/* 5 Value Points with Emerald Checkmark Bullets */}
              <ul className="space-y-3 pt-1">
                {[
                  "10X Job Placement Rate, In relevant Industry",
                  "Experienced Trainers from Google, Microsoft, TCS, Wipro, Adobe etc",
                  "Offline Classrooms & Online Instructor Led Classes",
                  "IT or non-IT, We have the best Placement",
                  "Assessments, Resume preparation, and Mock Interviews"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </span>
                    <span className="text-[14px] sm:text-[15px] font-medium leading-snug text-[#1e293b]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Action Buttons matching inventateq.com */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => handleOpenEnroll("Free Demo")}
                  className="h-12 px-8 inline-flex items-center justify-center rounded-xl bg-[#2E2EF2] text-white font-bold text-[15px] shadow-[0_4px_20px_-4px_rgba(46,46,242,0.45)] hover:bg-[#2525d4] active:scale-[0.98] transition-all cursor-pointer"
                >
                  Book a Free Demo
                </button>
                <Link
                  to="/students-placements"
                  className="h-12 px-8 inline-flex items-center justify-center rounded-xl border-2 border-[#2E2EF2] bg-white text-[#2E2EF2] font-bold text-[15px] hover:bg-blue-50/50 active:scale-[0.98] transition-all cursor-pointer"
                >
                  Career Support
                </Link>
              </div>

              {/* Ratings with Real CDN Student Avatars */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex -space-x-2.5">
                  <img
                    alt="Student"
                    className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-xs"
                    src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1"
                  />
                  <img
                    alt="Student"
                    className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-xs"
                    src="https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1"
                  />
                  <img
                    alt="Student"
                    className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-xs"
                    src="https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1"
                  />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#0f1629]">
                    Rated <span className="text-[#2E2EF2] font-black">{site.homeStats.ratingValue}</span> out of 5 based on <span className="text-[#2E2EF2] font-black">{site.homeStats.ratingCount}</span> Reviews
                  </p>
                  <p className="text-[12px] text-gray-500">
                    We are India's Rated Best Software Training Institute
                  </p>
                </div>
              </div>
            </div>

            {/* Right Hero Column: Real Hero Collage Graphic with MicronInfoTech Branding */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="relative w-full max-w-lg lg:max-w-none">
                <img
                  src="/images/micron-home.webp"
                  alt="MicronInfoTech Hero Certification & Placement"
                  className="w-full h-auto object-contain select-none"
                  loading="eager"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: PLACEMENT RECORD (How we have placed 10,579 Students?) */}
      <section id="placements" className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50/80 to-white py-10 sm:py-14 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-1.5 shadow-2xs mb-3">
              <TrendingUp className="h-3.5 w-3.5 text-amber-600" />
              <span className="text-[13px] font-bold uppercase tracking-wider text-amber-800">
                Placement Record
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0f1629] tracking-tight">
              How we have placed <span className="text-[#2E2EF2]">{site.homeStats.placedCount}</span> Students?
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-gray-500 max-w-xl mx-auto">
              Students from diverse academic backgrounds successfully placed at leading tech giants and MNCs.
            </p>

            {/* Top Partner Logos Bar */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              {topPartnerLogos.map((brand, i) => (
                <div key={i} className="h-8 flex items-center justify-center">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="max-h-7 max-w-[100px] object-contain opacity-85 hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 2 Smooth Horizontal Infinite Marquee Rows strictly bounded in max-w-7xl */}
          <div className="relative w-full space-y-4 overflow-hidden rounded-2xl">
            {/* Subtle edge fades */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-white to-transparent z-10" />

            {/* Row 1 */}
            <div className="overflow-hidden">
              <div className="flex gap-4 animate-marquee py-1 hover:[animation-play-state:paused]">
                {marqueeRow1.map((student, idx) => (
                  <StudentMarqueeCard key={`row1-${idx}`} student={student} />
                ))}
              </div>
            </div>

            {/* Row 2 */}
            <div className="overflow-hidden">
              <div className="flex gap-4 animate-marquee-reverse py-1 hover:[animation-play-state:paused]">
                {marqueeRow2.map((student, idx) => (
                  <StudentMarqueeCard key={`row2-${idx}`} student={student} />
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 4: WHY MICRONINFOTECH COURSES ARE THE BEST? (Courses Catalog) */}
      <section id="courses" className="py-14 sm:py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="text-xs font-bold uppercase tracking-wider text-[#2E2EF2] mb-1">
              COURSE CATEGORIES
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0f1629] tracking-tight">
              Why MicronInfoTech Courses are the best?
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              MicronInfoTech is the only option in India for the best in class quality training and career placement.
            </p>
          </div>

          {/* Clean Horizontal Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none justify-start lg:justify-center">
            {COURSE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#2E2EF2] text-white shadow-xs"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Full-Width Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((c: any) => (
              <div
                key={c._id}
                className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 pb-3 border-b border-gray-100">
                    <span className="font-semibold">{c.duration}</span>
                    <span className="font-bold text-[#2E2EF2] bg-blue-50 px-2 py-0.5 rounded">
                      {c.location}
                    </span>
                  </div>

                  <div className="py-4 space-y-2">
                    <h3 className="font-extrabold text-base text-[#0f1629] group-hover:text-[#2E2EF2] transition-colors line-clamp-1">
                      {c.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {c.description}
                    </p>

                    <div className="flex items-center gap-2 pt-2 text-[11px] font-bold text-emerald-700">
                      {c.placementGuaranteed && (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                          ✓ Placement Support
                        </span>
                      )}
                      {c.internshipIncluded && (
                        <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-[#2E2EF2]">
                          ✓ Internship
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-gray-500">Course Fee:</span>
                    <span className="text-lg font-black text-[#0f1629]">{c.fee}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleOpenEnroll(c.name)}
                      className="w-full py-2.5 rounded-lg bg-[#2E2EF2] hover:bg-[#2525d4] text-white font-bold text-xs text-center transition-colors cursor-pointer"
                    >
                      Book Course
                    </button>
                    <button
                      onClick={() => handleOpenEnroll(c.name + " (Details)")}
                      className="w-full py-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs text-center border border-gray-200 transition-colors cursor-pointer"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 5: FEATURED IN NEWS, MEDIA & PUBLICATIONS */}
      <section className="bg-[#f5f6fa] py-12 sm:py-14 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-[#3d4451] mb-8">
            Featured in News, Media & Publications
          </h2>

          {/* 10 Real Media Partner Logos from inventateq.b-cdn.net */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 items-center justify-center">
            {mediaPartners.map((media, i) => (
              <div key={i} className="flex h-14 items-center justify-center p-3 bg-white rounded-xl shadow-2xs border border-gray-200/80 hover:shadow-xs transition-shadow">
                <img
                  src={media.logo}
                  alt={media.name}
                  className="max-h-8 max-w-[130px] object-contain opacity-85 hover:opacity-100 transition-opacity"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: WHY MICRONINFOTECH IS THE BEST FOR YOU? */}
      <section className="py-14 sm:py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0f1629]">
              Why <span className="text-[#2E2EF2]">MicronInfoTech</span> is the best for you?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-500">
              MicronInfoTech is the only option in India for the best in class quality training and career placement.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { title: "Experienced Expert Instructors", icon: Users, desc: "Learn directly from senior tech leads from Google & Microsoft" },
              { title: "Assured 100% Placement Support", icon: Award, desc: "Dedicated recruitment drives with 2000+ corporate hiring partners" },
              { title: "Industry focused Updated Curriculum", icon: Cpu, desc: "Cutting-edge tools and frameworks demanded by modern employers" },
              { title: "Dedicated Mentor Connect", icon: Headphones, desc: "Personalized 1-on-1 doubt clearing and technical mentoring" },
              { title: "Best Industry Specific Projects", icon: FolderGit2, desc: "Hands-on capstones that showcase genuine engineering competence" }
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="p-5 rounded-2xl bg-gray-50/70 border border-gray-100 text-center space-y-3 hover:bg-blue-50/40 transition-colors">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-blue-100/70 text-[#2E2EF2] flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-sm text-[#0f1629] leading-snug">
                    {f.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FLOATING STATS COUNTER BAR (Overlapping Section 6 & 7) */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mb-10 z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-5 sm:p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 text-center">
          <div className="p-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0f1629]">11,540+</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Professionals Trained</div>
          </div>
          <div className="p-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0f1629]">200+</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Experienced Trainers</div>
          </div>
          <div className="p-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0f1629]">110+</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Cities Available</div>
          </div>
          <div className="p-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0f1629]">566+</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Professional Courses</div>
          </div>
          <div className="p-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0f1629]">4.9 / 5</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Avg Rating By Students</div>
          </div>
        </div>
      </div>

      {/* SECTION 7: HOW MICRONINFOTECH HELP STUDENTS GET PLACE? */}
      <section className="relative bg-[#2E2EF2] pt-20 pb-16 sm:pb-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              How MicronInfoTech help students get place?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-blue-100 leading-relaxed">
              We have a strong network of hiring partners over the world, and there is our dedicated career placement support team that always helps students get placed better for their career and life growth.
            </p>
          </div>

          {/* 4 White Feature Cards with Real Vector CDN Icons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-slate-900">
            {[
              {
                title: "Connecting with Brands",
                desc: "Our active network of 2000+ global brands helps students get placed with top compensation packages.",
                icon: "https://inventateq.b-cdn.net/images/hiring.svg"
              },
              {
                title: "Building Better Resume",
                desc: "Our successful ATS-optimized resume building guides and project portfolios ensure interview shortlists.",
                icon: "https://inventateq.b-cdn.net/images/resume.svg"
              },
              {
                title: "Instant Doubt Solving Mentors",
                desc: "Specialised and dedicated mentors to solve your technical coding doubts in live 1-on-1 lab sessions.",
                icon: "https://inventateq.b-cdn.net/images/mentoring.svg"
              },
              {
                title: "Personalised Courses For Every Student",
                desc: "Customized learning roadmaps matched to your current background and target dream career role.",
                icon: "https://inventateq.b-cdn.net/images/course.svg"
              }
            ].map((p, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center space-y-3 shadow-lg border border-white/20">
                <div className="w-14 h-14 mx-auto rounded-xl bg-blue-50 flex items-center justify-center p-2.5">
                  <img
                    src={p.icon}
                    alt={p.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="font-extrabold text-base text-[#0f1629]">
                  {p.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: WHAT MAKES YOU JOB READY? (Roadmap + Certificates Grid) */}
      <section className="py-14 sm:py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E2EF2] bg-blue-50 px-3 py-1 rounded-full">
              Our Training Process
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0f1629] tracking-tight mt-2">
              What Makes You Job Ready?
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Don't worry when you are with MicronInfoTech. Our courses and specialized 9-step training always help students get placed.
            </p>
          </div>

          {/* Two-Column Layout: Left 9-Step Roadmap + Right Certificates Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 9-Step Vertical Roadmap with connecting line */}
            <div className="lg:col-span-5 bg-[#f8fafc] rounded-2xl p-6 border border-slate-200">
              <h3 className="font-extrabold text-base text-[#0f1629] mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2E2EF2]" />
                9-Step Placement Roadmap
              </h3>

              <div className="relative space-y-3.5 before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-emerald-300">
                {[
                  { step: "01", title: "Enroll in Our Courses" },
                  { step: "02", title: "Practical Classes" },
                  { step: "03", title: "Real-time Projects" },
                  { step: "04", title: "Daily Assignments" },
                  { step: "05", title: "Certifications" },
                  { step: "06", title: "Winning Resume Building" },
                  { step: "07", title: "Mock Interviews" },
                  { step: "08", title: "Attend Real Interviews" },
                  { step: "09", title: "You Got Job! (100% GUARANTEE)" }
                ].map((s, idx) => (
                  <div key={idx} className="relative flex items-center gap-3.5 pl-1">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0 z-10 ${
                      idx === 8
                        ? "bg-[#2E2EF2] text-white ring-4 ring-blue-100"
                        : "bg-emerald-500 text-white"
                    }`}>
                      {idx === 8 ? "✓" : s.step}
                    </span>
                    <span className={`text-xs sm:text-sm font-bold ${
                      idx === 8 ? "text-[#2E2EF2] font-black" : "text-[#1e293b]"
                    }`}>
                      {s.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Certificates Showcase Grid with Real WebP Images */}
            <div className="lg:col-span-7 space-y-4">
              <div className="border border-slate-200 rounded-2xl p-6 bg-white">
                <h3 className="font-extrabold text-base text-[#0f1629] mb-1">
                  Industry Leading Certificates
                </h3>
                <p className="text-xs text-slate-500 mb-5">
                  Get certified by globally recognized cloud, software, and AI leaders.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { title: "Google Certified", src: "https://inventateq.b-cdn.net/certificates/google-cert.webp" },
                    { title: "AWS Solutions Architect", src: "https://inventateq.b-cdn.net/certificates/aws-cert.webp" },
                    { title: "Azure Microsoft", src: "https://inventateq.b-cdn.net/certificates/azure-cert.webp" },
                    { title: "IBM Specialist", src: "https://inventateq.b-cdn.net/certificates/IBM-certificate.webp" },
                    { title: "NASSCOM FutureSkills", src: "https://inventateq.b-cdn.net/certificates/nasscom-cert.webp" },
                    { title: "MicronInfoTech Course Certificate", src: "https://inventateq.b-cdn.net/certificates/azure-cert.webp" }
                  ].map((cert, i) => (
                    <div key={i} className="group relative rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-shadow">
                      <img
                        src={cert.src}
                        alt={cert.title}
                        className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="p-2 bg-white text-center border-t border-slate-100">
                        <span className="text-[11px] font-bold text-slate-700 block truncate">{cert.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 9: WHY THOUSANDS OF STUDENTS LOVES MICRONINFOTECH? & RATINGS BADGES */}
      <section className="bg-[#f5f6fa] py-14 sm:py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0f1629]">
              Why thousands of students loves MicronInfoTech?
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-gray-500 leading-relaxed">
              We are known for our best service, quality of courses and dedicated student placement support. Our way of guiding students and developing new skills is a game changer.
            </p>
          </div>

          {/* Student Reviews Cards Grid with Real CDN Photos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                name: "Mohammed Basha",
                package: "14.8 LPA • Lenovo",
                avatar: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
                review: "I cannot speak highly enough of MicronInfoTech. Their commitment to student success is evident in every aspect of their training program. The hands-on projects and real-world simulations prepare students for the challenges of the industry. Truly a transformative experience!"
              },
              {
                name: "Meera Nair",
                package: "10 LPA • Tech Mahindra",
                avatar: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
                review: "MicronInfoTech is the epitome of excellence in industry-aligned training. The personalized attention from mentors sets them apart. The placement support provided by them is top-notch. I'm grateful for their unwavering support throughout my journey."
              },
              {
                name: "Shaik Shaheed",
                package: "6.5 LPA • Aptus Data Labs",
                avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
                review: "MicronInfoTech gave me practical training and interview prep that helped me land my dream role. Mentors were always available to clear doubts and guide me through every step of the placement process."
              }
            ].map((t, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
                    />
                    <div>
                      <h4 className="font-extrabold text-sm text-[#0f1629]">{t.name}</h4>
                      <p className="text-xs text-[#2E2EF2] font-semibold">{t.package}</p>
                    </div>
                  </div>
                  <div className="flex text-amber-400 gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 italic leading-relaxed">
                    "{t.review}"
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* THE 4 VERIFIED RATINGS CARDS (Clean White Tiles, NOT BLACK!) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Google Reviews */}
            <div className="flex items-center gap-3.5 rounded-xl border border-gray-200/80 bg-white p-4 shadow-xs">
              <svg className="h-9 w-9 shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <div className="min-w-0 text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base text-[#131C33]">4.9 / 5</span>
                  <div className="flex text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                </div>
                <div className="text-[11px] text-gray-500 font-medium">By Google Reviews</div>
              </div>
            </div>

            {/* Justdial */}
            <div className="flex items-center gap-3.5 rounded-xl border border-gray-200/80 bg-white p-4 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-orange-500 text-white font-black text-sm flex items-center justify-center shrink-0">
                Jd
              </div>
              <div className="min-w-0 text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base text-[#131C33]">4.9 / 5</span>
                  <div className="flex text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                </div>
                <div className="text-[11px] text-gray-500 font-medium">By Justdial Verified</div>
              </div>
            </div>

            {/* Sulekha */}
            <div className="flex items-center gap-3.5 rounded-xl border border-gray-200/80 bg-white p-4 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-[#0070ba] text-white font-black text-sm flex items-center justify-center shrink-0">
                S
              </div>
              <div className="min-w-0 text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base text-[#131C33]">4.9 / 5</span>
                  <div className="flex text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                </div>
                <div className="text-[11px] text-gray-500 font-medium">By Sulekha Courses</div>
              </div>
            </div>

            {/* Course Suggest */}
            <div className="flex items-center gap-3.5 rounded-xl border border-gray-200/80 bg-white p-4 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                CS
              </div>
              <div className="min-w-0 text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base text-[#131C33]">4.8 / 5</span>
                  <div className="flex text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                </div>
                <div className="text-[11px] text-gray-500 font-medium">By Course Suggest India</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 10: WHAT SO SPECIAL ABOUT MICRONINFOTECH? */}
      <section className="py-14 sm:py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0f1629]">
              What so special about MicronInfoTech?
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed">
              MicronInfoTech is the most trusted software training Institute in Bangalore India, providing best Job Oriented courses by top Trainers from global universities with assured Free Internships.
            </p>
          </div>

          {/* Split: Left 3 Bullet Points + Right Grid of Company Logos */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left 3 Checklist Items */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#2E2EF2] flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-sm text-[#0f1629]">
                    Instructors from Top Global Brands
                  </h3>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed pl-12">
                  We have 100+ top certified and experienced Instructors from global universities and brands, providing practical software training in their field.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-sm text-[#0f1629]">
                    100% Assured Better Placements
                  </h3>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed pl-12">
                  Partnered with hundreds of reputed firms, businesses, and multinationals to provide the best career support for our students.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-sm text-[#0f1629]">
                    The Gateway to Build Skills & Career
                  </h3>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed pl-12">
                  More than 500+ courses in our collection designed for skill development and career boosting. Upgrade your skills and get employed with top salary packages.
                </p>
              </div>
            </div>

            {/* Right Hiring Company Logos Grid */}
            <div className="lg:col-span-7 bg-slate-50/70 p-6 rounded-2xl border border-slate-200">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 text-center">
                Our Students Are Hired By 2,000+ Global Tech Giants:
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                {allHiringBrands.map((brand, i) => (
                  <div key={i} className="h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center p-2 shadow-2xs hover:shadow-xs transition-shadow">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="max-h-6 max-w-[85px] object-contain opacity-85 hover:opacity-100 transition-opacity"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 11: JOIN MICRONINFOTECH CAREER GUIDANCE PROGRAM (CTA Banner) */}
      <section className="bg-white py-12 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-[#2E2EF2] to-[#173bb5] p-8 sm:p-12 text-white text-center sm:text-left flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
            {/* Background decorative circles */}
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-3 max-w-2xl relative z-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Join MicronInfoTech Career Guidance Program
              </h2>
              <p className="text-sm text-blue-100 leading-relaxed">
                Launch your fastest career with MicronInfoTech! Our program equips you with in-demand skills to unlock insights from real-world projects and land your dream job. Join us and become a career hero!
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0 relative z-10">
              <button
                onClick={() => handleOpenEnroll("Career Guidance Program")}
                className="px-8 py-3.5 rounded-xl bg-white text-[#2E2EF2] font-black text-xs sm:text-sm tracking-wider uppercase hover:bg-blue-50 transition-colors shadow-md cursor-pointer"
              >
                ENROLL NOW
              </button>
              <a
                href={telHref(site.phone || "")}
                className="px-6 py-3.5 rounded-xl border border-white/40 text-white font-bold text-xs sm:text-sm hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call: {site.phone}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 12: FREQUENTLY ASKED QUESTIONS */}
      <section className="py-14 sm:py-16 bg-[#f5f6fa] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f1629]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {homeFaqs.map((faq, i) => (
              <div
                key={i}
                className="border border-gray-200/90 rounded-2xl overflow-hidden bg-white shadow-2xs"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-[#0f1629] flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      openFaq === i ? "rotate-180 text-[#2E2EF2]" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-gray-600 border-t border-gray-100 pt-3 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <a
        href={waHref(site.whatsapp)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-[0_4px_16px_rgba(16,185,129,0.4)] transition-all hover:scale-110 active:scale-95"
      >
        <MessageCircle className="w-7 h-7 fill-current" />
      </a>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <EnrollModal
        isOpen={enrollModalOpen}
        onClose={() => setEnrollModalOpen(false)}
        initialCourse={selectedCourseForModal}
      />
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </div>
  );
}
