
import React, { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Facebook,
  Instagram,
  MapPin,
  Clock3,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

import { get } from "../../api";
import { getTenDigitPhoneNumber, parsePhoneNumbers } from "../../utils/phoneNumbers";
import { useToast } from "../Toast";
import BrandButton from "./BrandButton";

const EASE = [0.22, 1, 0.36, 1];

const LINKS = [
  ["Spa", "/spa"],
  ["Gym", "/gym"],
  ["Wellness", "/wellness"],
  ["Restro", "/restro"],
  ["Events", "/events"],
  ["Contact Us", "/contact"],
];

// Editorial category cards.
// These are navigation categories, not invented service packages.
const FEATURES = [
  {
    title: "The Art of Relaxation",
    subtitle: "Explore our spa experiences",
    image: "/media/spa-treatment.webp",
    to: "/spa",
  },
  {
    title: "Strength & Movement",
    subtitle: "Explore gym and fitness",
    image: "/media/gym-interior.webp",
    to: "/gym",
  },
  {
    title: "The Dining Experience",
    subtitle: "Discover our restaurant",
    image: "/media/terrace-lounge.webp",
    to: "/restro",
  },
  {
    title: "Moments to Remember",
    subtitle: "Explore events and celebrations",
    image: "/media/infinity-pool.webp",
    to: "/events",
  },
];

function RevealBlock({ children, delay = 0, className = "" }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{
        opacity: reduceMotion ? 1 : 0,
        y: reduceMotion ? 0 : 28,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.85,
        delay,
        ease: EASE,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children, line = false }) {
  return (
    <div className="flex items-center gap-5">
      <span className="shrink-0 text-[10px] font-medium uppercase tracking-[0.28em] text-clay sm:text-[11px]">
        {children}
      </span>

      {line && (
        <span
          aria-hidden="true"
          className="h-px flex-1 bg-clay/25"
        />
      )}
    </div>
  );
}

function FeatureCard({ item, index }) {
  return (
    <RevealBlock delay={index * 0.06}>
      <Link
        to={item.to}
        className="group relative block h-[185px] overflow-hidden rounded-[16px] bg-ink sm:h-[210px] lg:h-[clamp(165px,12vw,220px)]"
        aria-label={item.title}
      >
        <img
          src={item.image}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
        />

        {/* Editorial image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/5 transition-colors duration-500 group-hover:from-black/85" />

        {/* Top index */}
        <div className="absolute right-5 top-5 text-[10px] tracking-[0.18em] text-white/70">
          0{index + 1}
        </div>

        {/* Card content */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 sm:p-6">
          <div className="min-w-0">
            <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-white/70">
              {item.subtitle}
            </p>

            <h3 className="max-w-[280px] text-[clamp(1.2rem,1.8vw,1.9rem)] font-light leading-[1.12] tracking-[-0.045em] text-white">
              {item.title}
            </h3>
          </div>

          <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/45 text-white transition-all duration-500 group-hover:rotate-45 group-hover:bg-white group-hover:text-ink">
            <ArrowUpRight size={18} strokeWidth={1.4} />
          </span>
        </div>
      </Link>
    </RevealBlock>
  );
}

export default function Footer() {
  const notify = useToast();
  const reduceMotion = useReducedMotion();

  const [contact, setContact] = useState(null);

  // Preserve the existing backend settings call.
  useEffect(() => {
    let mounted = true;

    get("/public/settings")
      .then((data) => {
        if (mounted) {
          setContact(data);
        }
      })
      .catch((error) => {
        if (mounted) {
          notify(error.message, "error");
        }
      });

    return () => {
      mounted = false;
    };
  }, [notify]);

  const phoneNumbers = parsePhoneNumbers(contact?.whatsapp_number);

  const social = [
    {
      label: "Instagram",
      href: contact?.instagram_url,
      Icon: Instagram,
    },
    {
      label: "Facebook",
      href: contact?.facebook_url,
      Icon: Facebook,
    },
  ].filter((item) => item.href);

  return (
    <footer className="relative isolate overflow-hidden border-t border-ink/10 bg-cream text-ink">

      {/* Subtle decorative atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 -z-10 h-[600px] w-[600px] rounded-full bg-clay/[0.035] blur-[110px]"
      />

      <div className="mx-auto w-full max-w-[1800px] px-5 sm:px-8 lg:px-12 xl:px-16">

        {/* Top brand signature */}
        <div className="flex items-center justify-between border-b border-ink/10 py-7 md:py-9">
          <Link
            to="/"
            className="group inline-flex items-center gap-3"
            aria-label="HEIGHT home"
          >
            <img
              src="/logo.png"
              alt="HEIGHT Restro & Wellness"
              className="h-12 w-auto max-w-[120px] object-contain transition-opacity duration-300 group-hover:opacity-70"
            />
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden text-[10px] uppercase tracking-[0.25em] text-ink/50 sm:block">
              Your destination for more
            </span>

            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                window.scrollTo({
                  top: 0,
                  behavior: reduceMotion ? "auto" : "smooth",
                });
              }}
              className="flex size-10 items-center justify-center rounded-full border border-ink/20 transition-colors duration-300 hover:border-clay hover:bg-clay hover:text-white"
              aria-label="Back to top"
            >
              <ArrowUpRight
                size={17}
                strokeWidth={1.5}
                className="-rotate-45"
              />
            </a>
          </div>
        </div>

        {/* Main two-column editorial composition */}
        <div className="grid lg:grid-cols-[32%_68%] xl:grid-cols-[31%_69%]">

          {/* LEFT: LARGE NAVIGATION */}
          <div className="relative border-b border-ink/10 py-12 lg:border-b-0 lg:border-r lg:py-16 lg:pr-10 xl:pr-14">

            <RevealBlock>
              <SectionLabel line>
                Menu
              </SectionLabel>
            </RevealBlock>

            <nav
              aria-label="Footer navigation"
              className="mt-9 md:mt-11"
            >
              <ul className="space-y-1">
                {LINKS.map(([name, path], index) => (
                  <motion.li
                    key={path}
                    initial={{
                      opacity: reduceMotion ? 1 : 0,
                      y: reduceMotion ? 0 : 20,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.1,
                    }}
                    transition={{
                      duration: 0.7,
                      delay: index * 0.045,
                      ease: EASE,
                    }}
                  >
                    <Link
                      to={path}
                      className="group flex w-full items-center justify-between gap-4 py-1.5 text-[clamp(2.4rem,3.8vw,4.8rem)] font-light leading-[1.08] tracking-[-0.065em] transition-colors duration-500 hover:text-clay"
                    >
                      <span className="transition-transform duration-500 group-hover:translate-x-2">
                        {name}
                      </span>

                      <span
                        aria-hidden="true"
                        className="size-2 shrink-0 -translate-x-3 translate-y-2 rounded-full bg-clay opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                      />
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* Small editorial footer note */}
            <RevealBlock className="mt-14 hidden lg:block xl:mt-20">
              <div className="h-px w-12 bg-clay/45" />

              <p className="mt-6 max-w-[270px] text-[14px] font-light leading-7 text-ink/60">
                A place to dine, move, restore and simply be.
              </p>
            </RevealBlock>
          </div>

          {/* RIGHT SIDE */}
          <div className="min-w-0 py-12 lg:py-16 lg:pl-10 xl:pl-14">

            {/* Featured editorial cards */}
            <RevealBlock>
              <SectionLabel line>
                Featured Experiences
              </SectionLabel>
            </RevealBlock>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 md:gap-4">
              {FEATURES.map((item, index) => (
                <FeatureCard
                  key={item.to}
                  item={item}
                  index={index}
                />
              ))}
            </div>

            {/* Divider */}
            <div className="my-10 h-px bg-ink/10 md:my-12" />

            {/* Contact information */}
            <div className="grid gap-10 sm:grid-cols-2 sm:gap-10">

              {/* VISIT US */}
              <RevealBlock>
                <SectionLabel>
                  Visit Us
                </SectionLabel>

                <div className="mt-7 space-y-6">
                  {contact?.address && (
                    <a
                      href="https://maps.app.goo.gl/QPqg5DpUnAMyYwJd8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-4 text-[14px] leading-7 text-ink/75 transition-colors hover:text-clay md:text-[15px]"
                    >
                      <MapPin
                        size={18}
                        strokeWidth={1.4}
                        className="mt-1 shrink-0 text-clay"
                      />

                      <span className="flex-1">
                        {contact.address}
                      </span>

                      <ArrowUpRight
                        size={15}
                        className="mt-1 shrink-0 opacity-50 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                      />
                    </a>
                  )}

                  {contact?.opening_hours && (
                    <div className="flex items-start gap-4">
                      <Clock3
                        size={18}
                        strokeWidth={1.4}
                        className="mt-1 shrink-0 text-clay"
                      />

                      <p className="whitespace-pre-line text-[14px] leading-8 text-ink/75 md:text-[15px]">
                        {contact.opening_hours}
                      </p>
                    </div>
                  )}
                </div>
              </RevealBlock>

              {/* GET IN TOUCH */}
              <RevealBlock delay={0.08}>
                <SectionLabel>
                  Get in Touch
                </SectionLabel>

                <div className="mt-7 space-y-4">

                  {contact?.whatsapp_number && (
                    <div className="flex items-start gap-4 text-[14px] text-ink/75 md:text-[15px]">
                      <Phone
                        size={18}
                        strokeWidth={1.4}
                        className="mt-1 shrink-0 text-clay"
                      />
                      <div className="space-y-2">
                        {phoneNumbers.map((number, index) => {
                          const digits = getTenDigitPhoneNumber(number);
                          return digits ? (
                            <a
                              key={`${number}-${index}`}
                              href={`https://wa.me/${digits}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block transition-colors hover:text-clay"
                            >
                              {number}
                            </a>
                          ) : (
                            <span
                              key={`${number}-${index}`}
                              className="block"
                            >
                              {number}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {contact?.contact_email && (
                    <a
                      href={`mailto:${contact.contact_email}`}
                      className="flex min-w-0 items-center gap-4 text-[14px] text-ink/75 transition-colors hover:text-clay md:text-[15px]"
                    >
                      <Mail
                        size={18}
                        strokeWidth={1.4}
                        className="shrink-0 text-clay"
                      />

                      <span className="break-all">
                        {contact.contact_email}
                      </span>
                    </a>
                  )}
                </div>

                {/* Existing appointment route */}
                <div className="mt-7">
                  <BrandButton
                    to="/contact"
                    size="large"
                    tone="clay"
                    markSize="size-4 md:size-5"
                    className="max-w-full"
                  >
                    Book an Appointment
                  </BrandButton>
                </div>
              </RevealBlock>
            </div>

            {/* Bottom right information */}
            <div className="mt-10 grid gap-8 border-t border-ink/10 pt-8 sm:grid-cols-[1fr_auto] sm:items-end md:mt-12">

              {/* PHILOSOPHY */}
              <RevealBlock>
                <SectionLabel>
                  Our Philosophy
                </SectionLabel>

                <p className="mt-4 max-w-[490px] text-[15px] font-light leading-7 tracking-[-0.015em] text-ink/70 sm:text-[17px]">
                  Curated moments of wellness, movement,
                  dining and celebration.
                </p>
              </RevealBlock>

              {/* SOCIAL LINKS */}
              {social.length > 0 && (
                <RevealBlock delay={0.08}>
                  <SectionLabel>
                    Follow Along
                  </SectionLabel>

                  <div className="mt-5 flex items-center gap-3">
                    {social.map(({ label, href, Icon }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        title={label}
                        className="flex size-10 items-center justify-center rounded-full border border-ink/15 text-ink/75 transition-all duration-300 hover:-translate-y-1 hover:border-clay hover:bg-clay hover:text-white"
                      >
                        <Icon
                          size={18}
                          strokeWidth={1.6}
                        />
                      </a>
                    ))}
                  </div>
                </RevealBlock>
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col gap-4 border-t border-ink/10 py-6 text-[11px] text-ink/55 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} HEIGHT Restro & Wellness.
            All rights reserved.
          </span>

          <div className="flex items-center gap-6">
            <Link
              to="/contact"
              className="transition-colors hover:text-clay"
            >
              Contact
            </Link>

            <Link
              to="/terms"
              className="transition-colors hover:text-clay"
            >
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
