import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { pic } from "../data";
import { Reveal } from "../components/Layout";
import Banner from "../components/site/Banner";
import SectionHead from "../components/site/SectionHead";
import FeatureAccordion from "../components/site/FeatureAccordion";
import PackageCard from "../components/site/PackageCard";

const SPACE_ITEMS = [
  {
    id: "terrace",
    title: "Terrace",
    description: "Explore and enquire",
    image: "/media/terrace-lounge.webp",
  },
  {
    id: "indoor-dining",
    title: "Indoor dining",
    description: "Explore and enquire",
    image: "/media/restaurant-interior.webp",
  },
  {
    id: "bar-area",
    title: "Bar Area",
    description: "Explore and enquire",
    image: "/media/bar-counter.webp",
  },
  {
    id: "pool-side",
    title: "Pool Side",
    description: "Explore and enquire",
    image: "/media/rooftop-poolside.webp",
  },
];

export function Restro() {
  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    if (!activeMenu) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setActiveMenu(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeMenu]);

  return (
    <>
      <Banner
        tag="HEIGHT RESTRO"
        title="Come for the view. Stay for the moments."
        body="Multi cuisine | Bar — thoughtful dining, great company and memorable experiences."
        image={pic("restaurant-interior.webp")}
      />
      <section className="shell py-24">
        <SectionHead
          eyebrow="The dining experience"
          title="Discover a taste of HEIGHT"
        />
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[
            {
              title: "Breakfast Menu",
              description: "Start your day with breakfast at HEIGHT.",
              image: "breakfast-plate.webp",
              file: "/Menu/Breakfast%20Menu.pdf",
            },
            {
              title: "Menu by Height",
              description: "Explore our food menu for lunch and dinner.",
              image: "nepali-thali.webp",
              file: "/Menu/Menu%20by%20Height.pdf",
            },
            {
              title: "Drinks Menu",
              description: "Non-alcoholic and alcoholic beverages.",
              image: "orange-mocktail.webp",
              file: "/Menu/Drinks%20Menu.pdf",
            },
          ].map((menu) => (
            <Reveal key={menu.title}>
              <PackageCard
                item={{
                  ...menu,
                  image_url: pic(menu.image),
                  subtitle: menu.description,
                }}
                onClick={() => setActiveMenu(menu)}
                actionLabel="View menu"
              />
            </Reveal>
          ))}
        </div>
      </section>
      <section className="py-24 bg-[#f5e8df]">
        <div className="shell">
          <SectionHead eyebrow="Choose your corner" title="Our space" />
        </div>
        <FeatureAccordion
          items={SPACE_ITEMS}
          getTo={() => "/contact"}
          actionLabel="Explore and enquire"
          eyebrow="HEIGHT RESTRO"
        />
      </section>
      <section className="shell py-24">
        <SectionHead eyebrow="From our kitchen" title="Chef’s special" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "breakfast-spread.webp",
            "grilled-wrap.webp",
            "rice-curry.webp",
            "plated-fish.webp",
          ].map((p) => (
            <img
              key={p}
              loading="lazy"
              src={pic(p)}
              alt="Chef special"
              className="rounded-[2rem] h-60 w-full"
            />
          ))}
        </div>
      </section>
      
      {activeMenu && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActiveMenu(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="menu-dialog-title"
            className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <header className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-6">
              <h2 id="menu-dialog-title" className="font-semibold text-ink">
                {activeMenu.title}
              </h2>
              <button
                type="button"
                onClick={() => setActiveMenu(null)}
                aria-label="Close menu"
                className="rounded-full p-2 text-ink transition hover:bg-skin"
              >
                <X size={20} />
              </button>
            </header>
            <iframe
              title={activeMenu.title}
              src={activeMenu.file + "#toolbar=0&navpanes=0&scrollbar=0"}
              className="min-h-0 w-full flex-1 bg-slate-100"
            />
          </section>
        </div>
      )}
    </>
  );
}