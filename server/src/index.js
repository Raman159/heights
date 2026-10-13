import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { rows, pool } from "./db.js";
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)
  throw Error("Set JWT_SECRET (32+ characters) in server/.env");
const app = express(),
  port = Number(process.env.PORT || 5000);
app.disable("x-powered-by");
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(express.json({ limit: "50kb" }));
app.use(
  cors({
    origin: (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(","),
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  }),
);
const authRate = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many attempts; try again later" },
});
const here = path.dirname(fileURLToPath(import.meta.url));
const uploads = path.resolve(here, "../uploads");
fs.mkdirSync(uploads, { recursive: true });
app.use(
  "/uploads",
  express.static(uploads, { maxAge: "7d", fallthrough: false }),
);
const allowed = ["offers", "posts", "reviews", "videos", "inquiries"];
const fields = {
  offers: ["title", "description", "image_url", "link_url", "sort_order"],
  posts: ["title", "slug", "excerpt", "body", "image_url", "sort_order"],
  reviews: ["author", "quote", "sort_order"],
  videos: ["title", "video_url", "thumbnail_url", "sort_order"],
};
const needed = {
  offers: ["title"],
  posts: ["title", "slug"],
  reviews: ["author", "quote"],
  videos: [],
};
const clean = (v) => (typeof v === "string" ? v.trim() : v);
function validTable(table) {
  if (!allowed.includes(table))
    throw Object.assign(new Error("Invalid section"), { status: 404 });
}
function admin(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  try {
    const x = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    if (x.role !== "admin") throw Error();
    req.admin = x;
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized or expired token" });
  }
}
function fail(res, e) {
  if (e?.code === "ER_DUP_ENTRY")
    return res
      .status(409)
      .json({ error: "That slug or record already exists" });
  if (e instanceof z.ZodError)
    return res
      .status(400)
      .json({ error: e.issues.map((x) => x.message).join("; ") });
  res
    .status(e.status || 500)
    .json({ error: e.status ? e.message : "Unexpected server error" });
  if (!e.status) console.error(e);
}
const asyncRoute = (fn) => (req, res) =>
  Promise.resolve(fn(req, res)).catch((e) => fail(res, e));
