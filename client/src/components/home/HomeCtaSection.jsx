
import React from "react";
import { Link } from "react-router-dom";
import { EditorialPhoto } from "./HomeMedia";

export default function HomeCtaSection() {
  // CHANGE IMAGES DIRECTLY HERE
  const mainImage = "/images/cta-main.jpg";
  const secondaryImage = "/images/cta-secondary.jpg";

  return (
    <section className="relative isolate overflow-hidden bg-[#46382f] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-[.045]"
        aria-hidden="true"
      >
        <img
          src="/watermark.png"
          alt=""
          className="absolute -left-24 top-1/2 w-[540px] -translate-y-1/2 brightness-0 invert lg:w-[820px]"
          loading="lazy"
        />
      </div>

      <div className="mx-auto grid max-w-[1600px] items-center gap-12 px-5 py-20 sm:px-10 md:gap-16 md:py-28 lg:grid-cols-[1fr_.85fr] lg:gap-20 lg:px-16 lg:py-36">
        <div className="relative z-10 max-w-[780px]">
          <div className="mb-10 flex items-center gap-4">
            <span className="h-px w-12 bg-[#f2d5c6]/80" />
            <p className="text-[11px] font-medium uppercase tracking-[.3em] text-[#f2d5c6]">
              Your moment awaits
            </p>
          </div>

          <h2 className="font-display text-[clamp(3.8rem,6.8vw,8rem)] font-light leading-[1.02] tracking-[-.055em]">
            Make room
            <br />
            for something
            <br />
            <span className="italic text-[#f2d5c6]">
              extraordinary.
            </span>
          </h2>

          <p className="mt-8 max-w-md text-base leading-8 text-white/70 md:ml-16 md:text-lg">
            The best moments begin when you make time for yourself.
            Discover your next experience at Height.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-8 md:ml-16">
            <Link
              to="/contact"
              className="group inline-flex min-h-14 items-center gap-8 rounded-full bg-[#f2d5c6] px-7 py-4 text-xs font-semibold uppercase tracking-[.18em] text-[#46382f] transition-colors duration-300 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Plan your visit
              <span
                aria-hidden="true"
                className="text-lg transition-transform group-hover:translate-x-1"
              >
                ↗
              </span>
            </Link>

            <a
              href="#services"
              className="border-b border-white/50 pb-2 text-xs font-medium uppercase tracking-[.18em] text-white/80 transition-colors hover:border-white hover:text-white"
            >
              Explore experiences
            </a>
          </div>
        </div>

        {/* IMAGE SECTION */}
        <div
          className="relative mx-auto h-[400px] w-full max-w-[520px] sm:h-[540px] lg:h-[600px]"
          aria-label="A glimpse of the Height experiences"
        >
          {/* Main Image */}
          <div className="absolute right-0 top-0 h-[85%] w-[80%] overflow-hidden rounded-t-[180px] bg-white/10 sm:rounded-t-[260px]">
            <EditorialPhoto
              src={mainImage}
              alt="Explore the experiences at Height"
              className="transition-transform duration-1000 hover:scale-105"
            />
          </div>

          {/* Secondary Image */}
          <div className="absolute bottom-0 left-0 h-[47%] w-[51%] overflow-hidden border-[8px] border-[#46382f] bg-white/10 shadow-2xl sm:border-[12px]">
            <EditorialPhoto
              src={secondaryImage}
              alt="A second view of Height"
            />
          </div>

          {/* Watermark */}
          <div className="absolute bottom-[7%] right-[2%] flex h-24 w-24 items-center justify-center rounded-full border border-white/50 bg-[#46382f]/80 p-3 backdrop-blur-md sm:h-32 sm:w-32">
            <img
              src="/watermark.png"
              alt=""
              className="max-h-full max-w-full brightness-0 invert"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <div className="relative mx-auto flex max-w-[1472px] items-center justify-between gap-4 border-t border-white/20 px-5 py-6 text-[10px] uppercase tracking-[.2em] text-white/50 sm:px-10 lg:px-16">
        <span>Height · Closer to yourself.</span>
        <span>Restro / Wellness / Spa / Fitness</span>
      </div>
    </section>
  );
}
