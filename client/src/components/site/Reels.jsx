import React from "react";
import useCollection from "../../hooks/useCollection";
import EmptyState from "./EmptyState";

export default function Reels() {
  const videos = useCollection("videos");
  return (
    <section className="py-20 bg-[#f4e6d9] overflow-hidden">
      <div className="shell mb-9 flex items-end justify-between">
        <div>
          <p className="eyebrow mb-3">Moments at HEIGHT</p>
          <h2 className="h2">A glimpse of life here.</h2>
        </div>
        <span className="hidden md:block text-muted text-sm">
          The experience continues
        </span>
      </div>
      <div className="overflow-hidden">
        {videos === null ? null : videos.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="reel-track gap-4">
            {[...videos, ...videos].map((v, i) => (
              <div
                className="w-[210px] md:w-[250px] h-[385px] md:h-[440px] rounded-[2rem] border-[6px] border-white shadow-lg bg-ink overflow-hidden shrink-0 relative"
                key={`${v.id}-${i}`}
              >
                {v.video_url ? (
                  <video
                    src={v.video_url}
                    poster={v.thumbnail_url}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="none"
                    controls={false}
                    disablePictureInPicture
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    loading="lazy"
                    src={v.thumbnail_url}
                    className="h-full w-full"
                    alt="HEIGHT experience"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
