
import React, { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { serviceCards } from "../../data";
import { SectionIntro, SectionRule } from "./SectionDetails";

const ease = [0.22, 1, 0.36, 1];

export default function ServicesSection() {
  const reduceMotion = useReducedMotion();
  const scrollRef = useRef(null);

  const reveal = {
    hidden: {
      opacity: reduceMotion ? 1 : 0,
      y: reduceMotion ? 0 : 45,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const viewport = {
    once: false,
    amount: 0.12,
  };

  return (
    <section
      id="services"
      className="relative scroll-mt-24 bg-cream py-20 md:py-32"
    >
      <div className="shell">

        {/* Section rule */}
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          transition={{ duration: 0.85, ease }}
        >
          <SectionRule number="02" title="The experiences" />
        </motion.div>

        {/* Section introduction */}
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          transition={{ duration: 1, ease }}
        >
          <SectionIntro
            eyebrow="Explore Height"
            title={
              <>
                Our{" "}
                <em className="font-light text-clay">
                  Services.
                </em>
              </>
            }
            description="Restro · Wellness · Spa · Fitness"
          />
        </motion.div>

        {/* Native horizontal carousel */}
        <div className="relative w-full min-w-0">
          <div
            ref={scrollRef}
            aria-label="Services"
            tabIndex={0}
            className="
              flex w-full min-w-0 gap-5
              overflow-x-auto overflow-y-hidden
              overscroll-x-contain
              scroll-smooth
              snap-x snap-mandatory
              pb-4
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
            style={{
              touchAction: "pan-x pan-y",
            }}
          >
            {serviceCards.map((service) => (
              <motion.div
                key={service.name}
                variants={reveal}
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: false,
                  amount: 0.1,
                }}
                transition={{
                  duration: 0.9,
                  ease,
                }}
                className="
                  h-[31rem]
                  w-[min(20rem,80vw)]
                  flex-none snap-center
                  sm:h-[34rem]
                  sm:w-[22rem]
                  sm:snap-start
                  lg:w-[24rem]
                "
              >
                <a
                  href={service.href}
                  className="
                    group relative flex h-full w-full flex-col
                    overflow-hidden rounded-t-full bg-cream
                    transition-transform duration-500 ease-out
                    hover:-translate-y-1
                    focus-visible:outline
                    focus-visible:outline-2
                    focus-visible:outline-clay
                  "
                >
                  {/* Original arched border */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-10 rounded-t-full border border-clay/70 [-webkit-mask-image:linear-gradient(to_bottom,black_55%,transparent_100%)] [mask-image:linear-gradient(to_bottom,black_55%,transparent_100%)]"
                  />

                  {/* Service image */}
                  <div className="relative h-[245px] w-full shrink-0 overflow-hidden rounded-t-full sm:h-[285px] lg:h-[310px]">
                    <img
                      src={service.img}
                      alt={service.name}
                      loading="lazy"
                      decoding="async"
                      className="
                        h-full w-full object-cover object-center
                        transition-transform duration-[1100ms]
                        ease-out
                        group-hover:scale-[1.065]
                        group-focus-visible:scale-[1.065]
                        motion-reduce:transition-none
                      "
                    />
                  </div>

                  {/* Card content */}
                  <div className="flex min-h-0 flex-1 flex-col items-center px-5 pb-5 pt-5 text-center sm:px-6 sm:pt-6">

                    {/* Title - always visible */}
                    <h3 className="shrink-0 text-[clamp(1.55rem,2.3vw,2.15rem)] font-normal italic leading-tight text-ink">
                      {service.name}
                    </h3>

                    {/* Description - hover reveal */}
                    <div
                      className="
                        grid w-full grid-rows-[0fr] opacity-0
                        transition-[grid-template-rows,opacity]
                        duration-500 ease-out
                        group-hover:grid-rows-[1fr]
                        group-hover:opacity-100
                        group-focus-visible:grid-rows-[1fr]
                        group-focus-visible:opacity-100
                        motion-reduce:transition-none
                      "
                    >
                      <div className="min-h-0 overflow-hidden">
                        <p className="mx-auto mt-2 line-clamp-3 max-w-xs text-sm leading-relaxed text-muted">
                          {service.desc}
                        </p>
                      </div>
                    </div>

                    {/* Explore - always visible */}
                    <span
                      className="
                        mt-auto inline-flex min-h-11 shrink-0
                        items-center gap-3 pt-2
                        text-[11px] font-medium uppercase
                        tracking-[.18em] text-clay
                      "
                    >
                      Explore

                      <span
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                      >
                        ↗
                      </span>
                    </span>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
