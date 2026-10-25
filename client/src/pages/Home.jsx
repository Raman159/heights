import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight, Star } from "lucide-react";
import { get } from "../api";
import { services } from "../data";
import { Reveal } from "../components/Layout";
import SectionHead from "../components/site/SectionHead";
import Card from "../components/site/ExperienceCard";
import EmptyState from "../components/site/EmptyState";
import Reels from "../components/site/Reels";
import useCollection from "../hooks/useCollection";

export function Home() {
  const offers = useCollection("offers"),
    reviews = useCollection("reviews");
  const [hero, setHero] = useState(null);
  useEffect(() => {
    get("/public/settings")
      .then(setHero)
      .catch(() => {});
  }, []);
  return (
    <>
      <section className="relative h-[min(900px,100vh)] min-h-[660px] bg-[#46382f] text-white flex items-end pb-24 md:pb-32">
        {hero?.hero_image && (
          <img
            src={hero.hero_image}
            className="absolute inset-0 w-full h-full object-cover"
            alt="The Height exterior"
          />
        )}
        {hero?.hero_video && (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={hero.hero_image || undefined}
            className="absolute inset-0 w-full h-full object-cover"
            src={hero.hero_video}
          />
        )}
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
      <section className="py-28 bg-cream watermark">
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
      <section className="py-24 bg-[#f7f0e8]">
        <div className="shell">
          <SectionHead
            eyebrow="Thoughtfully curated"
            title="Explore our experiences"
            body="A world of care, connection and indulgence — all in one elevated destination."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[services[2], services[0], services[1], services[3]].map((s) => (
              <Reveal key={s.slug}>
                <Card item={s} />
              </Reveal>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link className="btn-outline" to="/wellness">
              Explore all wellness facilities <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
      <section className="py-24 bg-cream">
        <div className="shell">
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
                  <div className="bg-white rounded-[2rem] p-9 h-full">
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
      <section className="py-24 bg-cream">
        <div className="shell">
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
      <section className="bg-clay py-24 text-white">
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
