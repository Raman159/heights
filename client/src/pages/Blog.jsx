import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { pic } from "../data";
import { mediaUrl } from "../api";
import Banner from "../components/site/Banner";
import EmptyState from "../components/site/EmptyState";
import BrandButton from "../components/site/BrandButton";
import useCollection from "../hooks/useCollection";
import Markdown, { getHeadings, excerptFromMarkdown } from "../components/site/Markdown";
import RichText from "../components/site/RichText";

/* ---------- helpers ---------- */

const PAGE = 6;

const fmtDate = (v) => {
  const d = v ? new Date(v) : null;
  return d && !isNaN(d)
    ? d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "";
};
const dateOf = (p) => fmtDate(p.created_at || p.published_at || p.date);
/* Prefer the server's read_minutes (list endpoints may omit the body) */
const readLabel = (p) => {
  const body = (p.body || "").replace(/<[^>]*>/g, " ");
  const m =
    p.read_minutes ||
    (body ? Math.max(1, Math.round(body.trim().split(/\s+/).length / 200)) : 0);
  return m ? m + " min read" : "";
};
/* Use the written excerpt, else the first paragraph of the body */
const excerptOf = (p) => p.excerpt || excerptFromMarkdown(p.body);
const cover = (p) => mediaUrl(p.image_url || pic("spa-lobby.webp"));

const Arrow = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className={className}>
    <path d="M4 12h15m-5-5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* Image that fades in once loaded, so nothing pops */
function Img({ src, alt, className = "" }) {
  const ref = useRef(null);
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (ref.current?.complete) setOk(true);
  }, [src]);
  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      loading="lazy"
      onLoad={() => setOk(true)}
      className={`${className} transition-[opacity,transform] duration-[1200ms] ease-out ${ok ? "opacity-100" : "opacity-0"}`}
    />
  );
}

