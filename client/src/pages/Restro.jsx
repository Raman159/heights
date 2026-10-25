import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { pic } from "../data";
import { Reveal } from "../components/Layout";
import Banner from "../components/site/Banner";
import SectionHead from "../components/site/SectionHead";
import Card from "../components/site/ExperienceCard";

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
        image={pic("_DSC0116-HDR")}
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
              image: "Food /_DSC0044",
              file: "/Menu/Breakfast%20Menu.pdf",
            },
            {
              title: "Menu by Height",
              description: "Explore our food menu for lunch and dinner.",
              image: "Food /_DSC9927",
              file: "/Menu/Menu%20by%20Height.pdf",
            },
            {
              title: "Drinks Menu",
              description: "Non-alcoholic and alcoholic beverages.",
              image: "Food /_DSC9808",
              file: "/Menu/Drinks%20Menu.pdf",
            },
          ].map((menu) => (
            <Reveal key={menu.title}>
              <div className="panel">
                <img
                  src={pic(menu.image)}
                  className="w-full h-64"
                  alt={menu.title}
                />
                <div className="p-8">
                  <h3 className="text-2xl">{menu.title}</h3>
                  <p className="text-muted my-3">{menu.description}</p>
                  <button
                    type="button"
                    onClick={() => setActiveMenu(menu)}
                    className="text-clay font-semibold"
                  >
                    View menu →
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="py-24 bg-[#f5e8df]">
        <div className="shell">
          <SectionHead eyebrow="Choose your corner" title="Our space" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {["Terrace", "Indoor dining", "Bar Area", "Pool Side"].map(
              (n, i) => (
                <Card
                  key={n}
                  item={{
                    title: n,
                    photo: [
                      "The Height -4350",
                      "_DSC0116-HDR",
                      "Food /_DSC9808",
                      "Pool.jpg",
                    ][i],
                    subtitle: "Explore and enquire",
                  }}
                  to="/contact"
                />
              ),
            )}
          </div>
        </div>
      </section>
      <section className="shell py-24">
        <SectionHead eyebrow="From our kitchen" title="Chef’s special" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "Food /_DSC0044",
            "Food /DSC02595",
            "Food /_DSC9927",
            "Food /DSC02562",
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
      <section className="py-24 bg-cream">
        <div className="shell">
          <SectionHead eyebrow="Celebrate together" title="Events at HEIGHT" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
            {[
              "Buffet Dinner",
              "Set Menu",
              "Table Setup",
              "Conference Hall",
              "Private Room",
            ].map((n, i) => (
              <div className="panel" key={n}>
                <img
                  src={pic(
                    [
                      "Food /_DSC0044",
                      "Food /_DSC9808",
                      "_DSC0116",
                      "DSC04821",
                      "DSC04851",
                    ][i],
                  )}
                  alt={n}
                  className="w-full h-40"
                />
                <p className="p-4 text-center">{n}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/contact?service=Event%20booking" className="btn">
              Enquire Now →
            </Link>
          </div>
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
