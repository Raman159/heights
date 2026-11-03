import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import FeatureAccordion from "../site/FeatureAccordion";
import EmptyState from "../site/EmptyState";
import { SectionRule, SectionIntro } from "./SectionDetails";

const ease = [0.22, 1, 0.36, 1];
const ITEMS_PER_PAGE = 3;

export default function OffersSection({ offers }) {
  const reduceMotion = useReducedMotion();
  const [page, setPage] = useState(0);

  const safeOffers = Array.isArray(offers) ? offers : [];
  const totalPages = Math.ceil(safeOffers.length / ITEMS_PER_PAGE);

  const currentPage = Math.min(page, Math.max(0, totalPages - 1));

  const visibleOffers = safeOffers.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE,
  );

  const changePage = (nextPage) => {
    if (nextPage < 0 || nextPage >= totalPages) return;
    setPage(nextPage);
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
    <section className="relative bg-cream py-20 md:py-28">
      <div className="shell">
        {/* Section heading */}
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          transition={{ duration: 0.85, ease }}
        >
          <SectionRule number="08" title="Membership & offers" />
        </motion.div>

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          transition={{ duration: 1, ease }}
        >
          <SectionIntro
            eyebrow="Selected experiences"
            title={
              <>
                Made for <em className="text-clay">you.</em>
              </>
            }
            description="Thoughtfully curated experiences and offers worth looking forward to."
          />
        </motion.div>

        {offers === null ? (
          <div aria-busy="true" className="min-h-60" />
        ) : safeOffers.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Animated accordion */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{
                once: false,
                amount: 0.08,
              }}
              transition={{
                duration: 0.9,
                ease,
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentPage}
                  initial={reduceMotion ? false : { opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -30 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.45,
                    ease,
                  }}
                >
                  <FeatureAccordion
                    items={visibleOffers}
                    getTo={(offer) => `/offers/${offer.id}`}
                    actionLabel="More info"
                    eyebrow="A HEIGHT EXPERIENCE"
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-9 flex flex-wrap items-center justify-between gap-5 border-t border-clay/20 pt-6">
                <span className="text-[11px] uppercase tracking-[.18em] text-clay">
                  {String(currentPage + 1).padStart(2, "0")}
                  {" / "}
                  {String(totalPages).padStart(2, "0")}
                </span>

                {/* Page dots */}
                <div className="flex flex-wrap items-center gap-2">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => changePage(index)}
                      aria-label={`Go to page ${index + 1}`}
                      aria-current={currentPage === index ? "page" : undefined}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        currentPage === index
                          ? "w-8 bg-clay"
                          : "w-2 bg-clay/25 hover:bg-clay/60"
                      }`}
                    />
                  ))}
                </div>

                {/* Previous / Next */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={currentPage === 0}
                    onClick={() => changePage(currentPage - 1)}
                    aria-label="Previous offers"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-clay/35 text-clay transition-colors hover:bg-clay hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    ←
                  </button>

                  <button
                    type="button"
                    disabled={currentPage === totalPages - 1}
                    onClick={() => changePage(currentPage + 1)}
                    aria-label="Next offers"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-clay/35 text-clay transition-colors hover:bg-clay hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