function Meta({ post, withCategory = false, className = "" }) {
  const items = [withCategory && post.category, dateOf(post), readLabel(post)].filter(Boolean);
  return (
    <p className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-ink/60 ${className}`}>
      {items.map((t, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="h-3 w-px bg-ink/20" aria-hidden="true" />}
          <span className={i === 0 && withCategory ? "font-medium text-clay" : ""}>{t}</span>
        </React.Fragment>
      ))}
    </p>
  );
}

function useReadProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        setP(max > 0 ? Math.min(1, h.scrollTop / max) : 0);
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      window.removeEventListener("scroll", on);
      cancelAnimationFrame(raf);
    };
  }, []);
  return p;
}

/* ---------- list ---------- */

function Skeleton() {
  return (
    <div className="grid gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
      {[0, 1, 2].map((i) => (
        <div key={i}>
          <div className="aspect-[4/5] bg-ink/5" />
          <div className="mt-5 h-3 w-1/3 bg-ink/5" />
          <div className="mt-4 h-6 w-4/5 bg-ink/5" />
        </div>
      ))}
    </div>
  );
}

function Featured({ post }) {
  return (
    <Link
      to={"/blog/" + post.slug}
      className="group relative left-1/2 mb-24 grid w-screen -translate-x-1/2 bg-white/80 transition-shadow duration-700 hover:shadow-[0_40px_90px_-50px_rgba(48,39,37,.55)] lg:grid-cols-12"
    >
      <div className="relative overflow-hidden lg:col-span-5 after:pointer-events-none after:absolute after:inset-4 after:border after:border-white/0 after:transition-colors after:duration-700 group-hover:after:border-white/60">
        <Img
          src={cover(post)}
          alt={post.title}
          className="h-auto min-h-[260px] w-full object-cover group-hover:scale-[1.035]"
        />
      </div>
      <div className="flex flex-col justify-center p-8 sm:p-10 lg:col-span-7 lg:p-14">
        <p className="eyebrow">Latest story</p>
        <h2 className="font-display mt-6 text-3xl font-light leading-[1.1] tracking-[-.04em] md:text-[2.8rem]">
          {post.title}
        </h2>
        {excerptOf(post) && (
          <RichText
            text={excerptOf(post)}
            allowLinks={false}
            className="mt-6 max-w-md leading-8 text-ink/70 line-clamp-4"
          />
        )}
        <Meta post={post} withCategory className="mt-7" />
        <span className="mt-9 inline-flex w-fit items-center gap-3 border-b border-ink pb-1.5 text-sm font-medium">
          Read the story
          <Arrow className="transition-transform duration-500 group-hover:translate-x-1.5" />
        </span>
      </div>
    </Link>
  );
}

function PostCard({ post, index = 0 }) {
  return (
    <Link
      to={"/blog/" + post.slug}
      className="blog-in group block"
      style={{ "--d": `${(index % 3) * 90}ms` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-skin after:pointer-events-none after:absolute after:inset-3 after:border after:border-white/0 after:transition-colors after:duration-500 group-hover:after:border-white/70">
        <Img
          src={cover(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.05]"
        />
        {post.category && (
          <span className="absolute left-4 top-4 z-10 bg-[#fbf7eb]/90 px-3 py-1.5 text-[11px] font-medium tracking-wide text-ink backdrop-blur">
            {post.category}
          </span>
        )}
      </div>
      <Meta post={post} className="mt-6" />
      <h3 className="font-display mt-3 text-[1.65rem] font-light leading-[1.2] tracking-[-.03em]">
        {post.title}
      </h3>
      {excerptOf(post) && (
        <RichText
          text={excerptOf(post)}
          allowLinks={false}
          className="mt-3 leading-7 text-ink/65 line-clamp-2"
        />
      )}
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-clay">
        Read story
        <Arrow className="transition-transform duration-500 group-hover:translate-x-1.5" />
      </span>
    </Link>
  );
}

function Toolbar({ cats, cat, setCat, q, setQ, count }) {
  return (
    <div className="mb-14 flex flex-col gap-6 border-b border-ink/10 pb-8 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 className="h2">{cat || "All stories"}</h2>
        <p className="mt-2 text-sm text-ink/55" aria-live="polite">
          {count} {count === 1 ? "story" : "stories"}
        </p>
      </div>
      <div className="flex flex-col gap-5 md:items-end">
        <label className="relative block w-full md:w-72">
          <span className="sr-only">Search stories</span>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" className="absolute left-0 top-1/2 -translate-y-1/2 text-ink/45" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4 4" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search stories"
            className="w-full border-b border-ink/25 bg-transparent py-2.5 pl-7 pr-2 text-sm outline-none transition-colors placeholder:text-ink/40 focus:border-clay"
          />
        </label>
        {cats.length > 1 && (
          <div className="flex flex-wrap gap-2.5" role="tablist" aria-label="Filter by category">
            {["All", ...cats].map((c) => {
              const on = (c === "All" && !cat) || c === cat;
              return (
                <button
                  key={c}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setCat(c === "All" ? "" : c)}
                  className={`rounded-full border px-5 py-2 text-sm font-medium transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-clay ${
                    on ? "border-ink bg-ink text-white" : "border-ink/20 hover:bg-skin"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- article ---------- */

function Adjacent({ post, label, align }) {
  if (!post) return <span />;
  return (
    <Link
      to={"/blog/" + post.slug}
      className={`group flex-1 border-t border-ink/15 pt-6 transition-colors hover:border-clay ${align === "right" ? "text-right" : ""}`}
    >
      <p className="text-sm text-ink/50">{label}</p>
      <p className="font-display mt-2 text-2xl font-light leading-snug tracking-[-.02em]">{post.title}</p>
    </Link>
  );
}

function Toc({ items }) {
  const [active, setActive] = useState("");
  useEffect(() => {
    const obs = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-20% 0px -70% 0px" }
    );
    items.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [items]);
  return (
    <nav aria-label="In this story" className="space-y-3 border-t border-ink/15 pt-6">
      <p className="text-ink/50">In this story</p>
      {items.map((h) => (
        <button
          key={h.id}
          onClick={() => document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" })}
          className={`block text-left leading-snug transition-colors ${active === h.id ? "text-clay" : "text-ink/65 hover:text-ink"}`}
        >
          {h.text}
        </button>
      ))}
    </nav>
  );
}

function Article({ item, more, prev, next }) {
  const [copied, setCopied] = useState(false);
  const progress = useReadProgress();
  const toc = getHeadings(item.body);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: item.title, url });
      else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {}
  };

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[60] h-[3px]" aria-hidden="true">
        <div className="h-full origin-left bg-clay" style={{ transform: `scaleX(${progress})` }} />
      </div>

      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-12 lg:gap-16">
        <aside className="lg:col-span-3">
          <div className="space-y-6 border-t border-ink/15 pt-6 text-sm lg:sticky lg:top-28">
            <div>
              <p className="text-ink/50">Published</p>
              <p className="mt-1">{dateOf(item) || "—"}</p>
            </div>
            <div>
              <p className="text-ink/50">Reading time</p>
              <p className="mt-1">{readLabel(item)}</p>
            </div>
            {item.category && (
              <div>
                <p className="text-ink/50">Filed under</p>
                <p className="mt-1 font-medium text-clay">{item.category}</p>
              </div>
            )}
            {toc.length >= 3 && <Toc items={toc} />}
            <BrandButton onClick={share} size="small" tone="dark">
              {copied ? "Link copied" : "Share story"}
            </BrandButton>
          </div>
        </aside>

        <article className="lg:col-span-9 lg:max-w-[40rem]">
          {item.excerpt && (
            <RichText
              text={item.excerpt}
              className="font-display mb-10 border-b border-ink/10 pb-10 text-2xl font-light leading-[1.5] tracking-[-.02em] md:text-[1.7rem]"
            />
          )}
          <Markdown text={item.body} />
          <BrandButton to="/blog" size="small" tone="dark" className="mt-6">
            Back to journal
          </BrandButton>
        </article>
      </div>

      {(prev || next) && (
        <div className="mx-auto mt-24 flex max-w-5xl flex-col gap-10 sm:flex-row sm:gap-16">
          <Adjacent post={prev} label="Older story" />
          <Adjacent post={next} label="Newer story" align="right" />
        </div>
      )}

      {more.length > 0 && (
        <div className="mt-28 border-t border-ink/10 pt-20">
          <h2 className="h2 mb-14">Continue reading</h2>
          <div className="grid gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((p, i) => (
              <PostCard key={p.id} post={p} index={i} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/* ---------- page ---------- */

export function Blog() {
  const posts = useCollection("posts");
  const { slug } = useParams();
  const [cat, setCat] = useState("");
  const [q, setQ] = useState("");
  const [visible, setVisible] = useState(PAGE);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }, [slug]);
  useEffect(() => setVisible(PAGE), [cat, q]);

  const all = (posts || []).filter((p) => p.status !== "draft");
  const item = slug && posts ? all.find((x) => x.slug === slug) : null;
  const idx = item ? all.indexOf(item) : -1;
  const more = all.filter((p) => p.slug !== slug).slice(0, 3);

  const ql = q.trim().toLowerCase();
  const filtering = Boolean(cat || ql);
  const cats = [...new Set(all.map((p) => p.category).filter(Boolean))];
  const list = all.filter(
    (p) =>
      (!cat || p.category === cat) &&
      (!ql || `${p.title} ${excerptOf(p)}`.toLowerCase().includes(ql))
  );
  const featured = filtering ? null : list[0];
  const rest = filtering ? list : list.slice(1);
  const shown = rest.slice(0, visible);

  return (
    <>
      <style>{`
        .blog-in { animation: blog-in .8s cubic-bezier(.2,.7,.2,1) both; animation-delay: var(--d, 0ms); }
        @keyframes blog-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .blog-in { animation: none; } }
      `}</style>

      <Banner
        tag="HEIGHT JOURNAL"
        title={item?.title || "Stories of mindful living."}
        body={(item && excerptOf(item)) || "Notes on wellness, restoration, food and intentional living."}
        image={item?.image_url || pic("spa-lobby.webp")}
        compact={Boolean(item)}
      />

      <section className="shell py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          {posts === null ? (
            <Skeleton />
          ) : item ? (
            <Article item={item} more={more} prev={all[idx + 1]} next={all[idx - 1]} />
          ) : slug || posts.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <Toolbar cats={cats} cat={cat} setCat={setCat} q={q} setQ={setQ} count={list.length} />

              {list.length === 0 ? (
                <div className="py-24 text-center">
                  <p className="font-display text-3xl font-light tracking-[-.03em]">No stories match your search.</p>
                  <BrandButton
                    onClick={() => { setQ(""); setCat(""); }}
                    size="small"
                    tone="dark"
                    className="mt-8"
                  >
                    Clear filters
                  </BrandButton>
                </div>
              ) : (
                <>
                  {featured && <Featured post={featured} />}
                  <div key={cat + "|" + ql} className="grid gap-x-7 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
                    {shown.map((p, i) => (
                      <PostCard key={p.id} post={p} index={i} />
                    ))}
                  </div>
                  {rest.length > visible && (
                    <div className="mt-20 text-center">
                      <BrandButton
                        onClick={() => setVisible((v) => v + PAGE)}
                        size="small"
                        tone="dark"
                      >
                        Show more stories ({rest.length - visible} left)
                      </BrandButton>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}