import React from "react";
import { Link, useParams } from "react-router-dom";
import { pic } from "../data";
import Banner from "../components/site/Banner";
import Card from "../components/site/ExperienceCard";
import EmptyState from "../components/site/EmptyState";
import useCollection from "../hooks/useCollection";

export function Blog() {
  let posts = useCollection("posts"),
    { slug } = useParams(),
    item = slug && posts ? posts.find((x) => x.slug === slug) : null;
  return (
    <>
      <Banner
        tag="HEIGHT JOURNAL"
        title={item?.title || "Stories of mindful living."}
        body={
          item?.excerpt ||
          "Notes on wellness, restoration, food and intentional living."
        }
        image={item?.image_url || pic("spa-lobby.webp")}
      />
      <section className="shell py-24">
        {posts === null ? null : item ? (
          <article className="max-w-3xl mx-auto">
            <p className="leading-9 text-lg whitespace-pre-wrap text-muted">
              {item.body}
            </p>
            <Link to="/blog" className="btn-outline mt-10">
              ← Back to journal
            </Link>
          </article>
        ) : slug || posts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {posts.map((p) => (
              <Card
                key={p.id}
                item={{ ...p, subtitle: p.excerpt }}
                to={"/blog/" + p.slug}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
