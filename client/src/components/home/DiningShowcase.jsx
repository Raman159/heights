
import React, { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

import { serviceCards } from "../../data";
import { SectionRule } from "./SectionDetails";
import BrandButton from "../site/BrandButton";

const ease = [0.22, 1, 0.36, 1];

export default function DiningShowcase() {
  const sectionRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    [-20, 20]
  );

  const dining = serviceCards
    .filter((s) =>
      /restro|restaurant|dining|food|bar|lounge|drink/i.test(
        `${s.name} ${s.desc || ""}`
      )
    )
    .slice(0, 2);

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

  if (!dining.length) return null;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-cream py-20 md:py-28"
    >
      <div className="shell">

        {/* Section label */}
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          transition={{ duration: 0.8, ease }}
        >
          {/* <SectionRule
            number="05"
            title="Dining & gathering"
          /> */}
        </motion.div>

        {/* Main content */}
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">

          {/* LEFT - Editorial content */}
          <div className="lg:col-span-5">

            <motion.p
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              transition={{ duration: 0.7, ease }}
              className="eyebrow mb-7"
            >
              Restaurant & Bar
            </motion.p>

            <motion.h2
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              transition={{ duration: 1, ease }}
              className="text-[clamp(3.7rem,7.3vw,8.5rem)] font-light leading-[.95] tracking-[-.07em]"
            >
              The art of{" "}
              <em className="text-clay">
                staying.
              </em>
            </motion.h2>

            <motion.p
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              transition={{
                duration: 0.85,
                ease,
              }}
              className="mt-8 max-w-sm text-base leading-8 text-muted"
            >
              {dining[0].desc}
            </motion.p>

            {/* Actions */}
            <motion.div
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              transition={{
                duration: 0.85,
                ease,
              }}
              className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3"
            >
              <BrandButton
              href={dining[0].href}
              size="small"
              >
              Explore dining
              </BrandButton>

              <BrandButton
              to="/contact"
              size="small"
              tone="dark"
              >
              Reservations
              </BrandButton>
            </motion.div>
          </div>

          {/* RIGHT - Editorial image composition */}
          <div className="relative lg:col-span-7">

            <div className="relative pb-16 sm:pb-20">

              {/* Main dining image */}
              <motion.div
                initial={
                  reduceMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 55,
                        scale: 0.97,
                      }
                }
                whileInView={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                viewport={viewport}
                transition={{
                  duration: 1.1,
                  ease,
                }}
                className="relative ml-auto w-[88%] overflow-hidden"
              >
                <a
                  href={dining[0].href}
                  className="group block overflow-hidden"
                >
                  <div className="relative h-[360px] overflow-hidden sm:h-[480px] lg:h-[540px]">

                    <motion.img
                      src={dining[0].img}
                      alt={dining[0].name}
                      loading="lazy"
                      style={
                        reduceMotion
                          ? undefined
                          : { y: imageY }
                      }
                      className="absolute -top-[8%] left-0 h-[116%] w-full object-cover transition-transform duration-1000 group-hover:scale-[1.035]"
                    />

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                  </div>
                </a>
              </motion.div>

              {/* Second overlapping image */}
              {dining[1] && (
                <motion.div
                  initial={
                    reduceMotion
                      ? false
                      : {
                          opacity: 0,
                          x: -40,
                          y: 30,
                        }
                  }
                  whileInView={{
                    opacity: 1,
                    x: 0,
                    y: 0,
                  }}
                  viewport={{
                    once: false,
                    amount: 0.12,
                  }}
                  transition={{
                    duration: 1.1,
                    delay: 0.15,
                    ease,
                  }}
                  className="absolute bottom-0 left-0 z-10 w-[45%]"
                >
                  <a
                    href={dining[1].href}
                    className="group block border-[6px] border-cream bg-cream shadow-[0_18px_50px_rgba(30,20,15,0.13)] sm:border-[9px]"
                  >
                    <div className="relative h-[180px] overflow-hidden sm:h-[250px] lg:h-[290px]">
                      <img
                        src={dining[1].img}
                        alt={dining[1].name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.05]"
                      />
                    </div>
                  </a>

                  <div className="mt-3 flex items-center gap-3">
                    <span className="h-px w-6 bg-clay" />
                    <span className="text-[10px] uppercase tracking-[.18em] text-clay">
                      {dining[1].name}
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
