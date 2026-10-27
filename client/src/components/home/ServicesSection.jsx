import React from "react";
import { serviceCards } from "../../data";
import { Carousel } from "./HomeCarousel";

export default function ServicesSection() {
  return (
    <section id="services" className="scroll-mt-4 bg-cream py-10 md:py-12">
      <h2 className="mb-6 text-center text-3xl font-normal italic md:mb-7 md:text-4xl">
        Our Services
      </h2>
      <div className="mx-auto max-w-7xl px-5">
        <Carousel label="Services">
          {serviceCards.map((service) => (
            <a
              key={service.name}
              href={service.href}
              className="group relative flex h-[30rem] shrink-0 basis-[78%] snap-center flex-col overflow-hidden rounded-t-full bg-cream transition-transform duration-200 max-sm:active:scale-[0.985] sm:h-[34rem] sm:basis-[calc((100%_-_1.25rem)/2)] sm:snap-start lg:basis-[30%]"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-10 rounded-t-full border border-clay/70 [-webkit-mask-image:linear-gradient(to_bottom,black_55%,transparent_100%)] [mask-image:linear-gradient(to_bottom,black_55%,transparent_100%)]"
              />
              <div className="aspect-[1/1.05] overflow-hidden">
                <img
                  src={service.img}
                  alt={service.name}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-focus-visible:scale-110 motion-reduce:transition-none"
                />
              </div>
              <div className="flex flex-1 flex-col items-center px-5 pb-6 pt-5 text-center sm:px-6 sm:pt-6">
                <h3 className="text-2xl font-normal italic leading-tight text-ink md:text-[1.7rem]">
                  {service.name}
                </h3>
                <p className="mt-2 line-clamp-3 max-w-xs text-sm leading-relaxed text-muted transition-all duration-500 sm:mt-3 sm:line-clamp-none sm:min-h-[4.5rem] md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100">
                  {service.desc}
                </p>
                <span className="mt-auto pt-3 text-sm font-medium uppercase tracking-[0.18em] text-clay sm:mt-4 sm:pt-0">
                  Explore
                </span>
              </div>
            </a>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
