import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { mediaUrl } from "../api";
import { pic } from "../data";
import useCollection from "../hooks/useCollection";
import { Reveal } from "../components/Layout";
import Banner from "../components/site/Banner";
import SectionHead from "../components/site/SectionHead";
import FeatureAccordion from "../components/site/FeatureAccordion";

const CUISINES = [
  { title: "Indian Cuisine", fallback: "/media/curry-bowl.webp" },
  { title: "Japanese Cuisine", fallback: "/media/sushi-platter.webp" },
  { title: "Thai Cuisine", fallback: "/media/noodle-bowl.webp" },
  { title: "Nepalese Cuisine", fallback: "/media/nepali-thali.webp" },
];

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
  const menus = useCollection("menus");
  const gallery = useCollection("gallery");
  const [activeMenu, setActiveMenu] = useState(null);
  const chefSpecials = (gallery || []).filter(
    (item) => item.category === "Chef Special",
  );

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
          {menus?.filter((menu) => menu.file_url).map((menu) => (
            <Reveal key={menu.id}>
              <button
                type="button"
                onClick={() => setActiveMenu(menu)}
                className="group relative block aspect-[3/4] w-full overflow-hidden text-left"
                aria-label={`View ${menu.title}`}
              >
                {menu.image_url ? (
                  <img
                    src={mediaUrl(menu.image_url)}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[#182b2a]" />
                )}
                <div className="absolute inset-0 bg-black/35 transition-colors duration-500 group-hover:bg-black/55" />
                <div className="relative z-10 flex h-full flex-col items-center px-8 py-10 text-center text-white">
                  <div className="flex flex-1 flex-col justify-center">
                    <h3 className="font-display text-4xl font-light leading-tight">{menu.title}</h3>
                    {menu.description && <p className="mt-4 text-base text-white/85">{menu.description}</p>}
                  </div>
                  <span className="rounded-full border border-white/60 px-5 py-2 text-xs uppercase tracking-[.15em] transition-colors group-hover:bg-white group-hover:text-ink">
                    View menu
                  </span>
                </div>
              </button>
            </Reveal>
          ))}
          {menus === null && (
            <p className="col-span-full py-8 text-center text-muted">
              Loading menus…
            </p>
          )}
          {menus?.length === 0 && (
            <p className="col-span-full py-8 text-center text-muted">
              Menus will be available here soon.
            </p>
          )}
        </div>
      </section>
      <section className="bg-cream py-24">
        <div className="shell">
          <SectionHead
            eyebrow="A world of flavour"
            title="Explore our multi cuisine"
            body="Four distinct culinary traditions, brought together at HEIGHT."
          />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {CUISINES.map((cuisine) => {
              const photo = gallery?.find((item) => item.category === cuisine.title);
              return (
                <article key={cuisine.title} className="group relative aspect-[4/5] overflow-hidden bg-skin">
                  <img
                    src={mediaUrl(photo?.image_url || cuisine.fallback)}
                    alt={photo?.title || cuisine.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                  <h3 className="absolute inset-x-5 bottom-6 font-display text-3xl font-light text-white">
                    {cuisine.title}
                  </h3>
                </article>
              );
            })}
          </div>
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
          {chefSpecials.map((item) => (
              <img
                key={item.id}
                loading="lazy"
                src={mediaUrl(item.image_url)}
                alt={item.title}
                className="h-60 w-full rounded-[2rem] object-cover"
              />
            ))}
          {gallery !== null && chefSpecials.length === 0 && (
            <p className="col-span-full py-8 text-center text-muted">
              Chef specials will be featured here soon.
            </p>
          )}
          {gallery === null && (
            <p className="col-span-full py-8 text-center text-muted">
              Loading chef specials…
            </p>
          )}
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
              src={mediaUrl(activeMenu.file_url) + "#toolbar=0&navpanes=0&scrollbar=0"}
              className="min-h-0 w-full flex-1 bg-slate-100"
            />
          </section>
        </div>
      )}
    </>
  );
}