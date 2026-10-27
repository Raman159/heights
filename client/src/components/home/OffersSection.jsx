import React from "react";
import { Reveal } from "../Layout";
import Card from "../site/ExperienceCard";
import EmptyState from "../site/EmptyState";
import { Slider } from "./HomeCarousel";

export default function OffersSection({ offers }) {
  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="shell">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-[clamp(3.1rem,6vw,6rem)] font-light leading-[1] tracking-[-.05em]">
              Made for <span className="italic text-clay">you.</span>
            </h2>
          </div>
          <p className="max-w-xs text-base leading-7 text-muted">
            Thoughtfully curated experiences and offers worth looking forward
            to.
          </p>
        </div>
        {offers === null ? null : offers.length === 0 ? (
          <EmptyState />
        ) : (
          <Slider label="Offers">
            {offers.map((offer) => (
              <Reveal
                key={offer.id}
                className="w-[84%] shrink-0 snap-center md:w-[44%] lg:w-[32%]"
              >
                <Card
                  item={{ ...offer, subtitle: offer.description }}
                  to={"/offers/" + offer.id}
                />
              </Reveal>
            ))}
          </Slider>
        )}
      </div>
    </section>
  );
}
