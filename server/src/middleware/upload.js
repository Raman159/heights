import crypto from "node:crypto";
import fs from "node:fs";
import multer from "multer";
import { uploads } from "../config.js";

fs.mkdirSync(uploads, { recursive: true });

const extensions = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
};

const acceptedTypes = Object.keys(extensions);

export const uploadMiddleware = multer({
  storage: multer.diskStorage({
    destination: uploads,
    filename: (req, file, callback) =>
      callback(null, crypto.randomUUID() + (extensions[file.mimetype] || ".bin")),
  }),
  limits: { fileSize: 80 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, callback) => {
    if (!acceptedTypes.includes(file.mimetype))
      return callback(new Error("Unsupported media type"));
    callback(null, true);
  },
});
