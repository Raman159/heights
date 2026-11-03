import { before, test } from "node:test";
import assert from "node:assert/strict";

process.env.JWT_SECRET ||= "local-test-secret-with-at-least-32-characters";

let getUploadExtension;
before(async () => {
  ({ getUploadExtension } = await import("../src/middleware/upload.js"));
});

test("accepts MP3 uploads by extension regardless of MIME type", () => {
  for (const mimetype of [
    "audio/mpeg",
    "audio/mp3",
    "application/octet-stream",
    "application/download",
    "",
    undefined,
  ]) {
    assert.equal(
      getUploadExtension({ mimetype, originalname: "music.mp3" }),
      ".mp3",
    );
  }
});

test("accepts MP3 uploads by MIME type without an extension", () => {
  assert.equal(
    getUploadExtension({ mimetype: "audio/mpeg", originalname: "music" }),
    ".mp3",
  );
});

test("preserves supported image and video types and rejects unsupported files", () => {
  assert.equal(
    getUploadExtension({ mimetype: "image/jpeg", originalname: "photo.jpg" }),
    ".jpg",
  );
  assert.equal(
    getUploadExtension({ mimetype: "video/mp4", originalname: "clip.mp4" }),
    ".mp4",
  );
  assert.equal(
    getUploadExtension({
      mimetype: "application/octet-stream",
      originalname: "unknown.bin",
    }),
    null,
  );
});
