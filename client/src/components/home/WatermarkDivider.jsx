import React from "react";
export default function WatermarkDivider() {
  return (
    <div
      className="relative flex items-center justify-center bg-cream py-8 md:py-12"
      aria-hidden="true"
    >
      <span className="h-px flex-1 bg-ink/10" />
      <img
        src="/watermark.png"
        alt=""
        loading="lazy"
        className="mx-8 h-12 w-12 object-contain opacity-30 md:mx-12 md:h-16 md:w-16"
      />
      <span className="h-px flex-1 bg-ink/10" />
    </div>
  );
}
