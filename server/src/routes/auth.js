import { Router } from "express";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { rows } from "../db.js";
import admin from "../middleware/admin.js";
import asyncRoute from "../middleware/asyncRoute.js";

const router = Router();
const authRate = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many attempts; try again later" },
});

router.post(
  "/login",
  authRate,
  asyncRoute(async (req, res) => {
    const credentials = z
      .object({
        username: z.string().min(1).max(80),
        password: z.string().min(1).max(300),
      })
      .parse(req.body);
    const account = (
      await rows("SELECT * FROM admins WHERE username=?", [
        credentials.username,
      ])
    )[0];
    if (
      !account ||
      !(await bcrypt.compare(credentials.password, account.password_hash))
    )
      return res.status(401).json({ error: "Incorrect credentials" });
    res.json({
      token: jwt.sign(
        { id: account.id, role: "admin" },
        process.env.JWT_SECRET,
        { algorithm: "HS256", expiresIn: "8h" },
      ),
    });
  }),
);

router.post(
  "/change-password",
  admin,
  asyncRoute(async (req, res) => {
    const passwordChange = z
      .object({
        old_password: z.string(),
        new_password: z.string().min(12).max(128),
      })
      .parse(req.body);
    const account = (
      await rows("SELECT * FROM admins WHERE id=?", [req.admin.id])
    )[0];
    if (
      !account ||
      !(await bcrypt.compare(
        passwordChange.old_password,
        account.password_hash,
      ))
    )
      return res.status(400).json({ error: "Current password is incorrect" });
    await rows("UPDATE admins SET password_hash=? WHERE id=?", [
      await bcrypt.hash(passwordChange.new_password, 12),
      account.id,
    ]);
    res.json({ ok: true });
  }),
);

export default router;
