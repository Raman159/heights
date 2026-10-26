import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { get } from "../api";
import { serviceCards } from "../data";
import { Reveal } from "../components/Layout";
import SectionHead from "../components/site/SectionHead";
import Card from "../components/site/ExperienceCard";
import EmptyState from "../components/site/EmptyState";
import Reels from "../components/site/Reels";
import useCollection from "../hooks/useCollection";
import Design from "../components/site/design";


const SETTINGS_KEY = "height:public-settings";

function readCachedSettings() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || null;
  } catch {
    return null;
  }
}

function useHeroSettings() {
  const [hero, setHero] = useState(readCachedSettings);
  useEffect(() => {
    let alive = true;
    get("/public/settings")
      .then((s) => {
        if (!alive) return;
        setHero(s);
        try {
          localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
        } catch {
          /* storage full or blocked: ignore */
        }
      })
      .catch(() => { });
    return () => {
      alive = false;
    };
  }, []);
  return hero;
}

function HeroMedia({ image, video }) {
  const wrapRef = useRef(null);
  const videoRef = useRef(null);
  const [allowVideo, setAllowVideo] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [inView, setInView] = useState(true);

  // Open connections to the media host early (helps when files live on a CDN/other domain)
  useEffect(() => {
    [image, video].forEach((url) => {
      if (!url) return;
      try {
        const origin = new URL(url, window.location.href).origin;
        if (origin === window.location.origin) return;
        if (document.head.querySelector(`link[rel="preconnect"][href="${origin}"]`)) return;
        const link = document.createElement("link");
        link.rel = "preconnect";
        link.href = origin;
        document.head.appendChild(link);
      } catch {
        /* bad URL: ignore */
      }
    });
  }, [image, video]);

  useEffect(() => {
    if (!video) return;
    const conn = navigator.connection;
    const constrained =
      conn && (conn.saveData || /^(slow-2g|2g|3g)$/.test(conn.effectiveType || ""));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (constrained || reduceMotion) return; // poster image only

    const start = () => setAllowVideo(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(start, 400);
    return () => clearTimeout(id);
  }, [video]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.05,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inView) v.play().catch(() => { });
    else v.pause();
  }, [inView, allowVideo]);

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden">
      {image && (
        <img
          src={image}
          alt="The Height exterior"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {allowVideo && video && (
        <video
          ref={videoRef}
          src={video}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          onPlaying={() => setPlaying(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${playing ? "opacity-100" : "opacity-0"
            }`}
        />
      )}
    </div>
  );
}

function Carousel({ children, label, arrowClass = "" }) {
  const trackRef = React.useRef(null);
  const scroll = (direction) => {
    trackRef.current?.scrollBy({
      left: direction * trackRef.current.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={`Scroll ${label} backward`}
        className={`absolute left-0 z-20 ${arrowClass}`}
        onClick={() => scroll(-1)}
      >
        {/* <ChevronLeft aria-hidden="true" /> */}
      </button>
      <div
        ref={trackRef}
        aria-label={label}
        aria-roledescription="carousel"
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      <button
        type="button"
        aria-label={`Scroll ${label} forward`}
        className={`absolute right-0 z-20 ${arrowClass}`}
        onClick={() => scroll(1)}
      >
        {/* <ChevronRight aria-hidden="true" /> */}
      </button>
    </div>
  );
}


export function Home() {
  const offers = useCollection("offers"),
    reviews = useCollection("reviews");
  const hero = useHeroSettings();
  return (
    <>
      <section className="relative h-[min(900px,100vh)] min-h-[660px] bg-[#46382f] text-white flex items-end pb-16 md:pb-24">
        <HeroMedia image={hero?.hero_image} video={hero?.hero_video} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/25" />
        <div className="shell relative z-10 max-w-4xl text-center">
          <img
            src="/watermark.png"
            className="h-40 brightness-0 invert justify-center mx-auto mb-10 "
            alt="Watermark"
          />

          <h1 className="font-display font-light tracking-[-.06em] leading-[1.04] text-5xl sm:text-6xl md:text-[92px] max-w-5xl">
            Above the ordinary.
            <br />
            <em className="not-italic text-[#f2d5c6]">Closer to yourself.</em>
          </h1>
          <p className="eyebrow !text-skin mt-5">
            RESTRO • WELLNESS • SPA • FITNESS
          </p>
          {/* <p className="mt-7 text-white/85 max-w-md leading-7">
            Discover an elevated destination for dining, restoration, movement
            and memorable moments.
          </p> */}
        </div>
      </section>
      <section className="py-16 md:py-20 bg-cream watermark">
        <div className="shell text-center max-w-4xl">
          <Reveal>
            <p className="eyebrow mb-6">The Height Philosophy</p>
            <h2 className="h2 mb-7">
              Where everyday life finds{" "}
              <span className="text-clay">its balance.</span>
            </h2>
            <p className="text-muted text-lg leading-9">
              The Height is where traditional wisdom meets modern convenience —
              a sanctuary offering a touch-led holistic approach to healing.
              Unlike fleeting getaway retreats, The Height brings balance and
              wellness into your everyday life. More than just a holistic
              wellness spa, it’s a space to harmonize, heal, and reconnect with
              yourself.
            </p>
          </Reveal>
        </div>
      </section>
      <section id="services" className="bg-cream py-10 md:py-12">
        <h2 className="mb-7 text-center font-normal text-3xl italic md:text-4xl">
          Our Services
        </h2>

        <div className="mx-auto max-w-7xl px-5">
          <Carousel
            // arrowClass="grid top-[28%] size-6 place-items-center rounded-full bg-clay text-white text-2xl hover:bg-clay/80"
          >
            {serviceCards.map((service) => (
              <a
                key={service.name}
                href={service.href}
                className="group relative flex h-[34rem] shrink-0 snap-start basis-[80%] flex-col overflow-hidden rounded-t-full bg-cream sm:basis-[calc((100%_-_1.25rem)/2)] lg:basis-[30%]"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-10 rounded-t-full border border-clay/70 [-webkit-mask-image:linear-gradient(to_bottom,black_55%,transparent_100%)] [mask-image:linear-gradient(to_bottom,black_55%,transparent_100%)]"
                />

                <div className="aspect-[1/1.05] overflow-hidden">
                  <img
                    src={service.img}
                    alt={service.name}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-focus-visible:scale-110 motion-reduce:transition-none"
                  />
                </div>

                <div className="flex flex-1 flex-col items-center px-6 pb-6 pt-6 text-center">
                  <h3 className="font-normal text-2xl italic leading-tight text-ink md:text-[1.7rem]">
                    {service.name}
                  </h3>

                  <p className="mt-3 min-h-[4.5rem] max-w-xs text-sm leading-relaxed text-muted transition-all duration-500 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100">
                    {service.desc}
                  </p>

                  <span className="mt-4 text-sm font-medium uppercase tracking-[0.18em] text-clay">
                    Explore
                  </span>
                </div>
              </a>
            ))}
          </Carousel>
        </div>
      </section>
      <section className="relative isolate w-full overflow-hidden py-16 md:py-20 bg-cream ">
        <Design />
        <div className="shell relative z-10">
          <SectionHead
            eyebrow="Heartfelt words"
            title="The HEIGHT experience"
            body="Kind words from guests who made memories with us."
          />
          {reviews === null ? null : reviews.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid md:grid-cols-3 gap-5">
              {reviews.slice(0, 3).map((r) => (
                <Reveal key={r.id}>
                  <div className="bg-white rounded-[2rem] p-7 md:p-8 h-full">
                    <div className="flex gap-1 text-clay mb-6">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star fill="currentColor" size={15} key={i} />
                      ))}
                    </div>
                    <p className="leading-8 text-muted mb-8">“{r.quote}”</p>
                    <p className="font-semibold">{r.author}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
      <Reels />
      <section className=" bg-cream py-16 md:py-20">
 
  <div className="shell ">
          <SectionHead
            eyebrow="Special experiences"
            title="Wellness & offers"
            body="Carefully designed moments for you to look forward to."
          />
          {offers === null ? null : offers.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid md:grid-cols-3 gap-5">
              {offers.slice(0, 3).map((o) => (
                <Reveal key={o.id}>
                  <Card
                    item={{ ...o, subtitle: o.description }}
                    to={"/offers/" + o.id}
                  />
                </Reveal>
             
              ))}
            </div>
          )}
        </div>
      </section>
      <section className="bg-clay py-16 md:py-20 text-white">
        <div className="shell text-center">
          <p className="eyebrow !text-skin mb-5">Your moment awaits</p>
          <h2 className="h2 mb-6">Take time for the extraordinary.</h2>
          <Link
            className="inline-block rounded-full bg-white text-ink px-8 py-4 font-semibold"
            to="/contact"
          >
            Plan your visit →
          </Link>
        </div>
      </section>
    </>
  );
}