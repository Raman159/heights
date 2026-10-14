import React from "react";
import { Link } from "react-router-dom";
import { pic, spaGroups } from "../data";
import { Reveal } from "../components/Layout";
import Banner from "../components/site/Banner";
import SectionHead from "../components/site/SectionHead";

export function Spa() {
  return (
    <>
      <Banner
        tag="SPA AT THE HEIGHT"
        title="Rejuvenate mind. Body. Soul."
        body="Relax, release and reconnect through deeply relaxing oil-based therapies, dry massages and mini reflexologies."
        image={pic("Spa at Height")}
      />
      <section className="shell py-24 grid lg:grid-cols-2 gap-16 items-center">
        <img
          src={pic("Spa at Height")}
          className="rounded-[3rem] h-[450px] w-full"
        />
        <div>
          <p className="eyebrow mb-5">A sanctuary for you</p>
          <h2 className="h2 mb-6">Rest is a ritual.</h2>
          <p className="text-muted leading-8">
            Our spa features eight elegantly designed single spa rooms and two
            exclusive couple suites. A signature couple suite offers a private
            balcony, a private jacuzzi, breathtaking views and in-room dining.
            Each room is named after a majestic mountain of Nepal. With
            experienced therapists and personalized care, you can truly unwind
            and restore.
          </p>
        </div>
      </section>
      {spaGroups.map((g, idx) => (
        <section
          className={"py-20 " + (idx % 2 ? "bg-cream" : "bg-[#f5e8df]")}
          key={g.name}
        >
          <div className="shell">
            <SectionHead eyebrow="THE SPA MENU" title={g.name} />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {g.items.map((n, i) => (
                <Reveal key={n}>
                  <div className="panel">
                    <img
                      src={pic(
                        [
                          "Spa.jpg",
                          "Spa by Height",
                          "Spa at Height",
                          "Jacuzzi",
                        ][i % 4],
                      )}
                      alt={n}
                      loading="lazy"
                      className="w-full h-52"
                    />
                    <div className="p-6">
                      <h3 className="text-lg mb-4">{n}</h3>
                      <Link
                        to={"/contact?service=" + encodeURIComponent(n)}
                        className="text-clay font-semibold text-sm"
                      >
                        Get details →
                      </Link>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
