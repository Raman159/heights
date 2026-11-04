import React, { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { mediaUrl } from "../../api";

const BG = "#eae5df"; // plain warm stone, sampled from the Damai reference
const LOGO_TOP = 42; // svh: logo centre (reference sits just above the middle)
const SMOOTH = [0.22, 1, 0.36, 0.5]; // gentle landing
const OPEN = [0.76, 0, 0.24, 1]; // slow start, slow finish
const OPEN_TIME = 1.8; // seconds the screen takes to open
const ROLL_DELAY = -0.15; // seconds after the opening starts before the logo begins rolling up
// The roll-up ends exactly when the screen finishes opening.

/**
 * 1. Plain page, logo fades in
 * 2. A tall 3:4 box slides up from below the screen and settles
 * 3. The box pauses
 * 4. The box glides up and widens to fill the screen (media scales with it)
 * 5. The logo rolls up and out of its own mask, in sync with step 4
 *
 * Props:
 *   video  - mp4/webm shown inside the box (muted, looping)
 *   image  - photo (or the video's poster). Use the SAME media as your
 *            homepage hero so the hand-off is seamless.
 *   logo   - logo path (default "/logo.png")
 * With no media, the box is a transparent window onto the homepage.
 */
export default function SplashScreen({ video, image, logo = "/logo.png" }) {
  const resolvedVideo = mediaUrl(video);
  const resolvedImage = mediaUrl(image);
  const reduceMotion = Boolean(useReducedMotion());
  const videoRef = useRef(null);
  const [done, setDone] = useState(false);
  const hasMedia = Boolean(resolvedVideo || resolvedImage);

  // Box geometry (in vw / svh) measured once from the viewport
  const [g0] = useState(() => {
    const W = typeof window !== "undefined" ? window.innerWidth : 1440;
    const H = typeof window !== "undefined" ? window.innerHeight : 900;
    const small = W < 640;
    const boxW = small ? W * 0.52 : Math.min(Math.max(W * 0.2, 240), 400);
    const boxH = (boxW * 4) / 3;
    const T = small ? 60 : 63;
    return {
      W,
      H,
      L: (100 - (boxW / W) * 100) / 2,
      T,
      B: Math.max(T + (boxH / H) * 100, 108),
    };
  });

  const logoOpacity = useMotionValue(0);
  const rise = useMotionValue(0); // 0 = box below the screen, 1 = resting
  const p = useMotionValue(0); // 0 = small box, 1 = full screen
  const roll = useMotionValue(0); // 0 = logo in place, 1 = rolled up and gone

  // Box rectangle: slides up (rise), then opens (p). Slide leads, widening follows.
  const rect = (v, r) => {
    const g = v * v;
    const L = g0.L * (1 - g);
    const shift = (1 - r) * (101 - g0.T); // keeps the box fully off-screen at r = 0
    return {
      L,
      R: 100 - L,
      T: g0.T * (1 - v) + shift,
      B: g0.B + (100 - g0.B) * v + shift,
    };
  };

  const holeRect = useTransform([p, rise], ([v, r]) => {
    const { L, R, T, B } = rect(v, r);
    return `polygon(${L}vw ${T}svh, ${R}vw ${T}svh, ${R}vw ${B}svh, ${L}vw ${B}svh)`;
  });
  const mask = useTransform([p, rise], ([v, r]) => {
    const { L, R, T, B } = rect(v, r);
    return `polygon(evenodd, 0vw 0svh, 100vw 0svh, 100vw 100svh, 0vw 100svh, 0vw 0svh, ${L}vw ${T}svh, ${L}vw ${B}svh, ${R}vw ${B}svh, ${R}vw ${T}svh, ${L}vw ${T}svh)`;
  });

  // Media always covers the current box and is centred on it, easing to 1:1
  const mediaScale = useTransform([p, rise], ([v, r]) => {
    const { L, R, T, B } = rect(v, r);
    return Math.max((R - L) / 100, (B - T) / 100) * (1 + 0.15 * (1 - v));
  });
  const mediaX = useTransform([p, rise], ([v, r]) => {
    const { L, R } = rect(v, r);
    return (((L + R) / 2 - 50) / 100) * g0.W;
  });
  const mediaY = useTransform([p, rise], ([v, r]) => {
    const { T, B } = rect(v, r);
    return (((T + B) / 2 - 50) / 100) * g0.H;
  });

  // Logo rolls up inside its own mask once the screen is open
  const logoRollY = useTransform(roll, [0, 1], ["0%", "-115%"]);

  // Share the opening progress with the hero artwork beneath the splash.
  useEffect(() => {
    const root = document.documentElement;
    const syncProgress = (value) =>
      root.style.setProperty("--splash-open-progress", String(value));
    syncProgress(p.get());
    const unsubscribe = p.on("change", syncProgress);
    return () => {
      unsubscribe();
      syncProgress(1);
    };
  }, [p]);

  // Lock scroll during the intro
  useEffect(() => {
    if (done) return;
    const el = document.documentElement;
    const prev = el.style.overflow;
    el.style.overflow = "hidden";
    return () => {
      el.style.overflow = prev;
    };
  }, [done]);

  useEffect(() => {
    let cancelled = false;
    const running = [];
    const play = (mv, to, opts) => {
      const c = animate(mv, to, opts);
      running.push(c);
      return c;
    };
    const d = (s) => (reduceMotion ? 0 : s);
    const sleep = (s) => new Promise((r) => setTimeout(r, d(s) * 1000));
    const cap = (fn) =>
      new Promise((resolve) => {
        fn(resolve);
        setTimeout(resolve, 6000); // never wait forever
      });

    const pageLoaded = cap((res) => {
      if (document.readyState === "complete") return res();
      window.addEventListener("load", res, { once: true });
    });

    // Don't send the box up until its media can actually paint
    const mediaReady = cap((res) => {
      if (video) {
        const v = videoRef.current;
        if (!v || v.readyState >= 2) return res();
        v.addEventListener("loadeddata", res, { once: true });
      } else if (image) {
        const im = new Image();
        im.onload = im.onerror = res;
        im.src = image;
      } else res();
    });

    (async () => {
      await play(logoOpacity, 1, { duration: d(1), ease: "easeOut" });
      await mediaReady;
      await play(rise, 1, { delay: d(0.2), duration: d(1.5), ease: SMOOTH }); // slide up from below
      await Promise.all([pageLoaded, sleep(0.6)]); // pause
      // Open the screen and roll the logo up together, on the same easing
      await Promise.all([
        play(p, 1, { duration: d(OPEN_TIME), ease: OPEN }),
        play(roll, 1, { delay: d(ROLL_DELAY), duration: d(OPEN_TIME - ROLL_DELAY), ease: OPEN }),
      ]);
      if (!cancelled) setDone(true);
    })();

    return () => {
      cancelled = true;
      running.forEach((c) => c.stop());
    };
  }, [reduceMotion, logoOpacity, rise, p, roll, video, image]);

  if (done) return null;

  return (
    <div
      role="status"
      aria-label="Loading HEIGHT"
      className="fixed inset-0 z-[60] overflow-hidden"
    >
      {/* Media lives inside the box and scales with it, so it never stretches */}
      {hasMedia && (
        <motion.div className="absolute inset-0" style={{ clipPath: holeRect }}>
          <motion.div
            className="absolute inset-0 will-change-transform"
            style={{ x: mediaX, y: mediaY, scale: mediaScale }}
          >
            {resolvedVideo ? (
              <video
                ref={videoRef}
                src={resolvedVideo}
                poster={resolvedImage}
                autoPlay
                muted
                loop
                playsInline
                className="size-full object-cover"
              />
            ) : (
              <img src={resolvedImage} alt="" className="size-full object-cover" />
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Plain page with a hole that slides up, then widens to full screen */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 will-change-[clip-path]"
        style={{ backgroundColor: BG, clipPath: mask }}
      />

      {/* Logo: fades in on the plain page, stays through the opening, then rolls up */}
      <motion.div
        className="pointer-events-none absolute left-1/2"
        style={{ top: `${LOGO_TOP}svh`, opacity: logoOpacity, x: "-50%", y: "-50%" }}
      >
        <div className="overflow-hidden">
          <motion.img
            src={logo}
            alt="HEIGHT Restro & Wellness"
            className="block h-auto w-28 sm:w-32 md:w-40"
            style={{ y: logoRollY }}
          />
        </div>
      </motion.div>

      {/* <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-10 flex flex-col items-center gap-1 text-[#46382f] md:hidden"
        animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          viewBox="0 0 24 24"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M12 19V5m0 0L6.5 10.5M12 5l5.5 5.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-[10px] font-medium uppercase tracking-[.22em]">
          Swipe up
        </span>
      </motion.div> */}
    </div>
  );
}