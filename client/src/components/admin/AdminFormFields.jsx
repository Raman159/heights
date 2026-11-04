import React from "react";
import AdminMediaField from "./AdminMediaField";

export const fieldDefinitions = {
  offers: ["title", "description", "image_url", "link_url"],
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
};

export default function AdminFormFields({ section, value, onChange, includeSettings = false }) {
  const fields = includeSettings
    ? ["hero_video", "hero_image", "home_audio", "whatsapp_number", "contact_email", "address", "opening_hours"]
    : fieldDefinitions[section] || [];
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
              : labels[name] ||
                name.replaceAll("_", " ").replace(/^\w/, (letter) => letter.toUpperCase());
        if (["image_url", "thumbnail_url", "hero_image"].includes(name)) {
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
        const multiline = ["description", "body", "quote", "excerpt", "address", "opening_hours", "biography"].includes(name);
        return (
          <label key={name} className={"block text-sm font-medium text-slate-700 " + (multiline ? "md:col-span-2" : "")}>
            {label}
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
                type={name === "contact_email" || name === "email" ? "email" : "text"}
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
