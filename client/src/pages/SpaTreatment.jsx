import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { get, mediaUrl } from "../api";
import { Reveal } from "../components/Layout";
import Banner from "../components/site/Banner";
import BrandButton from "../components/site/BrandButton";
import RichText from "../components/site/RichText";
import { useToast } from "../components/Toast";

export function SpaTreatment() {
  const { slug } = useParams();
  const notify = useToast();
  const [treatment, setTreatment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    get("/public/spa/" + encodeURIComponent(slug))
      .then((result) => {
        if (active) setTreatment(result);
      })
      .catch((error) => {
        if (!active) return;
        setTreatment(null);
        notify(error.message, "error");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug, notify]);

  if (loading) {
    return <section className="shell min-h-[50vh] py-24 text-muted">Loading treatment…</section>;
  }
  if (!treatment) {
    return (
      <Banner
        tag="Not found"
        title="Treatment not found"
        body="Please explore our spa menu."
      />
    );
  }

  const pricing = treatment.pricing ? JSON.parse(treatment.pricing) : [];
  const image = mediaUrl(treatment.image_url || "/media/spa-treatment.webp");

  return (
    <>
      <Banner
        tag={treatment.category || "SPA AT HEIGHT"}
        title={treatment.title}
        body={treatment.description || "A restorative experience at Spa at The Height."}
        image={image}
        compact
      />
      <section className="shell py-20">
        <div className="grid items-start gap-12 lg:grid-cols-[1.1fr_.9fr]">
          <Reveal>
            <img
              src={image}
              alt={treatment.title}
              className="h-[420px] w-full rounded-[3rem] object-cover"
            />
            {treatment.description && (
              <RichText
                text={treatment.description}
                className="mt-8 text-muted leading-8"
              />
            )}
            {treatment.benefits && (
              <RichText
                text={treatment.benefits}
                className="mt-8 space-y-3 text-muted"
              />
            )}
          </Reveal>

          <Reveal>
            <div className="rounded-[2rem] bg-cream p-7 md:p-9">
              <p className="eyebrow mb-3">Choose your experience</p>
              <h2 className="h2 mb-6">{treatment.title}</h2>
              {pricing.length > 0 ? (
                <ul className="divide-y divide-ink/10">
                  {pricing.map((option, index) => (
                    <li
                      key={`${option.duration}-${index}`}
                      className="flex items-center justify-between gap-4 py-4"
                    >
                      <span>{option.duration}</span>
                      <span className="font-semibold text-ink">
                        Rs. {Number(option.price).toLocaleString("en-IN")}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">
                  Contact our team for treatment duration and pricing.
                </p>
              )}
              <BrandButton
                to={"/contact?service=" + encodeURIComponent(treatment.title)}
                size="small"
                className="mt-8"
              >
                Book now
              </BrandButton>
            </div>
          </Reveal>
        </div>
        <Link to="/spa" className="mt-12 inline-block text-sm font-semibold text-clay">
          ← Back to the spa menu
        </Link>
      </section>
    </>
  );
}
