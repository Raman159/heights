import { Router } from "express";
import { rows } from "../db.js";
import asyncRoute from "../middleware/asyncRoute.js";
import { orderedTables, tableFields } from "../config.js";

const router = Router();

router.get(
  "/events/:slug",
  asyncRoute(async (req, res) => {
    const [event] = await rows(
      "SELECT * FROM events WHERE slug=? LIMIT 1",
      [req.params.slug],
    );
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  }),
);

router.get(
  "/spa",
  asyncRoute(async (req, res) => {
    const [settings, categories, treatments] = await Promise.all([
      rows(
        "SELECT `key`,`value` FROM settings WHERE `key` IN ('spa_title','spa_tagline','spa_intro_heading','spa_intro','spa_hero_image','spa_intro_image')",
      ),
      rows("SELECT id,name,description FROM spa_categories ORDER BY sort_order ASC,id ASC"),
      rows(
        "SELECT t.id,t.category_id,c.name AS category,t.title,t.slug,t.description,t.benefits,t.pricing,t.image_url FROM spa_treatments t JOIN spa_categories c ON c.id=t.category_id ORDER BY c.sort_order ASC,c.id ASC,t.sort_order ASC,t.id ASC",
      ),
    ]);
    res.json({
      page: Object.fromEntries(settings.map(({ key, value }) => [key, value])),
      categories,
      treatments,
    });
  }),
);

router.get(
  "/spa/:slug",
  asyncRoute(async (req, res) => {
    const [treatment] = await rows(
      "SELECT t.id,t.category_id,c.name AS category,t.title,t.slug,t.description,t.benefits,t.pricing,t.image_url FROM spa_treatments t JOIN spa_categories c ON c.id=t.category_id WHERE t.slug=? LIMIT 1",
      [req.params.slug],
    );
    if (!treatment) return res.status(404).json({ error: "Treatment not found" });
    res.json(treatment);
  }),
);

router.get(
  "/services/:slug",
  asyncRoute(async (req, res) => {
    const [service] = await rows(
      "SELECT id,title,slug,subtitle,description,image_url FROM services WHERE slug=? LIMIT 1",
      [req.params.slug],
    );
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json(service);
  }),
);

router.get(
  "/settings",
  asyncRoute(async (req, res) => {
    const settings = await rows("SELECT `key`,`value` FROM settings");
    res.json(Object.fromEntries(settings.map((setting) => [setting.key, setting.value])));
  }),
);

router.get(
  "/:table",
  asyncRoute(async (req, res) => {
    const table = req.params.table;
    if (!tableFields[table])
      return res.status(404).json({ error: "Not found" });
    res.json(
      await rows(
        orderedTables.includes(table)
          ? "SELECT * FROM `" + table + "` ORDER BY sort_order ASC, id DESC LIMIT 200"
          : "SELECT * FROM `" + table + "` ORDER BY id DESC LIMIT 200",
      ),
    );
  }),
);

export default router;
