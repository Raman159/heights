import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { clientOrigins, uploads } from "./config.js";
import authRoutes from "./routes/auth.js";
import inquiryRoutes from "./routes/inquiries.js";
import publicRoutes from "./routes/public.js";
import adminRoutes from "./routes/admin.js";
import healthRoutes from "./routes/health.js";

const app = express();

app.disable("x-powered-by");
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(express.json({ limit: "50kb" }));
app.use(
  cors({
    origin: clientOrigins,
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
app.use(
  "/uploads",
  express.static(uploads, { maxAge: "7d", fallthrough: false }),
);

app.use("/api/auth", authRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/health", healthRoutes);
app.use((req, res) => res.status(404).json({ error: "Not found" }));

export default app;
