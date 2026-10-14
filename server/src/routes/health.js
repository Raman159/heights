import { Router } from "express";
import { rows } from "../db.js";
import asyncRoute from "../middleware/asyncRoute.js";

const router = Router();

router.get(
  "/",
  asyncRoute(async (req, res) => {
    await rows("SELECT 1");
    res.json({ ok: true });
  }),
);

export default router;
