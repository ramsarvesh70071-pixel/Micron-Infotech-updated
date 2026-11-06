import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// Public Pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import StudentReviewsPage from "./pages/StudentReviewsPage";
import PlacementPage from "./pages/PlacementPage";
import SupportPage from "./pages/SupportPage";
import LegalPage from "./pages/LegalPage";
import BlogPage from "./pages/BlogPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import { SiteSettingsProvider } from "./context/SiteSettingsContext";
import ApiStatusBanner from "./components/ApiStatusBanner";

// Admin Context & Guard
import { AdminAuthProvider } from "./admin/context/AdminAuthContext";
import { AdminProtectedRoute } from "./admin/components/AdminProtectedRoute";

// Admin Pages
import AdminLoginPage from "./admin/pages/AdminLoginPage";
import AdminDashboardPage from "./admin/pages/AdminDashboardPage";
import AdminUsersPage from "./admin/pages/AdminUsersPage";
import AdminSettingsPage from "./admin/pages/AdminSettingsPage";
import AdminSiteSettingsPage from "./admin/pages/AdminSiteSettingsPage";
import AdminResourcePage from "./admin/pages/AdminResourcePage";

// Scroll to top or anchor target automatically when route changes
function ScrollHandler() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          return;
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

const RESOURCE_ROUTES = [
  "enquiries", "support", "newsletter",
  "courses", "branches", "reviews", "placements", "partners", "faqs", "blogs", "team", "legal"
];

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-center p-6">
      <h1 className="text-5xl font-black text-slate-900">404</h1>
      <p className="text-slate-600">This page does not exist.</p>
      <a href="/" className="px-4 py-2 rounded-lg bg-[#2E2EF2] text-white text-sm font-bold">Back to home</a>
    </div>
  );
}

export default function App() {
  return (
    <SiteSettingsProvider>
      <AdminAuthProvider>
        <BrowserRouter>
          <ScrollHandler />
          <ApiStatusBanner />
          <Routes>
            {/* Public Website Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/job-oriented-courses" element={<HomePage />} />
            <Route path="/courses" element={<HomePage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/student-reviews" element={<StudentReviewsPage />} />
            <Route path="/students-placements" element={<PlacementPage />} />
            <Route path="/placement" element={<PlacementPage />} />
            <Route path="/placements" element={<PlacementPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/legal/:slug" element={<LegalPage />} />

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminProtectedRoute resource="dashboard"><AdminDashboardPage /></AdminProtectedRoute>} />
            <Route path="/admin/dashboard" element={<AdminProtectedRoute resource="dashboard"><AdminDashboardPage /></AdminProtectedRoute>} />
            {RESOURCE_ROUTES.map((r) => (
              <Route key={r} path={`/admin/${r}`} element={<AdminProtectedRoute resource={r}><AdminResourcePage resource={r} /></AdminProtectedRoute>} />
            ))}
            <Route path="/admin/site-settings" element={<AdminProtectedRoute resource="settings"><AdminSiteSettingsPage /></AdminProtectedRoute>} />
            <Route path="/admin/users" element={<AdminProtectedRoute resource="users"><AdminUsersPage /></AdminProtectedRoute>} />
            <Route path="/admin/settings" element={<AdminProtectedRoute resource="dashboard"><AdminSettingsPage /></AdminProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AdminAuthProvider>
    </SiteSettingsProvider>
  );
}
