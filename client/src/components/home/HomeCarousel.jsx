import React, { useEffect, useRef, useState } from "react";

function useActiveSlide(trackRef, count) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      const kids = Array.from(el.children);
      if (!kids.length) return;
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) {
        setActive(kids.length - 1);
        return;
      }
      const centre = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let min = Infinity;
      kids.forEach((kid, index) => {
        const distance = Math.abs(kid.offsetLeft + kid.offsetWidth / 2 - centre);
        if (distance < min) {
          min = distance;
          best = index;
        }
      });
      setActive(best);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [trackRef, count]);

  const goTo = (index) => {
    const el = trackRef.current;
    const kid = el?.children[index];
    if (!el || !kid) return;
    el.scrollTo({
      left: kid.offsetLeft + kid.offsetWidth / 2 - el.clientWidth / 2,
      behavior: "smooth",
    });
  };

  return [active, goTo];
}

function Dots({ count, active, onSelect, label, className = "" }) {
  if (count < 2) return null;
  return (
    <div
      role="group"
      aria-label={`${label} pagination`}
      className={`mt-5 flex items-center justify-center ${className}`}
    >
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          type="button"
          aria-label={`Go to ${label} ${index + 1} of ${count}`}
          aria-current={index === active ? "true" : undefined}
          onClick={() => onSelect(index)}
          className="grid h-6 min-w-6 place-items-center px-0.5"
        >
          <span
            className={`block h-1.5 rounded-full transition-all duration-300 ${
              index === active ? "w-6 bg-clay" : "w-1.5 bg-clay/30"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export function Slider({ children, label }) {
  const trackRef = useRef(null);
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startScrollLeft: 0,
  });
  const items = React.Children.toArray(children);
  const [active, goTo] = useActiveSlide(trackRef, items.length);

  const scroll = (direction) => {
    const track = trackRef.current;
    track?.scrollBy({
      left: direction * track.clientWidth * 0.8,
      behavior: "smooth",
    });
  };
  const startDrag = (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    const track = trackRef.current;
    if (!track) return;
    dragRef.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      startScrollLeft: track.scrollLeft,
    };
  };
  const moveDrag = (event) => {
    const drag = dragRef.current;
    const track = trackRef.current;
    if (!drag.active || !track) return;
    const distance = event.clientX - drag.startX;
    if (Math.abs(distance) > 4 && !drag.moved) {
      drag.moved = true;
      track.setPointerCapture(event.pointerId);
    }
    if (drag.moved) {
      track.scrollLeft = drag.startScrollLeft - distance;
      event.preventDefault();
    }
  };
  const stopDrag = () => {
    dragRef.current.active = false;
    if (dragRef.current.moved) {
      window.setTimeout(() => {
        dragRef.current.moved = false;
      }, 0);
    }
  };
  const preventDraggedClick = (event) => {
    if (!dragRef.current.moved) return;
    event.preventDefault();
    event.stopPropagation();
    dragRef.current.moved = false;
  };

  return (
    <div>
      <div
        ref={trackRef}
        aria-label={label}
        aria-roledescription="carousel"
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        onClickCapture={preventDraggedClick}
        className="relative flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:cursor-grab md:gap-5 md:active:cursor-grabbing md:pb-2"
      >
        {items}
      </div>
      <Dots count={items.length} active={active} onSelect={goTo} label={label} />
    </div>
  );
}

export function Carousel({ children, label = "Services", arrowClass = "" }) {
  const trackRef = useRef(null);
  const count = React.Children.count(children);
  const [active, goTo] = useActiveSlide(trackRef, count);

  const scroll = (direction) => {
    trackRef.current?.scrollBy({
      left: direction * trackRef.current.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        aria-label={label}
        aria-roledescription="carousel"
        className="relative -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto overscroll-x-contain scroll-smooth px-5 [scrollbar-width:none] sm:mx-0 sm:scroll-px-0 sm:gap-5 sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      {arrowClass && (
        <button
          type="button"
          aria-label={`Scroll ${label} forward`}
          className={`absolute right-0 z-20 ${arrowClass}`}
          onClick={() => scroll(1)}
        />
      )}
      <Dots
        count={count}
        active={active}
        onSelect={goTo}
        label={label}
        className="sm:hidden"
      />
    </div>
  );
}
