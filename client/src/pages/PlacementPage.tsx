import React, { useState } from "react";
import TopBanner from "../components/TopBanner";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import StudentPrideSection from "../components/StudentPrideSection";
import HiringPartners from "../components/HiringPartners";
import StudentBackgrounds from "../components/StudentBackgrounds";
import FaqSection from "../components/FaqSection";
import Footer from "../components/Footer";
import EnrollModal from "../components/EnrollModal";

export default function PlacementPage() {
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);

  const handleOpenEnroll = () => {
    setEnrollModalOpen(true);
  };

  const scrollToPlacements = () => {
    const el = document.getElementById("placements");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      handleOpenEnroll();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-[#2E2EF2] selection:text-white">
      {/* 1. Top Announcement Bar */}
      <TopBanner onSelectCourse={handleOpenEnroll} />

      {/* 2. Main Navigation Bar */}
      <Navbar
        onOpenSearch={scrollToPlacements}
        onCallClick={handleOpenEnroll}
      />

      {/* 3. Main Placement Page Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          onEnrollClick={handleOpenEnroll}
          onExploreCourses={scrollToPlacements}
        />

        {/* Student Pride Section */}
        <StudentPrideSection />

        {/* Hiring Partners */}
        <HiringPartners onCorporateEnquiry={scrollToContact} />

        {/* Student Backgrounds Donut Breakdown */}
        <StudentBackgrounds />

        {/* Frequently Asked Questions */}
        <FaqSection />
      </main>

      {/* 4. Royal Blue Footer */}
      <Footer />

      {/* 5. Interactive Enrollment Modal */}
      <EnrollModal
        isOpen={enrollModalOpen}
        onClose={() => setEnrollModalOpen(false)}
      />
    </div>
  );
}
