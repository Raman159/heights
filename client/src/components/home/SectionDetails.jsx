import React from "react";
import { motion, useReducedMotion } from "motion/react";
export function SectionRule({ number, title, light = false }) {
  return (
    <div
      className={`mb-9 flex items-center justify-between gap-4 border-t pt-5 text-[10px] font-medium uppercase tracking-[.22em] md:mb-12 ${light ? "border-white/35 text-white/75" : "border-ink/20 text-clay"}`}
    >
      <span>{number} / HEIGHT</span>
      <span>{title}</span>
    </div>
  );
}
export function SectionIntro({ eyebrow, title, description }) {
  return (
    <div className="mb-12 grid gap-5 md:mb-16 lg:grid-cols-[1.6fr_.4fr] lg:items-end lg:gap-12">
      <div>
        <p className="eyebrow mb-6">{eyebrow}</p>
        <h2 className="max-w-5xl text-[clamp(3.7rem,8.3vw,9.3rem)] font-light leading-[.95] tracking-[-.068em]">
          {title}
        </h2>
      </div>
      {description && (
        <p className="max-w-xs text-sm leading-7 text-muted lg:mb-2 lg:ml-auto">
          {description}
        </p>
      )}
    </div>
  );
}
// Motion only when visible; content is present without JavaScript animation completion.
export function SoftReveal({ children, className = "", delay = 0 }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={false}
      whileInView={reduced ? undefined : { opacity: [0.85, 1], y: [16, 0] }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
