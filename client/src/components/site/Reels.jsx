import React, { memo, useEffect, useRef, useState } from "react";
import useCollection from "../../hooks/useCollection";
import EmptyState from "./EmptyState";

// Respect data-saver: show posters only, never download video
const saveData =
  typeof navigator !== "undefined" && navigator.connection?.saveData === true;

// Resting "wave" of the cards: vertical offset (px) and tilt (deg), by position in the list.
// Indexed by (i % count) so all three looped copies match and the seam stays invisible.
const WAVE_Y = [0, 28, -10, 36, 12, 30];
const WAVE_R = [-1.5, 1, -0.5, 1.5, -1, 0.5];

/**
 * One card. Hover/visibility state lives HERE, not in the parent,
 * so hovering a card never re-renders the other cards.
 */
const ReelCard = memo(function ReelCard({ video, slot }) {
  const cardRef = useRef(null);
  const videoRef = useRef(null);
  const [everVisible, setEverVisible] = useState(false); // mount <video> only after first sight
  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(false); // fades video in over the poster
  const [sound, setSound] = useState(false); // drives the "sound on" badge

  // Watch the card: only on-screen cards load and play
  useEffect(() => {
    const el = cardRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setEverVisible(true);
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setEverVisible(true);
      },
      { rootMargin: "0px 200px 0px 200px", threshold: 0.01 } // warm up just before entering
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Pause off-screen videos so the browser stops decoding them
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (inView) vid.play().catch(() => {});
    else vid.pause();
  }, [inView, everVisible]);

  const handleEnter = () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = false;
    // Browsers may block sound without a click; fall back to muted playback
    vid
      .play()
      .then(() => setSound(true))
      .catch(() => {
        vid.muted = true;
        setSound(false);
        vid.play().catch(() => {});
      });
  };
  const handleLeave = () => {
    if (videoRef.current) videoRef.current.muted = true;
    setSound(false);
  };

  const showVideo = video.video_url && everVisible && !saveData;

  return (
    <div
      ref={cardRef}
      className="reel-card"
      style={{
        "--y": `${WAVE_Y[slot % WAVE_Y.length]}px`,
        "--r": `${WAVE_R[slot % WAVE_R.length]}deg`,
      }}
      tabIndex={0}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
    >
      <div className="reel-card__inner">
        {/* Poster is always there: instant paint, no blank card while video buffers */}
        {video.thumbnail_url && (
          <img
            className="reel-card__poster"
            src={video.thumbnail_url}
            alt="HEIGHT experience"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        )}
        {showVideo && (
          <video
            ref={videoRef}
            className={`reel-card__video ${playing ? "is-playing" : ""}`}
            src={video.video_url}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            controls={false}
            disablePictureInPicture
            draggable={false}
            onPlaying={() => setPlaying(true)}
          />
        )}

        {showVideo && (
          <div className={`reel-card__badge ${sound ? "is-on" : ""}`} aria-hidden="true">
            <span className="reel-card__eq">
              <i />
              <i />
              <i />
            </span>
            <span className="reel-card__badge-text">{sound ? "Sound on" : "Muted"}</span>
          </div>
        )}
      </div>
    </div>
  );
});

