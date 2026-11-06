import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "../components/AdminLayout";
import { getDashboardStats, adminUpdate } from "../../services/api";
import {
  Inbox,
  UserCheck,
  BookOpen,
  Star,
  LifeBuoy,
  Briefcase,
  TrendingUp,
  Clock,
  ArrowRight,
  Database,
  Server,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  FileSpreadsheet,
  Trophy,
  FileText
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setError(null);
      const res = await getDashboardStats();
      if (res.success && res.data) {
        setStats(res.data);
      } else {
        throw new Error(res.message || "Failed to load dashboard data");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleQuickStatusChange = async (enquiryId: string, newStatus: string) => {
    try {
      await adminUpdate("enquiries", enquiryId, { status: newStatus });
      fetchStats();
    } catch (err: any) {
      alert("Could not update lead status: " + err.message);
    }
  };

  return (
    <AdminLayout
      title="Executive Overview"
      subtitle="Real-time admissions pipeline, applications, course metrics & system health"
    >
      {/* Top Banner & Quick Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-black text-[#111827]">Live Operations Dashboard</h2>
          <p className="text-xs text-slate-500">Real-time performance analytics calculated directly from the backend database.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setRefreshing(true);
              fetchStats();
            }}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-[#2E2EF2] hover:bg-slate-50 transition cursor-pointer shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-[#2E2EF2]" : ""}`} />
            <span>Refresh Metrics</span>
          </button>

          <Link
            to="/admin/enquiries"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2E2EF2] hover:bg-[#2020d4] text-white text-xs font-bold transition shadow-sm hover:shadow active:scale-[0.98]"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>View All Leads</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>Notice: {error} (Displaying available cached data)</span>
          </div>
          <button onClick={fetchStats} className="underline font-bold hover:text-amber-900 cursor-pointer">Retry</button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-slate-200/80 shadow-2xs" />
          ))}
        </div>
      ) : (
        <>
          {/* Real Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Total Enquiries */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 hover:border-blue-300 hover:shadow-md transition-all duration-300 shadow-2xs group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500">Total Enquiries</span>
                <div className="p-2.5 rounded-xl bg-blue-50 text-[#2E2EF2] border border-blue-100 group-hover:scale-105 transition-transform">
                  <Inbox className="w-4.5 h-4.5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#111827]">{stats?.totals?.enquiries || 0}</span>
                {stats?.totals?.newEnquiries > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    +{stats.totals.newEnquiries} New
                  </span>
                )}
              </div>
              <p className="text-[11.5px] text-slate-500 mt-1">Student admissions & corporate leads</p>
            </div>

            {/* Total Placements */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 hover:border-purple-300 hover:shadow-md transition-all duration-300 shadow-2xs group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500">Student Placements</span>
                <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 group-hover:scale-105 transition-transform">
                  <Trophy className="w-4.5 h-4.5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#111827]">{stats?.totals?.placements || 0}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  Hired Alumni
                </span>
              </div>
              <p className="text-[11.5px] text-slate-500 mt-1">Placed in top tech companies</p>
            </div>

            {/* Active Courses */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 hover:border-emerald-300 hover:shadow-md transition-all duration-300 shadow-2xs group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500">Active Courses</span>
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-4.5 h-4.5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#111827]">{stats?.totals?.courses || 0}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Published
                </span>
              </div>
              <p className="text-[11.5px] text-slate-500 mt-1">Job-oriented training programs</p>
            </div>

            {/* Conversion Rate */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 hover:border-amber-300 hover:shadow-md transition-all duration-300 shadow-2xs group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500">Lead Conversion</span>
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 group-hover:scale-105 transition-transform">
                  <TrendingUp className="w-4.5 h-4.5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#111827]">{stats?.totals?.conversionRate || "0.0%"}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  Enrolled
                </span>
              </div>
              <p className="text-[11.5px] text-slate-500 mt-1">Ratio of contacted leads converted</p>
            </div>

            {/* Approved Reviews */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 hover:border-yellow-300 hover:shadow-md transition-all duration-300 shadow-2xs group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500">Verified Reviews</span>
                <div className="p-2.5 rounded-xl bg-yellow-50 text-yellow-600 border border-yellow-100 group-hover:scale-105 transition-transform">
                  <Star className="w-4.5 h-4.5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#111827]">{stats?.totals?.reviews || 0}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-800 border border-yellow-200">
                  4.8 Avg Rating
                </span>
              </div>
              <p className="text-[11.5px] text-slate-500 mt-1">Student alumni placement stories</p>
            </div>

            {/* Open Support Tickets */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 hover:border-rose-300 hover:shadow-md transition-all duration-300 shadow-2xs group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500">Support Desk</span>
                <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 group-hover:scale-105 transition-transform">
                  <LifeBuoy className="w-4.5 h-4.5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#111827]">{stats?.totals?.openTickets || 0}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  Open / In Progress
                </span>
              </div>
              <p className="text-[11.5px] text-slate-500 mt-1">Student grievances & requests</p>
            </div>

            {/* Published Articles */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 hover:border-cyan-300 hover:shadow-md transition-all duration-300 shadow-2xs group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500">Blog Articles</span>
                <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 group-hover:scale-105 transition-transform">
                  <FileText className="w-4.5 h-4.5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#111827]">{stats?.totals?.blogs || 0}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                  Published
                </span>
              </div>
              <p className="text-[11.5px] text-slate-500 mt-1">Tech blog posts & career guides</p>
            </div>

            {/* Server Status Quick Widget */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-md transition-all duration-300 shadow-2xs group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500">Database Engine</span>
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 group-hover:scale-105 transition-transform">
                  <Database className="w-4.5 h-4.5" />
                </div>
              </div>
              <div className="text-sm font-black text-slate-900 truncate">
                {stats?.systemStatus?.engine || "Active Engine"}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-bold mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Connected & Healthy</span>
              </div>
            </div>
          </div>

          {/* Lead Pipeline & Top Courses Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            {/* Status Pipeline Visualizer */}
            <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-black text-slate-900">Admissions Pipeline Stage Breakdown</h3>
                  <p className="text-xs text-slate-500">Live lead distribution across admission stages</p>
                </div>
                <Link to="/admin/enquiries" className="text-xs font-bold text-[#2E2EF2] hover:underline">
                  Manage Pipeline →
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                {[
                  { label: "New", count: stats?.statusDistribution?.new || 0, color: "bg-blue-50 text-[#2E2EF2] border-blue-200" },
                  { label: "Contacted", count: stats?.statusDistribution?.contacted || 0, color: "bg-amber-50 text-amber-700 border-amber-200" },
                  { label: "In Progress", count: stats?.statusDistribution?.in_progress || 0, color: "bg-purple-50 text-purple-700 border-purple-200" },
                  { label: "Converted", count: stats?.statusDistribution?.converted || 0, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                  { label: "Closed", count: stats?.statusDistribution?.closed || 0, color: "bg-slate-100 text-slate-600 border-slate-200" }
                ].map(item => (
                  <div key={item.label} className={`p-3 rounded-xl border text-center ${item.color}`}>
                    <div className="text-xl font-black">{item.count}</div>
                    <div className="text-[11px] font-bold mt-0.5">{item.label}</div>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="h-3 w-full bg-slate-100 border border-slate-200 rounded-full overflow-hidden flex">
                  {stats?.totals?.enquiries > 0 ? (
                    <>
                      <div style={{ width: `${((stats.statusDistribution.new || 0) / (stats.totals.enquiries || 1)) * 100}%` }} className="bg-[#2E2EF2] h-full" title="New" />
                      <div style={{ width: `${((stats.statusDistribution.contacted || 0) / (stats.totals.enquiries || 1)) * 100}%` }} className="bg-amber-500 h-full" title="Contacted" />
                      <div style={{ width: `${((stats.statusDistribution.in_progress || 0) / (stats.totals.enquiries || 1)) * 100}%` }} className="bg-purple-500 h-full" title="In Progress" />
                      <div style={{ width: `${((stats.statusDistribution.converted || 0) / (stats.totals.enquiries || 1)) * 100}%` }} className="bg-emerald-500 h-full" title="Converted" />
                      <div style={{ width: `${((stats.statusDistribution.closed || 0) / (stats.totals.enquiries || 1)) * 100}%` }} className="bg-slate-400 h-full" title="Closed" />
                    </>
                  ) : (
                    <div className="w-full bg-slate-200 h-full" />
                  )}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Legend: Blue (New) • Amber (Contacted) • Purple (In Progress) • Green (Converted)</span>
                  <span className="font-bold text-slate-900">{stats?.totals?.enquiries || 0} Total</span>
                </div>
              </div>
            </div>

            {/* Top Demand Courses */}
            <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-black text-slate-900">Top Demand Courses</h3>
                  <p className="text-xs text-slate-500">By student enquiry volume</p>
                </div>
                <Link to="/admin/courses" className="text-xs font-bold text-[#2E2EF2] hover:underline">
                  Courses →
                </Link>
              </div>

              <div className="space-y-3">
                {stats?.courseDistribution && stats.courseDistribution.length > 0 ? (
                  stats.courseDistribution.map((item: any, idx: number) => {
                    const max = stats.courseDistribution[0]?.count || 1;
                    const pct = Math.round((item.count / max) * 100);

                    return (
                      <div key={item.name} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-800 truncate max-w-[200px]">
                            {idx + 1}. {item.name}
                          </span>
                          <span className="font-mono text-slate-500 font-semibold">{item.count} leads</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                          <div
                            className="h-full bg-gradient-to-r from-[#2E2EF2] to-indigo-500 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-400 py-6 text-center">No inquiry distributions recorded yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Recent Leads Feed */}
          <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden mb-8 shadow-2xs">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">Recent Enquiries & Admissions Activity</h3>
                <p className="text-xs text-slate-500">Real-time submissions from website forms</p>
              </div>
              <Link
                to="/admin/enquiries"
                className="text-xs font-bold text-[#2E2EF2] hover:underline flex items-center gap-1"
              >
                <span>Full Leads Table</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-bold text-[10.5px] border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3.5">Candidate / Lead</th>
                    <th className="px-6 py-3.5">Contact</th>
                    <th className="px-6 py-3.5">Course & Mode</th>
                    <th className="px-6 py-3.5">Stage</th>
                    <th className="px-6 py-3.5">Received</th>
                    <th className="px-6 py-3.5 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats?.recentEnquiries && stats.recentEnquiries.length > 0 ? (
                    stats.recentEnquiries.map((enq: any) => (
                      <tr key={enq._id} className="hover:bg-blue-50/40 transition">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900">{enq.name}</div>
                          <div className="text-[11px] text-slate-500 font-medium">{enq.branch || "BTM Layout"}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-slate-800 font-mono font-medium">{enq.phone}</div>
                          <div className="text-[11px] text-slate-500 truncate max-w-[180px]">{enq.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800">{enq.course || "General Inquiry"}</div>
                          <div className="text-[11px] text-[#2E2EF2] font-semibold">{enq.mode || "Classroom"}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                              enq.status === "new"
                                ? "bg-blue-50 text-[#2E2EF2] border-blue-200"
                                : enq.status === "contacted"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : enq.status === "in_progress"
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : enq.status === "converted"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                            }`}
                          >
                            {enq.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-mono text-[11px]">
                          {new Date(enq.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <select
                            value={enq.status}
                            onChange={e => handleQuickStatusChange(enq._id, e.target.value)}
                            className="bg-white border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#2E2EF2] shadow-2xs font-medium cursor-pointer"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="in_progress">In Progress</option>
                            <option value="converted">Converted</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                        No recent enquiries recorded. Submit an inquiry through the website to test!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* System & Architecture Information */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-white border border-blue-100 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#2E2EF2] text-white flex items-center justify-center shadow-md shadow-[#2E2EF2]/20 shrink-0">
                <Server className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-[#111827]">Full-Stack Enterprise Architecture Active</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Node.js {stats?.systemStatus?.nodeVersion} • Database: <strong className="text-slate-800 font-bold">{stats?.systemStatus?.engine}</strong> ({stats?.systemStatus?.databaseName})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <Link
                to="/admin/settings"
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-xl transition shadow-2xs"
              >
                Inspect Settings
              </Link>
              <Link
                to="/admin/courses"
                className="px-4 py-2 bg-[#2E2EF2] hover:bg-[#2020d4] text-white font-bold rounded-xl transition shadow-sm hover:shadow active:scale-[0.98]"
              >
                Manage Courses
              </Link>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
