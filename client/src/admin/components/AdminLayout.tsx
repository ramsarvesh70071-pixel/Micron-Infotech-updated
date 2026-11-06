import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import { checkApiHealth } from "../../services/api";
import MitLogo from "../../components/MitLogo";
import {
  LayoutDashboard,
  Inbox,
  BookOpen,
  UserCheck,
  Briefcase,
  Star,
  MapPin,
  FileText,
  LifeBuoy,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  Activity,
  ChevronRight,
  Sparkles,
  Mail,
  Trophy,
  Handshake,
  HelpCircle,
  UserSquare,
  Building2,
  BarChart3,
  Scale,
  Globe
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, subtitle }) => {
  const { user, logout, can } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);
  const [dbMode, setDbMode] = useState<string>("Checking...");

  // Health check on mount and every 30s
  useEffect(() => {
    let mounted = true;
    const ping = async () => {
      try {
        const res = await checkApiHealth();
        if (mounted && (res as any).status === "UP") {
          setServerOnline(true);
          setDbMode(res.database?.connected ? "MongoDB (Live)" : "DB Offline");
        } else if (mounted) {
          setServerOnline(false);
          setDbMode("Offline");
        }
      } catch {
        if (mounted) {
          setServerOnline(false);
          setDbMode("Offline");
        }
      }
    };

    ping();
    const interval = setInterval(ping, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const allNav: { label: string; path: string; icon: any; resource: string; group: string }[] = [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard, resource: "dashboard", group: "Overview" },
    { label: "Leads & Enquiries", path: "/admin/enquiries", icon: Inbox, resource: "enquiries", group: "Leads" },
    { label: "Support Helpdesk", path: "/admin/support", icon: LifeBuoy, resource: "support", group: "Leads" },
    { label: "Newsletter", path: "/admin/newsletter", icon: Mail, resource: "newsletter", group: "Leads" },
    { label: "Courses", path: "/admin/courses", icon: BookOpen, resource: "courses", group: "Website Content" },
    { label: "Branches", path: "/admin/branches", icon: MapPin, resource: "branches", group: "Website Content" },
    { label: "Reviews", path: "/admin/reviews", icon: Star, resource: "reviews", group: "Website Content" },
    { label: "Placements", path: "/admin/placements", icon: Trophy, resource: "placements", group: "Website Content" },
    { label: "Partner Logos", path: "/admin/partners", icon: Handshake, resource: "partners", group: "Website Content" },
    { label: "FAQs", path: "/admin/faqs", icon: HelpCircle, resource: "faqs", group: "Website Content" },
    { label: "Blog & Articles", path: "/admin/blogs", icon: FileText, resource: "blogs", group: "Website Content" },
    { label: "Team & Mentors", path: "/admin/team", icon: UserSquare, resource: "team", group: "Website Content" },
    { label: "Legal Pages", path: "/admin/legal", icon: Scale, resource: "legal", group: "Website Content" },
    { label: "Site Settings", path: "/admin/site-settings", icon: Globe, resource: "settings", group: "System" },
    { label: "Admin Users", path: "/admin/users", icon: Users, resource: "users", group: "System" },
    { label: "My Account", path: "/admin/settings", icon: Settings, resource: "dashboard", group: "System" }
  ];
  const navItems = allNav.filter((n) => can(n.resource, "read"));

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#f8faff] text-slate-800 flex font-sans selection:bg-[#2E2EF2] selection:text-white">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-slate-200/90 shadow-2xs shrink-0 z-30">
        {/* Brand */}
        <Link to="/admin/dashboard" className="h-20 flex items-center gap-3 px-5 border-b border-slate-100 hover:bg-slate-50/50 transition">
          <MitLogo className="w-10 h-10" />
          <div className="min-w-0">
            <div className="font-black text-[15px] tracking-tight text-[#111827] truncate">
              MICRON INFO TECH
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[9.5px] font-black px-1.5 py-0.2 rounded-full bg-blue-50 text-[#2E2EF2] border border-blue-200 tracking-wider">
                ADMIN
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-tight">CONTROL HUB</span>
            </div>
          </div>
        </Link>

        {/* Live Server Indicator */}
        <div className="px-5 py-2.5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                serverOnline === true
                  ? "bg-emerald-500 animate-pulse"
                  : serverOnline === false
                  ? "bg-amber-500"
                  : "bg-slate-400"
              }`}
            />
            <span className="text-slate-500 font-medium text-[11.5px]">Backend:</span>
          </div>
          <span
            className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded-full border ${
              serverOnline
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
          >
            {dbMode}
          </span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path === "/admin/dashboard" && location.pathname === "/admin");
            const showGroup = idx === 0 || navItems[idx - 1].group !== item.group;

            return (
              <React.Fragment key={item.path}>
                {showGroup && (
                  <p className="px-3.5 pt-4 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {item.group}
                  </p>
                )}
                <Link
                  to={item.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all group ${
                    isActive
                      ? "bg-[#2E2EF2] text-white shadow-sm shadow-[#2E2EF2]/30"
                      : "text-slate-600 hover:text-[#2E2EF2] hover:bg-blue-50/70"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4.5 h-4.5 transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-[#2E2EF2]"}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-white/80" />}
                </Link>
              </React.Fragment>
            );
          })}
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 border border-blue-200 flex items-center justify-center font-black text-[#2E2EF2] text-sm overflow-hidden shrink-0 shadow-2xs">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />
              ) : (
                user?.name?.charAt(0) || "A"
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{user?.name || "Administrator"}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[9.5px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {user?.role || "admin"}
                </span>
                <span className="text-[11px] text-slate-500 truncate">{user?.email}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/80">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 hover:text-[#2E2EF2] transition shadow-2xs"
              title="Open Public Website"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-red-600 bg-red-50 border border-red-200/80 hover:bg-red-100 transition cursor-pointer shadow-2xs"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header & Drawer */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:text-slate-900 cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <MitLogo className="w-7 h-7" />
            <span className="font-black text-slate-900 text-sm tracking-tight">MICRON ADMIN</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:text-[#2E2EF2] text-xs flex items-center gap-1"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="w-72 max-w-[85%] h-full bg-white border-r border-slate-200 p-4 pt-20 flex flex-col shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <nav className="space-y-1 flex-1 overflow-y-auto">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                      isActive
                        ? "bg-[#2E2EF2] text-white shadow-sm"
                        : "text-slate-600 hover:text-[#2E2EF2] hover:bg-blue-50"
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-slate-100 text-xs text-slate-600">
              <p className="font-bold text-slate-900">{user?.name}</p>
              <p className="text-[11px] text-slate-500">{user?.email}</p>
              <button
                onClick={handleLogout}
                className="mt-3 w-full py-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg font-bold"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pt-16 lg:pt-0 overflow-y-auto">
        {/* Top Header Bar Desktop */}
        <header className="hidden lg:flex items-center justify-between h-20 px-8 border-b border-slate-200/90 bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <div>
            <h1 className="text-xl font-black text-[#111827] tracking-tight">
              {title || "Dashboard Overview"}
            </h1>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-700 font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#2E2EF2]" />
              <span>Role: <strong className="text-slate-900 capitalize">{user?.role || "Admin"}</strong></span>
            </div>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2E2EF2] hover:bg-[#2020d4] text-white text-xs font-bold transition shadow-sm hover:shadow active:scale-[0.98]"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Website</span>
            </a>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
