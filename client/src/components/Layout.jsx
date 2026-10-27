import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { get } from "../api";
import { useToast } from "./Toast";
import Footer from "./site/Footer";
import Navbar from "./site/Navbar";
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
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const loc = useLocation();
  const notify = useToast();
  useEffect(() => {
    get("/public/settings")
      .then((settings) => setWhatsappNumber(settings.whatsapp_number || ""))
      .catch((error) => notify(error.message, "error"));
  }, [notify]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [loc.pathname]);
  const whatsappDigits = whatsappNumber.replace(/\D/g, "");
  const whatsappHref =
    whatsappDigits.length >= 7 && whatsappDigits.length <= 15
      ? `https://wa.me/${whatsappDigits}?text=${encodeURIComponent("Hello! I would like to inquire about your services.")}`
      : "/contact";
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
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
