import React, { useEffect, useRef, useState } from "react";
import { pic, membership, dayPass } from "../data";
import BrandButton from "../components/site/BrandButton";
import Banner from "../components/site/Banner";
import SectionHead from "../components/site/SectionHead";

/* Accent used below: #b98a52 (tan, from your menu).
   Find & replace it with your own colour, or with `clay` if it supports opacity. */

const fmt = (n) => "Rs. " + n.toLocaleString();

const DURATIONS = [
  { label: "1 month", months: 1 },
  { label: "3 months", months: 3 },
  { label: "6 months", months: 6 },
  { label: "1 year", months: 12 },
];

/* Fades/slides in once when scrolled into view.
   Only opacity + transform animate, so scrolling stays smooth. */
function Reveal({ delay = 0, className = "", children }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={[
        "transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
        "motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none",
        shown ? "translate-y-0 opacity-100" : "translate-y-7 opacity-0",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function TierCard({ m }) {
  const ref = useRef(null);
  const frame = useRef(0);

  // Soft light following the cursor (mouse only, one update per frame)
  const onMove = (e) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    const r = el.getBoundingClientRect();
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  };
  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const amenities = m.includes.split(",").map((s) => s.trim());
  const yearlySaving = Math.round((1 - m.prices[3] / (m.prices[0] * 12)) * 100);

  return (
    <article
      ref={ref}
      onPointerMove={onMove}
      className={[
        "group relative isolate flex h-full flex-col overflow-hidden rounded-[22px] border px-7 pb-7 pt-8",
        "transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:-translate-y-2 hover:border-[#b98a52]/60 hover:shadow-[0_28px_50px_-28px_rgba(0,0,0,0.45)]",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        m.featured
          ? "border-[#b98a52]/60 bg-[#b98a52]/[0.07]"
          : "border-ink/15 bg-ink/[0.03]",
      ].join(" ")}
    >
      {/* cursor-following light */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(380px_circle_at_var(--mx,50%)_var(--my,0%),rgba(185,138,82,0.18),transparent_62%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      {/* gold hairline */}
      <span
        aria-hidden="true"
        className={[
          "absolute left-7 right-7 top-0 h-0.5 origin-center bg-gradient-to-r from-transparent via-[#b98a52] to-transparent",
          "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100",
          m.featured ? "scale-x-100" : "scale-x-0",
        ].join(" ")}
      />

      {m.featured && (
        <span className="absolute right-5 top-5 rounded-full bg-[#b98a52] px-2 py-1 text-[0.72rem] font-semibold tracking-wide text-white">
          PREMIUM
        </span>
      )}

      <p className="mb-2.5 text-[0.78rem] uppercase tracking-[0.14em] text-[#b98a52]">
        Height Membership
      </p>
      <h3 className="mb-5 text-4xl leading-[1.05]">{m.name}</h3>

      <ul
        aria-label={`${m.name} includes`}
        className="mb-6 flex min-h-[3.6rem] flex-wrap content-start gap-1.5"
      >
        {amenities.map((a) => (
          <li
            key={a}
            className="rounded-full border border-ink/15 px-3 py-1 text-[0.82rem] opacity-85"
          >
            {a}
          </li>
        ))}
      </ul>

      <div className="mb-7 border-t border-ink/10">
        {DURATIONS.map((d, i) => {
          const price = m.prices[i];
          const isYear = d.months === 12;
          return (
            <div
              key={d.label}
              className="flex items-center justify-between gap-3 border-b border-ink/10 py-3.5"
            >
              <span className="flex flex-col gap-1">
                {d.label}
                {isYear && (
                  <em className="text-[0.72rem] font-semibold not-italic text-[#b98a52]">
                    Save {yearlySaving}%
                  </em>
                )}
              </span>
              <span className="flex flex-col items-end tabular-nums">
                <b className={isYear ? "font-semibold text-[#b98a52]" : "font-semibold"}>
                  {fmt(price)}
                </b>
                {d.months > 1 && (
                  <small className="text-[0.72rem] opacity-55">
                    {fmt(Math.round(price / d.months))} / month
                  </small>
                )}
              </span>
            </div>
          );
        })}
      </div>

      <BrandButton
        to={"/contact?service=" + encodeURIComponent(m.name + " membership")}
        size="small"
        className="mt-auto w-full justify-center text-center"
      >
        Book Now
      </BrandButton>
    </article>
  );
}

function PassColumn({ title, items }) {
  return (
    <div>
      <div className="mb-3.5 flex justify-between text-lg font-semibold text-[#b98a52]">
        <span>{title}</span>
        <span>Price</span>
      </div>
      <ul>
        {items.map((it) => (
          <li
            key={it.name}
            className="-mx-3 flex items-end gap-2.5 rounded-[10px] px-3 py-3 transition-colors duration-300 hover:bg-[#b98a52]/10"
          >
            <span>{it.name}</span>
            <span
              aria-hidden="true"
              className="mb-1.5 min-w-4 flex-1 border-b border-dotted border-ink/30"
            />
            <span className="whitespace-nowrap font-semibold tabular-nums">
              {fmt(it.price)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Gym() {
  return (
    <>
      <Banner
        tag="GYM AT HEIGHT"
        title="Elevate your fitness."
        body="Purposeful movement, elevated facilities and a membership designed for you."
        image={pic("gym-interior.webp")}
      />

      {/* ── Memberships ── */}
      <section className="shell pb-12 pt-24">
        <SectionHead
          eyebrow="Membership"
          title="Find your perfect fit"
          body="Choose the level of access that fits your lifestyle. All prices are in NPR."
        />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {membership.map((m, i) => (
            <Reveal key={m.name} delay={i * 90} className="h-full">
              <TierCard m={m} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── 1-Day Pass ── */}
      <section className="shell pb-24 pt-12">
        <SectionHead
          eyebrow="Visiting for the day?"
          title="1-Day Pass"
          body="No commitment. Pick a single service or a package and make a day of it."
        />
        <Reveal>
          <div className="relative grid grid-cols-1 gap-8 rounded-[26px] border border-[#b98a52]/55 bg-ink/[0.03] px-7 pb-8 pt-12 md:grid-cols-[1fr_auto_1fr] md:gap-12 md:px-12 md:pb-10 md:pt-14">
            <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl bg-[#b98a52] px-6 py-2 font-bold tracking-wide text-[#2b2418]">
              1-Day Pass
            </span>
            <PassColumn title="Per service" items={dayPass.services} />
            <span aria-hidden="true" className="h-px bg-ink/15 md:h-auto md:w-px" />
            <PassColumn title="Per package" items={dayPass.packages} />
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-10 flex flex-col items-center gap-5 text-center md:flex-row md:justify-between md:text-left">
            <p className="opacity-80">
              One-on-one personal training: <b>Rs. 30,000</b> extra per month on
              any membership.
            </p>
            <BrandButton
              to={"/contact?service=" + encodeURIComponent("1-Day Pass")}
              size="small"
            >
              Book a day pass
            </BrandButton>
          </div>
        </Reveal>
      </section>
    </>
  );
}