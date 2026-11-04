
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";

import EmptyState from "../site/EmptyState";
import { SectionRule } from "./SectionDetails";

const ease = [0.22, 1, 0.36, 1];

const CARDS_PER_PAGE = 3;

export default function ReviewsSection({ reviews }) {
  const [page, setPage] = useState(0);
  const reduceMotion = useReducedMotion();

  const count = Array.isArray(reviews) ? reviews.length : 0;
  const totalPages = Math.ceil(count / CARDS_PER_PAGE);

  const currentPage = Math.min(
    page,
    Math.max(0, totalPages - 1)
  );

  const visibleReviews = Array.isArray(reviews)
    ? reviews.slice(
        currentPage * CARDS_PER_PAGE,
        (currentPage + 1) * CARDS_PER_PAGE
      )
    : [];

  const changePage = (direction) => {
    if (totalPages <= 1) return;

    setPage(
      (current) =>
        (Math.min(current, totalPages - 1) +
          direction +
          totalPages) %
        totalPages
    );
  };

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

  return (
    <section
      aria-label="Guest reviews"
      className="overflow-hidden bg-[#46382f] py-20 text-white md:py-28"
    >
      <div className="shell">

        {/* Section rule */}
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          transition={{ duration: 0.8, ease }}
        >
          {/* <SectionRule
            number="06"
            title="Words from our guests"
            light
          /> */}
        </motion.div>

        {/* Heading */}
        <div className="mb-12 mt-8 flex flex-wrap items-end justify-between gap-6 md:mb-14">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            transition={{ duration: 0.9, ease }}
          >
            <p className="mb-4 text-[11px] uppercase tracking-[.24em] text-[#f2d5c6]">
              THE HEIGHT EXPERIENCE
            </p>

            <h2 className="text-[clamp(3rem,5.5vw,6rem)] font-light leading-[1.05] tracking-[-.06em]">
              In their{" "}
              <em className="text-[#f2d5c6]">
                own words.
              </em>
            </h2>
          </motion.div>

          {/* Navigation */}
          {count > CARDS_PER_PAGE && (
            <div className="flex items-center gap-5">
              <span className="text-[11px] tracking-[.18em] text-white/60">
                {String(currentPage + 1).padStart(2, "0")}
                {" / "}
                {String(totalPages).padStart(2, "0")}
              </span>

              <button
                type="button"
                onClick={() => changePage(-1)}
                aria-label="Previous reviews"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white transition-colors duration-300 hover:bg-white hover:text-[#46382f]"
              >
                ←
              </button>

              <button
                type="button"
                onClick={() => changePage(1)}
                aria-label="Next reviews"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white transition-colors duration-300 hover:bg-white hover:text-[#46382f]"
              >
                →
              </button>
            </div>
          )}
        </div>

        {/* Reviews */}
        {reviews === null ? (
          <div
            aria-busy="true"
            className="min-h-[280px]"
          />
        ) : count === 0 ? (
          <EmptyState />
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentPage}
              initial={{
                opacity: reduceMotion ? 1 : 0,
                x: reduceMotion ? 0 : 30,
              }}
              animate={{ opacity: 1, x: 0 }}
              exit={{
                opacity: reduceMotion ? 1 : 0,
                x: reduceMotion ? 0 : -30,
              }}
              transition={{
                duration: reduceMotion ? 0 : 0.45,
                ease,
              }}
              className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
            >
              {visibleReviews.map((review, i) => (
                <motion.article
                  key={review.id ?? `${currentPage}-${i}`}
                  initial={{
                    opacity: reduceMotion ? 1 : 0,
                    y: reduceMotion ? 0 : 35,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: false,
                    amount: 0.12,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.1,
                    ease,
                  }}
                  className="group h-full"
                >
                  <div
                    className="
                      flex h-full min-h-[340px] flex-col
                      border border-[#e4dacf]
                      bg-[#f1eae0]
                      p-7 text-[#46382f]
                      transition-all duration-500 ease-out
                      group-hover:-translate-y-2
                      group-hover:border-[#c8ad99]
                      group-hover:shadow-[0_25px_60px_rgba(0,0,0,0.15)]
                      sm:p-8 lg:min-h-[390px]
                    "
                  >
                    {/* Top detail */}
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[10px] font-medium uppercase tracking-[.2em] text-[#a07d67]">
                        GUEST EXPERIENCE
                      </span>

                      <span className="text-[11px] tracking-[.15em] text-[#a07d67]">
                        {String(
                          currentPage * CARDS_PER_PAGE + i + 1
                        ).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Review text */}
                    <blockquote className="mt-10 flex-1 text-[clamp(1.15rem,1.65vw,1.6rem)] font-light leading-[1.6] tracking-[-.025em]">
                      “{review.quote}”
                    </blockquote>

                    {/* Guest name */}
                    <div className="mt-10 border-t border-[#46382f]/15 pt-5">
                      <p className="text-sm font-medium tracking-[.02em]">
                        {review.author}
                      </p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
