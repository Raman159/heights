import React, { useEffect, useState } from "react";
import { get, mediaUrl } from "../api";
import { Reveal } from "../components/Layout";
import Banner from "../components/site/Banner";
import SectionHead from "../components/site/SectionHead";
import BrandButton from "../components/site/BrandButton";
import RichText from "../components/site/RichText";
import { useToast } from "../components/Toast";

const pillars = [
  { word: "Restore", text: "Slow down with touch-led rituals." },
  { word: "Recharge", text: "Rebuild energy, body and mind." },
  { word: "Reconnect", text: "Return to yourself, every day." },
];

export function Wellness() {
  const notify = useToast();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    get("/public/services")
      .then((result) => {
        if (active) setServices(result);
      })
      .catch((requestError) => {
        if (!active) return;
        setError(true);
        notify(requestError.message, "error");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [notify]);

  const list = services.filter(
    (service) => !["spa", "gym", "restro"].includes(service.slug),
  );

  return (
    <>
      <Banner
        tag="WELLNESS AT HEIGHT"
        title="Find your moment of calm."
        body="Restore your senses, recharge your energy and find time for yourself."
        image="/media/infinity-pool.webp"
      />

      {/* Intro + pillars */}
      <section className="watermark bg-cream pt-16 md:pt-24">
        <div className="shell">
          <SectionHead
            eyebrow="Discover wellness"
            title="Thoughtfully made for you"
          />
          <Reveal>
            <div className="mx-auto mt-2 grid max-w-3xl grid-cols-3 divide-x divide-clay/25 border-y border-clay/25 py-6 text-center md:py-8">
              {pillars.map((p) => (
                <div key={p.word} className="px-2 md:px-6">
                  <p className="font-display text-xl italic text-ink md:text-2xl">
                    {p.word}
                  </p>
                  <p className="mt-2 hidden text-sm leading-6 text-muted sm:block">
                    {p.text}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Experiences */}
      <section className="bg-cream py-14 md:py-24">
        <div className="shell space-y-16 md:space-y-28">
          {loading && <p className="text-center text-muted">Loading experiences…</p>}
          {error && (
            <p className="text-center text-muted">
              Wellness experiences could not be loaded. Please try again later.
            </p>
          )}
          {list.map((s, i) => {
            const flip = i % 2 === 1;
            return (
              <Reveal
                key={s.slug}
                className={
                  "grid items-center gap-10 md:grid-cols-2 md:gap-16 " +
                  (flip ? "md:[&>*:first-child]:order-2" : "")
                }
              >
                {/* Arched image with offset frame */}
                <div className="relative mx-auto w-full max-w-md md:max-w-none">
                  <span
                    aria-hidden="true"
                    className={
                      "pointer-events-none absolute inset-0 rounded-t-full border border-clay/50 " +
                      (flip
                        ? "-translate-x-3 translate-y-3 md:-translate-x-5 md:translate-y-5"
                        : "translate-x-3 translate-y-3 md:translate-x-5 md:translate-y-5")
                    }
                  />
                  <div className="relative aspect-[4/5] overflow-hidden rounded-t-full bg-skin/30 md:aspect-[5/6]">
                    <img
                      src={mediaUrl(s.image_url)}
                      loading="lazy"
                      decoding="async"
                      alt={s.title}
                      className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out hover:scale-105 motion-reduce:transition-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                  </div>
                </div>

                {/* Text */}
                <div className="text-center md:text-left">
                  <span
                    aria-hidden="true"
                    className="block font-display text-6xl font-light italic leading-none text-clay/25 md:text-7xl"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="eyebrow mb-4 mt-3 md:mb-5">HEIGHT WELLNESS</p>
                  <h2 className="h2 mb-5 md:mb-6">{s.title}</h2>
                  <span
                    aria-hidden="true"
                    className="mx-auto mb-6 block h-px w-14 bg-clay/60 md:mx-0"
                  />
                  <RichText
                    text={s.description}
                    className="mx-auto mb-8 max-w-md text-base leading-8 text-muted md:mx-0 md:max-w-none"
                  />
                  <BrandButton to={"/services/" + s.slug} size="small" tone="dark">
                    Discover {s.title}
                  </BrandButton>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Closing call to action */}
      <section className="bg-clay py-14 text-white md:py-20">
        <div className="shell text-center">
          <p className="eyebrow !text-skin mb-4 md:mb-5">Begin your ritual</p>
          <h2 className="h2 mb-7 md:mb-6">Your calm is waiting at Height.</h2>
          <BrandButton
            to="/contact"
            tone="light"
            size="small"
            className="mx-auto mt-2"
          >
            Book your experience
          </BrandButton>
        </div>
      </section>
    </>
  );
}