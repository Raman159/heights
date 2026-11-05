import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { get, mediaUrl } from "../api";
import { pic } from "../data";
import useCollection from "../hooks/useCollection";
import { useToast } from "../components/Toast";
import BrandButton from "../components/site/BrandButton";
import Banner from "../components/site/Banner";
import Reels from "../components/site/Reels";
import SectionHead from "../components/site/SectionHead";
import RichText from "../components/site/RichText";

const DISPLAY = "var(--font-display, inherit)";
const eventPath = (event) => `/events/${event.slug}`;
const eventImage = (event) => mediaUrl(event.image_url || "/media/rooftop-view.webp");

function useReadProgress() {
  const [progress, setProgress] = useState(0);

  React.useEffect(() => {
    let frame;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const page = document.documentElement;
        const max = page.scrollHeight - page.clientHeight;
        setProgress(max > 0 ? Math.min(1, page.scrollTop / max) : 0);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      cancelAnimationFrame(frame);
    };
  }, []);

  return progress;
}

function EventDetail({ event, events }) {
  const [copied, setCopied] = useState(false);
  const progress = useReadProgress();
  const relatedEvents = events.filter((item) => item.slug !== event.slug).slice(0, 2);
  const gallery = [
    event.gallery_image_1,
    event.gallery_image_2,
    event.gallery_image_3,
  ].filter(Boolean);
  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: event.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        } catch {
          setCopied(false);
        }
      }
    }
  }

  return (
    <>
      <Banner
        tag="GATHER AT HEIGHT"
        title={event.name}
        body={event.summary}
        image={eventImage(event)}
        compact
      />
      <section className="shell py-20 md:py-28">
        <div className="fixed inset-x-0 top-0 z-[60] h-[3px]" aria-hidden="true">
          <div
            className="h-full origin-left bg-clay"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>

        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-12 lg:gap-16">
          <aside className="lg:col-span-3">
            <div className="space-y-6 border-t border-ink/15 pt-6 text-sm lg:sticky lg:top-28">
              <div>
                <p className="text-ink/50">Event</p>
                <p className="mt-1 font-medium text-clay">{event.name}</p>
              </div>
              <div>
                <p className="text-ink/50">Setting</p>
                <p className="mt-1">{event.setting}</p>
              </div>
              <BrandButton
                to={`/contact?service=${encodeURIComponent(event.name)}`}
                size="small"
                tone="dark"
              >
                Enquire about this event
              </BrandButton>
              <button
                type="button"
                onClick={share}
                className="block text-left text-sm font-medium text-clay transition-colors hover:text-ink"
              >
                {copied ? "Link copied" : "Share this page"}
              </button>
              <Link
                to="/events"
                className="block border-t border-ink/15 pt-5 text-ink/65 transition-colors hover:text-clay"
              >
                ← All events
              </Link>
            </div>
          </aside>

          <article className="lg:col-span-9 lg:max-w-[40rem]">
            <RichText
              text={event.summary}
              className="font-display mb-10 border-b border-ink/10 pb-10 text-2xl font-light leading-[1.5] tracking-[-.02em] text-ink/75 md:text-[1.7rem]"
            />
            {gallery.length > 0 && (
              <figure className="mb-12">
                <div className="grid grid-cols-12 items-start gap-x-3 gap-y-4 sm:gap-x-5 sm:gap-y-6">
                  {gallery.map((image, index) => (
                    <img
                      key={image}
                      src={mediaUrl(image)}
                      alt={`${event.name} — event photo ${index + 1}`}
                      loading={index === 0 ? "eager" : "lazy"}
                      className={
                        index === 0
                          ? "col-span-11 col-start-2 aspect-[16/10] w-full object-cover sm:col-span-9 sm:col-start-4"
                          : index === 1
                            ? "-mt-6 col-span-6 col-start-1 aspect-[4/5] w-full object-cover sm:-mt-16 sm:col-span-5"
                            : "col-span-6 col-start-7 mt-5 aspect-[4/5] w-full object-cover sm:col-span-6 sm:col-start-7 sm:mt-10"
                      }
                    />
                  ))}
                </div>
              </figure>
            )}
            {event.details && (
              <RichText
                text={event.details}
                className="text-[1.08rem] font-light leading-[2] text-ink/80"
              />
            )}
            <div className="mt-12 border-t border-ink/10 pt-8">
              <p className="mb-5 text-sm leading-7 text-ink/65">
                Have an occasion in mind? Tell us a little about it and our team
                will help with your enquiry.
              </p>
              <BrandButton
                to={`/contact?service=${encodeURIComponent(event.name)}`}
                size="small"
              >
                Enquire now
              </BrandButton>
            </div>
          </article>
        </div>

        <div className="mx-auto mt-24 max-w-5xl border-t border-ink/10 pt-12">
          <h2 className="h2 mb-10">Explore other events</h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {relatedEvents.map((related) => (
              <Link
                key={related.slug}
                to={eventPath(related)}
                className="group grid grid-cols-[120px_1fr] items-center gap-5 border-t border-ink/15 pt-5 transition-colors hover:border-clay sm:grid-cols-[160px_1fr]"
              >
                <img
                  src={eventImage(related)}
                  alt=""
                  loading="lazy"
                  className="aspect-square w-full object-cover"
                />
                <span>
                  <span className="block text-xs uppercase tracking-[.18em] text-ink/50">
                    Events at HEIGHT
                  </span>
                  <span className="font-display mt-2 block text-xl font-light text-ink group-hover:text-clay">
                    {related.name}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* Concentric arcs ornament */
function Arcs({ className = "" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 60" className={className} fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.45">
      <path d="M10 60a50 50 0 0 1 100 0" />
      <path d="M22 60a38 38 0 0 1 76 0" />
      <path d="M34 60a26 26 0 0 1 52 0" />
      <path d="M46 60a14 14 0 0 1 28 0" />
      <circle cx="60" cy="60" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function EventArch({ e, i }) {
  const num = String(i + 1).padStart(2, "0");
  return (
    <Link
      to={eventPath(e)}
      aria-label={`Read more about ${e.name}`}
      className={"group block " + (i % 2 === 1 ? "lg:mt-14" : "")}
    >
      <div className="relative">
        {/* Offset outline arch */}
        <div aria-hidden="true" className="absolute inset-0 translate-x-3 translate-y-3 rounded-t-[999px] border border-black/20 transition-transform duration-700 group-hover:translate-x-4 group-hover:translate-y-4" />
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-t-[999px] bg-black/10">
          <img
            src={eventImage(e)}
            alt={e.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.07]"
          />
          <div className="absolute inset-0 bg-black/10 transition-colors duration-700 group-hover:bg-black/35" />
        </div>
        {/* Number circle */}
        <span className="absolute -bottom-5 left-1/2 grid h-12 w-12 -translate-x-1/2 place-items-center rounded-full border border-black/20 bg-cream text-sm transition-colors duration-500 group-hover:border-black group-hover:bg-black group-hover:text-white" style={{ fontFamily: DISPLAY }}>
          {num}
        </span>
      </div>
      <p className="mt-10 text-center text-lg tracking-wide" style={{ fontFamily: DISPLAY }}>{e.name}</p>
    </Link>
  );
}

export function Events() {
  const { slug } = useParams();
  const eventCollection = useCollection("events", { refreshOnFocus: true });
  const events = eventCollection || [];
  const notify = useToast();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(Boolean(slug));

  useEffect(() => {
    if (!slug) {
      setSelectedEvent(null);
      setLoadingEvent(false);
      return undefined;
    }

    let active = true;
    setLoadingEvent(true);
    get("/public/events/" + encodeURIComponent(slug))
      .then((event) => {
        if (active) setSelectedEvent(event);
      })
      .catch((error) => {
        if (!active) return;
        setSelectedEvent(null);
        if (!/not found/i.test(error.message)) notify(error.message, "error");
      })
      .finally(() => {
        if (active) setLoadingEvent(false);
      });

    return () => {
      active = false;
    };
  }, [slug, notify]);

  if (slug) {
    if (loadingEvent) {
      return (
        <section className="shell min-h-[50vh] py-24 text-muted">
          Loading event…
        </section>
      );
    }
    return selectedEvent ? (
      <EventDetail event={selectedEvent} events={events} />
    ) : (
      <>
        <Banner
          tag="NOT FOUND"
          title="Event not found"
          body="Explore the event spaces and experiences available at HEIGHT."
          image={pic("rooftop-view.webp")}
          compact
        />
        <section className="shell py-16">
          <BrandButton to="/events" size="small" tone="dark">
            Browse all events
          </BrandButton>
        </section>
      </>
    );
  }

  return (
    <>
      <Banner
        tag="GATHER AT HEIGHT"
        title="Make room for moments worth celebrating."
        body="A welcoming setting for gatherings, celebrations, and special events at HEIGHT."
        image={pic("rooftop-view.webp")}
      />

      <section className="relative overflow-hidden bg-cream py-24">
        <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-10 h-[32rem] w-[32rem] rounded-full border border-black/10" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-48 bottom-0 h-[40rem] w-[40rem] rounded-full border border-black/10" />

        <div className="shell relative">
          <Arcs className="mx-auto mb-6 h-12 w-24" />
          <SectionHead eyebrow="Celebrate together" title="Events at HEIGHT" />

          <div className="mb-20 mt-16 grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-4">
            {events.map((event, index) => (
              <EventArch key={event.id} e={event} i={index} />
            ))}
            {eventCollection === null && (
              <p className="col-span-full py-8 text-center text-muted">
                Loading events…
              </p>
            )}
            {eventCollection?.length === 0 && (
              <p className="col-span-full py-8 text-center text-muted">
                Events will be available here soon.
              </p>
            )}
          </div>

          {/* CTA framed by a half-circle */}
          <div className="relative text-center">
            <div aria-hidden="true" className="mx-auto h-28 w-56 rounded-t-full border border-b-0 border-black/20" />
            <div className="-mt-10">
              <BrandButton to="/contact?service=Event%20booking" size="small">
                Enquire Now
              </BrandButton>
            </div>
          </div>
        </div>
      </section>
      <section aria-label="Event reels">
        <Reels background="linear-gradient(180deg, #FBF7EB 0%, #F3E9DF 50%, #FBF7EB 100%)" />
      </section>
      <section className="shell relative min-h-[30vh] overflow-hidden py-24">
        {/* Concentric rings */}
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="grid h-[28rem] w-[28rem] place-items-center rounded-full border border-black/10">
            <div className="grid h-80 w-80 place-items-center rounded-full border border-black/10">
              <div className="h-56 w-56 rounded-full border border-black/10" />
            </div>
          </div>
        </div>
        <SectionHead eyebrow="Events at HEIGHT" title="A place to come together" />
      </section>

    </>
  );
}