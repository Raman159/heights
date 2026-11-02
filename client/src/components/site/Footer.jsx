
import React, { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Facebook,
  Instagram,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  motion,
  useReducedMotion,
} from "framer-motion";

import { get } from "../../api";
import { useToast } from "../Toast";
import BrandButton from "./BrandButton";

/* ---------------------------------------
   Navigation
--------------------------------------- */

const LINKS = [
  ["Spa", "/spa"],
  ["Gym", "/gym"],
  ["Wellness", "/wellness"],
  ["Restro", "/restro"],
  ["Events", "/events"],
  ["Contact Us", "/contact"],
];

const ease = [0.22, 1, 0.36, 1];

export default function Footer() {
  const notify = useToast();
  const reduceMotion = useReducedMotion();

  const [contact, setContact] = useState(null);

  /* ---------------------------------------
     Backend settings
  --------------------------------------- */

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

  const whatsapp = contact?.whatsapp_number
    ?.replace(/\D/g, "");

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

  /* ---------------------------------------
     Animation
  --------------------------------------- */

  const reveal = {
    hidden: {
      opacity: reduceMotion ? 1 : 0,
      y: reduceMotion ? 0 : 25,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const viewport = {
    once: false,
    amount: 0.1,
  };

  return (
    <footer className="relative overflow-hidden border-t border-ink/10 bg-cream text-ink">

      {/* MAIN FOOTER */}
      <div className="shell">

        <div className="grid lg:grid-cols-[42%_58%]">

          {/* LEFT — LARGE EDITORIAL NAVIGATION */}
          <div className="border-b border-ink/10 py-16 md:py-20 lg:border-b-0 lg:border-r lg:py-24 lg:pr-14">

            <motion.div
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              transition={{
                duration: 0.8,
                ease,
              }}
            >
              <p className="mb-10 text-[11px] uppercase tracking-[.22em] text-ink/45">
                Menu
              </p>
            </motion.div>

            <nav aria-label="Footer navigation">
              <ul className="space-y-1 md:space-y-2">
                {LINKS.map(([name, path], index) => (
                  <motion.li
                    key={path}
                    initial={{
                      opacity: reduceMotion ? 1 : 0,
                      y: reduceMotion ? 0 : 25,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: false,
                      amount: 0.1,
                    }}
                    transition={{
                      duration: 0.75,
                      delay: index * 0.05,
                      ease,
                    }}
                  >
                    <Link
                      to={path}
                      className="group flex w-fit items-center gap-5 py-1 text-[clamp(2.8rem,5vw,5.5rem)] font-light leading-[1.12] tracking-[-.065em] transition-colors duration-300 hover:text-clay"
                    >
                      <span className="transition-transform duration-500 ease-out group-hover:translate-x-3">
                        {name}
                      </span>

                      <ArrowUpRight
                        size={22}
                        strokeWidth={1.2}
                        className="opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                      />
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
          </div>

          {/* RIGHT — INFORMATION */}
          <div className="py-16 md:py-20 lg:py-24 lg:pl-14">

            <div className="grid gap-x-10 gap-y-16 sm:grid-cols-2">

              {/* EXPERIENCES */}
              <motion.div
                variants={reveal}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                transition={{ duration: 0.85, ease }}
              >
                <h3 className="mb-10 text-[11px] font-medium uppercase tracking-[.2em] text-ink/45">
                  Experiences
                </h3>

                <div className="space-y-4">
                  {[
                    ["Restro", "/restro"],
                    ["Wellness", "/wellness"],
                    ["Spa", "/spa"],
                    ["Gym & Fitness", "/gym"],
                    ["Events", "/events"],
                  ].map(([name, path]) => (
                    <Link
                      key={path}
                      to={path}
                      className="group flex w-fit items-center gap-2 text-[15px] text-ink/75 transition-colors duration-300 hover:text-clay"
                    >
                      {name}

                      <ArrowUpRight
                        size={14}
                        className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      />
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* LOCATION */}
              <motion.div
                variants={reveal}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                transition={{
                  duration: 0.85,
                  delay: 0.05,
                  ease,
                }}
              >
                <h3 className="mb-10 text-[11px] font-medium uppercase tracking-[.2em] text-ink/45">
                  Visit us
                </h3>

                <div className="space-y-6">

                  {contact?.address && (
                    <a
                      href="https://maps.app.goo.gl/QPqg5DpUnAMyYwJd8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-2 text-[15px] leading-7 text-ink/75 transition-colors hover:text-clay"
                    >
                      <span>{contact.address}</span>

                      <ArrowUpRight
                        size={15}
                        className="mt-1 shrink-0"
                      />
                    </a>
                  )}

                  {contact?.opening_hours && (
                    <p className="whitespace-pre-line text-[15px] leading-8 text-ink/70">
                      {contact.opening_hours}
                    </p>
                  )}
                </div>
              </motion.div>

              {/* CONTACT */}
              <motion.div
                variants={reveal}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                transition={{
                  duration: 0.85,
                  ease,
                }}
              >
                <h3 className="mb-9 text-[11px] font-medium uppercase tracking-[.2em] text-ink/45">
                  Get in touch
                </h3>

                <div className="space-y-4">

                  {contact?.whatsapp_number && (
                    <a
                      href={
                        whatsapp
                          ? `https://wa.me/${whatsapp}`
                          : undefined
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-fit text-[15px] text-ink/75 transition-colors hover:text-clay"
                    >
                      {contact.whatsapp_number}
                    </a>
                  )}

                  {contact?.contact_email && (
                    <a
                      href={`mailto:${contact.contact_email}`}
                      className="block w-fit break-all text-[15px] text-ink/75 transition-colors hover:text-clay"
                    >
                      {contact.contact_email}
                    </a>
                  )}
                </div>

                {/* Booking */}
                <div className="mt-8">
                  <BrandButton
                    to="/contact"
                    size="large"
                    className="py-2"
                  >
                    Book an Appointment
                  </BrandButton>
                </div>
              </motion.div>

              {/* BRAND / SOCIAL */}
              <motion.div
                variants={reveal}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                transition={{
                  duration: 0.85,
                  delay: 0.05,
                  ease,
                }}
              >
                <h3 className="mb-9 text-[11px] font-medium uppercase tracking-[.2em] text-ink/45">
                  Follow along
                </h3>

                {social.length > 0 && (
                  <div className="space-y-4">
                    {social.map(
                      ({ label, href, Icon }) => (
                        <a
                          key={label}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex w-fit items-center gap-3 text-[15px] text-ink/75 transition-colors hover:text-clay"
                        >
                          <Icon
                            size={17}
                            strokeWidth={1.5}
                          />

                          <span>{label}</span>

                          <ArrowUpRight
                            size={14}
                            className="opacity-0 transition-opacity group-hover:opacity-100"
                          />
                        </a>
                      )
                    )}
                  </div>
                )}
              </motion.div>
            </div>

            {/* BRAND MESSAGE */}
            <motion.div
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              transition={{
                duration: 0.9,
                ease,
              }}
              className="mt-16 border-t border-ink/10 pt-10 md:mt-20"
            >
              <p className="max-w-xl text-[clamp(1.4rem,2vw,2.1rem)] font-light leading-[1.4] tracking-[-.035em] text-ink/80">
                A place to dine, move, heal,
                <br />
                and simply{" "}
                <em className="text-clay">
                  be.
                </em>
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* LARGE BRAND SIGNATURE */}
      <div className="border-t border-ink/10">
        <div className="shell">
          <motion.div
            initial={{
              opacity: reduceMotion ? 1 : 0,
              y: reduceMotion ? 0 : 45,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: false,
              amount: 0.1,
            }}
            transition={{
              duration: 1.1,
              ease,
            }}
            className="overflow-hidden py-7 text-center md:py-10"
          >
          
          </motion.div>
        </div>
      </div>

      {/* BOTTOM COPYRIGHT */}
      <div className="border-t border-ink/10">
        <div className="shell flex flex-wrap items-center justify-between gap-5 py-6 text-[11px] text-ink/55">
          <span>
            © {new Date().getFullYear()} HEIGHT
            Restro & Wellness. All rights reserved.
          </span>

          <div className="flex items-center gap-6">
            <Link
              to="/contact"
              className="transition-colors hover:text-ink"
            >
              Contact
            </Link>

            <Link
              to="/terms"
              className="transition-colors hover:text-ink"
            >
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
