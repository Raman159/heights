import React from "react";
import AdminMediaField from "./AdminMediaField";

export const fieldDefinitions = {
  offers: ["title", "description", "image_url", "link_url"],
  posts: ["title", "slug", "excerpt", "body", "image_url"],
  reviews: ["author", "quote"],
  videos: ["title", "video_url", "thumbnail_url"],
};

const labels = {
  image_url: "Offer image",
  thumbnail_url: "Video thumbnail",
  video_url: "Video file",
  link_url: "Destination link",
};

export default function AdminFormFields({ section, value, onChange, includeSettings = false }) {
  const fields = includeSettings
    ? ["hero_video", "hero_image", "whatsapp_number", "contact_email", "address", "opening_hours"]
    : fieldDefinitions[section] || [];
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {fields.map((name) => {
        const label = labels[name] || name.replaceAll("_", " ").replace(/^\w/, (letter) => letter.toUpperCase());
        if (["image_url", "thumbnail_url", "hero_image"].includes(name)) {
          return (
            <div key={name} className="md:col-span-2">
              <AdminMediaField label={label} value={value[name] || ""} onChange={(next) => onChange(name, next)} />
            </div>
          );
        }
        if (["video_url", "hero_video"].includes(name)) {
          return (
            <div key={name} className="md:col-span-2">
              <AdminMediaField label={label} mediaType="video" value={value[name] || ""} onChange={(next) => onChange(name, next)} />
            </div>
          );
        }
        const multiline = ["description", "body", "quote", "excerpt", "address", "opening_hours"].includes(name);
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
                type={name === "contact_email" ? "email" : "text"}
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
