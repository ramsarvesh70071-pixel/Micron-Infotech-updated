import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { adminLogin, adminLogout, getAdminProfile, updateAdminProfile as apiUpdateProfile } from "../../services/api";

export type AdminRole = "superadmin" | "admin" | "editor" | "counselor" | "support";
export type Action = "read" | "write" | "delete";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar?: string;
  phone?: string;
  lastLogin?: string;
  /** resource -> allowed actions, computed by the server from the user's role */
  permissions: Record<string, Action[]>;
}

interface AdminAuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  can: (resource: string, action?: Action) => boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Record<string, unknown>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

/**
 * Session lives in an httpOnly cookie set by the server, so JavaScript (and any XSS) can never read the token.
 * On load we simply ask the server "who am I?".
 */
export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    try {
      const res = await getAdminProfile();
      setUser(res.success ? (res.user as AdminUser) : null);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    // Only probe the session when the admin area is being used.
    if (!window.location.pathname.startsWith("/admin")) {
      setIsLoading(false);
      return;
    }
    refreshProfile().finally(() => setIsLoading(false));
  }, [refreshProfile]);

  const login = async (credentials: { email: string; password: string }) => {
    const res = await adminLogin(credentials);
    if (!res.success || !res.user) throw new Error(res.message || "Login failed");
    setUser(res.user as AdminUser);
  };

  const logout = async () => {
    try {
      await adminLogout();
    } finally {
      setUser(null);
    }
  };

  const updateProfile = async (data: Record<string, unknown>) => {
    const res = await apiUpdateProfile(data);
    if (res.success && res.user) setUser(res.user as AdminUser);
  };

  const can = (resource: string, action: Action = "read") => Boolean(user?.permissions?.[resource]?.includes(action));

  return (
    <AdminAuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, can, login, logout, updateProfile, refreshProfile }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
};
