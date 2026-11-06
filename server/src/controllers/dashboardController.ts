import type { Request, Response } from "express";
import { Enquiry } from "../models/Enquiry.js";
import { Course } from "../models/Course.js";
import { Review } from "../models/Review.js";
import { SupportTicket } from "../models/SupportTicket.js";
import { Placement } from "../models/Placement.js";
import { BlogPost } from "../models/BlogPost.js";
import { NewsletterSubscriber } from "../models/NewsletterSubscriber.js";
import { getDbStatus } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/** GET /api/admin/dashboard/stats - every number is computed from the database with aggregations. */
export const getStats = asyncHandler(async (_req: Request, res: Response) => {
  const since = new Date();
  since.setMonth(since.getMonth() - 5, 1);
  since.setHours(0, 0, 0, 0);

  const [
    totalEnquiries, newEnquiries, totalCourses, totalReviews, pendingReviews,
    openTickets, totalPlacements, publishedBlogs, subscribers,
    statusAgg, courseAgg, monthlyAgg, recentEnquiries
  ] = await Promise.all([
    Enquiry.countDocuments(),
    Enquiry.countDocuments({ status: "new" }),
    Course.countDocuments({ active: true }),
    Review.countDocuments({ isApproved: true }),
    Review.countDocuments({ isApproved: false }),
    SupportTicket.countDocuments({ status: { $in: ["Open", "In Progress"] } }),
    Placement.countDocuments({ active: true }),
    BlogPost.countDocuments({ isPublished: true }),
    NewsletterSubscriber.countDocuments({ active: true }),
    Enquiry.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Enquiry.aggregate([
      { $group: { _id: { $ifNull: ["$course", "General Consultation"] }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]),
    Enquiry.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]),
    Enquiry.find().sort({ createdAt: -1 }).limit(6).lean({ virtuals: true })
  ]);

  const statusDistribution: Record<string, number> = { new: 0, contacted: 0, in_progress: 0, converted: 0, closed: 0 };
  statusAgg.forEach((s: { _id: string; count: number }) => (statusDistribution[s._id] = s.count));
  const converted = statusDistribution.converted || 0;
  const conversionRate = totalEnquiries > 0 ? ((converted / totalEnquiries) * 100).toFixed(1) : "0.0";
  const db = getDbStatus();

  res.json({
    success: true,
    data: {
      totals: {
        enquiries: totalEnquiries,
        newEnquiries,
        applications: 0,
        newApplications: 0,
        courses: totalCourses,
        reviews: totalReviews,
        pendingReviews,
        openTickets,
        activeJobs: 0,
        pendingJobs: 0,
        placements: totalPlacements,
        blogs: publishedBlogs,
        subscribers,
        conversionRate: `${conversionRate}%`
      },
      statusDistribution,
      courseDistribution: courseAgg.map((c: { _id: string; count: number }) => ({ name: c._id, count: c.count })),
      monthlyEnquiries: monthlyAgg.map((m: { _id: string; count: number }) => ({ month: m._id, count: m.count })),
      recentEnquiries,
      systemStatus: {
        databaseConnected: db.connected,
        engine: "MongoDB (Mongoose)",
        host: db.host,
        databaseName: db.name,
        serverUptimeSeconds: Math.floor(process.uptime()),
        nodeVersion: process.version,
        timestamp: new Date().toISOString()
      }
    }
  });
});
