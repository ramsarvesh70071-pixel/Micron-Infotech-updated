// Maps API documents (MongoDB) to the shapes the presentational components expect.

export interface VideoReview { id: string; name: string; title: string; role: string; company: string; lpa: string; rating: number; duration: string; thumbnail: string; videoUrl: string; badge?: string; subBadge?: string; quote?: string }
export interface GoogleReview { id: string; name: string; avatar: string; role: string; company: string; lpa: string; rating: number; timeAgo: string; review: string; location?: string; tag?: string }
export interface StudentPlacementCard { id: string; name: string; package: string; role: string; company: string; logo: string; avatar: string; gender: "m" | "f" }
export interface StudentPlacement { id: string; name: string; package: string; packageNum: number; role: string; company: string; logo: string; image: string; category: string; batchYear: string; previousBg: string; hike: string; avatarBg: string; avatarSeed: string; avatarGender: "m" | "f"; companyColor: string }
export interface FaqItem { id: string; question: string; answer: string; category?: string }

export const toVideoReview = (r: any): VideoReview => ({
  id: r._id, name: r.name, title: r.title || r.name, role: r.role, company: r.company, lpa: r.packageLpa, rating: r.rating,
  duration: r.duration, thumbnail: r.thumbnail, videoUrl: r.videoUrl, badge: r.badge, subBadge: r.subBadge, quote: r.reviewText
});
export const toGoogleReview = (r: any): GoogleReview => ({
  id: r._id, name: r.name, avatar: r.avatar, role: r.role, company: r.company, lpa: r.packageLpa, rating: r.rating,
  timeAgo: r.timeAgo, review: r.reviewText, location: r.location, tag: r.tag
});
export const toPlacementCard = (p: any): StudentPlacementCard => ({
  id: p._id, name: p.name, package: p.package, role: p.role, company: p.company, logo: p.logo, avatar: p.image, gender: p.avatarGender || "m"
});
export const toStudentPlacement = (p: any): StudentPlacement => ({
  id: p._id, name: p.name, package: p.package, packageNum: p.packageNum || 0, role: p.role, company: p.company, logo: p.logo, image: p.image,
  category: p.category, batchYear: p.batchYear, previousBg: p.previousBg, hike: p.hike, avatarBg: p.avatarBg || "from-blue-400 to-indigo-600",
  avatarSeed: p.avatarSeed || p.name, avatarGender: p.avatarGender || "m", companyColor: p.companyColor
});
export const toFaq = (f: any): FaqItem => ({ id: f._id, question: f.question, answer: f.answer, category: f.category });

/** Human labels for placement categories (unknown ones fall back to the raw id). */
export const PLACEMENT_CATEGORY_LABELS: Record<string, string> = {
  ai: "AI, ML & Data Science", cloud: "Cloud & DevOps", fullstack: "Software & Mobile", testing: "Testing & QA",
  marketing: "Digital Marketing", other: "ServiceNow, SAP & ERP"
};

export const formatDate = (iso?: string): string =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) : "";
