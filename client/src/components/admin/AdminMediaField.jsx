import React, { useRef, useState } from "react";
import { ImagePlus, LoaderCircle, Upload, X } from "lucide-react";
import { upload } from "../../api";
import { useToast } from "../Toast";

export default function AdminMediaField({ label, value, onChange, mediaType = "image" }) {
  const notify = useToast();
  const input = useRef(null);
  const [busy, setBusy] = useState(false);
  const isVideo = mediaType === "video";

  async function handleFile(file) {
    if (!file) return;
    setBusy(true);
    try {
      const result = await upload(file);
      onChange(result.url);
      notify("Media uploaded and added");
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div>
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
          {isVideo ? (
            <video src={value} controls className="max-h-64 w-full bg-black object-contain" />
          ) : (
            <img src={value} alt="" className="h-48 w-full object-cover" />
          )}
          <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-3 py-2">
            <span className="truncate text-xs text-slate-500">{value.split("/").pop()}</span>
            <button type="button" onClick={() => onChange("")} className="flex shrink-0 items-center gap-1 text-xs font-medium text-slate-600 hover:text-red-700">
              <X size={14} /> Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={busy}
          className="flex min-h-[126px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center transition hover:border-[#9a6854] hover:bg-[#faf7f5] disabled:opacity-60"
        >
          {busy ? <LoaderCircle className="animate-spin text-[#9a6854]" size={22} /> : <ImagePlus className="text-[#9a6854]" size={22} />}
          <span className="mt-2 text-sm font-semibold text-slate-700">{busy ? "Uploading…" : "Choose a file to upload"}</span>
          <span className="mt-1 text-xs text-slate-500">{isVideo ? "MP4 or WebM, up to 80 MB" : "PNG, JPG or WebP"}</span>
        </button>
      )}
      {value && (
        <button type="button" onClick={() => input.current?.click()} disabled={busy} className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#95614e] hover:text-[#182b2a]">
          <Upload size={14} /> Replace file
        </button>
      )}
      <input
        ref={input}
        type="file"
        accept={isVideo ? "video/mp4,video/webm" : "image/png,image/jpeg,image/webp"}
        className="hidden"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
    </div>
  );
}