export default function Reels() {
  const videos = useCollection("videos");
  const count = videos ? videos.length : 0;

  const scrollerRef = useRef(null);
  const posRef = useRef(0); // float scroll position (scrollLeft gets rounded by browsers)
  const pauseRef = useRef({ hover: false, drag: false, touchUntil: 0 });
  const dragRef = useRef({ active: false, startX: 0, startScroll: 0 });

  // Width of one full copy of the list: the distance we jump to loop seamlessly
  const loopWidth = () => {
    const row = scrollerRef.current?.firstElementChild;
    if (!row || !count) return 0;
    const a = row.children[0];
    const b = row.children[count];
    return a && b ? b.offsetLeft - a.offsetLeft : 0;
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || !count) return;

    // Three copies rendered; we always stay inside the middle one
    const w0 = loopWidth();
    if (w0) {
      el.scrollLeft = w0;
      posRef.current = w0;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const SPEED = 0.04; // px per ms = 40px/s
    let raf;
    let last = performance.now();

    const tick = (now) => {
      const dt = Math.min(now - last, 64);
      last = now;
      const p = pauseRef.current;
      if (!reduceMotion && !p.hover && !p.drag && now > p.touchUntil && !document.hidden) {
        const w = loopWidth();
        let x = posRef.current + SPEED * dt;
        if (w && x >= 2 * w) x -= w;
        posRef.current = x;
        el.scrollLeft = x;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Wheel / trackpad / scrollbar / touch scrolling: keep the loop seamless
    const onScroll = () => {
      if (Math.abs(el.scrollLeft - posRef.current) <= 1.5) return; // our own auto-scroll
      const w = loopWidth();
      let x = el.scrollLeft;
      if (w) {
        if (x >= 2 * w) x -= w;
        else if (x < w) x += w;
        if (x !== el.scrollLeft) el.scrollLeft = x;
      }
      posRef.current = x;
    };
    el.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  // ---- mouse drag-to-scroll ----
  const onPointerDown = (e) => {
    if (e.pointerType !== "mouse") {
      // touch uses native scrolling; just hold the auto-scroll for a moment
      pauseRef.current.touchUntil = performance.now() + 2500;
      return;
    }
    if (e.button !== 0) return;
    const el = scrollerRef.current;
    dragRef.current = { active: true, startX: e.clientX, startScroll: el.scrollLeft };
    pauseRef.current.drag = true;
    el.setPointerCapture(e.pointerId);
    el.classList.add("is-dragging");
  };

  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d.active) return;
    const el = scrollerRef.current;
    const w = loopWidth();
    let target = d.startScroll - (e.clientX - d.startX);
    if (w) {
      while (target >= 2 * w) { target -= w; d.startScroll -= w; }
      while (target < w) { target += w; d.startScroll += w; }
    }
    el.scrollLeft = target;
    posRef.current = target;
  };

  const endDrag = (e) => {
    const d = dragRef.current;
    if (!d.active) return;
    d.active = false;
    pauseRef.current.drag = false;
    const el = scrollerRef.current;
    el.classList.remove("is-dragging");
    if (el.hasPointerCapture?.(e.pointerId)) el.releasePointerCapture(e.pointerId);
  };

  return (
    <section className="reel-section py-14 overflow-hidden">
      <style>{`
        /* ---------- section backdrop: warm light pooling behind the cards ---------- */
        .reel-section {
          position: relative;
          background:
            radial-gradient(60% 55% at 12% 28%, rgba(255, 214, 170, .55) 0%, rgba(255, 214, 170, 0) 70%),
            radial-gradient(55% 60% at 88% 78%, rgba(230, 197, 83, .30) 0%, rgba(230, 197, 83, 0) 70%),
            #f4e6d9;
        }

        /* ---------- scroller ---------- */
        .reel-scroller {
          overflow-x: auto;
          overflow-y: hidden;
          cursor: grab;
          user-select: none;
          -webkit-user-select: none;
          scrollbar-width: none;           /* Firefox */
          -ms-overflow-style: none;
          overscroll-behavior-x: contain;  /* don't trigger browser back-swipe */
          /* cards drift in and out of the edges instead of being cut off */
          -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 7%, #000 93%, transparent 100%);
                  mask-image: linear-gradient(90deg, transparent 0, #000 7%, #000 93%, transparent 100%);
        }
        .reel-scroller::-webkit-scrollbar { display: none; }
        .reel-scroller.is-dragging { cursor: grabbing; }
        .reel-scroller.is-dragging .reel-card { pointer-events: none; }

        /* Room above/below for the wave, the popped card and its shadow */
        .reel-row {
          display: flex;
          gap: 22px;
          width: max-content;
          padding: 96px 48px 110px;
        }

        /* ---------- card: soft ivory bezel, gold ring fades in on hover ---------- */
        .reel-card {
          --y: 0px;
          --r: 0deg;
          position: relative;
          flex-shrink: 0;
          width: 210px;
          height: 385px;
          padding: 5px;
          border-radius: 30px;
          background: linear-gradient(160deg, #fffdf8 0%, #f8ecdc 100%);
          box-shadow:
            0 1px 1px rgba(90, 60, 20, .10),
            0 12px 22px -10px rgba(90, 60, 20, .30),
            0 28px 40px -24px rgba(90, 60, 20, .28);
          translate: 0 var(--y);
          rotate: var(--r);
          transition:
            translate 500ms cubic-bezier(0.22, 1, 0.36, 1),
            rotate 500ms cubic-bezier(0.22, 1, 0.36, 1),
            scale 500ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 500ms cubic-bezier(0.22, 1, 0.36, 1),
            opacity 300ms ease;
          contain: layout;
          z-index: 0;
          outline: none;
        }
        @media (min-width: 768px) {
          .reel-card { width: 250px; height: 440px; }
        }

        /* gold ring, revealed on hover */
        .reel-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(145deg, #f7e08f 0%, #d4a91a 45%, #f0cf62 100%);
          opacity: 0;
          transition: opacity 400ms ease;
        }

        .reel-card__inner {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
          border-radius: 25px;
          overflow: hidden;
          background: #241a12;
        }
        .reel-card__poster,
        .reel-card__video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          -webkit-user-drag: none;
        }
        .reel-card__video { opacity: 0; transition: opacity 500ms ease; }
        .reel-card__video.is-playing { opacity: 1; }

        /* gloss on top, warm shade at the bottom for the badge */
        .reel-card__inner::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(180deg, rgba(255,255,255,.16) 0%, rgba(255,255,255,0) 20%),
            linear-gradient(0deg, rgba(30,16,4,.55) 0%, rgba(30,16,4,0) 34%);
          transition: opacity 400ms ease;
        }

        /* ---------- sound badge ---------- */
        .reel-card__badge {
          position: absolute;
          left: 50%;
          bottom: 14px;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 13px 7px 11px;
          border-radius: 999px;
          font-size: 12px;
          line-height: 1;
          font-weight: 600;
          letter-spacing: .01em;
          color: #fff8ec;
          background: rgba(36, 24, 12, .55);
          -webkit-backdrop-filter: blur(10px);
                  backdrop-filter: blur(10px);
          box-shadow: inset 0 0 0 1px rgba(255, 244, 220, .22);
          opacity: 0;
          translate: -50% 8px;
          transition: opacity 350ms ease, translate 450ms cubic-bezier(0.22, 1, 0.36, 1), background 300ms ease;
          pointer-events: none;
        }
        .reel-card__badge.is-on { background: rgba(204, 161, 21, .85); color: #2a1d06; box-shadow: none; }

        .reel-card__eq { display: inline-flex; align-items: flex-end; gap: 2px; height: 12px; }
        .reel-card__eq i {
          display: block;
          width: 2.5px;
          height: 100%;
          border-radius: 2px;
          background: currentColor;
          transform-origin: bottom;
          transform: scaleY(.3);
        }
        .reel-card__badge.is-on .reel-card__eq i { animation: reel-eq 900ms ease-in-out infinite; }
        .reel-card__badge.is-on .reel-card__eq i:nth-child(2) { animation-delay: -300ms; }
        .reel-card__badge.is-on .reel-card__eq i:nth-child(3) { animation-delay: -600ms; }
        @keyframes reel-eq {
          0%, 100% { transform: scaleY(.3); }
          50%      { transform: scaleY(1); }
        }

        /* ---------- hover / focus: straighten, lift, glow ---------- */
        .reel-card:hover,
        .reel-card:focus-visible {
          z-index: 30;
          will-change: translate, scale;
          translate: 0 calc(var(--y) - 18px);
          rotate: 0deg;
          scale: 1.13;
          box-shadow:
            0 2px 4px rgba(90, 60, 20, .16),
            0 34px 60px -14px rgba(90, 60, 20, .50),
            0 0 56px -6px rgba(204, 161, 21, .55);
        }
        .reel-card:hover::before,
        .reel-card:focus-visible::before { opacity: 1; }
        .reel-card:hover .reel-card__inner::after { opacity: .55; }
        .reel-card:hover .reel-card__badge,
        .reel-card:focus-visible .reel-card__badge { opacity: 1; translate: -50% 0; }

        .reel-scroller:hover .reel-card:not(:hover) { opacity: 0.55; }
        .reel-scroller.is-dragging .reel-card { opacity: 1 !important; }

        .reel-card:focus-visible { box-shadow: 0 0 0 3px #241a12, 0 0 0 6px #f4e6d9, 0 34px 60px -14px rgba(90,60,20,.5); }

        /* ---------- header hint ---------- */
        .reel-hint {
          display: none;
          align-items: center;
          gap: 10px;
          font-size: .875rem;
        }
        @media (min-width: 768px) { .reel-hint { display: inline-flex; } }
        .reel-hint__track {
          position: relative;
          width: 44px;
          height: 22px;
          border-radius: 999px;
          background: rgba(36, 26, 18, .08);
          box-shadow: inset 0 0 0 1px rgba(36, 26, 18, .14);
        }
        .reel-hint__dot {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(145deg, #f3d777, #cca115);
          box-shadow: 0 1px 3px rgba(90, 60, 20, .4);
          animation: reel-hint 2.6s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }
        @keyframes reel-hint {
          0%, 100% { transform: translateX(0); }
          50%      { transform: translateX(22px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .reel-card, .reel-card::before, .reel-card__video, .reel-card__badge { transition: none; }
          .reel-card__badge.is-on .reel-card__eq i,
          .reel-hint__dot { animation: none; }
          .reel-card__badge.is-on .reel-card__eq i { transform: scaleY(.7); }
        }
      `}</style>

      <div className="shell mb-2 flex items-end justify-between">
        <div>
          <p className="eyebrow mb-3">Moments at HEIGHT</p>
          <h2 className="h2">A glimpse of life here.</h2>
        </div>
        {/* <span className="reel-hint text-muted">
          <span className="reel-hint__track" aria-hidden="true">
            <span className="reel-hint__dot" />
          </span>
          Drag to explore
        </span> */}
      </div>

      {videos === null ? null : videos.length === 0 ? (
        <EmptyState />
      ) : (
        <div
          ref={scrollerRef}
          className="reel-scroller"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerEnter={(e) => {
            if (e.pointerType === "mouse") pauseRef.current.hover = true;
          }}
          onPointerLeave={(e) => {
            if (e.pointerType === "mouse") pauseRef.current.hover = false;
          }}
        >
          <div className="reel-row">
            {[...videos, ...videos, ...videos].map((v, i) => (
              <ReelCard video={v} slot={i % count} key={`${v.id}-${i}`} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}