import { Router } from "express";
import { rows } from "../db.js";
import asyncRoute from "../middleware/asyncRoute.js";
import { tableFields } from "../config.js";

const router = Router();

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
        "SELECT * FROM `" + table + "` ORDER BY sort_order ASC,id DESC LIMIT 200",
      ),
    );
  }),
);

export default router;
