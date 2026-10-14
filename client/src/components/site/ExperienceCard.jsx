import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { pic } from "../../data";

export default function Card({ item, to }) {
  return (
    <Link to={to || "/services/" + item.slug} className="group panel block">
      <div className="h-72 relative overflow-hidden">
        <img
          loading="lazy"
          src={item.image_url || pic(item.photo || item.title)}
          className="h-full w-full transition-transform duration-700 group-hover:scale-105"
          alt={item.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-medium">{item.title}</h3>
          <ArrowUpRight size={20} />
        </div>
        <p className="text-muted text-sm mt-2">
          {item.subtitle || item.description}
        </p>
      </div>
    </Link>
  );
}
