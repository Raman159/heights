import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { rows } from "../db.js";
import asyncRoute from "../middleware/asyncRoute.js";

const router = Router();
const inquirySchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    email: z.string().email().max(190),
    phone: z.string().regex(/^[+0-9 ()-]{7,20}$/),
    service: z.string().max(120).optional().default(""),
    preferred_date: z
      .union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/)])
      .optional()
      .default(""),
    message: z.string().trim().min(5).max(2000),
    type: z.enum(["service", "offer", "event", "contact"]).default("service"),
  })
  .strict();

router.post(
  "/",
  rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 10,
    message: { error: "Too many enquiries; please try later" },
  }),
  asyncRoute(async (req, res) => {
    const inquiry = inquirySchema.parse(req.body);
    await rows(
      "INSERT INTO inquiries (type,name,email,phone,service,preferred_date,message) VALUES (?,?,?,?,?,?,?)",
      [
        inquiry.type,
        inquiry.name,
        inquiry.email,
        inquiry.phone,
        inquiry.service,
        inquiry.preferred_date || null,
        inquiry.message,
      ],
    );
    res.status(201).json({ ok: true });
  }),
);

export default router;
