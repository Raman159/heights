import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

const BARS = [0, 1, 2, 3, 4];

/* Slow, breathing sound bars. Only scaleY animates, so it stays smooth. */
function SoundBars({ playing, reduced }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-6 items-center gap-[3px] transition-colors duration-500 ${
        playing ? "text-clay" : "text-clay/40"
      }`}
    >
      {BARS.map((i) => (
        <motion.span
          key={i}
          initial={false}
          className="h-full w-[3px] origin-center rounded-full bg-current"
          animate={
            playing
              ? reduced
                ? { scaleY: 0.7 }
                : { scaleY: [0.3, 1, 0.45, 0.85, 0.3] }
              : { scaleY: 0.2 + (i % 2) * 0.12 }
          }
          transition={
            playing && !reduced
              ? {
                  duration: 1.5 + i * 0.18,
                  delay: i * 0.1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
              : { duration: 0.5, ease: "easeOut" }
          }
        />
      ))}
    </span>
  );
}

export default function PhilosophySection() {
  const sectionRef = useRef(null);
  const audioRef = useRef(null);
  const fadeRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState("");
  const reducedMotion = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 90%", "end 25%"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 32,
    mass: 0.3,
  });

  const eyebrowOpacity = useTransform(
    progress,
    [0, 0.25],
    reducedMotion ? [1, 1] : [0, 1],
  );
  const eyebrowY = useTransform(
    progress,
    [0, 0.25],
    reducedMotion ? [0, 0] : [18, 0],
  );
  const headingOpacity = useTransform(
    progress,
    [0.08, 0.45],
    reducedMotion ? [1, 1] : [0, 1],
  );
  const headingY = useTransform(
    progress,
    [0.08, 0.45],
    reducedMotion ? [0, 0] : [28, 0],
  );
  const copyOpacity = useTransform(
    progress,
    [0.2, 0.58],
    reducedMotion ? [1, 1] : [0, 1],
  );
  const copyY = useTransform(
    progress,
    [0.2, 0.58],
    reducedMotion ? [0, 0] : [22, 0],
  );

  /* Gentle volume ramp so the sound eases in and out instead of cutting.
     (iOS ignores programmatic volume, so it simply plays normally there.) */
  const fadeTo = (audio, target, ms, onDone) => {
    cancelAnimationFrame(fadeRef.current);
    const from = audio.volume;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / ms, 1);
      audio.volume = from + (target - from) * t;
      if (t < 1) fadeRef.current = requestAnimationFrame(step);
      else onDone?.();
    };
    fadeRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      cancelAnimationFrame(fadeRef.current);
      audio?.pause();
    };
  }, []);

  const toggleAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      setIsPlaying(false);
      fadeTo(audio, 0, 700, () => audio.pause());
      return;
    }

    try {
      if (audio.paused) audio.volume = 0;
      await audio.play();
      setAudioError("");
      setIsPlaying(true);
      fadeTo(audio, 1, 1400);
    } catch (err) {
      // Open the browser console to see the exact reason
      console.error("[PhilosophySection] audio.play() failed:", err);
      setIsPlaying(false);
      setAudioError(
        err?.name === "NotAllowedError"
          ? "Your browser blocked playback. Please tap again."
          : "Audio could not be played. Please try again.",
      );
    }
  };

  return (
    <section ref={sectionRef} className="watermark bg-cream py-12 md:py-20">
      <div className="shell relative z-10 max-w-4xl text-center">
        <motion.p
          style={{ opacity: eyebrowOpacity, y: eyebrowY }}
          className="eyebrow mb-4 md:mb-6"
        >
          Height Philosophy
        </motion.p>
        <motion.h2
          style={{ opacity: headingOpacity, y: headingY }}
          className="h2 mb-5 md:mb-7"
        >
          Where everyday life finds{" "}
          <span className="text-clay">its balance.</span>
        </motion.h2>
        <motion.p
          style={{ opacity: copyOpacity, y: copyY }}
          className="mx-auto max-w-[34rem] text-base leading-8 text-muted md:max-w-none md:text-lg md:leading-9"
        >
          Height is where traditional wisdom meets modern convenience — a
          sanctuary offering a touch-led holistic approach to healing. Unlike
          fleeting getaway retreats, Height brings balance and wellness into
          your everyday life. More than just a holistic wellness spa, it’s a
          space to harmonize, heal, and reconnect with yourself.
        </motion.p>

        <motion.div
          style={{ opacity: copyOpacity, y: copyY }}
          className="mt-10 flex flex-col items-center"
        >
          <audio
            ref={audioRef}
            src="/media/audio.mp3"
            loop
            preload="none"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={(e) => {
              const code = e.currentTarget.error?.code;
              console.error(
                "[PhilosophySection] audio failed to load. MediaError code:",
                code,
                "(4 = file not found or unsupported format)",
                e.currentTarget.currentSrc,
              );
              setIsPlaying(false);
              setAudioError("The audio file could not be loaded.");
            }}
          />

          <button
            type="button"
            onClick={toggleAudio}
            aria-label="Philosophy audio"
            aria-pressed={isPlaying}
            className={[
              "group relative inline-flex items-center gap-5 rounded-full border py-3.5 pl-7 pr-7 text-ink",
              "transition-[transform,box-shadow,border-color,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
              "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.985]",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-clay",
              "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
              isPlaying
                ? "border-clay/60 bg-white shadow-[0_20px_44px_-20px_rgba(70,56,47,0.5),inset_0_1px_0_rgba(255,255,255,0.9)]"
                : "border-clay/30 bg-white/70 shadow-[0_8px_24px_-14px_rgba(70,56,47,0.5),inset_0_1px_0_rgba(255,255,255,0.9)] hover:border-clay/70 hover:bg-white hover:shadow-[0_16px_34px_-16px_rgba(70,56,47,0.45),inset_0_1px_0_rgba(255,255,255,0.9)]",
            ].join(" ")}
          >
            {/* label */}
            <span className="min-w-[10.5rem] text-left">
              <motion.span
                key={isPlaying ? "t-on" : "t-off"}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="block text-[0.95rem] font-semibold leading-tight"
              >
                {isPlaying ? "Pause the moment" : "Tap for calmness"}
              </motion.span>
              <span className="mt-1 block text-[0.68rem] uppercase tracking-[0.18em] text-clay">
                {isPlaying ? "Now playing" : "Press to listen"}
              </span>
            </span>

            <SoundBars playing={isPlaying} reduced={reducedMotion} />
          </button>

          {audioError && (
            <p role="status" className="mt-3 text-sm text-red-700">
              {audioError}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}