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
  "gallery",
  "menus",
  "team_members",
  "services",
  "spa_categories",
  "spa_treatments",
  "inquiries",
];

export const tableFields = {
  offers: ["title", "description", "image_url", "link_url"],
  posts: ["title", "slug", "excerpt", "body", "image_url"],
  reviews: ["author", "quote"],
  videos: ["title", "video_url", "thumbnail_url"],
  gallery: ["title", "image_url", "category"],
  menus: ["title", "description", "image_url", "file_url"],
  team_members: [
    "full_name",
    "department",
    "designation",
    "biography",
    "image_url",
    "instagram_url",
    "linkedin_url",
    "email",
  ],
  services: ["title", "slug", "subtitle", "description", "image_url"],
  spa_categories: ["name", "description"],
  spa_treatments: [
    "category_id",
    "title",
    "slug",
    "description",
    "benefits",
    "pricing",
    "image_url",
  ],
};

export const orderedTables = Object.keys(tableFields);

export const requiredFields = {
  offers: ["title"],
  posts: ["title", "slug"],
  reviews: ["author", "quote"],
  videos: [],
  gallery: ["title", "image_url", "category"],
  menus: ["title", "file_url"],
  team_members: ["full_name", "department", "designation"],
  services: ["title", "slug"],
  spa_categories: ["name"],
  spa_treatments: ["category_id", "title", "slug"],
};

export const galleryCategories = [
  "Dining",
  "Wellness",
  "Fitness",
  "Spaces",
  "Indian Cuisine",
  "Japanese Cuisine",
  "Thai Cuisine",
  "Nepalese Cuisine",
  "Chef Special",
];

export const settingFields = [
  "hero_video",
  "hero_image",
  "home_audio",
  "whatsapp_number",
  "contact_email",
  "address",
  "opening_hours",
  "spa_title",
  "spa_tagline",
  "spa_intro_heading",
  "spa_intro",
  "spa_hero_image",
  "spa_intro_image",
];

export const clean = (value) =>
  typeof value === "string" ? value.trim() : value;

export function validateTable(table) {
  if (!allowedTables.includes(table))
    throw Object.assign(new Error("Invalid section"), { status: 404 });
}
