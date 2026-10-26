import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { pic, services } from "../data";
import { Reveal } from "../components/Layout";
import Banner from "../components/site/Banner";
import SectionHead from "../components/site/SectionHead";

export function Wellness() {
  return (
    <>
      <Banner
        tag="WELLNESS AT HEIGHT"
        title="Find your moment of calm."
        body="Restore your senses, recharge your energy and find time for yourself."
        image={pic("infinity-pool.webp")}
      />
      <section className="py-24 shell">
        <SectionHead
          eyebrow="Discover wellness"
          title="Thoughtfully made for you"
        />
        <div className="space-y-20">
          {[
            services[4],
            services[5],
            services[6],
            services[3],
            services[7],
          ].map((s, i) => (
            <Reveal
              key={s.slug}
              className={
                "grid md:grid-cols-2 items-center gap-12 " +
                (i % 2 ? "md:[&>*:first-child]:order-2" : "")
              }
            >
              <img
                src={pic(s.photo)}
                loading="lazy"
                alt={s.title}
                className="w-full h-[350px] md:h-[430px] rounded-[3rem] object-cover"
              />
              <div>
                <p className="eyebrow mb-5">HEIGHT WELLNESS</p>
                <h2 className="h2 mb-6">{s.title}</h2>
                <p className="text-muted leading-8 mb-8">{s.description}</p>
                <Link className="btn-outline" to={"/services/" + s.slug}>
                  Discover {s.title}
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
