import React from "react";
import { Download } from "lucide-react";
import type { ResourceDef } from "./components/ResourceManager";
import { downloadEnquiriesCsv, errorMessage } from "../services/api";

const GRADIENTS = [
  "from-blue-600 to-indigo-600", "from-emerald-500 to-teal-600", "from-amber-500 to-orange-600", "from-rose-500 to-pink-600",
  "from-purple-500 to-violet-600", "from-cyan-500 to-sky-600", "from-slate-600 to-slate-800", "from-green-500 to-emerald-600"
];
const date = (v: string) => (v ? new Date(v).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "");
const img = (key: string) => (row: any) => (row[key] ? <img src={row[key]} alt="" className="h-9 w-9 rounded-lg object-contain bg-white border border-slate-200 shadow-2xs p-0.5" loading="lazy" /> : <span className="text-slate-400 font-mono">-</span>);
const yesNo = (v: boolean) => <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${v ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}>{v ? "Yes" : "No"}</span>;

const ExportCsvButton = () => {
  const [busy, setBusy] = React.useState(false);
  return (
    <button
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try { await downloadEnquiriesCsv(); } catch (e) { window.alert(errorMessage(e)); } finally { setBusy(false); }
      }}
      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold shadow-2xs disabled:opacity-60 cursor-pointer transition"
    >
      <Download className="w-4 h-4 text-[#2E2EF2]" /> Export CSV
    </button>
  );
};

