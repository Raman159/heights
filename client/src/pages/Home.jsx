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
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  return hero;
}

/* ------------------------------------------------------------------ */
/* Mobile slider helpers: active-slide tracking + pagination dots      */
/* ------------------------------------------------------------------ */

function useActiveSlide(trackRef, count) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      const kids = Array.from(el.children);
      if (!kids.length) return;
      // Reached the end of the track: last slide is active
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) {
        setActive(kids.length - 1);
        return;
      }
      const centre = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let min = Infinity;
      kids.forEach((k, i) => {
        const d = Math.abs(k.offsetLeft + k.offsetWidth / 2 - centre);
        if (d < min) {
          min = d;
          best = i;
        }
      });
      setActive(best);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [trackRef, count]);

  const goTo = (i) => {
    const el = trackRef.current;
    const kid = el?.children[i];
    if (!el || !kid) return;
    el.scrollTo({
      left: kid.offsetLeft + kid.offsetWidth / 2 - el.clientWidth / 2,
      behavior: "smooth",
    });
  };

  return [active, goTo];
}

function Dots({ count, active, onSelect, label, className = "" }) {
  if (count < 2) return null;
  return (
    <div
      role="group"
      aria-label={`${label} pagination`}
      className={`mt-5 flex items-center justify-center ${className}`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Go to ${label} ${i + 1} of ${count}`}
          aria-current={i === active ? "true" : undefined}
          onClick={() => onSelect(i)}
          className="grid h-6 min-w-6 place-items-center px-0.5"
        >
          <span
            className={`block h-1.5 rounded-full transition-all duration-300 ${
              i === active ? "w-6 bg-clay" : "w-1.5 bg-clay/30"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

/* Swipeable slider with touch, mouse-drag, arrow, and pagination controls. */
function Slider({ children, label }) {
  const trackRef = useRef(null);
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startScrollLeft: 0,
  });
  const items = React.Children.toArray(children);
  const [active, goTo] = useActiveSlide(trackRef, items.length);
  const scroll = (direction) => {
    const track = trackRef.current;
    track?.scrollBy({
      left: direction * track.clientWidth * 0.8,
      behavior: "smooth",
    });
  };
  const startDrag = (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    const track = trackRef.current;
    if (!track) return;
    dragRef.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      startScrollLeft: track.scrollLeft,
    };
  };
  const moveDrag = (event) => {
    const drag = dragRef.current;
    const track = trackRef.current;
    if (!drag.active || !track) return;
    const distance = event.clientX - drag.startX;
    if (Math.abs(distance) > 4 && !drag.moved) {
      drag.moved = true;
      track.setPointerCapture(event.pointerId);
    }
    if (drag.moved) {
      track.scrollLeft = drag.startScrollLeft - distance;
      event.preventDefault();
    }
  };
  const stopDrag = () => {
    dragRef.current.active = false;
    if (dragRef.current.moved) {
      window.setTimeout(() => {
        dragRef.current.moved = false;
      }, 0);
    }
  };
  const preventDraggedClick = (event) => {
    if (!dragRef.current.moved) return;
    event.preventDefault();
    event.stopPropagation();
    dragRef.current.moved = false;
  };

  return (
    <div>
     
      <div
        ref={trackRef}
        aria-label={label}
        aria-roledescription="carousel"
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        onClickCapture={preventDraggedClick}
        className="relative flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:cursor-grab md:gap-5 md:active:cursor-grabbing md:pb-2"
      >
        {items}
      </div>
      <Dots
        count={items.length}
        active={active}
        onSelect={goTo}
        label={label}
      />
    </div>
  );
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
    if (inView) v.play().catch(() => {});
    else v.pause();
  }, [inView, allowVideo]);

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden">
      {image && (
        <img
          src={image}
          alt="Height exterior"
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
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            playing ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}

function Carousel({ children, label = "Services", arrowClass = "" }) {
  const trackRef = useRef(null);
  const count = React.Children.count(children);
  const [active, goTo] = useActiveSlide(trackRef, count);

  const scroll = (direction) => {
    trackRef.current?.scrollBy({
      left: direction * trackRef.current.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      {/* {arrowClass && (
        <button
          type="button"
          aria-label={`Scroll ${label} backward`}
          className={`absolute left-0 z-20 ${arrowClass}`}
          onClick={() => scroll(-1)}
        />
      )} */}
      {/* Mobile: edge-to-edge track with side padding so the next card peeks in */}
      <div
        ref={trackRef}
        aria-label={label}
        aria-roledescription="carousel"
        className="relative -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto overscroll-x-contain scroll-smooth px-5 [scrollbar-width:none] sm:mx-0 sm:scroll-px-0 sm:gap-5 sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      {arrowClass && (
        <button
          type="button"
          aria-label={`Scroll ${label} forward`}
          className={`absolute right-0 z-20 ${arrowClass}`}
          onClick={() => scroll(1)}
        />
      )}
      <Dots
        count={count}
        active={active}
        onSelect={goTo}
        label={label}
        className="sm:hidden"
      />
    </div>
  );
}

export function Home() {
  const offers = useCollection("offers"),
    reviews = useCollection("reviews");
  const hero = useHeroSettings();
  return (
    <>
      {/* HERO */}
      <section className="relative flex h-[88svh] min-h-[560px] items-end bg-[#46382f] pb-[max(3rem,env(safe-area-inset-bottom))] text-white md:h-[min(900px,100vh)] md:min-h-[660px] md:pb-24">
        <HeroMedia image={hero?.hero_image} video={hero?.hero_video} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 md:from-black/75 md:via-black/15 md:to-black/25" />
        <div className="shell relative z-10 max-w-4xl text-center">
          <img
            src="/watermark.png"
            className="mx-auto mb-6 h-24 justify-center brightness-0 invert md:mb-10 md:h-40"
            alt="Watermark"
          />

          <h1 className="max-w-5xl font-display text-[42px] font-light leading-[1.08] tracking-[-.04em] sm:text-6xl md:text-[92px] md:leading-[1.04] md:tracking-[-.06em]">
            Above the ordinary.
            <br />
            <em className="not-italic text-[#f2d5c6]">Closer to yourself.</em>
          </h1>
          <p className="eyebrow !text-skin mt-4 max-md:text-[11px] md:mt-5">
            RESTRO • WELLNESS • SPA • FITNESS
          </p>

          {/* Mobile-only quick actions */}
          <div className="mx-auto mt-7 flex max-w-xs flex-col gap-3 md:hidden">
            <Link
              to="/contact"
              className="rounded-full bg-white px-6 py-3 text-center text-sm font-semibold text-ink shadow-lg shadow-black/20 transition-transform active:scale-[0.98]"
            >
              Plan your visit
            </Link>
            <a
              href="#services"
              className="rounded-full border border-white/50 bg-white/10 px-6 py-3 text-center text-sm font-medium text-white backdrop-blur-sm transition-transform active:scale-[0.98]"
            >
              Explore services
            </a>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="watermark bg-cream py-12 md:py-20">
        <div className="shell max-w-4xl text-center">
          <Reveal>
            <p className="eyebrow mb-4 md:mb-6">Height Philosophy</p>
            <h2 className="h2 mb-5 md:mb-7">
              Where everyday life finds{" "}
              <span className="text-clay">its balance.</span>
            </h2>
            <p className="mx-auto max-w-[34rem] text-base leading-8 text-muted md:max-w-none md:text-lg md:leading-9">
              Height is where traditional wisdom meets modern convenience —
              a sanctuary offering a touch-led holistic approach to healing.
              Unlike fleeting getaway retreats, Height brings balance and
              wellness into your everyday life. More than just a holistic
              wellness spa, it’s a space to harmonize, heal, and reconnect with
              yourself.
            </p>
          </Reveal>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="scroll-mt-4 bg-cream py-10 md:py-12">
        <h2 className="mb-6 text-center text-3xl font-normal italic md:mb-7 md:text-4xl">
          Our Services
        </h2>

        <div className="mx-auto max-w-7xl px-5">
          <Carousel label="Services">
            {serviceCards.map((service) => (
              <a
                key={service.name}
                href={service.href}
                className="group relative flex h-[30rem] shrink-0 basis-[78%] snap-center flex-col overflow-hidden rounded-t-full bg-cream transition-transform duration-200 max-sm:active:scale-[0.985] sm:h-[34rem] sm:basis-[calc((100%_-_1.25rem)/2)] sm:snap-start lg:basis-[30%]"
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

                <div className="flex flex-1 flex-col items-center px-5 pb-6 pt-5 text-center sm:px-6 sm:pt-6">
                  <h3 className="text-2xl font-normal italic leading-tight text-ink md:text-[1.7rem]">
                    {service.name}
                  </h3>

                  <p className="mt-2 line-clamp-3 max-w-xs text-sm leading-relaxed text-muted transition-all duration-500 sm:mt-3 sm:line-clamp-none sm:min-h-[4.5rem] md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100">
                    {service.desc}
                  </p>

                  <span className="mt-auto pt-3 text-sm font-medium uppercase tracking-[0.18em] text-clay sm:mt-4 sm:pt-0">
                    Explore
                  </span>
                </div>
              </a>
            ))}
          </Carousel>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="relative isolate w-full overflow-hidden bg-cream py-12 md:py-20">
        <Design />
        <div className="shell relative z-10">
          <SectionHead
            eyebrow="Heartfelt words"
            title="HEIGHT experience"
            body="Kind words from guests who made memories with us."
          />
          {reviews === null ? null : reviews.length === 0 ? (
            <EmptyState />
          ) : (
            <Slider label="Reviews">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="w-[84%] shrink-0 snap-center md:w-[44%] lg:w-[32%]"
                >
                  <Reveal className="h-full">
                    <div className="h-full rounded-[1.5rem] bg-white p-6 shadow-[0_8px_30px_-12px_rgba(70,56,47,0.18)] md:rounded-[2rem] md:p-8 md:shadow-none">
                      <div className="mb-5 flex gap-1 text-clay md:mb-6">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star fill="currentColor" size={15} key={i} />
                        ))}
                      </div>
                      <p className="mb-6 text-[15px] leading-7 text-muted md:mb-8 md:text-base md:leading-8">
                        “{r.quote}”
                      </p>
                      <p className="font-semibold">{r.author}</p>
                    </div>
                  </Reveal>
                </div>
              ))}
            </Slider>
          )}
        </div>
      </section>

      <Reels />

      {/* OFFERS */}
      <section className="bg-cream py-12 md:py-20">
        <div className="shell">
          <SectionHead
            eyebrow="Special experiences"
            title="Wellness & offers"
            body="Carefully designed moments for you to look forward to."
          />
          {offers === null ? null : offers.length === 0 ? (
            <EmptyState />
          ) : (
            <Slider label="Offers">
              {offers.map((o) => (
                <Reveal
                  key={o.id}
                  className="w-[84%] shrink-0 snap-center md:w-[44%] lg:w-[32%]"
                >
                  <Card
                    item={{ ...o, subtitle: o.description }}
                    to={"/offers/" + o.id}
                  />
                </Reveal>
              ))}
            </Slider>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-clay py-14 text-white md:py-20">
        <div className="shell text-center">
          <p className="eyebrow !text-skin mb-4 md:mb-5">Your moment awaits</p>
          <h2 className="h2 mb-7 md:mb-6">Take time for the extraordinary.</h2>
          <Link
            className="mx-auto block w-full max-w-xs rounded-full bg-white px-8 py-3.5 text-center font-semibold text-ink transition-transform active:scale-[0.98] md:inline-block md:w-auto md:max-w-none"
            to="/contact"
          >
            Plan your visit →
          </Link>
        </div>
      </section>
    </>
  );
}