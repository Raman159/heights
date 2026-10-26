import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { get } from "../api";
import { useToast } from "./Toast";
import {
  Menu,
  X,
  ChevronDown,
  Instagram,
  Facebook,
  Mail,
  ArrowUpRight,
} from "lucide-react";
export function Reveal({ children, className = "" }) {
  useEffect(() => {
    const ob = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            ob.unobserve(e.target);
          }
        }),
      { threshold: 0.08 },
    );
    document
      .querySelectorAll(".reveal:not(.visible)")
      .forEach((el) => ob.observe(el));
    return () => ob.disconnect();
  }, []);
  return <div className={"reveal " + className}>{children}</div>;
}
export default function Layout({ children }) {
  const [scroll, setScroll] = useState(false),
    [menu, setMenu] = useState(false),
    [whatsappNumber, setWhatsappNumber] = useState("");
  let loc = useLocation();
  const notify = useToast();
  useEffect(() => {
    let update = () => setScroll(window.scrollY > 40);
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    get("/public/settings")
      .then((settings) => setWhatsappNumber(settings.whatsapp_number || ""))
      .catch((error) => notify(error.message, "error"));
  }, [notify]);
  useEffect(() => {
    setMenu(false);
    window.scrollTo(0, 0);
  }, [loc.pathname]);
  const home = loc.pathname === "/",
    solid = scroll || !home || menu;
  const whatsappDigits = whatsappNumber.replace(/\D/g, "");
  const whatsappHref =
    whatsappDigits.length >= 7 && whatsappDigits.length <= 15
      ? `https://wa.me/${whatsappDigits}?text=${encodeURIComponent("Hello! I would like to inquire about your services.")}`
      : "/contact";
  const nav = [
    ["/", "Home"],
    ["/restro", "Restro"],
    ["/offers", "Offers"],
    ["/blog", "Blog"],
    ["/contact", "Contact Us"],
  ];
  return (
    <>
      <header
        className={
          "fixed top-0 left-0 z-50 w-full transition-all duration-500 " +
          (solid
            ? "bg-cream/95 backdrop-blur-xl shadow-sm py-1 md:py-2"
            : "bg-transparent py-2 md:py-4")
        }
      >
        <div className="shell flex items-center justify-between gap-5 ">
          <Link to="/" aria-label="Height home">
            <img
              src="/logo.png"
              alt="HEIGHT Restro & Wellness"
              className={
                "w-14 md:w-12 object-contain transition " +
                (!solid ? "brightness-0 invert" : "")
              }
            />
          </Link>
          <nav
            className={
              "hidden lg:flex items-center gap-8 text-sm font-medium " +
              (solid ? "text-ink" : "text-white")
            }
          >
            <div className="relative group">
              <Link
                to="/wellness"
                className="flex gap-1 items-center hover:opacity-70"
              >
                Wellness <ChevronDown size={14} />
              </Link>
              <div className="absolute top-full left-0 pt-4 hidden group-hover:block">
                <div className="rounded-2xl min-w-48 p-3 bg-cream text-ink shadow-xl">
                  {[
                    ["/gym", "Gym"],
                    ["/spa", "Spa"],
                    ["/wellness", "Wellness"],
                    ["/services/salon", "Salon"],
                  ].map((x) => (
                    <Link
                      key={x[0]}
                      className="block px-3 py-2 hover:bg-skin rounded-lg"
                      to={x[0]}
                    >
                      {x[1]}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            {nav.slice(1).map(([to, label]) => (
              <NavLink key={to} to={to} className="hover:opacity-70">
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden lg:block">
            <Link
              to="/contact"
              className={
                solid
                  ? "btn"
                  : "inline-flex rounded-full px-6 py-3 bg-white text-ink font-semibold text-sm"
              }
            >
              Book an Experience <ArrowUpRight size={16} />
            </Link>
          </div>
          <button
            className={
              "lg:hidden [&_svg]:size-5 " +
              (solid ? "text-ink" : "text-white")
            }
            onClick={() => setMenu(!menu)}
            aria-label="Toggle menu"
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
        {menu && (
          <div className="lg:hidden px-[5%] py-5 bg-cream text-ink flex flex-col gap-4">
            {[
              ["/", "Home"],
              ["/wellness", "Wellness"],
              ["/spa", "Spa"],
              ["/gym", "Gym"],
              ...nav.slice(1),
            ].map(([to, l]) => (
              <Link to={to} key={to}>
                {l}
              </Link>
            ))}
          </div>
        )}
      </header>
      <main>{children}</main>
      <footer className="bg-ink text-cream pt-20 pb-8">
        <div className="shell grid gap-12 text-center md:grid-cols-4 md:text-left">
          <div className="md:col-span-2">
            <img
              src="/logo.png"
              className="mx-auto w-32 brightness-0 invert md:mx-0"
              alt="HEIGHT"
            />
            <p className="mx-auto mt-5 max-w-md leading-8 text-cream/65 md:mx-0">
              Where traditional wisdom meets modern convenience. A destination
              to dine, move, heal and reconnect.
            </p>
          </div>
          <div>
            <p className="font-semibold mb-5">Discover</p>
            {[
              ["Spa", "/spa"],
              ["Gym", "/gym"],
              ["Wellness", "/wellness"],
              ["Restro", "/restro"],
              ["Offers", "/offers"],
              ["Blog", "/blog"],
            ].map(([n, l]) => (
              <Link
                key={l}
                className="block text-cream/65 mb-3 hover:text-white"
                to={l}
              >
                {n}
              </Link>
            ))}
          </div>
          <div>
            <p className="font-semibold mb-5">Connect</p>
            <Link
              to="/contact"
              className="mb-3 flex items-center justify-center gap-2 text-cream/70 md:justify-start"
            >
              <Mail size={16} />
              Contact & enquiries
            </Link>
            <div className="flex justify-center gap-4 md:justify-start">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <Instagram />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <Facebook />
              </a>
            </div>
          </div>
        </div>
        <div className="shell mt-16 flex flex-wrap justify-center gap-3 border-t border-white/15 pt-6 text-center text-xs text-cream/50 md:justify-between md:text-left">
          <span>
            © {new Date().getFullYear()} HEIGHT Restro & Wellness. All rights
            reserved.
          </span>
        </div>
      </footer>
      <a
        href={whatsappHref}
        target={whatsappDigits.length >= 7 ? "_blank" : undefined}
        rel={whatsappDigits.length >= 7 ? "noreferrer" : undefined}
        aria-label={
          whatsappDigits.length >= 7 ? "Chat on WhatsApp" : "Contact HEIGHT"
        }
        className="fixed bottom-5 right-4 z-50 grid size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-lg transition-transform hover:scale-105"
      >
        <svg
          viewBox="0 0 32 32"
          className="size-8"
          fill="currentColor"
          fillRule="evenodd"
          aria-hidden="true"
        >
          <path d="M16.04 2C8.97 2 3.22 7.74 3.22 14.81c0 2.26.6 4.47 1.74 6.41L3.1 27l5.94-1.56a12.77 12.77 0 0 0 7 2.06h.01c7.07 0 12.82-5.75 12.82-12.82A12.74 12.74 0 0 0 16.04 2Zm.01 23.35h-.01a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-3.52.92.94-3.43-.25-.4a10.62 10.62 0 0 1-1.63-5.92c0-5.86 4.77-10.63 10.64-10.63 2.84 0 5.51 1.11 7.52 3.12a10.57 10.57 0 0 1 3.11 7.52c0 5.86-4.77 10.63-10.63 10.63Z" />
          <path d="M22.1 18.1c-.33-.17-1.95-.96-2.25-1.07-.3-.11-.52-.17-.74.17-.22.34-.85 1.07-1.04 1.29-.19.22-.38.25-.71.08-.33-.17-1.4-.52-2.66-1.65-.98-.87-1.64-1.95-1.83-2.28-.19-.34-.02-.52.14-.69.15-.15.33-.39.49-.58.17-.19.22-.33.33-.55.11-.22.06-.41-.03-.58-.08-.17-.74-1.79-1.02-2.45-.27-.64-.55-.55-.74-.56l-.63-.01c-.22 0-.58.08-.88.41-.3.33-1.15 1.12-1.15 2.73s1.18 3.17 1.34 3.39c.17.22 2.32 3.54 5.62 4.97.79.34 1.4.54 1.88.69.79.25 1.51.21 2.08.13.63-.09 1.95-.8 2.23-1.57.28-.77.28-1.43.19-1.57-.08-.14-.3-.22-.63-.39Z" />
        </svg>
      </a>
    </>
  );
}
