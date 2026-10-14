import React from "react";
import { Link, useParams } from "react-router-dom";
import { pic, services } from "../data";
import { Reveal } from "../components/Layout";
import Banner from "../components/site/Banner";

export function Service() {
  let { slug } = useParams();
  const s = services.find((x) => x.slug === slug);
  if (!s)
    return (
      <Banner
        tag="Not found"
        title="Experience not found"
        body="Please explore our services."
      />
    );
  return (
    <>
      <Banner
        tag="HEIGHT EXPERIENCES"
        title={s.title}
        body={s.description}
        image={pic(s.photo)}
      />
      <section className="shell py-24 grid md:grid-cols-2 gap-16 items-center">
        <Reveal>
          <img
            src={pic(s.photo)}
            className="rounded-[3rem] w-full h-[500px] object-cover"
          />
        </Reveal>
        <Reveal>
          <p className="eyebrow mb-5">{s.subtitle}</p>
          <h2 className="h2 mb-6">Your time, beautifully spent.</h2>
          <p className="text-muted leading-8 mb-8">
            {s.description} Get in touch with our team to learn about
            availability and experiences tailored to you.
          </p>
          <Link
            to={"/contact?service=" + encodeURIComponent(s.title)}
            className="btn"
          >
            Enquire about {s.title} →
          </Link>
        </Reveal>
      </section>
    </>
  );
}