export const RESOURCE_DEFS: Record<string, { title: string; subtitle: string; def: ResourceDef }> = {
  // ===================== LEADS =====================
  enquiries: {
    title: "Leads & Enquiries", subtitle: "Every enrolment, contact and corporate form submitted on the website.",
    def: {
      resource: "enquiries", singular: "Enquiry", titleKey: "name", canCreate: false, searchPlaceholder: "Search name, email, phone, course...",
      headerActions: <ExportCsvButton />,
      filters: [
        { key: "status", label: "Status", options: ["new", "contacted", "in_progress", "converted", "closed"] },
        { key: "type", label: "Type", options: ["enrollment", "general", "corporate"] }
      ],
      columns: [
        { key: "createdAt", label: "Received", render: (r) => <span className="whitespace-nowrap">{date(r.createdAt)}</span> },
        { key: "name", label: "Name" }, { key: "phone", label: "Phone" }, { key: "email", label: "Email" },
        { key: "course", label: "Course" }, { key: "type", label: "Type" },
        { key: "status", label: "Status", select: ["new", "contacted", "in_progress", "converted", "closed"] }
      ],
      fields: [
        { key: "name", label: "Name", readOnly: true }, { key: "email", label: "Email", readOnly: true }, { key: "phone", label: "Phone", readOnly: true },
        { key: "course", label: "Course", readOnly: true }, { key: "branch", label: "Branch / Mode", readOnly: true }, { key: "type", label: "Type", readOnly: true },
        { key: "companyName", label: "Company", readOnly: true }, { key: "teamSize", label: "Team size", readOnly: true },
        { key: "comments", label: "Message from visitor", type: "textarea", readOnly: true },
        { key: "status", label: "Status", type: "select", required: true, options: ["new", "contacted", "in_progress", "converted", "closed"] },
        { key: "assignedTo", label: "Assigned to" },
        { key: "notes", label: "Internal notes", type: "textarea" }
      ]
    }
  },
  support: {
    title: "Support Helpdesk", subtitle: "Student tickets. Reply in 'Response to student' - they can see it via ticket tracking.",
    def: {
      resource: "support", singular: "Ticket", titleKey: "ticketNumber", canCreate: false,
      filters: [
        { key: "status", label: "Status", options: ["Open", "In Progress", "Resolved", "Closed"] },
        { key: "priority", label: "Priority", options: ["Low", "Normal", "High", "Urgent"] }
      ],
      columns: [
        { key: "createdAt", label: "Created", render: (r) => <span className="whitespace-nowrap">{date(r.createdAt)}</span> },
        { key: "ticketNumber", label: "Ticket" }, { key: "name", label: "Student" }, { key: "email", label: "Email" }, { key: "category", label: "Category" },
        { key: "priority", label: "Priority", select: ["Low", "Normal", "High", "Urgent"] },
        { key: "status", label: "Status", select: ["Open", "In Progress", "Resolved", "Closed"] }
      ],
      fields: [
        { key: "ticketNumber", label: "Ticket", readOnly: true }, { key: "name", label: "Student", readOnly: true }, { key: "email", label: "Email", readOnly: true },
        { key: "phone", label: "Phone", readOnly: true }, { key: "studentId", label: "Student ID", readOnly: true }, { key: "category", label: "Category", readOnly: true },
        { key: "description", label: "Issue", type: "textarea", readOnly: true },
        { key: "priority", label: "Priority", type: "select", required: true, options: ["Low", "Normal", "High", "Urgent"] },
        { key: "status", label: "Status", type: "select", required: true, options: ["Open", "In Progress", "Resolved", "Closed"] },
        { key: "responseNotes", label: "Response to student", type: "textarea" }
      ]
    }
  },
  newsletter: {
    title: "Newsletter Subscribers", subtitle: "Emails collected from the website footer.",
    def: {
      resource: "newsletter", singular: "Subscriber", titleKey: "email", canCreate: false, searchPlaceholder: "Search email...",
      columns: [
        { key: "createdAt", label: "Subscribed", render: (r) => date(r.createdAt) }, { key: "email", label: "Email" }, { key: "source", label: "Source" },
        { key: "active", label: "Active", toggle: true }
      ],
      fields: [{ key: "email", label: "Email", readOnly: true }, { key: "active", label: "Active", type: "boolean" }]
    }
  },

  // ===================== WEBSITE CONTENT =====================
  courses: {
    title: "Courses", subtitle: "Everything on the home page course grid, search and enrolment form comes from here.",
    def: {
      resource: "courses", singular: "Course", titleKey: "name", searchPlaceholder: "Search courses...",
      defaults: { active: true, location: "Bangalore & Online", mode: "Classroom / Online", order: 100 },
      columns: [
        { key: "order", label: "#" }, { key: "name", label: "Course" }, { key: "category", label: "Category" }, { key: "fee", label: "Fee" }, { key: "duration", label: "Duration" },
        { key: "placementGuaranteed", label: "Placement", toggle: true }, { key: "internshipIncluded", label: "Internship", toggle: true }, { key: "active", label: "Live", toggle: true }
      ],
      fields: [
        { key: "name", label: "Course name", required: true, wide: true },
        { key: "category", label: "Category (tab title)", required: true, placeholder: "Popular IT Courses 2026" },
        { key: "categorySlug", label: "Category key", required: true, placeholder: "popular", help: "Courses with the same key appear under the same tab." },
        { key: "fee", label: "Fee (shown as text)", placeholder: "₹34,999" }, { key: "duration", label: "Duration", required: true, placeholder: "60 Days" },
        { key: "location", label: "Location" }, { key: "mode", label: "Mode" }, { key: "badge", label: "Badge" },
        { key: "rating", label: "Rating (0-5)", type: "number", help: "Leave empty unless you have a real verified rating." },
        { key: "studentsCount", label: "Students trained (text)" }, { key: "order", label: "Sort order", type: "number" },
        { key: "image", label: "Image URL", wide: true },
        { key: "highlights", label: "Highlights (one per line)", type: "lines" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "syllabus", label: "Syllabus (JSON)", type: "json", help: '[{"title":"Module 1","topics":["Topic A","Topic B"]}]' },
        { key: "placementGuaranteed", label: "Placement support offered", type: "boolean" }, { key: "internshipIncluded", label: "Internship included", type: "boolean" },
        { key: "popular", label: "Mark as popular", type: "boolean" }, { key: "active", label: "Visible on website", type: "boolean" }
      ]
    }
  },
  branches: {
    title: "Branches", subtitle: "Training centres shown on the Contact page, footer and enrolment form.",
    def: {
      resource: "branches", singular: "Branch", titleKey: "name", defaults: { active: true, order: 100 },
      columns: [{ key: "order", label: "#" }, { key: "name", label: "Name" }, { key: "city", label: "City" }, { key: "phone", label: "Phone" }, { key: "isHeadquarter", label: "HQ", toggle: true }, { key: "active", label: "Live", toggle: true }],
      fields: [
        { key: "name", label: "Branch name", required: true }, { key: "city", label: "City", required: true },
        { key: "address", label: "Address", required: true, type: "textarea" }, { key: "landmark", label: "Landmark / area" },
        { key: "phone", label: "Phone" }, { key: "email", label: "Email" }, { key: "timings", label: "Timings" },
        { key: "mapQuery", label: "Google Maps search text", help: "Used to draw the map, e.g. 'Micron InfoTech, BTM Layout, Bangalore'" },
        { key: "order", label: "Sort order", type: "number" }, { key: "isHeadquarter", label: "Head office", type: "boolean" }, { key: "active", label: "Visible", type: "boolean" }
      ]
    }
  },
  reviews: {
    title: "Reviews & Testimonials", subtitle: "Student submitted reviews arrive UNAPPROVED - tick 'Approved' to publish them.",
    def: {
      resource: "reviews", singular: "Review", titleKey: "name", searchPlaceholder: "Search reviews...",
      defaults: { kind: "google", rating: 5, isApproved: true, order: 100 },
      filters: [
        { key: "kind", label: "Kind", options: ["written", "video", "google"] },
        { key: "isApproved", label: "Approved", options: ["true", "false"] }
      ],
      columns: [
        { key: "kind", label: "Kind" }, { key: "name", label: "Name" }, { key: "company", label: "Company" }, { key: "rating", label: "Rating" },
        { key: "reviewText", label: "Review", render: (r) => <span className="line-clamp-2">{r.reviewText}</span> },
        { key: "isApproved", label: "Approved", toggle: true }, { key: "isFeatured", label: "Featured", toggle: true }
      ],
      fields: [
        { key: "kind", label: "Kind", type: "select", required: true, options: ["written", "video", "google"], help: "video = video grid, google = review slider, written = student submitted" },
        { key: "name", label: "Student name", required: true }, { key: "role", label: "Role / designation" }, { key: "company", label: "Company" },
        { key: "rating", label: "Rating (1-5)", type: "number", required: true }, { key: "packageLpa", label: "Package (e.g. 12 LPA)" },
        { key: "course", label: "Course" }, { key: "avatar", label: "Avatar URL" },
        { key: "reviewText", label: "Review text / quote", type: "textarea" },
        { key: "timeAgo", label: "Time ago (google)" }, { key: "location", label: "Location (google)" }, { key: "tag", label: "Tag (google)" },
        { key: "title", label: "Video title" }, { key: "thumbnail", label: "Video thumbnail URL" }, { key: "videoUrl", label: "Video URL (YouTube embed)" },
        { key: "duration", label: "Video duration" }, { key: "badge", label: "Badge" }, { key: "subBadge", label: "Sub badge" },
        { key: "order", label: "Sort order", type: "number" },
        { key: "isApproved", label: "Approved (visible on website)", type: "boolean" }, { key: "isFeatured", label: "Featured", type: "boolean" }
      ]
    }
  },
  placements: {
    title: "Placements (Student Pride)", subtitle: "Placed-student cards. 'Marquee row' 1/2 = scrolling strips on the home page, 0 = Placement page grid.",
    def: {
      resource: "placements", singular: "Placement", titleKey: "name", searchPlaceholder: "Search student, company, role...", defaults: { active: true, marqueeRow: 0, category: "other", avatarGender: "m", order: 500 },
      filters: [{ key: "category", label: "Category", options: ["ai", "cloud", "fullstack", "testing", "marketing", "other"] }],
      columns: [
        { key: "image", label: "Photo", render: img("image") }, { key: "name", label: "Student" }, { key: "package", label: "Package" }, { key: "role", label: "Role" },
        { key: "company", label: "Company" }, { key: "marqueeRow", label: "Row" }, { key: "active", label: "Live", toggle: true }
      ],
      fields: [
        { key: "name", label: "Student name", required: true }, { key: "package", label: "Package (text)", placeholder: "12 LPA" }, { key: "packageNum", label: "Package (number, LPA)", type: "number" },
        { key: "role", label: "Role" }, { key: "company", label: "Company" }, { key: "logo", label: "Company logo URL" }, { key: "image", label: "Student photo URL" },
        { key: "category", label: "Category", type: "select", options: ["ai", "cloud", "fullstack", "testing", "marketing", "other"], required: true },
        { key: "marqueeRow", label: "Marquee row (0 = grid only)", type: "select", options: ["0", "1", "2"], required: true },
        { key: "batchYear", label: "Batch year" }, { key: "previousBg", label: "Previous background" }, { key: "hike", label: "Hike" },
        { key: "companyColor", label: "Company colour (hex)", placeholder: "#2E2EF2" }, { key: "avatarBg", label: "Avatar gradient", type: "select", options: GRADIENTS },
        { key: "avatarGender", label: "Avatar gender", type: "select", options: ["m", "f"], required: true },
        { key: "order", label: "Sort order", type: "number" }, { key: "active", label: "Visible", type: "boolean" }
      ]
    }
  },
  partners: {
    title: "Partner Logos", subtitle: "Hiring partners, media mentions and top companies. Only add logos of companies you truly work with.",
    def: {
      resource: "partners", singular: "Partner", titleKey: "name", defaults: { active: true, kind: "hiring", order: 100 },
      filters: [{ key: "kind", label: "Kind", options: ["hiring", "media", "top", "grid"] }],
      columns: [{ key: "logo", label: "Logo", render: img("logo") }, { key: "name", label: "Name" }, { key: "kind", label: "Kind" }, { key: "order", label: "#" }, { key: "active", label: "Live", toggle: true }],
      fields: [
        { key: "kind", label: "Kind", type: "select", required: true, options: ["hiring", "media", "top", "grid"], help: "hiring = scrolling strip, media = 'as seen in', top = top recruiters, grid = hiring brands grid" },
        { key: "name", label: "Name", required: true }, { key: "logo", label: "Logo URL", required: true, wide: true },
        { key: "order", label: "Sort order", type: "number" }, { key: "active", label: "Visible", type: "boolean" }
      ]
    }
  },
  faqs: {
    title: "FAQs", subtitle: "Questions shown on the Home, Placement, Reviews and Support pages.",
    def: {
      resource: "faqs", singular: "FAQ", titleKey: "question", searchPlaceholder: "Search questions...", defaults: { active: true, scope: "home", order: 100 },
      filters: [{ key: "scope", label: "Page", options: ["home", "placement", "reviews", "support", "general"] }],
      columns: [{ key: "scope", label: "Page" }, { key: "question", label: "Question" }, { key: "order", label: "#" }, { key: "active", label: "Live", toggle: true }],
      fields: [
        { key: "scope", label: "Shown on page", type: "select", required: true, options: ["home", "placement", "reviews", "support", "general"] },
        { key: "category", label: "Category" }, { key: "question", label: "Question", required: true, wide: true }, { key: "answer", label: "Answer", required: true, type: "textarea" },
        { key: "order", label: "Sort order", type: "number" }, { key: "active", label: "Visible", type: "boolean" }
      ]
    }
  },
  blogs: {
    title: "Blog & Articles", subtitle: "Published articles appear on /blog. Write the body in 'Content' (blank line = new paragraph, '## ' = heading).",
    def: {
      resource: "blogs", singular: "Article", titleKey: "title", searchPlaceholder: "Search articles...", defaults: { isPublished: true, category: "Career Trends" },
      columns: [{ key: "title", label: "Title" }, { key: "category", label: "Category" }, { key: "author", label: "Author" }, { key: "publishedAt", label: "Date", render: (r) => date(r.publishedAt) }, { key: "featured", label: "Featured", toggle: true }, { key: "isPublished", label: "Published", toggle: true }],
      fields: [
        { key: "title", label: "Title", required: true, wide: true }, { key: "slug", label: "URL slug", help: "Leave empty to generate from the title." },
        { key: "category", label: "Category" }, { key: "author", label: "Author" }, { key: "readTime", label: "Read time", placeholder: "6 min read" },
        { key: "publishedAt", label: "Publish date", type: "datetime" }, { key: "image", label: "Cover image URL", wide: true },
        { key: "excerpt", label: "Excerpt", required: true, type: "textarea" }, { key: "content", label: "Content", type: "textarea" },
        { key: "tags", label: "Tags (comma separated)", type: "tags" },
        { key: "featured", label: "Featured on top", type: "boolean" }, { key: "isPublished", label: "Published", type: "boolean" }
      ]
    }
  },
  team: {
    title: "Team & Mentors", subtitle: "'team' = leadership on the About page. 'mentor' profiles are stored for future use.",
    def: {
      resource: "team", singular: "Member", titleKey: "name", defaults: { active: true, kind: "team", color: GRADIENTS[0], order: 100 },
      filters: [{ key: "kind", label: "Kind", options: ["team", "mentor"] }],
      columns: [{ key: "kind", label: "Kind" }, { key: "name", label: "Name" }, { key: "role", label: "Role" }, { key: "order", label: "#" }, { key: "active", label: "Live", toggle: true }],
      fields: [
        { key: "kind", label: "Kind", type: "select", required: true, options: ["team", "mentor"] }, { key: "name", label: "Name", required: true },
        { key: "role", label: "Role / title" }, { key: "initials", label: "Initials (e.g. AK)" }, { key: "color", label: "Card gradient", type: "select", options: GRADIENTS },
        { key: "photo", label: "Photo URL" }, { key: "bio", label: "Bio", type: "textarea" },
        { key: "specialization", label: "Specialization" }, { key: "experienceYears", label: "Experience (years)", type: "number" },
        { key: "companies", label: "Companies (comma separated)", type: "tags" }, { key: "skills", label: "Skills (comma separated)", type: "tags" },
        { key: "achievements", label: "Achievements (one per line)", type: "lines" }, { key: "quote", label: "Quote", type: "textarea" },
        { key: "studentsTrained", label: "Students trained (text)" }, { key: "rating", label: "Rating (0-5)", type: "number" },
        { key: "order", label: "Sort order", type: "number" }, { key: "active", label: "Visible", type: "boolean" }
      ]
    }
  },
  legal: {
    title: "Legal Pages", subtitle: "Privacy policy, terms, refund policy etc. Have these reviewed by a legal professional before going live.",
    def: {
      resource: "legal", singular: "Legal page", titleKey: "title", defaults: { active: true, order: 100 },
      columns: [{ key: "title", label: "Title" }, { key: "slug", label: "URL" }, { key: "lastUpdated", label: "Last updated" }, { key: "active", label: "Live", toggle: true }],
      fields: [
        { key: "title", label: "Title", required: true }, { key: "slug", label: "URL slug", help: "/legal/<slug>" }, { key: "lastUpdated", label: "Last updated (text)" },
        { key: "sections", label: "Sections (JSON)", type: "json", help: '[{"heading":"1. Intro","content":["Paragraph one","Paragraph two"]}]' },
        { key: "order", label: "Sort order", type: "number" }, { key: "active", label: "Visible", type: "boolean" }
      ]
    }
  }
};
