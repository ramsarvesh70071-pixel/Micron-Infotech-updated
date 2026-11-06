import { Course } from "../models/Course.js";
import { Branch } from "../models/Branch.js";
import { Review } from "../models/Review.js";
import { Placement } from "../models/Placement.js";
import { Partner } from "../models/Partner.js";
import { Faq } from "../models/Faq.js";
import { BlogPost } from "../models/BlogPost.js";
import { LegalDoc } from "../models/LegalDoc.js";
import { TeamMember } from "../models/TeamMember.js";
import { Enquiry } from "../models/Enquiry.js";
import { SupportTicket } from "../models/SupportTicket.js";
import { NewsletterSubscriber } from "../models/NewsletterSubscriber.js";
import type { CrudOptions } from "../controllers/crud.js";
import type { Resource } from "../middleware/permissions.js";

export interface ResourceConfig {
  /** URL segment: /api/<path> (public read) and /api/admin/<path> (admin CRUD) */
  path: string;
  resource: Resource;
  /** Expose public GET endpoints for this resource. */
  publicRead: boolean;
  opts: CrudOptions;
}

const active = () => ({ active: true });

/** Single registry that drives both the public read API and the admin CRUD API. */
export const resources: ResourceConfig[] = [
  {
    path: "courses", resource: "courses", publicRead: true,
    opts: {
      model: Course, searchFields: ["name", "category", "description", "highlights"],
      filterFields: ["category", "categorySlug", "location", "mode"], boolFilters: ["popular", "active", "placementGuaranteed", "internshipIncluded"],
      publicFilter: active, sort: { order: 1, createdAt: 1 }, slugFrom: "name"
    }
  },
  {
    path: "branches", resource: "branches", publicRead: true,
    opts: { model: Branch, searchFields: ["name", "city", "address"], filterFields: ["city"], boolFilters: ["active"], publicFilter: active, sort: { order: 1, createdAt: 1 }, slugFrom: "name" }
  },
  {
    path: "reviews", resource: "reviews", publicRead: true,
    opts: {
      model: Review, searchFields: ["name", "company", "reviewText", "course"], filterFields: ["kind", "course"], boolFilters: ["isApproved", "isFeatured"],
      publicFilter: () => ({ isApproved: true }), sort: { order: 1, createdAt: -1 }
    }
  },
  {
    path: "placements", resource: "placements", publicRead: true,
    opts: {
      model: Placement, searchFields: ["name", "company", "role"], filterFields: ["category", "batchYear"], boolFilters: ["active"],
      publicFilter: active, sort: { order: 1, createdAt: 1 }
    }
  },
  {
    path: "partners", resource: "partners", publicRead: true,
    opts: { model: Partner, searchFields: ["name"], filterFields: ["kind"], boolFilters: ["active"], publicFilter: active, sort: { order: 1, createdAt: 1 } }
  },
  {
    path: "faqs", resource: "faqs", publicRead: true,
    opts: { model: Faq, searchFields: ["question", "answer"], filterFields: ["scope", "category"], boolFilters: ["active"], publicFilter: active, sort: { order: 1, createdAt: 1 } }
  },
  {
    path: "blogs", resource: "blogs", publicRead: true,
    opts: {
      model: BlogPost, searchFields: ["title", "excerpt", "category", "author"], filterFields: ["category"], boolFilters: ["featured", "isPublished"],
      publicFilter: () => ({ isPublished: true, publishedAt: { $lte: new Date() } }), publicSelect: "-content",
      sort: { publishedAt: -1 }, slugFrom: "title"
    }
  },
  {
    path: "legal", resource: "legal", publicRead: true,
    opts: { model: LegalDoc, searchFields: ["title"], boolFilters: ["active"], publicFilter: active, publicSelect: "slug title lastUpdated order", sort: { order: 1, createdAt: 1 }, slugFrom: "title" }
  },
  {
    path: "team", resource: "team", publicRead: true,
    opts: { model: TeamMember, searchFields: ["name", "role", "specialization"], filterFields: ["kind"], boolFilters: ["active"], publicFilter: active, sort: { order: 1, createdAt: 1 } }
  },

  // ---- Records created by public forms; admin can only review / update status / delete ----
  {
    path: "enquiries", resource: "enquiries", publicRead: false,
    opts: {
      model: Enquiry, searchFields: ["name", "email", "phone", "course", "companyName"], filterFields: ["type", "status", "course", "branch"],
      updatableFields: ["status", "notes", "assignedTo"], creatable: false
    }
  },
  {
    path: "support", resource: "support", publicRead: false,
    opts: {
      model: SupportTicket, searchFields: ["ticketNumber", "name", "email", "description"], filterFields: ["status", "priority", "category"],
      updatableFields: ["status", "responseNotes", "priority"], creatable: false,
      beforeUpdate: (doc, body) => {
        if (body.status === "Resolved" || body.status === "Closed") doc.resolvedAt = doc.resolvedAt || new Date();
        else if (body.status) doc.resolvedAt = undefined;
      }
    }
  },
  {
    path: "newsletter", resource: "newsletter", publicRead: false,
    opts: { model: NewsletterSubscriber, searchFields: ["email"], boolFilters: ["active"], updatableFields: ["active"], creatable: false }
  }
];
