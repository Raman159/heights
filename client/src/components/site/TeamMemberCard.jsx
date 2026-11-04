import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

const ICONS = {
  x: (
    <path d="M18.244 2H21.5l-7.19 8.21L22.75 22h-6.6l-5.17-6.76L5.06 22H1.8l7.7-8.8L1.5 2h6.77l4.67 6.17L18.244 2Zm-1.16 18h1.82L7.01 3.9H5.06L17.084 20Z" />
  ),
  linkedin: (
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11.5H3V9.75Zm6.5 0h3.83v1.57h.06c.53-1 1.84-2.07 3.78-2.07 4.04 0 4.78 2.66 4.78 6.12v5.88h-4v-5.2c0-1.24-.02-2.84-1.73-2.84-1.73 0-2 1.35-2 2.75v5.29h-4V9.75Z" />
  ),
  instagram: (
    <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.25-3.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z" />
  ),
  email: (
    <path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm1 2.6V17h16V7.6l-8 5.4-8-5.4ZM5.6 7 12 11.3 18.4 7H5.6Z" />
  ),
};

export default function TeamMemberCard({ member, index = 0, className = "" }) {
  const reduceMotion = useReducedMotion();
  const { fullName, department, designation, biography, image, socials = [] } = member;
  const number = String(index + 1).padStart(2, "0");

  return (
    <motion.article
      tabIndex={0}
      initial={reduceMotion ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay: index * 0.1, ease }}
      className={`group relative isolate aspect-[3/4] w-full overflow-hidden bg-ink/10 text-white outline-none focus-visible:ring-2 focus-visible:ring-clay ${className}`}
    >
      {/* Full-bleed photo */}
      <img
        src={image}
        alt={fullName}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06] group-focus-within:scale-[1.06]"
      />

      {/* Resting gradient for legible name */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20 transition-opacity duration-700 group-hover:opacity-70 group-focus-within:opacity-70" />

      {/* Top tags */}
      <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between p-4">
        <span className="border border-white/30 bg-white/10 px-3 py-1.5 text-[10px] uppercase tracking-[.18em] backdrop-blur-md">
          {department}
        </span>
        {/* <span className="font-mono text-[11px] tracking-[.2em] text-white/80">
          {number}
        </span> */}
      </div>

      {/* Resting caption: fades out on hover */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-5 transition-all duration-700 ease-out group-hover:translate-y-4 group-hover:opacity-0 group-focus-within:translate-y-4 group-focus-within:opacity-0 sm:p-6">
        <h3 className="text-2xl font-medium leading-tight tracking-tight drop-shadow-sm sm:text-[28px]">
          {fullName}
        </h3>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[.18em] text-white/80">
          {designation}
        </p>
      </div>

      {/* Glass panel: slides up on hover / focus / tap */}
      <div
        className="absolute inset-x-3 bottom-3 z-20 translate-y-[110%] border border-white/25 bg-white/[0.14] p-5 opacity-0 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl backdrop-saturate-150 transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 sm:inset-x-4 sm:bottom-4 sm:p-6"
      >
        {/* Soft inner highlight */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />

        <h3 className="text-xl font-medium leading-tight tracking-tight sm:text-2xl">
          {fullName}
        </h3>
        <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[.18em] text-white/75">
          {designation}
        </p>

        <p className="mt-4 text-[13px] leading-6 text-white/90 sm:text-sm sm:leading-7">
          {biography}
        </p>

        {socials.length > 0 && (
          <>
            <div className="my-4 h-px w-full bg-white/25" />
            <ul className="flex items-center gap-2">
              {socials.map(({ type, href }) => (
                <li key={type}>
                  <a
                    href={href}
                    target={type === "email" ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    aria-label={`${fullName} on ${type}`}
                    className="grid h-10 w-10 place-items-center border border-white/30 bg-white/10 text-white backdrop-blur-md transition-colors duration-300 hover:border-white hover:bg-white hover:text-ink"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      {ICONS[type]}
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </motion.article>
  );
}