import React from "react";
import { Link } from "react-router-dom";
import BrandButton from "./BrandButton";
import { mediaUrl } from "../../api";

export default function PackageCard({ item, to }) {
  return (
    <Link
      to={to}
      className="group relative block aspect-[3/4] overflow-hidden"
    >
      {/* Image */}
      <img
        src={mediaUrl(item.image_url)}
        alt={item.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {/* Overlay: slightly dark by default, darker on hover */}
      <div className="absolute inset-0 bg-black/30 transition-colors duration-500 group-hover:bg-black/55" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center px-8 py-10 text-center text-white">
        {/* Top label */}
        {item.tag && (
          <p className="w-full text-xs font-medium uppercase tracking-widest text-white/70">
            {item.tag}
          </p>
        )}

        {/* Title + description */}
        <div className="flex flex-1 flex-col justify-center">
          <h3 className="font-display text-4xl font-light leading-tight">{item.title}</h3>
          {item.subtitle && (
            <p className="mt-4 text-base text-white/85">{item.subtitle}</p>
          )}
        </div>

        {/* Pill button */}
        <BrandButton as="span" tone="glass">
          More info
        </BrandButton>
      </div>
    </Link>
  );
}