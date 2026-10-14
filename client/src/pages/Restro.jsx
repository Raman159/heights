import React from "react";
import { Link } from "react-router-dom";
import { pic } from "../data";
import { Reveal } from "../components/Layout";
import Banner from "../components/site/Banner";
import SectionHead from "../components/site/SectionHead";
import Card from "../components/site/ExperienceCard";

export function Restro() {
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
        <div className="grid md:grid-cols-2 gap-6">
          {["Food", "Beverages"].map((n, i) => (
            <Reveal key={n}>
              <div className="panel">
                <img
                  src={pic(i ? "Food /_DSC9808" : "Food /_DSC0044")}
                  className="w-full h-64"
                  alt={n}
                />
                <div className="p-8">
                  <h3 className="text-2xl">{n}</h3>
                  <p className="text-muted my-3">
                    {i
                      ? "Non-alcoholic and alcoholic beverages"
                      : "Breakfast, lunch and dinner"}
                  </p>
                  <Link to="/contact" className="text-clay font-semibold">
                    Request menu →
                  </Link>
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
    </>
  );
}
