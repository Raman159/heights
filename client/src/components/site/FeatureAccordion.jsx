import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

import { mediaUrl } from "../../api";
import PackageCard from "./PackageCard";
import BrandButton from "./BrandButton";
import RichText from "./RichText";
import { formatOfferPrice, getOfferPrices } from "../../utils/offerPricing";

const ease = [0.22, 1, 0.36, 1];

function getImage(item) {
  const sources = [
    item.image,
    item.img,
    item.imageUrl,
    item.image_url,
    item.thumbnail,
    item.cover,
    item.coverImage,
    item.featuredImage,
    item.images?.[0],
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

function getShortTitle(item) {
  if (item.shortTitle || item.short_title) {
    return item.shortTitle || item.short_title;
  }

  const title = String(item.title || item.name || "Experience");
  return title
    .replace(/\s*[—–]\s*(?:NPR|NRs?\.?|Rs\.?)?\s*[\d,]+.*$/i, "")
    .replace(/\s*[-|]\s*(?:NPR|NRs?\.?|Rs\.?)\s*[\d,]+.*$/i, "")
    .replace(/\s+(?:NPR|NRs?\.?|Rs\.?)\s*[\d,]+.*$/i, "")
    .trim();
}

export default function FeatureAccordion({
  items,
  getTo,
  actionLabel = "More info",
  eyebrow = "A HEIGHT EXPERIENCE",
  priceClassName = "",
  pricePosition = "top-center",
}) {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const activeIndex = Math.min(active, items.length - 1);

  const columns = items
    .map((_, index) => {
      if (items.length === 1) return "100%";
      if (index === activeIndex) return "70%";
      return `${30 / (items.length - 1)}%`;
    })
    .join(" ");

  return (
    <>
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
          {items.map((item, index) => {
            const expanded = activeIndex === index;
            const title = item.title || item.name || "Experience";
            const shortTitle = getShortTitle(item);
            const description = item.description || item.subtitle || "";
            const image = getImage(item);
            const prices = getOfferPrices(item);
            const pricePositionClass =
              pricePosition === "bottom-right"
                ? "left-auto right-5 top-auto bottom-5 w-fit xl:right-8 xl:bottom-8"
                : "inset-x-5 top-5 xl:inset-x-8 xl:top-8";

            return (
              <Link
                key={item.id}
                to={getTo(item)}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                aria-label={`View ${title}`}
                className="group relative block h-full min-w-0 overflow-hidden bg-[#5a4a3e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white"
              >
                <div className="absolute inset-0 overflow-hidden">
                  {image ? (
                    <img
                      src={mediaUrl(image)}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-[#ab9278] via-[#776457] to-[#382d27]" />
                  )}
                </div>

                <div
                  className={`pointer-events-none absolute inset-0 transition-colors duration-500 ${
                    expanded ? "bg-black/35" : "bg-black/60"
                  }`}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

                {prices && (
                  <p
                    aria-hidden={!expanded}
                    className={`pointer-events-none absolute z-20 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-full px-3 py-2 text-white transition-opacity duration-300 ${pricePositionClass} ${
                      priceClassName || "bg-black/55 backdrop-blur-sm"
                    } ${
                      expanded ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <span className="text-xs text-white/75 line-through">
                      Rs. {formatOfferPrice(prices.original)}
                    </span>
                    <span className="text-sm font-semibold">
                      Rs. {formatOfferPrice(prices.discounted)}
                    </span>
                  </p>
                )}

                <div
                  aria-hidden={!expanded}
                  className={`pointer-events-none absolute inset-0 z-10 flex flex-col justify-end overflow-hidden p-7 text-white transition-opacity duration-500 xl:p-12 ${
                    expanded ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="w-full max-w-[620px]">
                    <p className="mb-4 text-[10px] font-medium uppercase tracking-[.28em] text-white/80">
                      {eyebrow}
                    </p>
                    <h3 className="text-[clamp(1.8rem,3.2vw,3.7rem)] font-light leading-[1.1] tracking-[-.05em]">
                      {title}
                    </h3>
                    {description && (
                      <RichText
                        text={description}
                        allowLinks={false}
                        className="mt-5 line-clamp-4 max-w-lg text-sm leading-7 text-white/85"
                      />
                    )}
                    <BrandButton
                      as="span"
                      tone="glass"
                      size="small"
                      className="mt-7"
                    >
                      {actionLabel}
                    </BrandButton>
                  </div>
                </div>

                <div
                  aria-hidden={expanded}
                  className={`pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden px-2 py-12 transition-opacity duration-300 ${
                    expanded ? "opacity-0" : "opacity-100 delay-150"
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

                <span className="pointer-events-none absolute bottom-5 left-1/2 z-20 -translate-x-1/2 text-[10px] tracking-[.2em] text-white/75">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {index !== items.length - 1 && (
                  <div className="pointer-events-none absolute right-0 top-0 z-30 h-full w-px bg-white/20" />
                )}
              </Link>
            );
          })}
        </motion.div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:hidden">
        {items.map((item) => (
          <PackageCard
            key={item.id}
            item={{
              ...item,
              image_url: getImage(item),
              subtitle: item.description || item.subtitle,
            }}
            to={getTo(item)}
            actionLabel={actionLabel}
            priceClassName={priceClassName}
          />
        ))}
      </div>
    </>
  );
}