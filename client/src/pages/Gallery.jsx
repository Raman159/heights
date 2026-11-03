import React, { useEffect, useState } from "react";
import { ArrowDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import { mediaUrl } from "../api";
import useCollection from "../hooks/useCollection";
import Banner from "../components/site/Banner";
import SectionHead from "../components/site/SectionHead";

const CATEGORY_ORDER = ["Dining", "Wellness", "Fitness", "Spaces"];
const PHOTO_ASPECTS = [
  "aspect-[4/5]",
  "aspect-square",
  "aspect-[3/4]",
  "aspect-[4/5]",
];

export function Gallery() {
  const gallery = useCollection("gallery");
  const [category, setCategory] = useState("All");
  const [activePhoto, setActivePhoto] = useState(null);
  const allPhotos = gallery || [];
  const categories = [
    "All",
    ...CATEGORY_ORDER.filter((item) =>
      allPhotos.some((photo) => photo.category === item),
    ),
  ];
  const photos =
    category === "All"
      ? allPhotos
      : allPhotos.filter((photo) => photo.category === category);
  const selectedPhoto = activePhoto === null ? null : photos[activePhoto];

  useEffect(() => {
    if (activePhoto === null) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setActivePhoto(null);
      } else if (event.key === "ArrowRight") {
        setActivePhoto((current) => (current + 1) % photos.length);
      } else if (event.key === "ArrowLeft") {
        setActivePhoto((current) => (current - 1 + photos.length) % photos.length);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePhoto, photos.length]);

  function showPreviousPhoto() {
    setActivePhoto((current) => (current - 1 + photos.length) % photos.length);
  }

  function showNextPhoto() {
    setActivePhoto((current) => (current + 1) % photos.length);
  }

  return (
    <>
      <Banner
        tag="A GLIMPSE OF HEIGHT"
        title="A closer look at Height."
        body="From slow mornings to evenings above the city, explore the spaces and moments that make Height feel like your own."
        image={allPhotos[0]?.image_url}
      >
        <a
          href="#gallery"
          className="inline-flex items-center gap-2 text-sm text-white transition-opacity hover:opacity-70"
        >
          Explore the gallery <ArrowDown size={16} aria-hidden="true" />
        </a>
      </Banner>

      <section id="gallery" className="scroll-mt-24 bg-cream py-20 md:py-28">
        <div className="shell">
          <SectionHead
            eyebrow="A place for every pace"
            title="The Height experience"
            body="Take a moment to explore our dining, wellness and fitness spaces."
          />

          <div
            role="group"
            aria-label="Filter gallery by category"
            className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:mb-14 md:flex md:flex-wrap md:justify-center md:gap-4"
          >
            {categories.map((item) => {
              const isActive = category === item;

              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => {
                    setCategory(item);
                    setActivePhoto(null);
                  }}
                  className={
                    "group relative aspect-[16/9] overflow-hidden rounded-2xl text-white outline-none transition-all duration-300 " +
                    "focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 md:aspect-[4/3] md:w-44 lg:w-52 " +
                    (isActive
                      ? "ring-2 ring-ink ring-offset-2 ring-offset-cream"
                      : "opacity-90 hover:opacity-100")
                  }
                >
                  <img
                    src={mediaUrl(
                      allPhotos.find((photo) =>
                        item === "All" || photo.category === item,
                      )?.image_url,
                    )}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
                  />
                  <span
                    aria-hidden="true"
                    className={
                      "absolute inset-0 transition-colors duration-500 " +
                      (isActive
                        ? "bg-black/20"
                        : "bg-black/40 group-hover:bg-black/30")
                    }
                  />
                  <span className="relative z-10 flex h-full items-end justify-center px-3 pb-3 font-display text-lg font-light leading-tight tracking-wide md:text-xl">
                    {item}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="columns-2 gap-4 space-y-4 sm:columns-3 lg:columns-4 lg:gap-5 lg:space-y-5">
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setActivePhoto(index)}
                aria-label={`View ${photo.title}`}
                className="group relative mb-4 block w-full break-inside-avoid overflow-hidden bg-skin/30 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-clay lg:mb-5"
              >
                <img
                  src={mediaUrl(photo.image_url)}
                  alt={photo.title}
                  loading="lazy"
                  decoding="async"
                  className={`${PHOTO_ASPECTS[index % PHOTO_ASPECTS.length]} w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none`}
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-100"
                />
                <span className="absolute inset-x-0 bottom-0 flex translate-y-2 flex-col p-4 text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 sm:p-5">
                  <span className="text-[10px] uppercase tracking-[.2em] text-white/75">
                    {photo.category}
                  </span>
                  <span className="mt-1 font-display text-lg">
                    {photo.title}
                  </span>
                </span>
              </button>
            ))}
            {!photos.length && (
              <p className="col-span-full py-12 text-center text-muted">
                {gallery === null ? "Loading gallery…" : "No gallery images yet."}
              </p>
            )}
          </div>
        </div>
      </section>

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`Gallery image: ${selectedPhoto.title}`}
          onClick={(event) => {
            if (event.target === event.currentTarget) setActivePhoto(null);
          }}
        >
          <button
            type="button"
            onClick={() => setActivePhoto(null)}
            aria-label="Close image viewer"
            className="absolute right-4 top-4 z-10 rounded-full p-3 text-white transition-colors hover:bg-white/15"
          >
            <X size={24} />
          </button>
          <button
            type="button"
            onClick={showPreviousPhoto}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full p-3 text-white transition-colors hover:bg-white/15 sm:left-6"
          >
            <ChevronLeft size={28} />
          </button>
          <figure className="flex max-h-full max-w-6xl flex-col items-center">
            <img
              src={mediaUrl(selectedPhoto.image_url)}
              alt={selectedPhoto.title}
              className="max-h-[78vh] max-w-full object-contain"
            />
            <figcaption className="mt-4 text-center text-sm text-white/85">
              <span className="mr-3 text-[10px] uppercase tracking-[.2em] text-white/55">
                {selectedPhoto.category}
              </span>
              {selectedPhoto.title}
            </figcaption>
          </figure>
          <button
            type="button"
            onClick={showNextPhoto}
            aria-label="Next image"
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full p-3 text-white transition-colors hover:bg-white/15 sm:right-6"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}
    </>
  );
}
