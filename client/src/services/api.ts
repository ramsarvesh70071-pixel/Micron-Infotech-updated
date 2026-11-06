// Single API client for the whole app. Public content, form submissions and the admin panel all go through here.
// Dev: Vite proxies /api -> http://localhost:5000 (see vite.config.ts). Prod: set VITE_API_URL if the API is on another origin.

const API_BASE_URL: string = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") || "/api";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  total?: number;
  ticketNumber?: string;
  token?: string;
  user?: any;
  errors?: { field?: string; message: string }[];
  [key: string]: any;
}

export class ApiError extends Error {
  status: number;
  errors?: { field?: string; message: string }[];
  constructor(message: string, status: number, errors?: { field?: string; message: string }[]) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

async function request<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      credentials: "include", // httpOnly session cookie for the admin panel
      ...options,
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest", // CSRF guard expected by the server
        ...(options.headers || {})
      },
      signal: controller.signal
    });
    const isJson = (res.headers.get("content-type") || "").includes("application/json");
    const json = isJson ? await res.json() : null;
    if (!res.ok) throw new ApiError(json?.message || `Request failed (${res.status})`, res.status, json?.errors);
    return (json ?? { success: true }) as ApiResponse<T>;
  } catch (e: any) {
    if (e instanceof ApiError) throw e;
    if (e?.name === "AbortError") throw new ApiError("The server took too long to respond. Please try again.", 0);
    throw new ApiError("Cannot reach the server. Please check your connection and try again.", 0);
  } finally {
    clearTimeout(timeout);
  }
}

// Public GET requests are cached for a short time and de-duplicated: a page that mounts several components
// asking for the same list (footer + search + form dropdowns) makes ONE network call, not many.
const GET_CACHE_TTL_MS = 30_000;
const getCache = new Map<string, { at: number; promise: Promise<ApiResponse> }>();
const cacheable = (endpoint: string, options: RequestInit) =>
  (!options.method || options.method === "GET") && !endpoint.startsWith("/admin") && !endpoint.startsWith("/auth") && !endpoint.startsWith("/health");

function cachedRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  if (!cacheable(endpoint, options)) return request<T>(endpoint, options);
  const hit = getCache.get(endpoint);
  if (hit && Date.now() - hit.at < GET_CACHE_TTL_MS) return hit.promise as Promise<ApiResponse<T>>;
  const promise = request<T>(endpoint, options);
  getCache.set(endpoint, { at: Date.now(), promise });
  promise.catch(() => getCache.delete(endpoint)); // never cache failures
  return promise;
}

const qs = (params: Record<string, string | number | boolean | undefined | null> = {}): string => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") q.append(k, String(v));
  });
  const s = q.toString();
  return s ? `?${s}` : "";
};
/** Drops cached public data (call after an admin edit so the next public read is fresh). */
export const clearApiCache = () => getCache.clear();
const send = (method: string, body?: unknown): RequestInit => ({ method, body: body === undefined ? undefined : JSON.stringify(body) });

/** First validation message from the server, or the generic message. */
export const errorMessage = (e: unknown): string =>
  e instanceof ApiError ? e.errors?.[0]?.message || e.message : e instanceof Error ? e.message : "Something went wrong.";

// ============================ PUBLIC: READ ============================
export type Params = Record<string, string | number | boolean | undefined | null>;
export const getSettings = () => cachedRequest("/settings");
export const getCourses = (p: Params = {}) => cachedRequest(`/courses${qs(p)}`);
export const getCourseBySlug = (slug: string) => cachedRequest(`/courses/${encodeURIComponent(slug)}`);
export const getBranches = () => cachedRequest("/branches");
export const getReviews = (p: Params = {}) => cachedRequest(`/reviews${qs(p)}`);
export const getPlacements = (p: Params = {}) => cachedRequest(`/placements${qs(p)}`);
export const getPartners = (p: Params = {}) => cachedRequest(`/partners${qs(p)}`);
export const getFaqs = (p: Params = {}) => cachedRequest(`/faqs${qs(p)}`);
export const getBlogs = (p: Params = {}) => cachedRequest(`/blogs${qs(p)}`);
export const getBlogBySlug = (slug: string) => cachedRequest(`/blogs/${encodeURIComponent(slug)}`);
export const getLegalDoc = (slug: string) => cachedRequest(`/legal/${encodeURIComponent(slug)}`);
export const getLegalDocs = () => cachedRequest("/legal");
export const getTeam = (p: Params = {}) => cachedRequest(`/team${qs(p)}`);

