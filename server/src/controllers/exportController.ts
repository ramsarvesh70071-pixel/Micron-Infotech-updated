import type { Request, Response } from "express";
import { Enquiry } from "../models/Enquiry.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { csvCell } from "../utils/csv.js";

/** GET /api/admin/enquiries/export/csv */
export const exportEnquiriesCsv = asyncHandler(async (_req: Request, res: Response) => {
  const headers = ["ID", "Name", "Email", "Phone", "Course", "Mode", "Branch", "Type", "Status", "Company", "Team Size", "Comments", "Notes", "Created At"];
  const lines = [headers.map(csvCell).join(",")];
  const cursor = Enquiry.find().sort({ createdAt: -1 }).lean().cursor();
  for await (const e of cursor) {
    lines.push(
      [e._id, e.name, e.email, e.phone, e.course, e.mode, e.branch, e.type, e.status, e.companyName, e.teamSize, e.comments, e.notes, (e as any).createdAt]
        .map(csvCell)
        .join(",")
    );
  }
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="micron-enquiries-${new Date().toISOString().slice(0, 10)}.csv"`);
  res.status(200).send("\uFEFF" + lines.join("\r\n")); // BOM so Excel opens UTF-8 (₹, Hindi) correctly
});
