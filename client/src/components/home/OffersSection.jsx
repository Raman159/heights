
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";

import PackageCard from "../site/PackageCard";
import EmptyState from "../site/EmptyState";
import { SectionRule, SectionIntro } from "./SectionDetails";

const ease = [0.22, 1, 0.36, 1];
const ITEMS_PER_PAGE = 3;

// Image resolution
function getImage(offer) {
  const sources = [
    offer.image,
    offer.img,
    offer.imageUrl,
    offer.image_url,
    offer.thumbnail,
    offer.cover,
    offer.coverImage,
    offer.featuredImage,
    offer.images?.[0],
  ];

  for (const source of sources) {
    if (typeof source === "string" && source.trim()) {
      return source;
    }

    if (source && typeof source === "object") {
      const url = source.url || source.src || source.path;

      if (typeof url === "string" && url.trim()) {
        return url;
      }
    }
  }

  return null;
}

// Short title for collapsed panels
function getShortTitle(offer) {
  if (offer.shortTitle || offer.short_title) {
    return offer.shortTitle || offer.short_title;
  }

  const title = String(offer.title || offer.name || "Experience");

  return title
    .replace(/\s*[—–]\s*(?:NPR|NRs?\.?|Rs\.?)?\s*[\d,]+.*$/i, "")
    .replace(/\s*[-|]\s*(?:NPR|NRs?\.?|Rs\.?)\s*[\d,]+.*$/i, "")
    .replace(/\s+(?:NPR|NRs?\.?|Rs\.?)\s*[\d,]+.*$/i, "")
    .trim();
}

// One interactive accordion
function OffersAccordion({ items }) {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();

  const activeIndex = Math.min(active, items.length - 1);

  const columns = items
    .map((_, index) => {
      if (items.length === 1) return "100%";

      if (items.length === 2) {
        return index === activeIndex ? "70%" : "30%";
      }

      return index === activeIndex ? "70%" : "15%";
    })
    .join(" ");

  return (
    <>
      {/* Desktop accordion */}
      <div className="hidden lg:block">
        <motion.div
          className="grid h-[530px] w-full gap-0 overflow-hidden xl:h-[580px]"
          initial={false}
          animate={{ gridTemplateColumns: columns }}
          transition={{
            duration: reduceMotion ? 0 : 0.7,
            ease,
          }}
        >
          {items.map((offer, index) => {
            const expanded = activeIndex === index;

            const title =
              offer.title || offer.name || "Experience";

            const shortTitle = getShortTitle(offer);

            const description =
              offer.description || offer.subtitle || "";

            const image = getImage(offer);

            return (
              <Link
                key={offer.id}
                to={`/offers/${offer.id}`}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                aria-label={`View ${title}`}
                className="group relative block h-full min-w-0 overflow-hidden bg-[#5a4a3e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white"
              >
                {/* Background image */}
                <div className="absolute inset-0 overflow-hidden">
                  {image ? (
                    <img
                      src={image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-[#ab9278] via-[#776457] to-[#382d27]" />
                  )}
                </div>

                {/* Dark overlay */}
                <div
                  className={`pointer-events-none absolute inset-0 transition-colors duration-500 ${
                    expanded ? "bg-black/35" : "bg-black/60"
                  }`}
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

                {/* Expanded information */}
                <div
                  aria-hidden={!expanded}
                  className={`pointer-events-none absolute inset-0 z-10 flex flex-col justify-end overflow-hidden p-7 text-white transition-opacity duration-500 xl:p-12 ${
                    expanded ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="w-full max-w-[620px]">
                    <p className="mb-4 text-[10px] font-medium uppercase tracking-[.28em] text-white/80">
                      A HEIGHT EXPERIENCE
                    </p>

                    <h3 className="text-[clamp(1.8rem,3.2vw,3.7rem)] font-light leading-[1.1] tracking-[-.05em]">
                      {title}
                    </h3>

                    {description && (
                      <p className="mt-5 line-clamp-4 max-w-lg text-sm leading-7 text-white/85">
                        {description}
                      </p>
                    )}

                    <span className="mt-7 inline-flex min-h-11 items-center gap-6 border-b border-white/70 pb-2 text-[11px] font-medium uppercase tracking-[.2em]">
                      More info
                      <span
                        aria-hidden="true"
                        className="text-lg transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                      >
                        ↗
                      </span>
                    </span>
                  </div>
                </div>

                {/* Collapsed vertical title */}
                <div
                  aria-hidden={expanded}
                  className={`pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden px-2 py-12 transition-opacity duration-300 ${
                    expanded
                      ? "opacity-0"
                      : "opacity-100 delay-150"
                  }`}
                >
                  <div className="flex h-full w-full items-center justify-center overflow-hidden">
                    <h3
                      title={title}
                      className="max-h-full max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-[clamp(0.85rem,1.3vw,1.25rem)] font-light leading-tight tracking-[-.025em] text-white"
                      style={{
                        writingMode: "vertical-rl",
                        transform: "rotate(180deg)",
                      }}
                    >
                      {shortTitle}
                    </h3>
                  </div>
                </div>

                {/* Panel number */}
                <span className="pointer-events-none absolute bottom-5 left-1/2 z-20 -translate-x-1/2 text-[10px] tracking-[.2em] text-white/75">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Panel separator */}
                {index !== items.length - 1 && (
                  <div className="pointer-events-none absolute right-0 top-0 z-30 h-full w-px bg-white/20" />
                )}
              </Link>
            );
          })}
        </motion.div>
      </div>

      {/* Mobile and tablet */}
      <div className="grid gap-5 sm:grid-cols-2 lg:hidden">
        {items.map((offer) => (
          <PackageCard
            key={offer.id}
            item={{
              ...offer,
              subtitle: offer.description,
            }}
            to={`/offers/${offer.id}`}
          />
        ))}
      </div>
    </>
  );
}

export default function OffersSection({ offers }) {
  const reduceMotion = useReducedMotion();
  const [page, setPage] = useState(0);

  const safeOffers = Array.isArray(offers) ? offers : [];
  const totalPages = Math.ceil(
    safeOffers.length / ITEMS_PER_PAGE
  );

  const currentPage = Math.min(
    page,
    Math.max(0, totalPages - 1)
  );

  const visibleOffers = safeOffers.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
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
          <SectionRule
            number="08"
            title="Membership & offers"
          />
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
                Made for{" "}
                <em className="text-clay">you.</em>
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
              initial={
                reduceMotion
                  ? false
                  : { opacity: 0, y: 40 }
              }
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
                  initial={
                    reduceMotion
                      ? false
                      : { opacity: 0, x: 30 }
                  }
                  animate={{ opacity: 1, x: 0 }}
                  exit={
                    reduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, x: -30 }
                  }
                  transition={{
                    duration: reduceMotion ? 0 : 0.45,
                    ease,
                  }}
                >
                  <OffersAccordion items={visibleOffers} />
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
                  {Array.from(
                    { length: totalPages },
                    (_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => changePage(index)}
                        aria-label={`Go to page ${index + 1}`}
                        aria-current={
                          currentPage === index
                            ? "page"
                            : undefined
                        }
                        className={`h-2 rounded-full transition-all duration-300 ${
                          currentPage === index
                            ? "w-8 bg-clay"
                            : "w-2 bg-clay/25 hover:bg-clay/60"
                        }`}
                      />
                    )
                  )}
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
