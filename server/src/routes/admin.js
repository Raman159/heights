import { Router } from "express";
import admin from "../middleware/admin.js";
import asyncRoute from "../middleware/asyncRoute.js";
import { uploadMiddleware } from "../middleware/upload.js";
import { rows } from "../db.js";
import {
  clean,
  requiredFields,
  settingFields,
  tableFields,
  validateTable,
} from "../config.js";

const router = Router();
router.use(admin);

router.post("/upload", (req, res) =>
  uploadMiddleware.single("file")(req, res, (error) => {
    if (error) return res.status(400).json({ error: error.message });
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
      if (typeof req.body[key] === "string" && req.body[key].length <= 1024)
        await rows(
          "INSERT INTO settings(`key`,`value`) VALUES (?,?) ON DUPLICATE KEY UPDATE `value`=VALUES(`value`)",
          [key, req.body[key].trim()],
        );
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
      await rows("SELECT * FROM `" + table + "` ORDER BY id DESC LIMIT 500"),
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
    const maxLength =
      key === "body"
        ? 50000
        : key === "description" || key === "quote"
          ? 3000
          : 1024;
    if (String(value).length > maxLength)
      throw Object.assign(new Error("Value too long: " + key), { status: 400 });
  }
}

export default router;
