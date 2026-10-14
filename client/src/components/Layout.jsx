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
    // ["/contact", "Contact Us"],
  ];
  return (
    <>
      <header
        className={
          "fixed top-0 left-0 z-50 w-full transition-all duration-500 " +
          (solid
            ? "bg-cream/95 backdrop-blur-xl shadow-sm py-2"
            : "bg-transparent py-4")
        }
      >
        <div className="shell flex items-center justify-between gap-5">
          <Link to="/" aria-label="Height home">
            <img
              src="/logo.png"
              alt="HEIGHT Restro & Wellness"
              className={
                "w-24 md:w-12 object-contain transition " +
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
            className={solid ? "lg:hidden text-ink" : "lg:hidden text-white"}
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
        <div className="shell grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <img
              src="/logo.png"
              className="w-32 brightness-0 invert"
              alt="HEIGHT"
            />
            <p className="text-cream/65 max-w-md mt-5 leading-8">
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
              className="flex gap-2 items-center text-cream/70 mb-3"
            >
              <Mail size={16} />
              Contact & enquiries
            </Link>
            <div className="flex gap-4">
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
        <div className="shell border-t border-white/15 mt-16 pt-6 text-cream/50 text-xs flex flex-wrap justify-between gap-3">
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
          viewBox="0 0 24 24"
          className="size-7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.7-5.2A8.5 8.5 0 1 1 21 11.5Z" />
          <path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 .8a4 4 0 0 1-2-2l.8-1-1-2L9 8.5Z" />
        </svg>
      </a>
    </>
  );
}






