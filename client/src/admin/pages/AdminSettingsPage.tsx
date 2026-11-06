import React, { useState, useEffect } from "react";
import { AdminLayout } from "../components/AdminLayout";
import { checkApiHealth, updateAdminProfile } from "../../services/api";
import { useAdminAuth } from "../context/AdminAuthContext";
import {
  Settings,
  Server,
  Database,
  Shield,
  Key,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Cpu,
  Globe
} from "lucide-react";

export default function AdminSettingsPage() {
  const { user } = useAdminAuth();
  const [healthData, setHealthData] = useState<any>(null);
  const [checkingHealth, setCheckingHealth] = useState(false);

  // Password Change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchHealth = async () => {
    setCheckingHealth(true);
    try {
      const res = await checkApiHealth();
      setHealthData(res);
    } catch (err: any) {
      setHealthData({ status: "UNREACHABLE", error: err.message });
    } finally {
      setCheckingHealth(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPwdMsg({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,128}$/.test(newPassword)) {
      setPwdMsg({ type: "error", text: "Password must be 10+ characters with an uppercase letter, a lowercase letter and a number." });
      return;
    }

    setPwdLoading(true);
    setPwdMsg(null);

    try {
      await updateAdminProfile({
        currentPassword,
        newPassword
      });
      setPwdMsg({ type: "success", text: "Password changed successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPwdMsg({ type: "error", text: err.message || "Failed to update password." });
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <AdminLayout
      title="System Architecture & Settings"
      subtitle="Inspect live database connections, verify server health pings and manage personal account security"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: System & Database Health */}
        <div className="lg:col-span-7 space-y-6">
          {/* Health Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-[#2E2EF2] border border-blue-100">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#111827]">Backend Health & Engine Status</h3>
                  <p className="text-xs text-slate-500">Live heartbeat monitoring</p>
                </div>
              </div>

              <button
                onClick={fetchHealth}
                disabled={checkingHealth}
                className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-[#2E2EF2] hover:bg-slate-100 transition cursor-pointer shadow-2xs"
                title="Ping API Server"
              >
                <RefreshCw className={`w-4 h-4 ${checkingHealth ? "animate-spin text-[#2E2EF2]" : ""}`} />
              </button>
            </div>

            <div className="space-y-3 bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 font-medium">API Status:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{healthData?.status || "HEALTHY"}</span>
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-t border-slate-200/70">
                <span className="text-slate-500 font-medium">Active Database Mode:</span>
                <span className="font-bold text-slate-800">
                  {healthData?.database?.isMemoryFallback ? (
                    <span className="text-amber-600">In-Memory Engine (Active)</span>
                  ) : (
                    <span className="text-emerald-600 font-bold">MongoDB Mongoose (Connected)</span>
                  )}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-t border-slate-200/70">
                <span className="text-slate-500 font-medium">Database Host / Storage:</span>
                <span className="font-mono text-slate-700 font-medium">
                  {healthData?.database?.host || "localhost / internal"}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-t border-slate-200/70">
                <span className="text-slate-500 font-medium">Database Name:</span>
                <span className="font-mono text-slate-700 font-medium">
                  {healthData?.database?.name || "micron_infotech"}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-t border-slate-200/70">
                <span className="text-slate-500 font-medium">Server Uptime:</span>
                <span className="font-mono text-[#2E2EF2] font-bold">
                  {healthData?.uptime ? `${Math.floor(healthData.uptime)} seconds` : "Active"}
                </span>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 leading-relaxed font-medium">
              <strong className="font-bold text-[#2E2EF2]">Database Connection Policy:</strong> All resources, admissions pipeline, applications, reviews, courses, and site settings are synchronized with the database in real-time.
            </div>
          </div>

          {/* Architecture Details Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs">
            <h3 className="text-base font-black text-[#111827] mb-3">Enterprise Stack & Security Controls</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/80">
                <div className="text-slate-500 font-medium">Authentication</div>
                <div className="font-bold text-slate-900 mt-1">JWT + bcrypt (10 rounds)</div>
              </div>
              <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/80">
                <div className="text-slate-500 font-medium">Headers Security</div>
                <div className="font-bold text-slate-900 mt-1">Helmet Protection</div>
              </div>
              <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/80">
                <div className="text-slate-500 font-medium">Rate Limiting</div>
                <div className="font-bold text-slate-900 mt-1">1000 req / 15m (50 auth)</div>
              </div>
              <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/80">
                <div className="text-slate-500 font-medium">Data Validation</div>
                <div className="font-bold text-slate-900 mt-1">express-validator</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Account Security & Password Update */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#111827]">Update Security Credentials</h3>
                <p className="text-xs text-slate-500">Change password for {user?.email}</p>
              </div>
            </div>

            {pwdMsg && (
              <div
                className={`p-3.5 mb-4 rounded-xl text-xs flex items-center gap-2 border font-medium ${
                  pwdMsg.type === "success"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-red-50 text-red-600 border-red-200"
                }`}
              >
                {pwdMsg.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />}
                <span>{pwdMsg.text}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Current Password *</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-[#2E2EF2] focus:ring-2 focus:ring-[#2E2EF2]/15 shadow-2xs transition"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">New Password *</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Minimum 10 characters"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-[#2E2EF2] focus:ring-2 focus:ring-[#2E2EF2]/15 shadow-2xs transition"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-[#2E2EF2] focus:ring-2 focus:ring-[#2E2EF2]/15 shadow-2xs transition"
                />
              </div>

              <button
                type="submit"
                disabled={pwdLoading}
                className="w-full py-3 bg-[#2E2EF2] hover:bg-[#2020d4] text-white font-black rounded-xl shadow-xs hover:shadow transition active:scale-[0.98] cursor-pointer mt-2"
              >
                {pwdLoading ? "Updating Password..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
