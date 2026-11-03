import { Router } from "express";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { pool, rows } from "../db.js";
import admin from "../middleware/admin.js";
import asyncRoute from "../middleware/asyncRoute.js";

const router = Router();
const REFRESH_COOKIE = "height_refresh";
const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60 * 1000;
const authRate = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many attempts; try again later" },
});

function refreshCookieOptions() {
  const production = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: production,
    sameSite: production ? "none" : "lax",
    path: "/api/auth",
    maxAge: REFRESH_TOKEN_TTL,
  };
}

function setRefreshCookie(res, token) {
  res.cookie(REFRESH_COOKIE, token, refreshCookieOptions());
}

function clearRefreshCookie(res) {
  const { maxAge, ...options } = refreshCookieOptions();
  res.clearCookie(REFRESH_COOKIE, options);
}

function createRefreshToken() {
  return crypto.randomBytes(32).toString("base64url");
}

function hashRefreshToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function createAccessToken(adminId) {
  return jwt.sign(
    { id: adminId, role: "admin", token_use: "access" },
    process.env.JWT_SECRET,
    { algorithm: "HS256", expiresIn: "8h" },
  );
}

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

    const refreshToken = createRefreshToken();
    await rows("DELETE FROM admin_refresh_tokens WHERE expires_at <= CURRENT_TIMESTAMP");
    await rows(
      "INSERT INTO admin_refresh_tokens(token_hash, admin_id, expires_at) VALUES (?, ?, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 7 DAY))",
      [hashRefreshToken(refreshToken), account.id],
    );
    setRefreshCookie(res, refreshToken);
    res.json({
      token: createAccessToken(account.id),
    });
  }),
);

router.post(
  "/refresh",
  asyncRoute(async (req, res) => {
    const oldToken = req.cookies?.[REFRESH_COOKIE];
    if (!oldToken) {
      clearRefreshCookie(res);
      return res.status(401).json({
        error: "Refresh session expired. Please sign in again.",
        code: "REFRESH_TOKEN_INVALID",
      });
    }

    const connection = await pool.getConnection();
    const nextToken = createRefreshToken();
    try {
      await connection.beginTransaction();
      const [sessions] = await connection.execute(
        "SELECT rt.admin_id FROM admin_refresh_tokens AS rt JOIN admins AS a ON a.id = rt.admin_id WHERE rt.token_hash = ? AND rt.expires_at > CURRENT_TIMESTAMP FOR UPDATE",
        [hashRefreshToken(oldToken)],
      );
      if (!sessions.length) {
        await connection.rollback();
        clearRefreshCookie(res);
        return res.status(401).json({
          error: "Refresh session expired. Please sign in again.",
          code: "REFRESH_TOKEN_INVALID",
        });
      }

      const adminId = sessions[0].admin_id;
      await connection.execute(
        "DELETE FROM admin_refresh_tokens WHERE token_hash = ?",
        [hashRefreshToken(oldToken)],
      );
      await connection.execute(
        "INSERT INTO admin_refresh_tokens(token_hash, admin_id, expires_at) VALUES (?, ?, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 7 DAY))",
        [hashRefreshToken(nextToken), adminId],
      );
      await connection.commit();
      setRefreshCookie(res, nextToken);
      res.json({ token: createAccessToken(adminId) });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }),
);

router.post(
  "/logout",
  asyncRoute(async (req, res) => {
    const refreshToken = req.cookies?.[REFRESH_COOKIE];
    if (refreshToken)
      await rows("DELETE FROM admin_refresh_tokens WHERE token_hash=?", [
        hashRefreshToken(refreshToken),
      ]);
    clearRefreshCookie(res);
    res.json({ ok: true });
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
    await rows("DELETE FROM admin_refresh_tokens WHERE admin_id=?", [
      account.id,
    ]);
    res.json({ ok: true });
  }),
);

export default router;
