import React from "react";

export default function WatermarkDivider({ dark = false }) {
  return (
    <div
      aria-hidden="true"
      className="mx-auto flex w-full max-w-[1400px] items-center gap-5 px-5 py-5 sm:gap-8 sm:px-10 lg:px-16"
    >
      <span className={`h-px flex-1 ${dark ? "bg-white/35" : "bg-clay/35"}`} />
      <img
        src="/watermark.png"
        alt=""
        loading="lazy"
        className={`h-10 w-auto max-w-[80px] object-contain opacity-65 sm:h-14 sm:max-w-[110px] ${
          dark ? "brightness-0 invert" : ""
        }`}
      />
      <span className={`h-px flex-1 ${dark ? "bg-white/35" : "bg-clay/35"}`} />
    </div>
  );
}
