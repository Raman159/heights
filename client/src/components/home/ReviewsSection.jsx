import React from "react";
import { Reveal } from "../Layout";
import EmptyState from "../site/EmptyState";
import Design from "../site/design";
import { Slider } from "./HomeCarousel";

export default function ReviewsSection({ reviews }) {
  return (
    <section className="relative isolate overflow-hidden bg-cream py-20 md:py-28">
      <Design />
      <div className="shell relative z-10">
        <div className="mb-12 grid gap-6 md:grid-cols-[1fr_1fr] md:items-end">
          <div>
            <h2 className="font-display text-[clamp(3.2rem,6vw,6rem)] font-light leading-[1.02] tracking-[-.05em]">
              Stories worth <span className="italic text-clay">sharing.</span>
            </h2>
          </div>
          <p className="max-w-xs text-base leading-7 text-muted md:ml-auto">
            Kind words from people who experienced a little more of life with
            us.
          </p>
        </div>
        {reviews === null ? null : reviews.length === 0 ? (
          <EmptyState />
        ) : (
          <Slider label="Reviews">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="w-[84%] shrink-0 snap-center md:w-[44%] lg:w-[32%]"
              >
                <Reveal className="h-full">
                  <div className="h-full rounded-[1.5rem] bg-white p-6 shadow-[0_8px_30px_-12px_rgba(70,56,47,0.18)] md:rounded-[2rem] md:p-8 md:shadow-none">
                    <p className="mb-6 text-[15px] leading-7 text-muted md:mb-8 md:text-base md:leading-8">
                      “{review.quote}”
                    </p>
                    <p className="font-semibold">{review.author}</p>
                  </div>
                </Reveal>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </section>
  );
}
