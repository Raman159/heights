import React, { memo, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import useCollection from "../../hooks/useCollection";
import EmptyState from "./EmptyState";
import { mediaUrl } from "../../api";

const ReelCard = memo(function ReelCard({ reel, onOpen, paused }) {
  const elementRef = useRef(null);
  const playerRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "100px", threshold: 0.01 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = playerRef.current;
    if (!video) return;
    if (visible && !paused) video.play().catch(() => {});
    else video.pause();
  }, [visible, paused]);

  return (
    <button
      ref={elementRef}
      type="button"
      className="height-reel-card"
      aria-label="Open reel"
      onClick={onOpen}
    >
      {reel.thumbnail_url && (
        <img src={mediaUrl(reel.thumbnail_url)} alt="HEIGHT experience" loading="lazy" draggable={false} />
      )}
      {visible && reel.video_url && (
        <video
          ref={playerRef}
          src={mediaUrl(reel.video_url)}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          draggable={false}
        />
      )}
    </button>
  );
});

export default function Reels() {
  const videos = useCollection("videos");
  const scrollerRef = useRef(null);
  const scrollPosition = useRef(0);
  const dragging = useRef(null);
  const pauseScroll = useRef(false);
  const ignoreClick = useRef(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const selectedReel = selectedIndex === null ? null : videos?.[selectedIndex];
  const closeRef = useRef(null);
  const lastFocused = useRef(null);
  const count = videos?.length ?? 0;

  const openReel = (index) => {
    if (ignoreClick.current || !videos?.[index]?.video_url) return;
    lastFocused.current = document.activeElement;
    setSelectedIndex(index);
  };

  const closeReel = () => setSelectedIndex(null);
  const moveReel = (direction) => {
    if (!count) return;
    setSelectedIndex((index) => (index === null ? null : (index + direction + count) % count));
  };

  useEffect(() => {
    if (!selectedReel) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") closeReel();
      if (event.key === "ArrowLeft") { event.preventDefault(); moveReel(-1); }
      if (event.key === "ArrowRight") { event.preventDefault(); moveReel(1); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = oldOverflow;
      document.removeEventListener("keydown", onKeyDown);
      lastFocused.current?.focus?.();
    };
  }, [selectedIndex !== null, count]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !count) return;
    const loopWidth = () => {
      const items = scroller.firstElementChild?.children;
      return items?.[count] ? items[count].offsetLeft - items[0].offsetLeft : 0;
    };
    const start = () => {
      const width = loopWidth();
      if (width) {
        scroller.scrollLeft = width;
        scrollPosition.current = width;
      }
    };
    start();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame;
    let previous = performance.now();
    const tick = (now) => {
      const elapsed = Math.min(now - previous, 64);
      previous = now;
      if (!reducedMotion && !pauseScroll.current && !dragging.current && !document.hidden) {
        const width = loopWidth();
        if (width) {
          let next = scrollPosition.current + elapsed * 0.035;
          if (next >= 2 * width) next -= width;
          scrollPosition.current = next;
          scroller.scrollLeft = next;
        }
      }
      frame = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      if (Math.abs(scroller.scrollLeft - scrollPosition.current) < 1.5) return;
      const width = loopWidth();
      let next = scroller.scrollLeft;
      if (width) {
        if (next >= 2 * width) next -= width;
        if (next < width) next += width;
        if (next !== scroller.scrollLeft) scroller.scrollLeft = next;
      }
      scrollPosition.current = next;
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", start);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", start);
    };
  }, [count]);

  const onPointerDown = (event) => {
    ignoreClick.current = false;
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    dragging.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      scroll: scrollerRef.current.scrollLeft,
      moved: false,
    };
    // Do NOT capture on pointer down: doing so can swallow button clicks.
  };

  const onPointerMove = (event) => {
    const drag = dragging.current;
    if (!drag) return;
    const distance = event.clientX - drag.x;
    if (!drag.moved && Math.abs(distance) < 7) return;
    if (!drag.moved) {
      drag.moved = true;
      ignoreClick.current = true;
      scrollerRef.current.setPointerCapture?.(drag.pointerId);
      scrollerRef.current.classList.add("is-dragging");
    }
    const el = scrollerRef.current;
    el.scrollLeft = drag.scroll - distance;
    scrollPosition.current = el.scrollLeft;
  };

  const onPointerUp = (event) => {
    const drag = dragging.current;
    if (!drag) return;
    dragging.current = null;
    const el = scrollerRef.current;
    el.classList.remove("is-dragging");
    if (el.hasPointerCapture?.(event.pointerId)) el.releasePointerCapture(event.pointerId);
    if (drag.moved) {
      ignoreClick.current = true;
      // Clear after the synthetic click produced by this pointer gesture.
      requestAnimationFrame(() => { ignoreClick.current = false; });
    }
  };

  return (
    <section className="height-reels" aria-label="Moments at HEIGHT">
      <style>{`
        .height-reels { overflow: hidden; padding: clamp(64px,7vw,104px) 0; background: #f6f2ec; color: #28231e; }
        .height-reels__heading { display:flex; align-items:end; justify-content:space-between; gap:24px; margin-bottom:20px; }
        .height-reels__eyebrow { font-size:12px; letter-spacing:.2em; color:#9a8065; margin:0 0 16px; }
        .height-reels__title { font-family:inherit; font-size:clamp(44px,6vw,84px); font-weight:400; line-height:1.04; letter-spacing:-.045em; margin:0; }
        .height-reels__hint { font-size:12px; letter-spacing:.1em; color:#85776a; white-space:nowrap; }
        .height-reels__scroller { overflow-x:auto; overflow-y:hidden; cursor:grab; scrollbar-width:none; overscroll-behavior-x:contain; }
        .height-reels__scroller::-webkit-scrollbar { display:none; }
        .height-reels__scroller.is-dragging { cursor:grabbing; user-select:none; }
        .height-reels__scroller.is-dragging .height-reel-card { pointer-events:none; }
        .height-reels__row { display:flex; width:max-content; gap:20px; padding:28px max(24px,4vw) 42px; }
        .height-reel-card { border:0; padding:0; position:relative; display:block; flex:none; width:270px; aspect-ratio:9/15; border-radius:18px; overflow:hidden; background:#302b27; cursor:pointer; box-shadow:0 12px 35px -20px rgba(25,19,13,.3); transition:transform .3s,box-shadow .3s; }
        .height-reel-card:hover { transform:scale(1.025); box-shadow:0 20px 45px -19px rgba(25,19,13,.4); }
        .height-reel-card:focus-visible { outline:3px solid #b39470; outline-offset:3px; }
        .height-reel-card img,.height-reel-card video { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; pointer-events:none; }
        .height-reel-popup { position:fixed; inset:0; z-index:99999; background:rgba(10,10,10,.88); display:flex; align-items:center; justify-content:center; padding:54px 20px 24px; }
        .height-reel-popup__panel { position:relative; height:min(82vh,820px); max-width:calc(100vw - 40px); aspect-ratio:9/16; border-radius:14px; overflow:hidden; background:#111; box-shadow:0 24px 80px rgba(0,0,0,.5); }
        .height-reel-popup__video { display:block; width:100%; height:100%; object-fit:contain; }
        .height-reel-popup__nav { position:absolute; top:50%; transform:translateY(-50%); width:46px; height:46px; display:grid; place-items:center; border:1px solid rgba(255,255,255,.3); border-radius:50%; background:rgba(20,20,20,.6); color:white; cursor:pointer; font-size:30px; line-height:1; z-index:2; }
        .height-reel-popup__nav:hover { background:rgba(255,255,255,.22); }
        .height-reel-popup__nav--prev { left:max(12px,calc(50% - min(82vh * 9 / 32, 410px) - 74px)); }
        .height-reel-popup__nav--next { right:max(12px,calc(50% - min(82vh * 9 / 32, 410px) - 74px)); }
        .height-reel-popup__close { position:absolute; top:16px; right:18px; display:grid; place-items:center; width:40px; height:40px; border:1px solid rgba(255,255,255,.35); border-radius:50%; background:rgba(0,0,0,.5); color:#fff; font-size:26px; line-height:1; cursor:pointer; }
        @media (max-width:767px) { .height-reels__heading { display:block; } .height-reels__hint { margin-top:20px; } .height-reel-card { width:220px; } .height-reels__row { gap:15px; } .height-reel-popup__panel { height:auto; max-height:82vh; width:min(100%,440px); } .height-reel-popup__nav { top:auto; bottom:14px; transform:none; width:42px; height:42px; } .height-reel-popup__nav--prev { left:16px; } .height-reel-popup__nav--next { right:16px; } }
        @media (prefers-reduced-motion:reduce) { .height-reel-card { transition:none; } }
      `}</style>
      <div className="shell height-reels__heading">
        <div>
          <p className="height-reels__eyebrow">THE HEIGHT EXPERIENCE</p>
          <h2 className="height-reels__title">Life, beautifully<br />in motion.</h2>
        </div>
        <p className="height-reels__hint">DRAG TO EXPLORE</p>
      </div>
      {videos === null ? null : count === 0 ? <EmptyState /> : (
        <div
          className="height-reels__scroller"
          ref={scrollerRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onMouseEnter={() => { pauseScroll.current = true; }}
          onMouseLeave={() => { pauseScroll.current = false; }}
          onTouchStart={() => { pauseScroll.current = true; }}
          onTouchEnd={() => { pauseScroll.current = false; }}
        >
          <div className="height-reels__row">
            {[...videos, ...videos, ...videos].map((reel, index) => (
              <ReelCard
                key={`${reel.id ?? index}-${index}`}
                reel={reel}
                paused={Boolean(selectedReel)}
                onOpen={() => openReel(index % count)}
              />
            ))}
          </div>
        </div>
      )}
      {selectedReel && typeof document !== "undefined" && createPortal(
        <div className="height-reel-popup" role="presentation" onClick={(e) => { if (e.target === e.currentTarget) closeReel(); }}>
          <div className="height-reel-popup__panel" role="dialog" aria-modal="true" aria-label="Reel video">
            <video
              key={selectedReel.video_url}
              className="height-reel-popup__video"
              src={mediaUrl(selectedReel.video_url)}
              poster={mediaUrl(selectedReel.thumbnail_url) || undefined}
              autoPlay
              controls
              playsInline
              loop
            />
          </div>
          {count > 1 && (<>
            <button type="button" className="height-reel-popup__nav height-reel-popup__nav--prev" onClick={() => moveReel(-1)} aria-label="Previous reel">‹</button>
            <button type="button" className="height-reel-popup__nav height-reel-popup__nav--next" onClick={() => moveReel(1)} aria-label="Next reel">›</button>
          </>)}
          <button ref={closeRef} type="button" className="height-reel-popup__close" onClick={closeReel} aria-label="Close reel">×</button>
        </div>,
        document.body
      )}
    </section>
  );
}
