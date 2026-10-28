import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)
  throw Error("Set JWT_SECRET (32+ characters) in server/.env");

export const port = Number(process.env.PORT || 5000);
export const clientOrigins = (
  process.env.CLIENT_ORIGINS ||
  process.env.CLIENT_ORIGIN ||
  "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
export const uploads = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../uploads",
);

export const allowedTables = [
  "offers",
  "posts",
  "reviews",
  "videos",
  "inquiries",
];

export const tableFields = {
  offers: ["title", "description", "image_url", "link_url", "sort_order"],
  posts: ["title", "slug", "excerpt", "body", "image_url", "sort_order"],
  reviews: ["author", "quote", "sort_order"],
  videos: ["title", "video_url", "thumbnail_url", "sort_order"],
};

export const requiredFields = {
  offers: ["title"],
  posts: ["title", "slug"],
  reviews: ["author", "quote"],
  videos: [],
};

export const settingFields = [
  "hero_video",
  "hero_image",
  "whatsapp_number",
  "contact_email",
  "address",
  "opening_hours",
];

export const clean = (value) =>
  typeof value === "string" ? value.trim() : value;

export function validateTable(table) {
  if (!allowedTables.includes(table))
    throw Object.assign(new Error("Invalid section"), { status: 404 });
}
