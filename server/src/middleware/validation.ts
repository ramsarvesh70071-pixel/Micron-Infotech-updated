import type { Request, Response, NextFunction } from "express";
import { validationResult, body } from "express-validator";

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: errors.array()[0]?.msg || "Validation failed",
      errors: errors.array().map((err: any) => ({ field: err.path || err.param, message: err.msg }))
    });
    return;
  }
  next();
};

/** Honeypot: bots fill hidden fields. Pretend success, store nothing. */
export const honeypot = (req: Request, res: Response, next: NextFunction): void => {
  const trap = (req.body && (req.body.website ?? req.body._hp)) as unknown;
  if (typeof trap === "string" && trap.trim() !== "") {
    res.status(201).json({ success: true, message: "Submitted successfully." });
    return;
  }
  next();
};

const email = (field = "email") =>
  body(field).trim().isEmail().withMessage("A valid email address is required").isLength({ max: 254 }).toLowerCase();
const phone = (required = true) => {
  const c = body("phone").trim();
  return (required ? c.notEmpty().withMessage("Phone number is required") : c.optional({ values: "falsy" }))
    .matches(/^[+0-9()\s-]{8,20}$/)
    .withMessage("Enter a valid phone number (8-20 digits)");
};
const name = (field: string, label: string) =>
  body(field).trim().notEmpty().withMessage(`${label} is required`).isLength({ min: 2, max: 120 }).withMessage(`${label} must be 2-120 characters`);
const text = (field: string, max = 4000) => body(field).optional({ values: "null" }).isString().isLength({ max }).withMessage(`${field} is too long`);

export const validateEnquiry = [
  honeypot,
  name("name", "Full name"),
  email(),
  phone(),
  body("type").optional().isIn(["enrollment", "general", "corporate"]).withMessage("Invalid enquiry type"),
  text("comments"),
  handleValidationErrors
];

export const validateSupportTicket = [
  honeypot,
  name("name", "Student name"),
  email(),
  phone(false),
  body("description").trim().notEmpty().withMessage("Issue description is required").isLength({ min: 10, max: 6000 }).withMessage("Please describe your issue in at least 10 characters"),
  body("priority").optional().isIn(["Low", "Normal", "High", "Urgent"]).withMessage("Invalid priority"),
  handleValidationErrors
];

export const validateReviewSubmission = [
  honeypot,
  name("name", "Name"),
  body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5").toInt(),
  body("reviewText").trim().isLength({ min: 10, max: 2000 }).withMessage("Review must be 10-2000 characters"),
  handleValidationErrors
];

export const validateNewsletter = [honeypot, email(), handleValidationErrors];

export const validateLogin = [
  body("email").trim().isEmail().withMessage("Enter a valid email address").toLowerCase(),
  body("password").isString().notEmpty().withMessage("Password is required"),
  handleValidationErrors
];

/** Password policy for admin accounts. */
export const strongPassword = (field: string, optional = false) => {
  const c = body(field);
  const chain = optional ? c.optional({ values: "falsy" }) : c;
  return chain
    .isString()
    .isLength({ min: 10, max: 128 })
    .withMessage("Password must be 10-128 characters")
    .matches(/[a-z]/)
    .withMessage("Password needs a lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password needs an uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password needs a number");
};
