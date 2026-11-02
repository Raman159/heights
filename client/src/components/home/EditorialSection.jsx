import React, { useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

/**
 * Motion scroll-scrubbed editorial composition.
 * Nothing runs on a timer or on initial page load. The entire scene moves
 * forwards and backwards with scroll position. Both images retain their paths.
 * Requires: motion, react-router-dom, Tailwind CSS + existing theme tokens.
 */
function useScrub(progress, reducedMotion, times, values) {
  return useTransform(
    progress,
    times,
    reducedMotion ? values.map(() => values[values.length - 1]) : values
  );
}

export default function EditorialSection() {
  const sectionRef = useRef(null);
  const reduceMotion = Boolean(useReducedMotion());

  // Complete the reveal as the section's TOP reaches 25% of the viewport.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 85%", "start 25%"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 32,
    mass: 0.3,
    restDelta: 0.0005,
  });
  const revealProgress = scrollYProgress;
  const textRevealProgress = progress;
  const imageRevealProgress = scrollYProgress;

  // Reveal timeline: eyebrow -> heading -> copy -> main image -> floating image.
  const eyebrowOpacity = useScrub(textRevealProgress, reduceMotion, [0.02, 0.14], [0, 1]);
  const eyebrowX = useScrub(textRevealProgress, reduceMotion, [0.02, 0.16], [-24, 0]);
  const eyebrowLine = useScrub(textRevealProgress, reduceMotion, [0.04, 0.24], [0, 1]);

  const headingOneY = useScrub(textRevealProgress, reduceMotion, [0.05, 0.28], [36, 0]);
  const headingOneOpacity = useScrub(textRevealProgress, reduceMotion, [0.06, 0.22], [0, 1]);
  const headingOneSkew = useScrub(textRevealProgress, reduceMotion, [0.05, 0.28], [-2, 0]);
  const headingTwoY = useScrub(textRevealProgress, reduceMotion, [0.13, 0.38], [44, 0]);
  const headingTwoOpacity = useScrub(textRevealProgress, reduceMotion, [0.14, 0.32], [0, 1]);
  const headingTwoSkew = useScrub(textRevealProgress, reduceMotion, [0.13, 0.38], [-2, 0]);

  const copyOpacity = useScrub(textRevealProgress, reduceMotion, [0.27, 0.46], [0, 1]);
  const copyY = useScrub(textRevealProgress, reduceMotion, [0.27, 0.5], [22, 0]);
  const copyX = useScrub(textRevealProgress, reduceMotion, [0.27, 0.5], [-10, 0]);
  const ctaLine = useScrub(revealProgress, reduceMotion, [0.38, 0.58], [0, 1]);

  // Main image: cinematic bottom-up reveal and depth/scale motion.
  const mainClip = useScrub(imageRevealProgress, reduceMotion, [0.04, 0.24], [100, 0]);
  const mainScale = useScrub(progress, reduceMotion, [0.12, 0.7, 1], [1.32, 1.05, 1.12]);
  const mainY = useScrub(progress, reduceMotion, [0.12, 1], [85, -90]);
  const mainShellY = useScrub(imageRevealProgress, reduceMotion, [0.04, 0.24], [85, 0]);
  const mainShellOpacity = useScrub(imageRevealProgress, reduceMotion, [0.04, 0.16], [0, 1]);

  // Secondary frame: earlier, quicker fly-in, twist, and counter-parallax.
  const smallOpacity = useScrub(imageRevealProgress, reduceMotion, [0.04, 0.22], [0, 1]);
  const smallX = useScrub(imageRevealProgress, reduceMotion, [0.04, 0.24], [-70, 0]);
  const smallY = useScrub(imageRevealProgress, reduceMotion, [0.04, 0.24, 1], [60, 0, -16]);
  const smallRotate = useScrub(imageRevealProgress, reduceMotion, [0.04, 0.24], [-5, 0]);
  const smallScale = useScrub(imageRevealProgress, reduceMotion, [0.04, 0.24], [0.92, 1]);
  const smallImageY = useScrub(imageRevealProgress, reduceMotion, [0.04, 1], [28, -30]);

  const outlineOpacity = useScrub(revealProgress, reduceMotion, [0.46, 0.7], [0, 1]);
  const outlineX = useScrub(revealProgress, reduceMotion, [0.46, 0.7], [-18, 0]);
  const ornamentOpacity = useScrub(revealProgress, reduceMotion, [0.48, 0.76], [0, 0.35]);
  const ornamentRotate = useScrub(revealProgress, reduceMotion, [0.48, 0.95], [-24, 0]);
  const verticalOpacity = useScrub(revealProgress, reduceMotion, [0.55, 0.78], [0, 1]);
  const bottomLine = useScrub(revealProgress, reduceMotion, [0.52, 0.82], [0, 1]);

  const mainClipPath = useTransform(mainClip, (v) => `inset(${v}% 0% 0% 0%)`);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const mouseX = useSpring(cursorX, { stiffness: 110, damping: 18 });
  const mouseY = useSpring(cursorY, { stiffness: 110, damping: 18 });

  function moveImage(event) {
    if (reduceMotion) return;
    const r = event.currentTarget.getBoundingClientRect();
    cursorX.set(((event.clientX - r.left) / r.width - 0.5) * 12);
    cursorY.set(((event.clientY - r.top) / r.height - 0.5) * 12);
  }

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-cream py-6 md:py-24"
    >
      {/* <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 top-1/4 h-[600px] w-[600px] rounded-full bg-clay/[0.045] blur-[110px]" />
        <div className="absolute left-5 top-10 h-px w-28 bg-clay/25 sm:left-10 lg:left-16" />
      </div> */}

      <div className="shell relative grid gap-16 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-16">
        <div className="relative z-20 lg:pr-8">
          <motion.div
            style={{ opacity: eyebrowOpacity, x: eyebrowX }}
            className="mb-9 flex items-center gap-4"
          >
            <motion.span
              style={{ scaleX: eyebrowLine }}
              className="h-px w-10 origin-left bg-clay"
            />
            <span className="text-[10px] uppercase tracking-[.35em] text-clay">
              A moment to yourself
            </span>
          </motion.div>

          <h2 className="font-display text-[clamp(3.6rem,7.5vw,8rem)] font-light leading-[.95] tracking-[-.06em]">
            <span className="block overflow-hidden pb-[.12em]">
              <motion.span
                style={{ y: headingOneY, opacity: headingOneOpacity, skewY: headingOneSkew }}
                className="block origin-bottom-left will-change-transform"
              >
                Stay a little
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[.12em]">
              <motion.span
                style={{ y: headingTwoY, opacity: headingTwoOpacity, skewY: headingTwoSkew }}
                className="block origin-bottom-left italic text-clay will-change-transform"
              >
                longer.
              </motion.span>
            </span>
          </h2>

          <motion.div style={{ opacity: copyOpacity, y: copyY, x: copyX }} className="mt-7 md:ml-20">
            <p className="max-w-sm text-base leading-8 text-muted md:text-lg">
              Make room for meaningful rituals, unhurried conversations, and moments that feel entirely your own.
            </p>
            <Link
              to="/contact"
              className="group relative mt-9 inline-flex items-center gap-4 pb-3 text-xs uppercase tracking-[.2em] text-clay"
            >
              <span>Experience Height</span>
              <span className="inline-block transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1">↗</span>
              <span className="absolute bottom-0 left-0 h-px w-full bg-clay/20" />
              <motion.span
                style={{ scaleX: ctaLine }}
                className="absolute bottom-0 left-0 h-px w-full origin-left bg-clay"
              />
            </Link>
          </motion.div>

          <motion.div
            style={{ opacity: ornamentOpacity, rotate: ornamentRotate }}
            className="pointer-events-none absolute -bottom-20 left-0 hidden h-28 w-28 rounded-full border border-clay/40 lg:block"
          >
            <div className="absolute inset-4 rounded-full border border-clay/20" />
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-clay/20" />
            <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-clay/20" />
          </motion.div>
        </div>

        <div
          onMouseMove={moveImage}
          onMouseLeave={() => { cursorX.set(0); cursorY.set(0); }}
          className="relative h-[360px] sm:h-[460px] lg:h-[580px]"
        >
          <motion.div
            style={{ y: mainShellY, opacity: mainShellOpacity }}
            className="absolute right-0 top-0 h-[94%] w-[80%]"
          >
            <motion.div
              style={{ clipPath: mainClipPath }}
              className="relative h-full w-full overflow-hidden rounded-t-[180px] bg-clay/10 sm:rounded-t-[280px]"
            >
              <motion.div style={{ y: mainY, scale: mainScale }} className="absolute -inset-y-[20%] inset-x-0 will-change-transform">
                <img
                  src="/media/rooftop-view.webp"
                  alt="Height lifestyle and wellness"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </motion.div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </motion.div>
          </motion.div>

          <motion.div
            style={{ opacity: outlineOpacity, x: outlineX }}
            className="pointer-events-none absolute right-[5%] top-[5%] h-[84%] w-[70%] rounded-t-[180px] border border-clay/30 sm:rounded-t-[280px]"
          />

          <motion.div
            style={{ opacity: smallOpacity, x: smallX, y: smallY, rotate: smallRotate, scale: smallScale }}
            className="absolute bottom-0 left-0 z-10 h-[50%] w-[49%]"
          >
            <motion.div
              style={{ x: mouseX, y: mouseY }}
              className="relative h-full w-full border-[8px] border-cream bg-clay/10 shadow-[0_30px_70px_rgba(0,0,0,.18)] sm:border-[14px]"
            >
              <div className="absolute inset-0 overflow-hidden">
                <motion.div style={{ y: smallImageY }} className="absolute -inset-y-[20%] inset-x-0">
                  <img
                    src="/media/spa-treatment.webp"
                    alt="A curated moment at Height"
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </motion.div>
              </div>
              <div className="pointer-events-none absolute bottom-3 left-3 h-7 w-7 border-b border-l border-white/80" />
              <div className="pointer-events-none absolute right-3 top-3 h-7 w-7 border-r border-t border-white/80" />
            </motion.div>
          </motion.div>

          <motion.div
            style={{ opacity: verticalOpacity }}
            className="absolute bottom-[40%] right-[-8px] z-80 hidden lg:block"
          >
            <span className="block text-[10px] uppercase tracking-[.35em] text-clay/70" style={{ writingMode: "vertical-rl" }}>
              Get the best Height experience
            </span>
          </motion.div>
          <motion.div
            style={{ scaleY: bottomLine }}
            className="absolute -bottom-8 right-0 h-px w-[45%] origin-right bg-clay/40"
          />
        </div>
      </div>
    </section>
  );
}
