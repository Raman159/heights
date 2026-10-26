import React from "react";
import { Link } from "react-router-dom";
import { pic, membership } from "../data";
import Banner from "../components/site/Banner";
import SectionHead from "../components/site/SectionHead";

export function Gym() {
  return (
    <>
      <Banner
        tag="GYM AT THE HEIGHT"
        title="Elevate your fitness."
        body="Purposeful movement, elevated facilities and a membership designed for you."
        image={pic("gym-interior.webp")}
      />
      <section className="shell py-24">
        <SectionHead
          eyebrow="Membership"
          title="Find your perfect fit"
          body="Choose the level of access that fits your lifestyle. All prices are in NPR."
        />
        <div className="grid lg:grid-cols-3 gap-5">
          {membership.map((m) => (
            <div key={m.name} className="panel p-8 flex flex-col">
              <p className="eyebrow mb-4">HEIGHT MEMBERSHIP</p>
              <h3 className="text-3xl mb-4">{m.name}</h3>
              <p className="text-muted min-h-14">{m.includes}</p>
              <div className="my-6 border-t border-ink/10">
                {["1 month", "3 months", "6 months", "1 year"].map((dur, i) => (
                  <div
                    className="flex justify-between py-4 border-b border-ink/10"
                    key={dur}
                  >
                    <span>{dur}</span>
                    <b>Rs. {m.prices[i].toLocaleString()}</b>
                  </div>
                ))}
              </div>
              <Link
                to={
                  "/contact?service=" +
                  encodeURIComponent(m.name + " membership")
                }
                className="btn mt-auto"
              >
                Book Now →
              </Link>
            </div>
          ))}
        </div>
        <p className="text-center mt-10 text-clay font-medium">
          One-Time Gym Access: Rs. 2,000 &nbsp; | &nbsp; One-on-One Personal
          Training: Rs. 30,000 extra per month
        </p>
      </section>
    </>
  );
}
