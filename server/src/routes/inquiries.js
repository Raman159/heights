import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { rows } from "../db.js";
import asyncRoute from "../middleware/asyncRoute.js";

const router = Router();
export const inquirySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2)
      .max(120)
      .regex(/^[\p{L}\p{M}][\p{L}\p{M} .'\u2019-]*$/u, "Enter a valid name"),
    email: z.string().trim().email().max(190),
    phone: z.string().regex(/^\d{10}$/, "Phone must contain exactly 10 digits"),
    number_of_people: z.coerce
      .number()
      .int()
      .min(1)
      .max(4294967295)
      .default(1),
    service: z.string().trim().max(120).optional().default(""),
    preferred_date: z
      .union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/)])
      .optional()
      .default("")
      .refine((value) => {
        if (!value) return true;
        const [year, month, day] = value.split("-").map(Number);
        const date = new Date(Date.UTC(year, month - 1, day));
        return (
          date.getUTCFullYear() === year &&
          date.getUTCMonth() === month - 1 &&
          date.getUTCDate() === day
        );
      }, "Enter a valid preferred date")
      .refine(
        (value) => !value || value >= new Date().toISOString().slice(0, 10),
        "Preferred date cannot be in the past",
      ),
    message: z.string().trim().min(10).max(2000),
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
      "INSERT INTO inquiries (type,name,email,phone,number_of_people,service,preferred_date,message) VALUES (?,?,?,?,?,?,?,?)",
      [
        inquiry.type,
        inquiry.name,
        inquiry.email,
        inquiry.phone,
        inquiry.number_of_people,
        inquiry.service,
        inquiry.preferred_date || null,
        inquiry.message,
      ],
    );
    res.status(201).json({ ok: true });
  }),
);

export default router;
