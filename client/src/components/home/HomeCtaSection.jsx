
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function HomeCtaSection({
  imageSrc = "/media/terrace-lounge.webp",
  text = "Above the ordinary.",
}) {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const content = contentRef.current;

    if (!section || !image || !content) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let frameId = 0;
    let current = 0;
    let target = 0;

    const clamp = (value, min = 0, max = 1) =>
      Math.max(min, Math.min(max, value));

    const animate = () => {
      frameId = 0;

      current += (target - current) * 0.12;

      if (Math.abs(target - current) < 0.001) {
        current = target;
      }

      const progress = current;

      // Original pinned cinematic image animation
      if (!reducedMotion) {
        const scale = 1.38 - progress * 0.38;
        const moveY = (progress - 0.5) * 65;

        image.style.transform = `
          translate3d(0, ${moveY}px, 0)
          scale(${scale})
        `;
      } else {
        image.style.transform = "none";
      }

      // Fade in, hold, then fade out
      const fadeIn = clamp((progress - 0.12) / 0.2);
      const fadeOut = clamp((0.92 - progress) / 0.18);

      const opacity = reducedMotion
        ? 1
        : Math.min(fadeIn, fadeOut);

      const move = reducedMotion
        ? 0
        : (1 - fadeIn) * 55 - (1 - fadeOut) * 35;

      const scale = reducedMotion
        ? 1
        : 0.94 + fadeIn * 0.06;

      content.style.opacity = String(opacity);
      content.style.transform = `
        translate3d(0, ${move}px, 0)
        scale(${scale})
      `;

      // Keep the CTA non-interactive when hidden
      content.style.pointerEvents =
        opacity > 0.5 ? "auto" : "none";

      if (Math.abs(target - current) > 0.001) {
        frameId = requestAnimationFrame(animate);
      }
    };

    const updateTarget = () => {
      const rect = section.getBoundingClientRect();
      const distance = Math.max(
        1,
        section.offsetHeight - window.innerHeight
      );

      target = clamp(-rect.top / distance);

      if (!frameId) {
        frameId = requestAnimationFrame(animate);
      }
    };

    updateTarget();

    window.addEventListener("scroll", updateTarget, {
      passive: true,
    });

    window.addEventListener("resize", updateTarget);

    return () => {
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", updateTarget);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[240svh] bg-[#29231f]"
    >
      {/* Pinned full-screen photograph */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* Cinematic image */}
        <div
          ref={imageRef}
          className="absolute inset-0 will-change-transform"
        >
          <img
            src={imageSrc}
            alt="HEIGHT terrace lounge"
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </div>

        {/* Soft overlay for readability */}
        <div className="pointer-events-none absolute inset-0 bg-black/25" />

        {/* Animated center content */}
        <div className="absolute inset-0 z-10 flex items-center justify-center px-6">
          <div
            ref={contentRef}
            className="flex w-full max-w-[1400px] flex-col items-center text-center opacity-0 will-change-transform"
            style={{ pointerEvents: "none" }}
          >
            {/* Heading */}
            <h2
              className="
                max-w-[1200px]
                text-[clamp(3.5rem,9vw,10rem)]
                font-light
                leading-[0.95]
                tracking-[-0.065em]
                text-white
                drop-shadow-[0_5px_35px_rgba(0,0,0,0.2)]
              "
            >
              {text}
            </h2>

            {/* Contact button */}
            <Link
              to="/contact"
              className="
                group
                mt-10
                inline-flex
                min-h-[56px]
                items-center
                justify-center
                gap-8
                rounded-full
                border
                border-white/75
                bg-white/10
                px-8
                text-[11px]
                font-medium
                uppercase
                tracking-[0.18em]
                text-white
                backdrop-blur-sm
                transition-all
                duration-500
                hover:border-white
                hover:bg-white
                hover:text-[#29231f]
                md:mt-14
              "
            >
              Book an Experience

              <span
                className="
                  text-lg
                  leading-none
                  transition-transform
                  duration-500
                  group-hover:translate-x-1
                  group-hover:-translate-y-1
                "
                aria-hidden="true"
              >
                ↗
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
