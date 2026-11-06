import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

const skip = () => env.isTest;
const json = (message: string) => ({ success: false, message });

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 3000, // generous: many students can share one campus / office IP. Login & form limiters below are strict.
  standardHeaders: true,
  legacyHeaders: false,
  skip,
  message: json("Too many requests from this IP, please try again later.")
});

/** Brute-force protection: only FAILED logins count. */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  skip,
  message: json("Too many failed login attempts. Please try again after 15 minutes.")
});

/** Public forms (enquiry, support, newsletter, reviews): anti-spam. */
export const submissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  skip,
  message: json("Too many submissions from this IP. Please try again later.")
});

/** Ticket lookup: makes guessing ticket numbers impractical. */
export const trackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
  skip,
  message: json("Too many lookups. Please try again later.")
});
