import React from "react";
import { motion, useReducedMotion } from "framer-motion";

import FeatureAccordion from "../site/FeatureAccordion";
import EmptyState from "../site/EmptyState";
import BrandButton from "../site/BrandButton";
import { SectionRule, SectionIntro } from "./SectionDetails";

const ease = [0.22, 1, 0.36, 1];
const ITEMS_PER_PAGE = 3;

export default function OffersSection({ offers }) {
  const reduceMotion = useReducedMotion();

  const safeOffers = Array.isArray(offers) ? offers : [];
  const visibleOffers = safeOffers.slice(0, ITEMS_PER_PAGE);

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
          {/* <SectionRule number="08" title="Membership & offers" /> */}
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
            {/* Offer cards keep each experience and its pricing visible together. */}
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
              <FeatureAccordion
                items={visibleOffers}
                getTo={(offer) => `/offers/${offer.id}`}
                actionLabel="View offer"
                eyebrow="SELECTED EXPERIENCES"
                priceClassName="border border-white/35 bg-white/15 shadow-lg backdrop-blur-md"
                pricePosition="bottom-right"
              />

              {safeOffers.length > ITEMS_PER_PAGE && (
                <div className="mt-8 flex justify-center">
                  <BrandButton to="/offers" size="small" tone="clay">
                    View more offers
                  </BrandButton>
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
