import type { UserRole } from "../models/User.js";

export type Action = "read" | "write" | "delete";
export type Resource =
  | "courses" | "branches" | "reviews" | "placements" | "partners" | "faqs" | "blogs"
  | "legal" | "team" | "settings"
  | "enquiries" | "support" | "newsletter" | "users" | "dashboard";

const ALL: UserRole[] = ["superadmin", "admin", "editor", "counselor", "support"];
const CONTENT_RW: UserRole[] = ["superadmin", "admin", "editor"];
const OWNERS: UserRole[] = ["superadmin", "admin"];

/** Single source of truth for role based access control (RBAC). */
export const PERMISSIONS: Record<Resource, Partial<Record<Action, UserRole[]>>> = {
  courses: { read: CONTENT_RW, write: CONTENT_RW, delete: OWNERS },
  branches: { read: CONTENT_RW, write: CONTENT_RW, delete: OWNERS },
  reviews: { read: CONTENT_RW, write: CONTENT_RW, delete: OWNERS },
  placements: { read: CONTENT_RW, write: CONTENT_RW, delete: OWNERS },
  partners: { read: CONTENT_RW, write: CONTENT_RW, delete: OWNERS },
  faqs: { read: CONTENT_RW, write: CONTENT_RW, delete: OWNERS },
  blogs: { read: CONTENT_RW, write: CONTENT_RW, delete: OWNERS },
  legal: { read: OWNERS, write: OWNERS, delete: ["superadmin"] },
  team: { read: CONTENT_RW, write: CONTENT_RW, delete: OWNERS },
  settings: { read: OWNERS, write: OWNERS },
  enquiries: { read: ["superadmin", "admin", "counselor"], write: ["superadmin", "admin", "counselor"], delete: OWNERS },
  support: { read: ["superadmin", "admin", "support"], write: ["superadmin", "admin", "support"], delete: OWNERS },
  newsletter: { read: ["superadmin", "admin", "editor"], write: OWNERS, delete: OWNERS },
  users: { read: ["superadmin"], write: ["superadmin"], delete: ["superadmin"] },
  dashboard: { read: ALL }
};

export const permissionsForRole = (role: UserRole): Record<string, Action[]> => {
  const out: Record<string, Action[]> = {};
  (Object.keys(PERMISSIONS) as Resource[]).forEach((res) => {
    const actions = (["read", "write", "delete"] as Action[]).filter((a) => PERMISSIONS[res][a]?.includes(role));
    if (actions.length) out[res] = actions;
  });
  return out;
};
