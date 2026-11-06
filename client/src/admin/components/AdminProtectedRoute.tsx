import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import { Loader2 } from "lucide-react";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  /** Resource the page needs read access to (checked against the server-provided permissions). */
  resource?: string;
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children, resource }) => {
  const { isAuthenticated, isLoading, can } = useAdminAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-sm font-medium text-slate-400">Verifying Admin Session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (resource && !can(resource, "read")) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6 text-center">
        <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl font-black">!</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-slate-400 max-w-md mb-6">
          Your role does not have permission to open this module.
        </p>
        <a
          href="/admin/dashboard"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition"
        >
          Return to Dashboard
        </a>
      </div>
    );
  }

  return <>{children}</>;
};
