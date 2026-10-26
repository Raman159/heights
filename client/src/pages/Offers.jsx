import React from "react";
import { useParams } from "react-router-dom";
import { pic } from "../data";
import Inquiry from "../components/Forms";
import Banner from "../components/site/Banner";
import Card from "../components/site/ExperienceCard";
import EmptyState from "../components/site/EmptyState";
import useCollection from "../hooks/useCollection";

export function Offers() {
  let offers = useCollection("offers");
  let { id } = useParams();
  let item = id && offers ? offers.find((x) => String(x.id) === id) : null;
  return (
    <>
      <Banner
        tag="SPECIAL MOMENTS"
        title={item?.title || "Offers & Packages"}
        body={
          item?.description ||
          "Wellness packages and thoughtful experiences for every occasion."
        }
        image={item?.image_url || pic("jacuzzi-bath.webp")}
      />
      <section className="shell py-24">
        {offers === null ? null : item ? (
          <div className="max-w-3xl mx-auto">
            <p className="text-muted leading-8 mb-10">{item.description}</p>
            <Inquiry service={item.title} type="offer" />
          </div>
        ) : id || offers.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {offers.map((o) => (
              <Card
                key={o.id}
                item={{ ...o, subtitle: o.description }}
                to={"/offers/" + o.id}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
