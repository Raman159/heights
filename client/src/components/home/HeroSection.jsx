import React from "react";
import { Link } from "react-router-dom";
import { HeroMedia } from "./HomeMedia";

export default function HeroSection({ settings }) {
  return (
    <section className="relative flex h-[88svh] min-h-[560px] items-end bg-[#46382f] pb-[max(3rem,env(safe-area-inset-bottom))] text-white md:h-[min(900px,100vh)] md:min-h-[660px] md:pb-24">
      <HeroMedia image={settings?.hero_image} video={settings?.hero_video} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 md:from-black/75 md:via-black/15 md:to-black/25" />
      <div className="shell relative z-10 max-w-4xl text-center">
        <img
          src="/watermark.png"
          className="mx-auto mb-6 h-24 justify-center brightness-0 invert md:mb-10 md:h-40"
          alt="Watermark"
        />
        <h1 className="max-w-5xl font-display text-[42px] font-light leading-[1.08] tracking-[-.04em] sm:text-6xl md:text-[92px] md:leading-[1.04] md:tracking-[-.06em]">
          Above the ordinary.
          <br />
          <em className="not-italic text-[#f2d5c6]">Closer to yourself.</em>
        </h1>
        <p className="eyebrow !text-skin mt-4 max-md:text-[11px] md:mt-5">
          RESTRO • WELLNESS • SPA • FITNESS
        </p>
        <div className="mx-auto mt-7 flex max-w-xs flex-col gap-3 md:hidden">
          <Link
            to="/contact"
            className="rounded-full bg-white px-6 py-3 text-center text-sm font-semibold text-ink shadow-lg shadow-black/20 transition-transform active:scale-[0.98]"
          >
            Plan your visit
          </Link>
          <a
            href="#services"
            className="rounded-full border border-white/50 bg-white/10 px-6 py-3 text-center text-sm font-medium text-white backdrop-blur-sm transition-transform active:scale-[0.98]"
          >
            Explore services
          </a>
        </div>
      </div>
    </section>
  );
}