app.post(
  "/api/auth/login",
  authRate,
  asyncRoute(async (req, res) => {
    const p = z
      .object({
        username: z.string().min(1).max(80),
        password: z.string().min(1).max(300),
      })
      .parse(req.body);
    const a = (
      await rows("SELECT * FROM admins WHERE username=?", [p.username])
    )[0];
    if (!a || !(await bcrypt.compare(p.password, a.password_hash)))
      return res.status(401).json({ error: "Incorrect credentials" });
    res.json({
      token: jwt.sign({ id: a.id, role: "admin" }, process.env.JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: "8h",
      }),
    });
  }),
);
app.post(
  "/api/auth/change-password",
  admin,
  asyncRoute(async (req, res) => {
    const p = z
      .object({
        old_password: z.string(),
        new_password: z.string().min(12).max(128),
      })
      .parse(req.body);
    const a = (
      await rows("SELECT * FROM admins WHERE id=?", [req.admin.id])
    )[0];
    if (!a || !(await bcrypt.compare(p.old_password, a.password_hash)))
      return res.status(400).json({ error: "Current password is incorrect" });
    await rows("UPDATE admins SET password_hash=? WHERE id=?", [
      await bcrypt.hash(p.new_password, 12),
      a.id,
    ]);
    res.json({ ok: true });
  }),
);
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
app.post(
  "/api/inquiries",
  rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 10,
    message: { error: "Too many enquiries; please try later" },
  }),
  asyncRoute(async (req, res) => {
    const p = inquirySchema.parse(req.body);
    await rows(
      "INSERT INTO inquiries (type,name,email,phone,service,preferred_date,message) VALUES (?,?,?,?,?,?,?)",
      [
        p.type,
        p.name,
        p.email,
        p.phone,
        p.service,
        p.preferred_date || null,
        p.message,
      ],
    );
    res.status(201).json({ ok: true });
  }),
);
app.get(
  "/api/public/settings",
  asyncRoute(async (req, res) => {
    const r = await rows("SELECT `key`,`value` FROM settings");
    res.json(Object.fromEntries(r.map((x) => [x.key, x.value])));
  }),
);
app.get(
  "/api/public/:table",
  asyncRoute(async (req, res) => {
    let t = req.params.table;
    if (!fields[t]) return res.status(404).json({ error: "Not found" });
    res.json(
      await rows(
        "SELECT * FROM `" + t + "` ORDER BY sort_order ASC,id DESC LIMIT 200",
      ),
    );
  }),
);
app.get(
  "/api/admin/settings",
  admin,
  asyncRoute(async (req, res) => {
    const r = await rows("SELECT `key`,`value` FROM settings");
    res.json(Object.fromEntries(r.map((x) => [x.key, x.value])));
  }),
);
app.put(
  "/api/admin/settings",
  admin,
  asyncRoute(async (req, res) => {
    const names = [
      "hero_video",
      "hero_image",
      "whatsapp_number",
      "contact_email",
      "address",
      "opening_hours",
    ];
    for (const k of names) {
      if (typeof req.body[k] === "string" && req.body[k].length <= 1024)
        await rows(
          "INSERT INTO settings(`key`,`value`) VALUES (?,?) ON DUPLICATE KEY UPDATE `value`=VALUES(`value`)",
          [k, req.body[k].trim()],
        );
    }
    res.json({ ok: true });
  }),
);
app.get(
  "/api/admin/:table",
  admin,
  asyncRoute(async (req, res) => {
    const t = req.params.table;
    validTable(t);
    res.json(
      await rows("SELECT * FROM `" + t + "` ORDER BY id DESC LIMIT 500"),
    );
  }),
);
app.post(
  "/api/admin/:table",
  admin,
  asyncRoute(async (req, res) => {
    const t = req.params.table;
    validTable(t);
    if (!fields[t]) return res.status(405).json({ error: "Not allowed" });
    const keys = fields[t];
    const data = Object.fromEntries(
      keys
        .filter((k) => Object.hasOwn(req.body, k))
        .map((k) => [k, clean(req.body[k])]),
    );
    for (const k of needed[t])
      if (!data[k]) return res.status(400).json({ error: k + " required" });
    for (const [k, v] of Object.entries(data))
      if (
        String(v).length >
        (k === "body"
          ? 50000
          : k === "description" || k === "quote"
            ? 3000
            : 1024)
      )
        return res.status(400).json({ error: "Value too long: " + k });
    if (!Object.keys(data).length)
      return res.status(400).json({ error: "Empty record" });
    const q = Object.keys(data)
      .map(() => "?")
      .join(",");
    const out = await rows(
      "INSERT INTO `" +
        t +
        "` (" +
        Object.keys(data)
          .map((x) => "`" + x + "`")
          .join(",") +
        ") VALUES (" +
        q +
        ")",
      Object.values(data),
    );
    res.status(201).json({ id: out.insertId });
  }),
);
app.put(
  "/api/admin/:table/:id",
  admin,
  asyncRoute(async (req, res) => {
    const t = req.params.table;
    validTable(t);
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id < 1)
      return res.status(400).json({ error: "Invalid id" });
    if (t === "inquiries") {
      if (!["new", "handled"].includes(req.body.status))
        return res.status(400).json({ error: "Invalid status" });
      await rows("UPDATE inquiries SET status=? WHERE id=?", [
        req.body.status,
        id,
      ]);
      return res.json({ ok: true });
    }
    const data = Object.fromEntries(
      fields[t]
        .filter((k) => Object.hasOwn(req.body, k))
        .map((k) => [k, clean(req.body[k])]),
    );
    if (!Object.keys(data).length)
      return res.status(400).json({ error: "No changes" });
    for (const [k, v] of Object.entries(data))
      if (
        String(v).length >
        (k === "body"
          ? 50000
          : k === "description" || k === "quote"
            ? 3000
            : 1024)
      )
        return res.status(400).json({ error: "Value too long: " + k });
    await rows(
      "UPDATE `" +
        t +
        "` SET " +
        Object.keys(data)
          .map((k) => "`" + k + "`=?")
          .join(",") +
        " WHERE id=?",
      [...Object.values(data), id],
    );
    res.json({ ok: true });
  }),
);
app.delete(
  "/api/admin/:table/:id",
  admin,
  asyncRoute(async (req, res) => {
    const t = req.params.table;
    validTable(t);
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id < 1)
      return res.status(400).json({ error: "Invalid id" });
    await rows("DELETE FROM `" + t + "` WHERE id=?", [id]);
    res.json({ ok: true });
  }),
);
const upload = multer({
  storage: multer.diskStorage({
    destination: uploads,
    filename: (req, file, cb) =>
      cb(
        null,
        crypto.randomUUID() +
          ({
            "image/png": ".png",
            "image/jpeg": ".jpg",
            "image/webp": ".webp",
            "video/mp4": ".mp4",
            "video/webm": ".webm",
          }[file.mimetype] || ".bin"),
      ),
  }),
  limits: { fileSize: 80 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    if (
      ![
        "image/png",
        "image/jpeg",
        "image/webp",
        "video/mp4",
        "video/webm",
      ].includes(file.mimetype)
    )
      return cb(new Error("Unsupported media type"));
    cb(null, true);
  },
});
app.post("/api/admin/upload", admin, (req, res) =>
  upload.single("file")(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: "No file received" });
    res.json({ url: "/uploads/" + req.file.filename });
  }),
);
app.get(
  "/api/health",
  asyncRoute(async (req, res) => {
    await rows("SELECT 1");
    res.json({ ok: true });
  }),
);
app.use((req, res) => res.status(404).json({ error: "Not found" }));
app.listen(port, () => console.log("HEIGHT API on port " + port));
