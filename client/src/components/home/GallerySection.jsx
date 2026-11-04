import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { mediaUrl } from "../../api";
import useCollection from "../../hooks/useCollection";
import { SectionRule } from "./SectionDetails";

const ease = [0.22, 1, 0.36, 1];

export default function GallerySection() {
  const gallery = useCollection("gallery");
  const reduceMotion = useReducedMotion();
  const available = gallery?.filter((item) => item.image_url).slice(0, 4) || [];

  if (!available.length) return null;

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
  const viewport = { once: false, amount: 0.15 };

  return (
    <section
      aria-label="Height visual gallery"
      className="bg-[#ece5d9] py-20 md:py-32"
    >
      <div className="shell">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={reveal}
          transition={{ duration: 0.9, ease }}
        >
          {/* <SectionRule number="07" title="A glimpse of Height" /> */}
        </motion.div>

        <div className="mb-12 flex items-end justify-between gap-6">
          <motion.h2
            initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 45 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.1, margin: "0px 0px -30px 0px" }}
            transition={{ duration: 1.1, ease }}
            className="text-[clamp(3.6rem,8vw,9rem)] font-light leading-[.96] tracking-[-.07em]"
          >
            Moments at <em className="text-clay">Height.</em>
          </motion.h2>
          <motion.span
            initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.7, ease }}
            className="hidden text-[11px] uppercase tracking-[.2em] text-clay sm:block"
          >
            The gallery / 0{available.length}
          </motion.span>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-12 md:gap-5">
          {available.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 55 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.9, delay: (index % 2) * 0.12, ease }}
              className={`group relative block overflow-hidden ${
                index === 0
                  ? "col-span-2 h-[350px] md:col-span-7 md:h-[640px]"
                  : index === 1
                    ? "h-[280px] md:col-span-5 md:h-[640px]"
                    : "h-[260px] md:col-span-6 md:h-[460px]"
              }`}
            >
              <Link
                to="/gallery"
                aria-label={`View ${photo.title} in the gallery`}
                className="absolute inset-0 block"
              >
                <motion.img
                  src={mediaUrl(photo.image_url)}
                  alt={photo.title}
                  loading="lazy"
                  initial={{ scale: reduceMotion ? 1 : 1.12 }}
                  whileInView={{ scale: 1 }}
                  viewport={viewport}
                  transition={{ duration: 1.3, ease }}
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.05] motion-reduce:transition-none"
                />
                <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-700 group-hover:bg-black/10" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/45 to-transparent p-5">
                  <span className="block text-sm text-white">{photo.title}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
