import React, { useState, useEffect } from "react";
import { AdminLayout } from "../components/AdminLayout";
import { getAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser } from "../../services/api";
import { useAdminAuth } from "../context/AdminAuthContext";
import {
  Users,
  UserPlus,
  Shield,
  ShieldAlert,
  CheckCircle,
  XCircle,
  Trash2,
  Edit,
  Clock,
  Mail,
  Phone,
  X
} from "lucide-react";

export default function AdminUsersPage() {
  const { user: currentUser } = useAdminAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string>("editor");
  const [phone, setPhone] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAdminUsers();
      if (res.success && res.data) {
        setUsers(res.data);
      }
    } catch (err: any) {
      console.error("Failed to load users:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert("Please fill all required fields.");
      return;
    }

    setSaving(true);
    try {
      await createAdminUser({
        name,
        email,
        password,
        role,
        phone
      });
      setIsModalOpen(false);
      setName("");
      setEmail("");
      setPassword("");
      fetchUsers();
    } catch (err: any) {
      alert("Failed to create user: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (user: any) => {
    if (user._id === currentUser?.id) {
      alert("You cannot deactivate your own account.");
      return;
    }

    try {
      await updateAdminUser(user._id || user.id, { isActive: !user.isActive });
      fetchUsers();
    } catch (err: any) {
      alert("Failed to update user status: " + err.message);
    }
  };

  const handleDelete = async (id: string, userName: string) => {
    if (id === currentUser?.id) {
      alert("You cannot delete your own account.");
      return;
    }
    if (!window.confirm(`Are you sure you want to delete administrator account for ${userName}?`)) return;

    try {
      await deleteAdminUser(id);
      fetchUsers();
    } catch (err: any) {
      alert("Failed to delete user: " + err.message);
    }
  };

  return (
    <AdminLayout
      title="Admin Users & Role-Based Access"
      subtitle="Superadmin controls: Create and manage administrative accounts, permission tiers and active sessions"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-base font-black text-slate-900">System Administrators ({users.length})</h3>
          <p className="text-xs text-slate-500">Authenticated staff members with management dashboard access</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2E2EF2] hover:bg-[#2020d4] text-white text-xs font-black rounded-xl shadow-xs hover:shadow transition cursor-pointer active:scale-[0.98]"
        >
          <UserPlus className="w-4 h-4" />
          <span>Create New Staff Account</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#2E2EF2]" />
            <h3 className="font-black text-slate-900 text-sm">Staff Directory</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">Superadmin privilege active</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading staff users...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-bold text-[10.5px] border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">User Profile</th>
                  <th className="px-5 py-3.5">Email & Contact</th>
                  <th className="px-5 py-3.5">Assigned Role</th>
                  <th className="px-5 py-3.5">Account Status</th>
                  <th className="px-5 py-3.5">Last Login</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(u => {
                  const isCurrent = u._id === currentUser?.id;

                  return (
                    <tr key={u._id || u.id} className="hover:bg-blue-50/40 transition">
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <span>{u.name}</span>
                          {isCurrent && (
                            <span className="text-[10px] bg-blue-50 text-[#2E2EF2] border border-blue-200 px-1.5 py-0.2 rounded font-bold">
                              You
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="text-slate-800 font-medium">{u.email}</div>
                        {u.phone && <div className="text-[11px] text-slate-500 font-mono mt-0.5">{u.phone}</div>}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                            u.role === "superadmin"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : u.role === "admin"
                              ? "bg-blue-50 text-[#2E2EF2] border-blue-200"
                              : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleToggleStatus(u)}
                          disabled={isCurrent}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition border ${
                            isCurrent ? "cursor-default" : "cursor-pointer"
                          } ${
                            u.isActive
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-red-50 text-red-600 border-red-200"
                          }`}
                        >
                          {u.isActive ? "Active" : "Deactivated"}
                        </button>
                      </td>

                      <td className="px-5 py-4 text-slate-500 font-mono text-[11px]">
                        {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : "Never"}
                      </td>

                      <td className="px-5 py-4 text-right">
                        {!isCurrent && (
                          <button
                            onClick={() => handleDelete(u._id || u.id, u.name)}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition cursor-pointer shadow-2xs"
                            title="Delete User Account"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <h3 className="text-base font-black text-slate-900">Create Staff Administrator</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-200/50 cursor-pointer transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-[#2E2EF2] focus:ring-2 focus:ring-[#2E2EF2]/15 shadow-2xs transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Official Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. rajesh@microninfotech.com"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-[#2E2EF2] focus:ring-2 focus:ring-[#2E2EF2]/15 shadow-2xs transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Temporary password"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-[#2E2EF2] focus:ring-2 focus:ring-[#2E2EF2]/15 shadow-2xs transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Role *</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-[#2E2EF2] focus:ring-2 focus:ring-[#2E2EF2]/15 shadow-2xs transition font-semibold cursor-pointer"
                  >
                    <option value="admin">Admin (manage everything except users)</option>
                    <option value="editor">Editor (website content)</option>
                    <option value="counselor">Counselor (leads & applications)</option>
                    <option value="support">Support (helpdesk tickets)</option>
                    <option value="superadmin">Super Admin (full access incl. users)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98450..."
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-[#2E2EF2] focus:ring-2 focus:ring-[#2E2EF2]/15 shadow-2xs transition"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition shadow-2xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#2E2EF2] hover:bg-[#2020d4] text-white text-xs font-black rounded-xl shadow-xs hover:shadow transition active:scale-[0.98] cursor-pointer"
                >
                  {saving ? "Creating..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
