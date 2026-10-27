import React from "react";
import { Reveal } from "../Layout";

export default function PhilosophySection() {
  return (
    <section className="watermark bg-cream py-12 md:py-20">
      <div className="shell max-w-4xl text-center">
        <Reveal>
          <p className="eyebrow mb-4 md:mb-6">Height Philosophy</p>
          <h2 className="h2 mb-5 md:mb-7">
            Where everyday life finds{" "}
            <span className="text-clay">its balance.</span>
          </h2>
          <p className="mx-auto max-w-[34rem] text-base leading-8 text-muted md:max-w-none md:text-lg md:leading-9">
            Height is where traditional wisdom meets modern convenience — a
            sanctuary offering a touch-led holistic approach to healing. Unlike
            fleeting getaway retreats, Height brings balance and wellness into
            your everyday life. More than just a holistic wellness spa, it’s a
            space to harmonize, heal, and reconnect with yourself.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
