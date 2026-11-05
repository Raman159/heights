import React from "react";
import { mediaUrl } from "../../api";
import RichText from "./RichText";

// Long titles step down in size instead of scrolling inside a fixed box,
// so the whole title is always visible and the banner simply grows if needed.
function titleSize(title, compact) {
  const length = typeof title === "string" ? title.trim().length : 0;

  const sizes = compact
    ? [
        "text-[clamp(2.25rem,5.2vw,5rem)]", // short
        "text-[clamp(2rem,4.2vw,3.75rem)]", // medium
        "text-[clamp(1.85rem,3.4vw,3rem)]", // long
      ]
    : [
        "text-[clamp(2.75rem,7.2vw,6.75rem)]",
        "text-[clamp(2.5rem,5.6vw,5rem)]",
        "text-[clamp(2.25rem,4.4vw,3.75rem)]",
      ];

  if (length > 80) return sizes[2];
  if (length > 40) return sizes[1];
  return sizes[0];
}

export default function Banner({ tag, title, body, image, children, compact = false }) {
  return (
    <section className="banner relative isolate flex h-auto min-h-[max(640px,100svh)] w-full overflow-hidden bg-neutral-900 text-white">
      <style>{`
        .banner .banner-img {
          animation: banner-settle 2.4s cubic-bezier(.2,.7,.2,1) both;
        }
        .banner .banner-rise {
          animation: banner-rise 1.1s cubic-bezier(.2,.7,.2,1) .35s both;
        }
        .banner .banner-rise-late {
          animation: banner-rise 1.1s cubic-bezier(.2,.7,.2,1) .7s both;
        }
        @keyframes banner-settle {
          from { transform: scale(1.08); }
          to   { transform: scale(1); }
        }
        @keyframes banner-rise {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .banner .banner-img,
          .banner .banner-rise,
          .banner .banner-rise-late { animation: none; }
        }
      `}</style>

      <img
        src={mediaUrl(image)}
        alt=""
        className="banner-img absolute inset-0 -z-20 h-full w-full object-cover"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-black/55 via-black/20 to-black/5"
      />

      {/* Soft shade behind the nav bar */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-48 bg-gradient-to-b from-black/50 via-black/20 to-transparent"
      />

      {/* <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-3 rounded-[22px] border border-white/30 sm:inset-5 md:inset-7 md:rounded-[32px]"
      /> */}

      <div className="relative mx-auto flex w-full max-w-7xl flex-col justify-between gap-16 px-8 pb-14 pt-32 sm:px-12 md:px-16 md:pb-20">
        {tag ? (
          <p className="banner-rise inline-flex w-fit items-center gap-3 rounded-full text-sm">
            {tag}
          </p>
        ) : (
          <span />
        )}

        <div className="grid items-end gap-10 md:grid-cols-12 md:gap-8">
          <h1
            className={`banner-rise-late min-w-0 break-words text-balance font-light leading-[0.98] tracking-[-0.02em] md:col-span-8 ${titleSize(
              title,
              compact
            )}`}
          >
            {title}
          </h1>

          <div className="banner-rise-late min-w-0 md:col-span-4 md:border-l md:border-white/30 md:pl-8">
            <RichText
              text={body}
              className="max-w-sm text-[15px] leading-7 text-white/80"
            />
            {children ? (
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {children}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}