// ============================ PUBLIC: SUBMIT ============================
export const submitEnquiry = (data: Record<string, unknown>) => request("/enquiries", send("POST", data));
export const submitSupportTicket = (data: Record<string, unknown>) => request("/support", send("POST", data));
export const trackSupportTicket = (ticketNumber: string, email: string) => request("/support/track", send("POST", { ticketNumber, email }));
export const submitReview = (data: Record<string, unknown>) => request("/reviews", send("POST", data));
export const subscribeNewsletter = (email: string) => request("/newsletter", send("POST", { email }));

// ============================ ADMIN UPLOAD ============================
export const uploadImage = async (file: File): Promise<{ url: string; filename: string }> => {
  const formData = new FormData();
  formData.append("image", file);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const res = await fetch(`${API_BASE_URL}/admin/upload`, {
      method: "POST",
      credentials: "include",
      headers: {
        "X-Requested-With": "XMLHttpRequest"
      },
      body: formData,
      signal: controller.signal
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new ApiError(json?.message || "Failed to upload image", res.status);
    return json;
  } catch (e: any) {
    if (e instanceof ApiError) throw e;
    throw new ApiError(e.message || "Failed to upload image", 0);
  } finally {
    clearTimeout(timeout);
  }
};

// ============================ ADMIN ============================
export const adminLogin = (credentials: { email: string; password: string }) => request("/auth/login", send("POST", credentials));
export const adminLogout = () => request("/auth/logout", send("POST"));
export const getAdminProfile = () => request("/auth/me");
export const updateAdminProfile = (data: Record<string, unknown>) => request("/auth/profile", send("PUT", data));
export const getDashboardStats = () => request("/admin/dashboard/stats");
export const checkApiHealth = () => request("/health");

/** Generic admin CRUD for every resource (courses, faqs, placements, enquiries, ...). */
export const adminList = (resource: string, p: Params = {}) => request(`/admin/${resource}${qs({ limit: 500, ...p })}`);
export const adminCreate = (resource: string, data: unknown) => (clearApiCache(), request)(`/admin/${resource}`, send("POST", data));
export const adminUpdate = (resource: string, id: string, data: unknown) => (clearApiCache(), request)(`/admin/${resource}/${id}`, send("PUT", data));
export const adminDelete = (resource: string, id: string) => (clearApiCache(), request)(`/admin/${resource}/${id}`, send("DELETE"));

export const updateSettings = (data: unknown) => (clearApiCache(), request)("/admin/settings", send("PUT", data));
export const getAdminSettings = () => request("/admin/settings");

// Users (super admin)
export const getAdminUsers = () => request("/admin/users");
export const createAdminUser = (data: unknown) => request("/admin/users", send("POST", data));
export const updateAdminUser = (id: string, data: unknown) => request(`/admin/users/${id}`, send("PUT", data));
export const deleteAdminUser = (id: string) => request(`/admin/users/${id}`, send("DELETE"));

/** Downloads the enquiries CSV using the session cookie (no token in the URL). */
export const downloadEnquiriesCsv = async (): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/admin/enquiries/export/csv`, { credentials: "include" });
  if (!res.ok) throw new ApiError("Export failed. Please log in again.", res.status);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `micron-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};
