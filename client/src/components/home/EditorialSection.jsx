
import React, { useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { SectionRule } from "./SectionDetails";

const ease = [0.22, 1, 0.36, 1];

export default function EditorialSection() {
  const sectionRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const mainImageY = useTransform(
    scrollYProgress,
    [0, 1],
    [-16, 16]
  );

  const floatingImageY = useTransform(
    scrollYProgress,
    [0, 1],
    [24, -24]
  );

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
    amount: 0.15,
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-cream py-16 md:py-24 lg:py-28"
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
          <SectionRule
            number="04"
            title="The Height feeling"
          />
        </motion.div>

        {/* Main split layout */}
        <div className="grid items-center gap-12 md:gap-16 lg:grid-cols-12 lg:gap-10">

          {/* LEFT: Editorial text */}
          <div className="lg:col-span-6 lg:pr-8">

            <motion.p
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              transition={{ duration: 0.75, ease }}
              className="mb-7 text-[11px] font-medium uppercase tracking-[.26em] text-clay"
            >
              THE ART OF SLOWING DOWN
            </motion.p>

            <motion.h2
              initial={
                reduceMotion
                  ? false
                  : { opacity: 0, y: 45 }
              }
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{
                duration: 1,
                ease,
              }}
              className="max-w-[690px] text-[clamp(3.4rem,6vw,7rem)] font-light leading-[.99] tracking-[-.065em] text-ink"
            >
              A little escape.
              <br />
              <em className="font-light text-clay">
                A lasting feeling.
              </em>
            </motion.h2>

            <motion.div
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              transition={{
                duration: 0.9,
                delay: 0.1,
                ease,
              }}
              className="mt-9 max-w-md border-l border-clay/40 pl-6 md:mt-12"
            >
              <p className="text-base leading-8 text-muted md:text-lg md:leading-9">
                Step away from the everyday and
                discover a place where wellness,
                thoughtful dining, and memorable
                moments come together effortlessly.
              </p>
            </motion.div>

            <motion.div
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              transition={{
                duration: 0.8,
                delay: 0.15,
                ease,
              }}
              className="mt-9 md:mt-11"
            >
              <Link
                to="/contact"
                className="group inline-flex min-h-12 items-center gap-8 border-b border-clay pb-2 text-[11px] font-medium uppercase tracking-[.2em] text-clay transition-colors duration-300 hover:text-ink"
              >
                Discover the experience

                <span
                  aria-hidden="true"
                  className="text-lg transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                >
                  ↗
                </span>
              </Link>
            </motion.div>
          </div>

          {/* RIGHT: Overlapping image composition */}
          <div className="relative min-w-0 lg:col-span-6">

            <div className="relative mx-auto w-full max-w-[540px] pb-14 pl-10 pt-5 sm:pb-20 sm:pl-16 lg:pb-24">

              {/* Decorative vertical line */}
              <motion.div
                initial={{
                  scaleY: reduceMotion ? 1 : 0,
                }}
                whileInView={{ scaleY: 1 }}
                viewport={viewport}
                transition={{
                  duration: 1,
                  ease,
                }}
                style={{ transformOrigin: "top" }}
                className="absolute right-1 top-0 h-[70%] w-px bg-clay/25"
              />

              {/* Main rooftop photograph */}
              <motion.div
                initial={
                  reduceMotion
                    ? false
                    : {
                        opacity: 0,
                        x: 35,
                        scale: 0.96,
                      }
                }
                whileInView={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                }}
                viewport={{
                  once: false,
                  amount: 0.15,
                }}
                transition={{
                  duration: 1.1,
                  ease,
                }}
                className="relative ml-auto w-[86%]"
              >
                <div className="relative aspect-[4/5] max-h-[480px] overflow-hidden rounded-t-[160px] sm:rounded-t-[220px]">

                  <motion.img
                    src="/media/rooftop-view.webp"
                    alt="Height rooftop view"
                    loading="lazy"
                    style={
                      reduceMotion
                        ? undefined
                        : { y: mainImageY }
                    }
                    className="absolute -top-[8%] left-0 h-[116%] w-full object-cover"
                  />

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </motion.div>

              {/* Floating spa photograph */}
              <motion.div
                initial={
                  reduceMotion
                    ? false
                    : {
                        opacity: 0,
                        x: -45,
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
                  delay: 0.1,
                  ease,
                }}
                className="absolute bottom-0 left-0 z-10 w-[48%]"
              >
                <div className="border-[6px] border-cream bg-cream shadow-[0_20px_60px_rgba(36,26,18,0.14)] sm:border-[9px]">

                  <div className="relative aspect-[4/5] max-h-[280px] overflow-hidden">
                    <motion.img
                      src="/media/spa-treatment.webp"
                      alt="Spa and wellness treatment at Height"
                      loading="lazy"
                      style={
                        reduceMotion
                          ? undefined
                          : { y: floatingImageY }
                      }
                      className="absolute -top-[10%] left-0 h-[120%] w-full object-cover"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Bottom editorial caption */}
              <div className="absolute bottom-2 right-0 hidden items-center gap-3 sm:flex">
                <span className="h-px w-8 bg-clay/60" />
                <span className="text-[10px] uppercase tracking-[.2em] text-clay">
                  HEIGHT / THE EXPERIENCE
                </span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
