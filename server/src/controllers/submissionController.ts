import type { Request, Response } from "express";
import { Enquiry } from "../models/Enquiry.js";
import { SupportTicket } from "../models/SupportTicket.js";
import { Review } from "../models/Review.js";
import { NewsletterSubscriber } from "../models/NewsletterSubscriber.js";
import { asyncHandler, HttpError } from "../utils/asyncHandler.js";
import { generateTicketNumber } from "../utils/ticket.js";

const pick = (body: Record<string, unknown>, fields: string[]) => {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    const v = body?.[f];
    if (v !== undefined && v !== null && typeof v !== "object") out[f] = typeof v === "string" ? v.trim() : v;
  }
  return out;
};

/** POST /api/enquiries - student enrolment, contact page and corporate RFP leads. */
export const createEnquiry = asyncHandler(async (req: Request, res: Response) => {
  const data = pick(req.body, ["name", "email", "phone", "course", "mode", "branch", "comments", "type", "companyName", "teamSize"]);
  const enquiry = await Enquiry.create({ ...data, status: "new" });
  res.status(201).json({ success: true, message: "Thank you! Our counsellor will contact you shortly.", data: { id: enquiry.id } });
});

/** POST /api/support - student helpdesk ticket. */
export const createTicket = asyncHandler(async (req: Request, res: Response) => {
  const data = pick(req.body, ["name", "email", "phone", "studentId", "category", "priority", "description"]);
  let ticket;
  for (let attempt = 0; attempt < 5 && !ticket; attempt++) {
    try {
      // eslint-disable-next-line no-await-in-loop
      ticket = await SupportTicket.create({ ...data, ticketNumber: generateTicketNumber(), status: "Open" });
    } catch (e: any) {
      if (e?.code !== 11000) throw e; // ticket number collision -> retry
    }
  }
  if (!ticket) throw new HttpError(500, "Could not generate a ticket number. Please retry.");
  res.status(201).json({ success: true, message: "Support ticket created.", ticketNumber: ticket.ticketNumber });
});

/** POST /api/support/track - requires BOTH ticket number and the email used at creation. */
export const trackTicket = asyncHandler(async (req: Request, res: Response) => {
  const ticketNumber = String(req.body?.ticketNumber || "").trim().toUpperCase();
  const email = String(req.body?.email || "").trim().toLowerCase();
  if (!ticketNumber || !email) throw new HttpError(400, "Ticket number and email are required.");
  const ticket = await SupportTicket.findOne({ ticketNumber, email });
  if (!ticket) throw new HttpError(404, "No ticket found for that ticket number and email.");
  res.json({
    success: true,
    data: {
      ticketNumber: ticket.ticketNumber,
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status,
      responseNotes: ticket.responseNotes,
      createdAt: ticket.get("createdAt"),
      updatedAt: ticket.get("updatedAt")
    }
  });
});

/** POST /api/reviews - student testimonial. Always created UNAPPROVED; an admin must approve it. */
export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const data = pick(req.body, ["name", "role", "company", "rating", "reviewText", "course", "hike", "packageLpa"]);
  const review = await Review.create({ ...data, kind: "written", isApproved: false, isFeatured: false });
  res.status(201).json({ success: true, message: "Thank you! Your review will appear after moderation.", data: { id: review.id } });
});

/** POST /api/newsletter - idempotent: never reveals whether an address is already subscribed. */
export const subscribeNewsletter = asyncHandler(async (req: Request, res: Response) => {
  const email = String(req.body.email).toLowerCase();
  await NewsletterSubscriber.updateOne({ email }, { $setOnInsert: { email, source: "footer" }, $set: { active: true } }, { upsert: true });
  res.status(201).json({ success: true, message: "Subscribed successfully." });
});
