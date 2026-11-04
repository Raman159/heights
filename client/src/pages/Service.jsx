import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { get, mediaUrl } from "../api";
import { Reveal } from "../components/Layout";
import Banner from "../components/site/Banner";
import BrandButton from "../components/site/BrandButton";
import { useToast } from "../components/Toast";

export function Service() {
  const { slug } = useParams();
  const notify = useToast();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    get("/public/services/" + encodeURIComponent(slug))
      .then((result) => {
        if (active) setService(result);
      })
      .catch((error) => {
        if (!active) return;
        setService(null);
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
    return <section className="shell min-h-[50vh] py-24 text-muted">Loading service…</section>;
  }
  if (!service) {
    return (
      <Banner
        tag="Not found"
        title="Experience not found"
        body="Please explore our services."
      />
    );
  }

  const image = mediaUrl(service.image_url || "/media/spa-lobby.webp");
  return (
    <>
      <Banner
        tag="HEIGHT EXPERIENCES"
        title={service.title}
        body={service.description}
        image={image}
      />
      <section className="shell py-24 grid md:grid-cols-2 gap-16 items-center">
        <Reveal>
          <img
            src={image}
            alt={service.title}
            className="rounded-[3rem] w-full h-[500px] object-cover"
          />
        </Reveal>
        <Reveal>
          <p className="eyebrow mb-5">{service.subtitle}</p>
          <h2 className="h2 mb-6">Your time, beautifully spent.</h2>
          <p className="text-muted leading-8 mb-8">{service.description}</p>
          <BrandButton
            to={"/contact?service=" + encodeURIComponent(service.title)}
            size="small"
          >
            Enquire about {service.title}
          </BrandButton>
        </Reveal>
      </section>
    </>
  );
}
