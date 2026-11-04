import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { get, mediaUrl } from "../api";
import { Reveal } from "../components/Layout";
import { useToast } from "../components/Toast";
import Banner from "../components/site/Banner";
import SectionHead from "../components/site/SectionHead";

const fallbackPage = {
  spa_title: "Spa at The Height",
  spa_tagline: "Rejuvenate Mind. Body. Soul.",
  spa_intro_heading: "A sanctuary for you",
  spa_hero_image: "/media/spa-lobby.webp",
  spa_intro_image: "/media/spa-treatment.webp",
};

export function Spa() {
  const notify = useToast();
  const [content, setContent] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    get("/public/spa")
      .then((result) => {
        if (active) setContent(result);
      })
      .catch((requestError) => {
        if (!active) return;
        setError(true);
        notify(requestError.message, "error");
      });
    return () => {
      active = false;
    };
  }, [notify]);

  if (error) {
    return (
      <section className="shell min-h-[50vh] py-24 text-muted">
        Spa content could not be loaded. Please try again later.
      </section>
    );
  }
  if (!content) {
    return <section className="shell min-h-[50vh] py-24 text-muted">Loading spa…</section>;
  }

  const page = { ...fallbackPage, ...content.page };
  return (
    <>
      <Banner
        tag="SPA AT HEIGHT"
        title={page.spa_title}
        body={page.spa_tagline}
        image={mediaUrl(page.spa_hero_image || fallbackPage.spa_hero_image)}
      />
      <section className="shell py-24 grid lg:grid-cols-2 gap-16 items-center">
        <img
          src={mediaUrl(page.spa_intro_image || fallbackPage.spa_intro_image)}
          alt="Spa treatment at HEIGHT"
          className="rounded-[3rem] h-[450px] w-full object-cover"
        />
        <div>
          <p className="eyebrow mb-5">A sanctuary for you</p>
          <h2 className="h2 mb-6">{page.spa_intro_heading}</h2>
          <p className="text-muted leading-8 whitespace-pre-line">
            {page.spa_intro}
          </p>
        </div>
      </section>
      {content.categories.map((category, index) => {
        const treatments = content.treatments.filter(
          (treatment) => Number(treatment.category_id) === Number(category.id),
        );
        if (!treatments.length) return null;
        return (
          <section
            className={"py-20 " + (index % 2 ? "bg-cream" : "bg-[#f5e8df]")}
            key={category.id}
          >
            <div className="shell">
              <SectionHead eyebrow="THE SPA MENU" title={category.name} />
              {category.description && (
                <p className="mb-8 max-w-3xl text-muted leading-8">
                  {category.description}
                </p>
              )}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {treatments.map((treatment) => (
                  <Reveal key={treatment.id}>
                    <article className="panel h-full">
                      <img
                        src={mediaUrl(treatment.image_url || page.spa_intro_image)}
                        alt={treatment.title}
                        loading="lazy"
                        className="w-full h-52 object-cover"
                      />
                      <div className="p-6">
                        <h3 className="text-lg mb-4">{treatment.title}</h3>
                        <Link
                          to={"/spa/" + encodeURIComponent(treatment.slug)}
                          className="text-clay font-semibold text-sm"
                        >
                          Read more →
                        </Link>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
