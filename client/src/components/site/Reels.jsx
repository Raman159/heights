import React, { memo, useEffect, useRef, useState } from "react";
import useCollection from "../../hooks/useCollection";
import EmptyState from "./EmptyState";

// Respect data-saver: show posters only, never download video
const saveData =
  typeof navigator !== "undefined" && navigator.connection?.saveData === true;

/**
 * One card. Hover/visibility state lives HERE, not in the parent,
 * so hovering a card never re-renders the other cards.
 */
const ReelCard = memo(function ReelCard({ video }) {
  const cardRef = useRef(null);
  const videoRef = useRef(null);
  const [everVisible, setEverVisible] = useState(false); // mount <video> only after first sight
  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(false); // fades video in over the poster

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
    vid.play().catch(() => {
      vid.muted = true;
      vid.play().catch(() => {});
    });
  };
  const handleLeave = () => {
    if (videoRef.current) videoRef.current.muted = true;
  };

  const showVideo = video.video_url && everVisible && !saveData;

  return (
    <div
      ref={cardRef}
      className="reel-card"
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
    <section className="py-14 bg-[#f4e6d9] overflow-hidden">
      <style>{`
        .reel-scroller {
          overflow-x: auto;
          overflow-y: hidden;
          cursor: grab;
          user-select: none;
          -webkit-user-select: none;
          scrollbar-width: none;           /* Firefox */
          -ms-overflow-style: none;
          overscroll-behavior-x: contain;  /* don't trigger browser back-swipe */
        }
        .reel-scroller::-webkit-scrollbar { display: none; }
        .reel-scroller.is-dragging { cursor: grabbing; }
        .reel-scroller.is-dragging .reel-card { pointer-events: none; }

        /* Room above/below so the popped card and its shadow never get clipped */
        .reel-row {
          display: flex;
          gap: 20px;
          width: max-content;
          padding: 80px 32px;
        }

        .reel-card {
          position: relative;
          flex-shrink: 0;
          width: 210px;
          height: 385px;
          padding: 2px;
          border-radius: 2rem;
          background: linear-gradient(145deg, #f3dc8a 0%, #cca115 38%, #8f6f0c 62%, #e6c553 100%);
          box-shadow: 0 1px 2px rgba(60,40,10,.12), 0 10px 24px -10px rgba(60,40,10,.35);
          transition:
            transform 400ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 400ms cubic-bezier(0.22, 1, 0.36, 1),
            opacity 300ms ease;
          contain: layout paint;
          z-index: 0;
        }
        @media (min-width: 768px) {
          .reel-card { width: 250px; height: 440px; }
        }

        .reel-card__inner {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: calc(2rem - 2px);
          overflow: hidden;
          background: #1a1510;
          box-shadow: inset 0 0 0 1px rgba(0,0,0,.35);
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

        .reel-card__inner::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(180deg, rgba(255,255,255,.14) 0%, rgba(255,255,255,0) 22%),
            linear-gradient(0deg, rgba(20,12,4,.45) 0%, rgba(20,12,4,0) 38%);
          transition: opacity 400ms ease;
        }

        .reel-card:hover,
        .reel-card:focus-visible {
          z-index: 30;
          will-change: transform;
          transform: translateY(-14px) scale(1.14);
          box-shadow:
            0 2px 4px rgba(60,40,10,.15),
            0 30px 60px -12px rgba(60,40,10,.55),
            0 0 0 1px rgba(204,161,21,.5),
            0 0 48px -6px rgba(204,161,21,.55);
        }
        .reel-card:hover .reel-card__inner::after { opacity: 0; }
        .reel-scroller:hover .reel-card:not(:hover) { opacity: 0.6; }
        .reel-scroller.is-dragging .reel-card { opacity: 1 !important; }

        .reel-card:focus-visible { outline: 3px solid #1a1510; outline-offset: 4px; }

        @media (prefers-reduced-motion: reduce) {
          .reel-card, .reel-card__video { transition: none; }
        }
      `}</style>

      <div className="shell mb-2 flex items-end justify-between">
        <div>
          <p className="eyebrow mb-3">Moments at HEIGHT</p>
          <h2 className="h2">A glimpse of life here.</h2>
        </div>
        <span className="hidden md:block text-muted text-sm">
          Drag to explore
        </span>
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
              <ReelCard video={v} key={`${v.id}-${i}`} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}