import React from "react";
import { Link } from "react-router-dom";
import { pic } from "../data";
import BrandButton from "../components/site/BrandButton";
import Banner from "../components/site/Banner";
import Reels from "../components/site/Reels";
import SectionHead from "../components/site/SectionHead";

const EVENTS = [
  { name: "Buffet Dinner", img: "restaurant-dining.webp" },
  { name: "Set Menu", img: "restaurant-lounge.webp" },
  // { name: "Table Setup", img: "lounge-seating.webp" },
  { name: "Conference Hall", img: "restaurant-interior.webp" },
  { name: "Meeting Room", img: "terrace-lounge.webp" },
];

const DISPLAY = "var(--font-display, inherit)";

/* Concentric arcs ornament */
function Arcs({ className = "" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 60" className={className} fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.45">
      <path d="M10 60a50 50 0 0 1 100 0" />
      <path d="M22 60a38 38 0 0 1 76 0" />
      <path d="M34 60a26 26 0 0 1 52 0" />
      <path d="M46 60a14 14 0 0 1 28 0" />
      <circle cx="60" cy="60" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function EventArch({ e, i }) {
  const num = String(i + 1).padStart(2, "0");
  return (
    <Link
      to={"/contact?service=" + encodeURIComponent(e.name)}
      className={"group block " + (i % 2 === 1 ? "lg:mt-14" : "")}
    >
      <div className="relative">
        {/* Offset outline arch */}
        <div aria-hidden="true" className="absolute inset-0 translate-x-3 translate-y-3 rounded-t-[999px] border border-black/20 transition-transform duration-700 group-hover:translate-x-4 group-hover:translate-y-4" />
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-t-[999px] bg-black/10">
          <img
            src={pic(e.img)}
            alt={e.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.07]"
          />
          <div className="absolute inset-0 bg-black/10 transition-colors duration-700 group-hover:bg-black/35" />
        </div>
        {/* Number circle */}
        <span className="absolute -bottom-5 left-1/2 grid h-12 w-12 -translate-x-1/2 place-items-center rounded-full border border-black/20 bg-cream text-sm transition-colors duration-500 group-hover:border-black group-hover:bg-black group-hover:text-white" style={{ fontFamily: DISPLAY }}>
          {num}
        </span>
      </div>
      <p className="mt-10 text-center text-lg tracking-wide" style={{ fontFamily: DISPLAY }}>{e.name}</p>
    </Link>
  );
}

export function Events() {
  return (
    <>
      <Banner
        tag="GATHER AT HEIGHT"
        title="Make room for moments worth celebrating."
        body="A welcoming setting for gatherings, celebrations, and special events at HEIGHT."
        image={pic("rooftop-view.webp")}
      />

      <section className="relative overflow-hidden bg-cream py-24">
        <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-10 h-[32rem] w-[32rem] rounded-full border border-black/10" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-48 bottom-0 h-[40rem] w-[40rem] rounded-full border border-black/10" />

        <div className="shell relative">
          <Arcs className="mx-auto mb-6 h-12 w-24" />
          <SectionHead eyebrow="Celebrate together" title="Events at HEIGHT" />

          <div className="mb-20 mt-16 grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-4">
            {EVENTS.map((e, i) => <EventArch key={e.name} e={e} i={i} />)}
          </div>

          {/* CTA framed by a half-circle */}
          <div className="relative text-center">
            <div aria-hidden="true" className="mx-auto h-28 w-56 rounded-t-full border border-b-0 border-black/20" />
            <div className="-mt-10">
              <BrandButton to="/contact?service=Event%20booking" size="small">
                Enquire Now
              </BrandButton>
            </div>
          </div>
        </div>
      </section>
      <section aria-label="Event reels">
        <Reels background="linear-gradient(180deg, #FBF7EB 0%, #F3E9DF 50%, #FBF7EB 100%)" />
      </section>
      <section className="shell relative min-h-[30vh] overflow-hidden py-24">
        {/* Concentric rings */}
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="grid h-[28rem] w-[28rem] place-items-center rounded-full border border-black/10">
            <div className="grid h-80 w-80 place-items-center rounded-full border border-black/10">
              <div className="h-56 w-56 rounded-full border border-black/10" />
            </div>
          </div>
        </div>
        <SectionHead eyebrow="Events at HEIGHT" title="A place to come together" />
      </section>

    </>
  );
}