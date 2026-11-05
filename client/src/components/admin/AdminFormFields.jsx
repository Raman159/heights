import React from "react";
import AdminMediaField from "./AdminMediaField";

export const fieldDefinitions = {
  offers: [
    "title",
    "description",
    "image_url",
    "link_url",
    "original_price",
    "discounted_price",
  ],
  posts: ["title", "slug", "excerpt", "body", "image_url"],
  reviews: ["author", "quote"],
  videos: ["title", "video_url", "thumbnail_url"],
  gallery: ["title", "category", "image_url"],
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

const labels = {
  image_url: "Offer image",
  thumbnail_url: "Video thumbnail",
  video_url: "Video file",
  link_url: "Destination link",
  file_url: "Menu PDF",
  full_name: "Full name",
  department: "Department",
  designation: "Job title",
  biography: "Biography",
  instagram_url: "Instagram URL",
  linkedin_url: "LinkedIn URL",
  email: "Email address",
  category_id: "Spa category",
  slug: "Page URL slug",
  pricing: "Duration and price options (JSON)",
  original_price: "Original price (Rs.)",
  discounted_price: "Discounted price (Rs.)",
};

export const spaSettingFields = [
  "spa_title",
  "spa_tagline",
  "spa_intro_heading",
  "spa_intro",
  "spa_hero_image",
  "spa_intro_image",
];

export const websiteSettingFields = [
  "hero_video",
  "hero_image",
  "home_audio",
  "whatsapp_number",
  "contact_email",
  "address",
  "opening_hours",
];

export default function AdminFormFields({
  section,
  value,
  onChange,
  includeSettings = false,
  settingsFields,
  categories = [],
}) {
  const fields = settingsFields || (includeSettings
    ? [...websiteSettingFields, ...spaSettingFields]
    : fieldDefinitions[section] || []);
  return (
    <div className="grid min-w-0 gap-5 md:grid-cols-2 [&>*]:min-w-0">
      {fields.map((name) => {
        const label =
          name === "image_url" && section === "gallery"
            ? "Gallery image"
            : name === "image_url" && section === "menus"
              ? "Menu cover image"
              : name === "image_url" && section === "team_members"
                ? "Team member photo"
                : name === "image_url" && section === "spa_treatments"
                  ? "Treatment image"
                  : name === "image_url" && section === "services"
                    ? "Service image"
                    : name === "spa_hero_image"
                      ? "Spa hero image"
                      : name === "spa_intro_image"
                        ? "Spa introduction image"
              : labels[name] ||
                name.replaceAll("_", " ").replace(/^\w/, (letter) => letter.toUpperCase());
        if (
          name === "category_id" &&
          section === "spa_treatments"
        ) {
          return (
            <label key={name} className="block text-sm font-medium text-slate-700">
              {label}
              <select
                className="admin-field mt-2"
                required
                value={value[name] ?? ""}
                onChange={(event) => onChange(name, event.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </label>
          );
        }
        if (["image_url", "thumbnail_url", "hero_image", "spa_hero_image", "spa_intro_image"].includes(name)) {
          return (
            <div key={name} className="md:col-span-2">
              <AdminMediaField label={label} value={value[name] || ""} onChange={(next) => onChange(name, next)} />
            </div>
          );
        }
        if (["video_url", "hero_video", "home_audio"].includes(name)) {
          return (
            <div key={name} className="md:col-span-2">
              <AdminMediaField
                label={label}
                mediaType={name === "home_audio" ? "audio" : "video"}
                value={value[name] || ""}
                onChange={(next) => onChange(name, next)}
              />
            </div>
          );
        }
        if (name === "file_url" && section === "menus") {
          return (
            <div key={name} className="md:col-span-2">
              <AdminMediaField
                label={labels[name]}
                mediaType="pdf"
                value={value[name] || ""}
                onChange={(next) => onChange(name, next)}
              />
            </div>
          );
        }
        if (name === "category") {
          return (
            <label key={name} className="block text-sm font-medium text-slate-700">
              Category
              <select
                className="admin-field mt-2"
                value={value[name] ?? "Spaces"}
                onChange={(event) => onChange(name, event.target.value)}
              >
                {["Dining", "Wellness", "Fitness", "Spaces", "Indian Cuisine", "Japanese Cuisine", "Thai Cuisine", "Nepalese Cuisine", "Chef Special"].map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </label>
          );
        }
        const multiline = [
          "description",
          "body",
          "quote",
          "excerpt",
          "address",
          "opening_hours",
          "biography",
          "whatsapp_number",
          "spa_intro",
          "benefits",
          "pricing",
        ].includes(name);
        return (
          <label key={name} className={"block text-sm font-medium text-slate-700 " + (multiline ? "md:col-span-2" : "")}>
            {label}
            {name === "whatsapp_number" && (
              <span className="mt-1 block text-xs font-normal text-slate-500">
                Enter multiple numbers separated by commas or new lines. Only 10-digit numbers link to WhatsApp.
              </span>
            )}
            {name === "original_price" && (
              <span className="mt-1 block text-xs font-normal text-slate-500">
                Enter both prices; the discounted price must be lower.
              </span>
            )}
            {name === "pricing" && (
              <span className="mt-1 block text-xs font-normal text-slate-500">
                Use JSON, for example:{" "}
                <code>{"[{\"duration\":\"60 mins\",\"price\":4000}]"}</code>
              </span>
            )}
            {multiline ? (
              <textarea
                className="admin-field mt-2 min-h-28 resize-y"
                rows={name === "body" ? 10 : 4}
                value={value[name] ?? ""}
                onChange={(event) => onChange(name, event.target.value)}
              />
            ) : (
              <input
                className="admin-field mt-2"
                type={
                  ["original_price", "discounted_price"].includes(name)
                    ? "number"
                    : name === "contact_email" || name === "email"
                      ? "email"
                      : "text"
                }
                min={
                  ["original_price", "discounted_price"].includes(name)
                    ? "0.01"
                    : undefined
                }
                step={
                  ["original_price", "discounted_price"].includes(name)
                    ? "0.01"
                    : undefined
                }
                required={
                  section === "offers" &&
                  ["original_price", "discounted_price"].includes(name)
                }
                value={value[name] ?? ""}
                onChange={(event) => onChange(name, event.target.value)}
              />
            )}
          </label>
        );
      })}
    </div>
  );
}
