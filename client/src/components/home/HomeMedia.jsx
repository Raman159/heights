import React, { useEffect, useRef, useState } from "react";
import { mediaUrl } from "../../api";

export function HeroMedia({ image, video }) {
  const wrapRef = useRef(null);
  const videoRef = useRef(null);
  const [allowVideo, setAllowVideo] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [inView, setInView] = useState(true);
  const resolvedImage = mediaUrl(image);
  const resolvedVideo = mediaUrl(video);

  useEffect(() => {
    [resolvedImage, resolvedVideo].forEach((url) => {
      if (!url) return;
      try {
        const origin = new URL(url, window.location.href).origin;
        if (
          origin === window.location.origin ||
          document.head.querySelector(
            `link[rel="preconnect"][href="${origin}"]`,
          )
        )
          return;
        const link = document.createElement("link");
        link.rel = "preconnect";
        link.href = origin;
        document.head.appendChild(link);
      } catch {}
    });
  }, [resolvedImage, resolvedVideo]);

  useEffect(() => {
    if (!resolvedVideo) {
      setAllowVideo(false);
      setPlaying(false);
      return;
    }
    const connection = navigator.connection;
    const constrained =
      connection &&
      (connection.saveData ||
        /^(slow-2g|2g|3g)$/.test(connection.effectiveType || ""));
    if (
      constrained ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const start = () => setAllowVideo(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(start, 400);
    return () => clearTimeout(id);
  }, [resolvedVideo]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (inView) el.play().catch(() => {});
    else el.pause();
  }, [inView, allowVideo]);

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden">
      {resolvedImage && (
        <img
          src={resolvedImage}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {allowVideo && resolvedVideo && (
        <video
          key={resolvedVideo}
          ref={videoRef}
          src={resolvedVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          disableRemotePlayback
          onPlaying={() => setPlaying(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${playing ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
}
export function EditorialPhoto({ src, alt, className = "", eager = false }) {
  if (!src)
    return <div aria-hidden="true" className={`bg-clay/10 ${className}`} />;
  return (
    <img
      src={mediaUrl(src)}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={`h-full w-full object-cover ${className}`}
    />
  );
}
