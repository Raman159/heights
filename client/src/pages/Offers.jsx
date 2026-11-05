import React from "react";
import { useParams } from "react-router-dom";
import { pic } from "../data";
import Inquiry from "../components/Forms";
import Banner from "../components/site/Banner";
import Card from "../components/site/PackageCard";
import EmptyState from "../components/site/EmptyState";
import useCollection from "../hooks/useCollection";
import { formatOfferPrice, getOfferPrices } from "../utils/offerPricing";
import RichText from "../components/site/RichText";

export function Offers() {
  let offers = useCollection("offers");
  let { id } = useParams();
  let item = id && offers ? offers.find((x) => String(x.id) === id) : null;
  let prices = getOfferPrices(item);
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
            {prices && (
              <div className="mb-8 flex flex-wrap items-baseline gap-4">
                <span className="text-lg text-muted line-through">
                  Original price: Rs. {formatOfferPrice(prices.original)}
                </span>
                <span className="text-2xl font-semibold text-ink">
                  Now: Rs. {formatOfferPrice(prices.discounted)}
                </span>
              </div>
            )}
            <RichText
              text={item.description}
              className="font-display mb-10 text-xl font-light leading-[1.8] tracking-[-.015em] text-ink/75 md:text-2xl"
            />
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
