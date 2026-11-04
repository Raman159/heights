import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import { uploads } from "../config.js";

fs.mkdirSync(uploads, { recursive: true });

const extensions = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "audio/mpeg": ".mp3",
  "audio/mp3": ".mp3",
  "audio/mpeg3": ".mp3",
  "audio/x-mpeg": ".mp3",
  "audio/x-mpeg-3": ".mp3",
  "audio/x-mp3": ".mp3",
  "audio/mpg": ".mp3",
  "audio/x-mpg": ".mp3",
  "audio/mpa": ".mp3",
  "application/mp3": ".mp3",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "application/pdf": ".pdf",
};

export function getUploadExtension(file) {
  const nameExtension = path.extname(file?.originalname || "").toLowerCase();
  if (nameExtension === ".mp3") return ".mp3";
  if (nameExtension === ".pdf") return ".pdf";

  const mimeType = String(file?.mimetype || "")
    .split(";")[0]
    .trim()
    .toLowerCase();
  return extensions[mimeType] || null;
}

export const uploadMiddleware = multer({
  storage: multer.diskStorage({
    destination: uploads,
    filename: (req, file, callback) =>
      callback(null, crypto.randomUUID() + (getUploadExtension(file) || ".bin")),
  }),
  limits: { fileSize: 80 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, callback) => {
    if (!getUploadExtension(file)) {
      const error = new Error(
        "Unsupported file type. Use PNG, JPG, WebP, PDF, MP3, MP4, or WebM.",
      );
      error.status = 415;
      return callback(error);
    }
    callback(null, true);
  },
});
