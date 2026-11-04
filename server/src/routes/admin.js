import { Router } from "express";
import multer from "multer";
import admin from "../middleware/admin.js";
import asyncRoute from "../middleware/asyncRoute.js";
import { uploadMiddleware } from "../middleware/upload.js";
import { pool, rows } from "../db.js";
import {
  clean,
  galleryCategories,
  orderedTables,
  requiredFields,
  settingFields,
  tableFields,
  validateTable,
} from "../config.js";

const router = Router();
router.use(admin);

router.post("/upload", (req, res) =>
  uploadMiddleware.single("file")(req, res, (error) => {
    if (error) {
      if (error instanceof multer.MulterError) {
        const status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
        return res.status(status).json({ error: error.message });
      }
      if (error.status === 415)
        return res.status(415).json({ error: error.message });
      console.error("[admin/upload] Upload failed:", error);
      return res.status(500).json({ error: "Upload failed" });
    }
    if (!req.file) return res.status(400).json({ error: "No file received" });
    res.json({ url: "/uploads/" + req.file.filename });
  }),
);

router.get(
  "/settings",
  asyncRoute(async (req, res) => {
    const settings = await rows("SELECT `key`,`value` FROM settings");
    res.json(Object.fromEntries(settings.map((setting) => [setting.key, setting.value])));
  }),
);

router.put(
  "/settings",
  asyncRoute(async (req, res) => {
    for (const key of settingFields) {
      if (typeof req.body[key] === "string" && req.body[key].length <= 1024) {
        if (key === "hero_image" && !req.body[key].trim()) {
          await rows("DELETE FROM settings WHERE `key`=?", [key]);
          continue;
        }
        await rows(
          "INSERT INTO settings(`key`,`value`) VALUES (?,?) ON DUPLICATE KEY UPDATE `value`=VALUES(`value`)",
          [key, req.body[key].trim()],
        );
      }
    }
    res.json({ ok: true });
  }),
);

router.get(
  "/:table",
  asyncRoute(async (req, res) => {
    const table = req.params.table;
    validateTable(table);
    res.json(
      await rows(
        orderedTables.includes(table)
          ? "SELECT * FROM `" + table + "` ORDER BY sort_order ASC, id DESC LIMIT 500"
          : "SELECT * FROM `" + table + "` ORDER BY id DESC LIMIT 500",
      ),
    );
  }),
);

router.post(
  "/:table",
  asyncRoute(async (req, res) => {
    const table = req.params.table;
    validateTable(table);
    if (!tableFields[table])
      return res.status(405).json({ error: "Not allowed" });
    const data = Object.fromEntries(
      tableFields[table]
        .filter((key) => Object.hasOwn(req.body, key))
        .map((key) => [key, clean(req.body[key])]),
    );
    validateGalleryCategory(table, data);
    for (const key of requiredFields[table])
      if (!data[key])
        return res.status(400).json({ error: key + " required" });
    validateLengths(data);
    if (!Object.keys(data).length)
      return res.status(400).json({ error: "Empty record" });
    const columns = Object.keys(data);
    const placeholders = columns.map(() => "?").join(",");
    const result = await rows(
      "INSERT INTO `" +
        table +
        "` (" +
        columns.map((key) => "`" + key + "`").join(",") +
        ") VALUES (" +
        placeholders +
        ")",
      Object.values(data),
    );
    res.status(201).json({ id: result.insertId });
  }),
);

router.put(
  "/:table/:id/order",
  asyncRoute(async (req, res) => {
    const table = req.params.table;
    validateTable(table);
    if (!orderedTables.includes(table))
      return res.status(400).json({ error: "This section cannot be reordered" });

    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id < 1)
      return res.status(400).json({ error: "Invalid id" });
    const targetId = Number(req.body.targetId);
    if (!Number.isSafeInteger(targetId) || targetId < 1)
      return res.status(400).json({ error: "A valid targetId is required" });
    if (!["before", "after"].includes(req.body.position))
      return res.status(400).json({ error: "Position must be before or after" });

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const [records] = await connection.execute(
        "SELECT id FROM `" + table + "` ORDER BY sort_order ASC, id DESC FOR UPDATE",
      );
      const index = records.findIndex((record) => Number(record.id) === id);
      let targetIndex = records.findIndex(
        (record) => Number(record.id) === targetId,
      );
      if (index === -1 || targetIndex === -1) {
        await connection.rollback();
        return res.status(404).json({ error: "Record not found" });
      }
      if (index === targetIndex) {
        await connection.rollback();
        return res.json({ ok: true });
      }

      const [record] = records.splice(index, 1);
      if (index < targetIndex) targetIndex -= 1;
      records.splice(
        targetIndex + (req.body.position === "after" ? 1 : 0),
        0,
        record,
      );
      for (const [position, record] of records.entries()) {
        await connection.execute(
          "UPDATE `" + table + "` SET sort_order=? WHERE id=?",
          [position, record.id],
        );
      }
      await connection.commit();
      res.json({ ok: true });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }),
);

router.put(
  "/:table/:id",
  asyncRoute(async (req, res) => {
    const table = req.params.table;
    validateTable(table);
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id < 1)
      return res.status(400).json({ error: "Invalid id" });
    if (table === "inquiries") {
      if (!["new", "handled"].includes(req.body.status))
        return res.status(400).json({ error: "Invalid status" });
      await rows("UPDATE inquiries SET status=? WHERE id=?", [
        req.body.status,
        id,
      ]);
      return res.json({ ok: true });
    }
    const data = Object.fromEntries(
      tableFields[table]
        .filter((key) => Object.hasOwn(req.body, key))
        .map((key) => [key, clean(req.body[key])]),
    );
    validateGalleryCategory(table, data);
    if (!Object.keys(data).length)
      return res.status(400).json({ error: "No changes" });
    validateLengths(data);
    await rows(
      "UPDATE `" +
        table +
        "` SET " +
        Object.keys(data)
          .map((key) => "`" + key + "`=?")
          .join(",") +
        " WHERE id=?",
      [...Object.values(data), id],
    );
    res.json({ ok: true });
  }),
);

router.delete(
  "/:table/:id",
  asyncRoute(async (req, res) => {
    const table = req.params.table;
    validateTable(table);
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id < 1)
      return res.status(400).json({ error: "Invalid id" });
    await rows("DELETE FROM `" + table + "` WHERE id=?", [id]);
    res.json({ ok: true });
  }),
);

function validateLengths(data) {
  for (const [key, value] of Object.entries(data)) {
    const maxLength = {
      body: 50000,
      description: 3000,
      quote: 3000,
      biography: 3000,
      full_name: 200,
      department: 160,
      designation: 200,
      email: 254,
    }[key] || 1024;
    if (String(value).length > maxLength)
      throw Object.assign(new Error("Value too long: " + key), { status: 400 });
  }
}

function validateGalleryCategory(table, data) {
  if (table !== "gallery") return;
  if (
    data.category !== undefined &&
    !galleryCategories.includes(data.category)
  )
    throw Object.assign(new Error("Invalid gallery category"), { status: 400 });
}

export default router;
