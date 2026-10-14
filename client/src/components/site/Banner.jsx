import React from "react";
export default function Banner({ tag, title, body, image, children }) {
  return (
    <section className="banner relative isolate flex min-h-[640px] h-[92svh] w-full overflow-hidden bg-neutral-900 text-white">
      <style>{`

        .banner .banner-serif {
          font-family: 'Cormorant Garamond', 'Iowan Old Style', Georgia, serif;
        }
        .banner .banner-img {
          animation: banner-settle 2.4s cubic-bezier(.2,.7,.2,1) both;
        }
        .banner .banner-rise {
          animation: banner-rise 1.1s cubic-bezier(.2,.7,.2,1) .35s both;
        }
        .banner .banner-rise-late {
          animation: banner-rise 1.1s cubic-bezier(.2,.7,.2,1) .7s both;
        }
        @keyframes banner-settle {
          from { transform: scale(1.08); }
          to   { transform: scale(1); }
        }
        @keyframes banner-rise {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .banner .banner-img,
          .banner .banner-rise,
          .banner .banner-rise-late { animation: none; }
        }
      `}</style>

      <img
        src={image}
        alt=""
        className="banner-img absolute inset-0 -z-20 h-full w-full object-cover"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/25 to-black/10"
      />

      {/* <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-3 rounded-[22px] border border-white/30 sm:inset-5 md:inset-7 md:rounded-[32px]"
      /> */}

      <div className="relative mx-auto flex w-full max-w-7xl flex-col justify-between px-8 pb-14 pt-32 sm:px-12 md:px-16 md:pb-20">
        {tag ? (
          <p className="banner-rise inline-flex w-fit items-center gap-3 rounded-full bordertext-sm ">
            {tag}
          </p>
        ) : (
          <span />
        )}

        <div className="grid items-end gap-10 md:grid-cols-12 md:gap-8">
          <h1 className="banner-serif banner-rise-late text-balance text-[clamp(2.75rem,7.2vw,6.75rem)] font-light leading-[0.98] tracking-[-0.02em] md:col-span-8">
            {title}
          </h1>

          <div className="banner-rise-late md:col-span-4 md:border-l md:border-white/30 md:pl-8">
            <p className="max-w-sm text-[15px] leading-7 text-white/80">
              {body}
            </p>
            {children ? (
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {children}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}