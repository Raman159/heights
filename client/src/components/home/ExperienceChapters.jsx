
import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { serviceCards } from "../../data";
import { SectionRule } from "./SectionDetails";

const definitions = [
  {
    title: "Wellness",
    key: /wellness|spa|massage|sauna|jacuzzi/i,
    lead: "Make time to reconnect.",
  },
  {
    title: "Gym & Fitness",
    key: /gym|fitness|training|workout/i,
    lead: "Move with intention.",
  },
  {
    title: "Restaurant",
    key: /restaurant|restro|dining|food/i,
    lead: "Savour the moment.",
  },
  {
    title: "Bar",
    key: /\bbar\b|lounge|cocktail|mixology|nightlife|drinks/i,
    lead: "Stay a little longer.",
  },
];

const ease = [0.22, 1, 0.36, 1];

export default function ExperienceChapters() {
  const reduceMotion = useReducedMotion();

  const used = new Set();

  const categories = definitions.map((item) => {
    // Prefer an exact category match in the service name.
    let service = serviceCards.find(
      (s) =>
        s.img &&
        !used.has(s.name) &&
        item.key.test(s.name || "")
    );

    // Check descriptions if no name matches.
    if (!service) {
      service = serviceCards.find(
        (s) =>
          s.img &&
          !used.has(s.name) &&
          item.key.test(s.desc || "")
      );
    }

    // Ensure Bar appears even if no dedicated Bar
    // service exists in serviceCards.
    if (!service && item.title === "Bar") {
      service =
        serviceCards.find(
          (s) =>
            s.img &&
            /restaurant|restro|lounge|dining/i.test(
              s.name || ""
            )
        ) || serviceCards.find((s) => s.img);
    }

    if (service) used.add(service.name);

    return service
      ? {
          ...item,
          service,
          fallback:
            item.title === "Bar" &&
            !item.key.test(
              `${service.name || ""} ${service.desc || ""}`
            ),
        }
      : null;
  }).filter(Boolean);

  const reveal = {
    hidden: {
      opacity: reduceMotion ? 1 : 0,
      y: reduceMotion ? 0 : 35,
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

  if (!categories.length) return null;

  return (
    <section
      aria-label="Experience highlights"
      className="bg-[#46382f] py-16 text-white md:py-20"
    >
      <div className="shell">
        {/* Section heading */}
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          transition={{ duration: 0.8, ease }}
        >
          <SectionRule
            number="03"
            title="Distinctive experiences"
            light
          />
        </motion.div>

        <div className="mb-10 grid gap-5 lg:grid-cols-[1.4fr_.6fr] lg:items-end">
          <motion.h2
            initial={reveal.hidden}
            whileInView={reveal.visible}
            viewport={viewport}
            transition={{ duration: 1, ease }}
            className="max-w-[900px] text-[clamp(3.5rem,8vw,9rem)] font-light leading-[.94] tracking-[-.068em]"
          >
            More than{" "}
            <em className="text-[#f2d5c6]">
              a destination.
            </em>
          </motion.h2>

          <motion.p
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            transition={{ duration: 0.8, ease }}
            className="max-w-sm text-base leading-8 text-white/70 lg:ml-auto"
          >
            Restro · Wellness · Spa · Fitness
          </motion.p>
        </div>

        {/* Compact experience grid */}
        <div className="grid gap-y-10 md:grid-cols-2 md:gap-x-8 md:gap-y-14">
          {categories.map(
            ({ title, lead, service, fallback }, i) => (
              <motion.div
                key={title}
                className={i % 2 ? "md:mt-10" : ""}
                initial={{
                  opacity: reduceMotion ? 1 : 0,
                  y: reduceMotion ? 0 : 45,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: false,
                  amount: 0.1,
                }}
                transition={{
                  duration: 0.9,
                  delay: (i % 2) * 0.1,
                  ease,
                }}
              >
                <a
                  href={service.href}
                  className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f2d5c6]"
                >
                  {/* Image */}
                  <div className="relative h-[280px] overflow-hidden sm:h-[350px] lg:h-[420px]">
                    <img
                      src={service.img}
                      alt={
                        fallback
                          ? `${title} experience`
                          : service.name
                      }
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1100ms] group-hover:scale-[1.04] motion-reduce:transition-none"
                    />

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />

                    <span className="absolute bottom-5 left-6 text-[11px] tracking-[.22em]">
                      0{i + 1}
                    </span>
                  </div>

                  {/* Card title */}
                  <div className="mt-5 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[.22em] text-[#f2d5c6]">
                        {lead}
                      </p>

                      <h3 className="mt-2 text-[clamp(2.4rem,4.8vw,5.5rem)] font-light leading-none tracking-[-.055em]">
                        {title}
                      </h3>
                    </div>

                    <span
                      aria-hidden="true"
                      className="mb-2 text-2xl transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                    >
                      ↗
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mt-3 max-w-lg text-sm leading-7 text-white/65">
                    {fallback ? lead : service.desc}
                  </p>
                </a>
              </motion.div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
