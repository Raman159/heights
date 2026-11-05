import React, { useEffect, useRef } from "react";
import {
  motion,
  cubicBezier,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import { serviceCards } from "../../data";
import BrandButton from "../site/BrandButton";

// Soft ease-in-out so the expansion starts and ends gently
const scrollEase = cubicBezier(0.65, 0, 0.35, 1);

// Share of the scroll used to expand the shape (the rest reveals the content)
const EXPAND_END = 0.64;

/* ------------------------------------------------------------------ */
/*  Shape                                                              */
/* ------------------------------------------------------------------ */

// Outline traced from the reference blob: 36 points, clockwise from the top,
// normalised to the shape's own bounding box (0-1).
const OUTLINE = [
  [0.482, 0.062],
  [0.544, 0.14],
  [0.598, 0.18],
  [0.655, 0.199],
  [0.73, 0.204],
  [0.826, 0.211],
  [0.913, 0.254],
  [0.97, 0.33],
  [0.995, 0.423],
  [0.995, 0.52],
  [0.974, 0.612],
  [0.938, 0.697],
  [0.896, 0.774],
  [0.842, 0.842],
  [0.781, 0.9],
  [0.713, 0.947],
  [0.639, 0.981],
  [0.56, 0.994],
  [0.482, 0.997],
  [0.406, 0.979],
  [0.332, 0.957],
  [0.264, 0.921],
  [0.2, 0.878],
  [0.14, 0.825],
  [0.086, 0.763],
  [0.044, 0.69],
  [0.014, 0.608],
  [0.001, 0.52],
  [0.006, 0.43],
  [0.025, 0.342],
  [0.057, 0.258],
  [0.101, 0.179],
  [0.158, 0.108],
  [0.228, 0.051],
  [0.308, 0.01],
  [0.397, 0.006],
];

const OUTLINE_ASPECT = 1.066; // width / height of the traced blob
const SHAPE_SCALE = 0.62; // starting height as a share of the viewport height
const FULL_RADIUS = 0.78; // end shape: a squircle that overshoots the section

const fmt = (n) => +n.toFixed(4);
const lerp = (a, b, t) => a + (b - a) * t;

// Starting anchors in 0-1 section space, corrected for the viewport aspect
// ratio so the blob keeps its true proportions on any screen.
function startAnchors(aspect) {
  const k = Math.min(SHAPE_SCALE, (0.8 * aspect) / OUTLINE_ASPECT);
  const kx = (k * OUTLINE_ASPECT) / aspect;
  return OUTLINE.map(([x, y]) => [0.5 + (x - 0.5) * kx, 0.5 + (y - 0.5) * k]);
}

// Every anchor travels along its own ray from the centre out to a large,
// rounded square. Both shapes stay smooth, so every frame in between does too.
function endAnchors(start) {
  return start.map(([x, y]) => {
    const dx = x - 0.5;
    const dy = y - 0.5;
    const s = FULL_RADIUS / Math.pow(dx ** 4 + dy ** 4, 0.25);
    return [0.5 + dx * s, 0.5 + dy * s];
  });
}

// Closed Catmull-Rom spline through the anchors, written as cubic Beziers
function smoothPath(pts) {
  const n = pts.length;
  let d = `M ${fmt(pts[0][0])} ${fmt(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    d +=
      ` C ${fmt(p1[0] + (p2[0] - p0[0]) / 6)} ${fmt(p1[1] + (p2[1] - p0[1]) / 6)}` +
      ` ${fmt(p2[0] - (p3[0] - p1[0]) / 6)} ${fmt(p2[1] - (p3[1] - p1[1]) / 6)}` +
      ` ${fmt(p2[0])} ${fmt(p2[1])}`;
  }
  return d + " Z";
}

function blobPath(t, aspect) {
  const from = startAnchors(aspect);
  const to = endAnchors(from);
  return smoothPath(
    from.map((p, i) => [lerp(p[0], to[i][0], t), lerp(p[1], to[i][1], t)])
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function DiningShowcase() {
  const sectionRef = useRef(null);
  const reduceMotion = useReducedMotion();

  // Viewport aspect ratio (feeds the shape so it never looks stretched)
  const aspect = useMotionValue(1.6);
  useEffect(() => {
    const update = () => aspect.set(window.innerWidth / window.innerHeight);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [aspect]);

  // Progress runs 0 -> 1 while the sticky stage is pinned on screen
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Spring smoothing so wheel / trackpad steps glide instead of jumping
  const smooth = useSpring(scrollYProgress, {
    stiffness: 105,
    damping: 28,
    mass: 0.8,
    restDelta: 0.0005,
  });
  const fullyExpanded = useMotionValue(1);
  const progress = reduceMotion ? fullyExpanded : smooth;

  // Eased 0 -> 1 expansion amount that drives everything about the image
  const t = useTransform(progress, [0, EXPAND_END], [0, 1], {
    ease: scrollEase,
    clamp: true,
  });

  const blobD = useTransform([t, aspect], ([tv, av]) => blobPath(tv, av));
  const imageScale = useTransform(t, [0, 1], [1.15, 1]);
  const overlayOpacity = useTransform(t, [0, 1], [0.1, 0.5]);

  // Headline: dark on cream -> light on the image
  const headingColor = useTransform(t, [0.25, 0.8], ["#C5B5AE", "#f6f1e9"]);
  const headingY = useTransform(t, [0, 1], [0, -30]);

  // Supporting content appears once the image has expanded
  const copyOpacity = useTransform(progress, [0.6, 0.78], [0, 1]);
  const copyY = useTransform(progress, [0.6, 0.78], [24, 0]);
  const cardOpacity = useTransform(progress, [0.7, 0.88], [0, 1]);
  const cardY = useTransform(progress, [0.7, 0.88], [40, 0]);

  const dining = serviceCards
    .filter((s) =>
      /restro|restaurant|dining|food|bar|lounge|drink/i.test(
        `${s.name} ${s.desc || ""}`
      )
    )
    .slice(0, 2);

  if (!dining.length) return null;

  return (
    <section
      ref={sectionRef}
      className="relative bg-cream"
      style={{ height: reduceMotion ? "100vh" : "320vh" }}
    >
      {/* Sticky stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Clip shape (animated) */}
        <svg width="0" height="0" aria-hidden="true" className="absolute">
          <defs>
            <clipPath id="dining-blob" clipPathUnits="objectBoundingBox">
              <motion.path d={blobD} />
            </clipPath>
          </defs>
        </svg>

        {/* Background image that expands */}
        <motion.div
          className="absolute inset-0 will-change-[clip-path]"
          style={{
            clipPath: "url(#dining-blob)",
            WebkitClipPath: "url(#dining-blob)",
          }}
        >
          <motion.img
            src="/media/pool-guests.webp"
            alt="Guests enjoying the pool"
            loading="lazy"
            style={{ scale: imageScale }}
            className="h-full w-full object-cover"
          />
          <motion.div
            className="pointer-events-none absolute inset-0 bg-black"
            style={{ opacity: overlayOpacity }}
          />
        </motion.div>

        {/* Content layer */}
        <div className="shell relative z-10 flex h-full flex-col items-center justify-center text-center">
          <p className="eyebrow mb-7 text-clay">Restaurant & Bar</p>

          <motion.h2
            style={{ color: headingColor, y: headingY }}
            className="text-[clamp(3.7rem,7.3vw,8.5rem)] font-light leading-[.95] tracking-[-.07em]"
          >
            The art of <em>staying.</em>
          </motion.h2>

          <motion.div
            style={{ opacity: copyOpacity, y: copyY }}
            className="flex flex-col items-center"
          >
            <p className="mt-8 max-w-md text-base leading-8 text-white/85">
              {dining[0].desc}
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
              <BrandButton href={dining[0].href} size="small">
                Explore dining
              </BrandButton>

              <BrandButton to="/contact" size="small" tone="dark">
                Reservations
              </BrandButton>
            </div>
          </motion.div>
        </div>

        {/* Second image as a small card, appears after expansion */}
        {dining[1] && (
          <motion.div
            style={{ opacity: cardOpacity, y: cardY }}
            className="absolute bottom-8 right-6 z-20 hidden w-[200px] sm:block lg:bottom-12 lg:right-12 lg:w-[260px]"
          >
            <a
              href={dining[1].href}
              className="group block border-[6px] border-cream bg-cream shadow-[0_18px_50px_rgba(30,20,15,0.25)] sm:border-[9px]"
            >
              <div className="h-[160px] overflow-hidden lg:h-[210px]">
                <img
                  src={dining[1].img}
                  alt={dining[1].name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.05]"
                />
              </div>
            </a>

            <div className="mt-3 flex items-center gap-3">
              <span className="h-px w-6 bg-cream" />
              <span className="text-[10px] uppercase tracking-[.18em] text-cream">
                {dining[1].name}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}