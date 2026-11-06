import { Router, Request, Response } from "express";
import { resources } from "./resources.js";
import { adminHandlers, publicHandlers } from "../controllers/crud.js";
import { requireAuth, requireAccess } from "../middleware/auth.js";
import { loginLimiter, submissionLimiter, trackLimiter } from "../middleware/rateLimits.js";
import { uploadSingleImage } from "../middleware/upload.js";
import {
  strongPassword, validateEnquiry, validateLogin,
  validateNewsletter, validateReviewSubmission, validateSupportTicket, handleValidationErrors
} from "../middleware/validation.js";
import * as auth from "../controllers/authController.js";
import * as users from "../controllers/userController.js";
import * as submit from "../controllers/submissionController.js";
import * as settings from "../controllers/settingsController.js";
import { getStats } from "../controllers/dashboardController.js";
import { exportEnquiriesCsv } from "../controllers/exportController.js";
import { body } from "express-validator";

export const buildRouter = (): Router => {
  const api = Router();

  // ---------------- Auth ----------------
  api.post("/auth/login", loginLimiter, validateLogin, auth.login);
  api.post("/auth/logout", auth.logout);
  api.get("/auth/me", requireAuth, auth.me);
  api.put("/auth/profile", requireAuth, [strongPassword("newPassword", true), handleValidationErrors], auth.updateProfile);

  // ---------------- Public: content (read only) ----------------
  api.get("/settings", settings.getPublicSettings);
  for (const r of resources.filter((x) => x.publicRead)) {
    const h = publicHandlers(r.opts);
    api.get(`/${r.path}`, h.list);
    api.get(`/${r.path}/:key`, h.get);
  }

  // ---------------- Public: form submissions ----------------
  api.post("/enquiries", submissionLimiter, validateEnquiry, submit.createEnquiry);
  api.post("/support", submissionLimiter, validateSupportTicket, submit.createTicket);
  api.post("/support/track", trackLimiter, submit.trackTicket);
  api.post("/reviews", submissionLimiter, validateReviewSubmission, submit.createReview);
  api.post("/newsletter", submissionLimiter, validateNewsletter, submit.subscribeNewsletter);

  // ---------------- Admin (cookie / bearer auth + RBAC) ----------------
  const admin = Router();
  admin.use(requireAuth);

  // Multer Image Upload
  admin.post("/upload", (req: Request, res: Response) => {
    uploadSingleImage(req, res, (err: any) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message || "Failed to upload file." });
      }
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No image file provided." });
      }
      return res.status(201).json({
        success: true,
        message: "Image uploaded successfully",
        url: `/uploads/${req.file.filename}`,
        filename: req.file.filename
      });
    });
  });

  admin.get("/dashboard/stats", requireAccess("dashboard", "read"), getStats);
  admin.put("/settings", requireAccess("settings", "write"), settings.updateSettings);
  admin.get("/settings", requireAccess("settings", "read"), settings.getPublicSettings);
  admin.get("/enquiries/export/csv", requireAccess("enquiries", "read"), exportEnquiriesCsv);

  admin.get("/users", requireAccess("users", "read"), users.listUsers);
  admin.post(
    "/users",
    requireAccess("users", "write"),
    [
      body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 100 }),
      body("email").trim().isEmail().withMessage("A valid email is required").toLowerCase(),
      strongPassword("password"),
      handleValidationErrors
    ],
    users.createUser
  );
  admin.put("/users/:id", requireAccess("users", "write"), [strongPassword("password", true), handleValidationErrors], users.updateUser);
  admin.delete("/users/:id", requireAccess("users", "delete"), users.deleteUser);

  for (const r of resources) {
    const h = adminHandlers(r.opts);
    admin.get(`/${r.path}`, requireAccess(r.resource, "read"), h.list);
    admin.get(`/${r.path}/:id`, requireAccess(r.resource, "read"), h.get);
    if (r.opts.creatable !== false) admin.post(`/${r.path}`, requireAccess(r.resource, "write"), h.create);
    admin.put(`/${r.path}/:id`, requireAccess(r.resource, "write"), h.update);
    admin.patch(`/${r.path}/:id`, requireAccess(r.resource, "write"), h.update);
    admin.delete(`/${r.path}/:id`, requireAccess(r.resource, "delete"), h.remove);
  }

  api.use("/admin", admin);
  return api;
};
