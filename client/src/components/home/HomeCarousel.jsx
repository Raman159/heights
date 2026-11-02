import React, { useEffect, useRef, useState } from "react";
function useCarousel(count) {
  const ref = useRef(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const track = ref.current;
    if (!track) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const slides = [...track.children];
        if (!slides.length) return;
        const center = track.scrollLeft + track.clientWidth / 2;
        let idx = 0,
          distance = Infinity;
        slides.forEach((slide, i) => {
          const d = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - center);
          if (d < distance) {
            distance = d;
            idx = i;
          }
        });
        setActive(idx);
      });
    };
    track.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      track.removeEventListener("scroll", update);
      cancelAnimationFrame(frame);
    };
  }, [count]);
  const goTo = (index) => {
    const track = ref.current;
    const slide = track?.children[index];
    if (!track || !slide) return;
    track.scrollTo({
      left: slide.offsetLeft + slide.offsetWidth / 2 - track.clientWidth / 2,
      behavior: "smooth",
    });
  };
  return { ref, active, goTo };
}
function Controls({ label, count, active, goTo, refEl }) {
  if (count < 2) return null;
  const scroll = (direction) =>
    refEl.current?.scrollBy({
      left: direction * refEl.current.clientWidth * 0.8,
      behavior: "smooth",
    });
  return (
    <div className="mt-7 flex items-center justify-between gap-6">
      <span className="text-[11px] uppercase tracking-[.2em] text-clay">
        {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
      </span>
      <div
        className="flex items-center gap-2"
        role="group"
        aria-label={`${label} controls`}
      >
        <button
          type="button"
          onClick={() => scroll(-1)}
          aria-label={`Previous ${label}`}
          className="grid h-11 w-11 place-items-center rounded-full border border-ink/20 text-ink transition hover:bg-ink hover:text-white"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          aria-label={`Next ${label}`}
          className="grid h-11 w-11 place-items-center rounded-full border border-ink/20 text-ink transition hover:bg-ink hover:text-white"
        >
          →
        </button>
      </div>
    </div>
  );
}
function Track({ children, label = "Items", className = "" }) {
  const items = React.Children.toArray(children);
  const { ref, active, goTo } = useCarousel(items.length);
  return (
    <div>
      <div
        ref={ref}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        className={`flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-6 ${className}`}
      >
        {items}
      </div>
      <Controls
        label={label}
        count={items.length}
        active={active}
        goTo={goTo}
        refEl={ref}
      />
    </div>
  );
}
export function Slider(props) {
  return <Track {...props} />;
}
export function Carousel({ children, label = "Services", arrowClass = "" }) {
  return <Track label={label}>{children}</Track>;
}
