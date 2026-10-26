import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { pic } from "../../data";

export default function Card({ item, to }) {
  const href = to || "/services/" + item.slug;
  const tag = item.badge || item.category || item.tag;
  const text = item.subtitle || item.description;

  return (
    <Link
      to={href}
      aria-label={`${item.title} – view details`}
      className="group panel flex h-full flex-col overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(70,56,47,0.45)] focus-visible:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay max-md:active:scale-[0.985] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      {/* Image */}
      <div className="relative h-64 shrink-0 overflow-hidden sm:h-72">
        <img
          loading="lazy"
          decoding="async"
          src={item.image_url || pic(item.photo || item.title)}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />

        {/* Fine inner frame – subtle fine-dining detail */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-3 border border-white/35 transition-all duration-500 group-hover:inset-2.5 group-hover:border-white/60"
        />

        {tag && (
          <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-clay backdrop-blur-sm">
            {tag}
          </span>
        )}

        {item.price && (
          <span className="absolute bottom-5 left-5 font-display text-lg italic text-white drop-shadow">
            {item.price}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-[1.4rem] font-normal italic leading-snug text-ink">
          {item.title}
        </h3>

        {/* thin accent rule that grows on hover */}
        <span
          aria-hidden="true"
          className="mt-3 block h-px w-10 bg-clay/60 transition-all duration-500 group-hover:w-20"
        />

        {text && (
          <p className="mt-4 line-clamp-3 text-sm leading-7 text-muted">
            {text}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-6">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-clay">
            Inquire 
          </span>
          <span
            aria-hidden="true"
            className="grid size-10 place-items-center rounded-full border border-clay/40 text-clay transition-all duration-300 group-hover:border-clay group-hover:bg-clay group-hover:text-white"
          >
            <ArrowUpRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}