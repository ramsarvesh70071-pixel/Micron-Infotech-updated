import React, { useState } from "react";
import HiringPartners from "@/components/HiringPartners";
import TopBanner from "../components/TopBanner";
import Navbar from "../components/Navbar";
import StudentReviewsHero from "../components/reviews/StudentReviewsHero";
import GoogleReviewsSlider from "../components/reviews/GoogleReviewsSlider";
import StatsCounterSection from "../components/reviews/StatsCounterSection";
import PlacedStudentsReviewGrid from "../components/reviews/PlacedStudentsReviewGrid";
import ReviewFaqSection from "../components/reviews/ReviewFaqSection";
import Footer from "../components/Footer";
import EnrollModal from "../components/EnrollModal";

export default function StudentReviewsPage() {
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);

  const handleOpenEnroll = () => {
    setEnrollModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-[#2E2EF2] selection:text-white">
      {/* 1. Top Announcement Banner */}
      <TopBanner onSelectCourse={handleOpenEnroll} />

      {/* 2. Main Navigation Bar */}
      <Navbar
        onOpenSearch={handleOpenEnroll}
        onCallClick={handleOpenEnroll}
      />

      {/* 3. Main Page Content */}
      <main className="flex-1">
        {/* Hero Section: India's Most Loved Training Institute */}
        <StudentReviewsHero
          onEnrollClick={handleOpenEnroll}
        />
        {/* How we have placed 6,622 Students? - Smooth Horizontal Marquee in 2 Rows matching cgdfhgdfhggh.mp4 */}
        <PlacedStudentsReviewGrid />
        {/* Student Reviews Showcase placed directly under Hero */}
        <GoogleReviewsSlider />

        {/* 3 Key Stats Counters: 4K+, 9K+, 24K+ */}
        <StatsCounterSection />
        <HiringPartners/>

        {/* 7 Detailed Reviews FAQs with Search & Accordion */}
        <ReviewFaqSection />
      </main>

      {/* 4. Royal Blue Footer */}
      <Footer />

      {/* 5. Interactive Enrollment Modal with Confetti */}
      <EnrollModal
        isOpen={enrollModalOpen}
        onClose={() => setEnrollModalOpen(false)}
      />
    </div>
  );
}

