import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowUpRight, ChevronDown, X } from "lucide-react";
import BrandButton from "./BrandButton";

const links = [
  ["/", "Home"],
  ["/restro", "Restro"],
  ["/events", "Events"],
  ["/wellness", "Wellness"],
  ["/gallery", "Gallery"],
  ["/offers", "Offers"],
  ["/blog", "Blog"],
  ["/contact", "Contact Us"],
];

const wellness = [
  {
    to: "/wellness",
    label: "Wellness",
    img: "/media/infinity-pool.webp",
    desc: "Complete holistic health and relaxation experiences.",
  },
  {
    to: "/gym",
    label: "Gym",
    img: "/media/gym-interior.webp",
    desc: "State-of-the-art fitness equipment and training.",
  },
  {
    to: "/spa",
    label: "Spa",
    img: "/media/spa-lobby.webp",
    desc: "Rejuvenating therapies and therapeutic massages.",
  },
  {
    to: "/services/salon",
    label: "Salon",
    img: "/media/salon-chairs.webp",
    desc: "Professional grooming and styling services.",
  },
];

const quick = [
  ["/restro", "Restro"],
  ["/events", "Events"],
  ["/gallery", "Gallery"],
  ["/offers", "Offers"],
];

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

export default function Navbar() {
  const [scroll, setScroll] = useState(false);
  const [menu, setMenu] = useState(false);
  const [sub, setSub] = useState(false);
  const [mega, setMega] = useState(false);
  const loc = useLocation();

  const triggerRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    const update = () => setScroll(window.scrollY > 40);
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  // close everything on route change
  useEffect(() => {
    setMenu(false);
    setSub(false);
    setMega(false);
  }, [loc.pathname]);

  // lock body scroll + close drawer on Escape
  useEffect(() => {
    if (!menu) return;
    const onKey = (e) => e.key === "Escape" && setMenu(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  // mega menu: close on Escape and on any click outside trigger/panel
  useEffect(() => {
    if (!mega) return;

    const onKey = (e) => e.key === "Escape" && setMega(false);
    const onPointerDown = (e) => {
      const t = e.target;
      if (triggerRef.current?.contains(t)) return;
      if (panelRef.current?.contains(t)) return;
      setMega(false);
    };

    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [mega]);

const solid = scroll || mega;
  const light = !solid; // white text over hero
  const wellnessActive = wellness.some((w) => loc.pathname.startsWith(w.to));

  return (
    <>
      {/* Dim backdrop behind header while mega menu is open */}
      <div
        aria-hidden="true"
        className={
          "fixed inset-0 z-40 hidden md:block bg-ink/25 backdrop-blur-[2px] transition-opacity duration-800 " +
          (mega ? "opacity-100" : "opacity-0 pointer-events-none")
        }
      />

      <header
        className={
          "fixed top-0 left-0 z-50 w-full transition-all duration-500 " +
          (solid
            ? mega
              ? "bg-cream py-2"
              : "bg-cream/95 backdrop-blur-xl shadow-sm py-2"
            : "bg-transparent py-3 md:py-4")
        }
      >
        <div className="grid grid-cols-3 items-center w-full px-4 md:px-8">
          <div className="flex items-center justify-start gap-8 lg:gap-12">
            <button
              onClick={() => {
                setMega(false);
                setMenu(true);
              }}
              aria-label="Open menu"
              aria-expanded={menu}
              aria-controls="site-drawer"
              className={
                "flex items-center transition hover:opacity-70 " +
                (light ? "text-white" : "text-ink")
              }
            >
              <span className="flex w-7 flex-col gap-[5px]">
                <span className="h-[2px] w-4 rounded-full bg-current" />
                <span className="h-[2px] w-6 rounded-full bg-current" />
                <span className="h-[2px] w-8 rounded-full bg-current" />
              </span>
            </button>

            {/* Divider */}
            <span
              aria-hidden="true"
              className={
                "hidden md:block h-5 w-px bg-current opacity-30 transition-colors duration-500 " +
                (light ? "text-white" : "text-ink")
              }
            />

            <nav
              aria-label="Quick links"
              className={
                "hidden items-center gap-8 lg:gap-11 md:flex transition-colors duration-500 " +
                (light ? "text-white" : "text-ink")
              }
            >
              {/* Wellness trigger */}
              <button
                ref={triggerRef}
                type="button"
                onClick={() => setMega((v) => !v)}
                aria-expanded={mega}
                aria-controls="wellness-mega"
                className="group/link relative inline-flex items-center gap-1.5 py-2 text-[15px] lg:text-base font-light transition-transform duration-200 active:scale-95"
              >
                <span className="relative block overflow-hidden leading-[1.5]">
                  <span
                    className={`block group-hover/link:-translate-y-full group-hover/link:transition-transform group-hover/link:duration-700 group-hover/link:${EASE}`}
                  >
                    Wellness
                  </span>
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 top-0 block translate-y-full group-hover/link:translate-y-0 group-hover/link:transition-transform group-hover/link:duration-700 group-hover/link:${EASE}`}
                  >
                    Wellness
                  </span>
                </span>
                <ChevronDown
                  size={14}
                  aria-hidden="true"
                  className={
                    "transition-transform duration-500 " +
                    EASE +
                    (mega ? " rotate-180" : "")
                  }
                />
                <span
                  aria-hidden="true"
                  className={
                    "absolute left-1/2 -bottom-1 h-1 w-1 -translate-x-1/2 rounded-full bg-current " +
                    "transition-all duration-500 " +
                    EASE +
                    " " +
                    (mega || wellnessActive
                      ? "scale-100 opacity-100"
                      : "scale-0 opacity-0 group-hover/link:scale-100 group-hover/link:opacity-100")
                  }
                />
              </button>

              {/* Other quick links */}
              {quick.map(([to, label]) => (
                <NavLink
                  key={to}
                  to={to}
                  className="group/link relative inline-flex py-2 text-[15px] lg:text-base font-light"
                >
                  {({ isActive }) => (
                    <>
                      <span className="relative block overflow-hidden leading-[1.5]">
                        <span
                          className={`block group-hover/link:-translate-y-full group-hover/link:transition-transform group-hover/link:duration-700 group-hover/link:${EASE}`}
                        >
                          {label}
                        </span>
                        <span
                          aria-hidden="true"
                          className={`absolute left-0 top-0 block translate-y-full group-hover/link:translate-y-0 group-hover/link:transition-transform group-hover/link:duration-700 group-hover/link:${EASE}`}
                        >
                          {label}
                        </span>
                      </span>

                      <span
                        aria-hidden="true"
                        className={
                          "absolute left-1/2 -bottom-1 h-1 w-1 -translate-x-1/2 rounded-full bg-current " +
                          "transition-all duration-500 " +
                          EASE +
                          " " +
                          (isActive
                            ? "scale-100 opacity-100"
                            : "scale-0 opacity-0 group-hover/link:scale-100 group-hover/link:opacity-100")
                        }
                      />
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Center: logo */}
          <div className="flex justify-center">
            <Link to="/" aria-label="Height home">
              <img
                src="/logo.png"
                alt="HEIGHT Restro & Wellness"
                className={
                  "w-14 md:w-16 object-contain transition " +
                  (light ? "brightness-0 invert" : "")
                }
              />
            </Link>
          </div>

          {/* Right: book appointment */}
          <div className="flex justify-end">
            <BrandButton
              to="/contact"
              size="large"
              tone={light ? "glass" : "clay"}
              className={light ? "text-clay hover:text-white" : "text-white"}
            >
              <span className="hidden sm:inline">Book an Experience</span>
              <span className="sm:hidden">Enquire</span>
              {/* <ArrowUpRight size={16} /> */}
            </BrandButton>
          </div>
        </div>

        {/* Mega menu panel, attached to the header */}
        <div
          ref={panelRef}
          id="wellness-mega"
          aria-hidden={!mega}
          inert={!mega ? "" : undefined}
          className={
            "absolute left-0 top-full hidden w-full md:block bg-cream text-ink border-t border-ink/10 " +
            "shadow-[0_30px_60px_-30px_rgba(0,0,0,0.25)] " +
            "transition-[clip-path,opacity] duration-700 " +
            EASE +
            " " +
            (mega
              ? "opacity-100 [clip-path:inset(0_0_-48px_0)]"
              : "opacity-0 pointer-events-none [clip-path:inset(0_0_100%_0)]")
          }
        >
          <div className="mx-auto grid max-w-6xl grid-cols-4 px-8 py-8">
            {wellness.map((item, i) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMega(false)}
                style={{ transitionDelay: mega ? `${180 + i * 80}ms` : "0ms" }}
                className={
                  "group/card flex flex-col gap-4 border-l border-ink/10 px-6 first:border-l-0 " +
                  "font-sans transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] " +
                  (mega ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0")
                }
              >
                <div className="aspect-[3/4] w-full overflow-hidden bg-ink/10 rounded-t-full">
                  <img
                    src={item.img}
                    alt=""
                    className="h-full w-full object-cover opacity-100 transition-[transform,opacity] duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-[1.04] group-hover/card:opacity-70"
                  />
                </div>
                <div>
                  <h4 className="font-display text-lg font-light tracking-tight">
                    {item.label}
                  </h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink/60 line-clamp-2">
                    {item.desc}
                  </p>
                </div>
              </NavLink>
            ))}
          </div>
        </div>
      </header>

      {/* Drawer overlay */}
      <div
        onClick={() => setMenu(false)}
        aria-hidden="true"
        className={
          "fixed inset-0 z-[60] bg-black/50 transition-opacity duration-500 " +
          (menu ? "opacity-100" : "opacity-0 pointer-events-none")
        }
      />

      {/* Drawer: slides in from the left */}
      <aside
        id="site-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!menu}
        inert={!menu ? "" : undefined}
        className={
          "fixed top-0 left-0 z-[70] h-full w-[85%] max-w-sm bg-cream text-ink shadow-2xl " +
          "flex flex-col transition-transform duration-500 " +
          EASE +
          " " +
          (menu ? "translate-x-0" : "-translate-x-full")
        }
      >
        <div className="flex items-center justify-between px-6 py-4">
          <Link to="/" aria-label="Height home" onClick={() => setMenu(false)}>
            <img
              src="/logo.png"
              alt="HEIGHT Restro & Wellness"
              className="w-12 object-contain"
            />
          </Link>
          <button
            onClick={() => setMenu(false)}
            aria-label="Close menu"
            className="hover:opacity-70 [&_svg]:size-6"
          >
            <X />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-6 pb-8 flex flex-col text-lg font-light">
          <NavLink to="/" className="py-3 border-b border-ink/10 hover:opacity-70">
            Home
          </NavLink>

          {/* Wellness accordion */}
          <div className="border-b border-ink/10">
            <button
              onClick={() => setSub(!sub)}
              aria-expanded={sub}
              className="flex w-full items-center justify-between py-3 hover:opacity-70"
            >
              Wellness
              <ChevronDown
                size={18}
                className={"transition-transform duration-300 " + (sub ? "rotate-180" : "")}
              />
            </button>
            <div
              className={
                "grid transition-all duration-300 " +
                (sub ? "grid-rows-[1fr] pb-3" : "grid-rows-[0fr]")
              }
            >
              <div className="overflow-hidden flex flex-col gap-1 pl-4 text-base">
                {wellness.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className="py-2 rounded-lg hover:opacity-70"
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          {links.slice(1).map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              className="py-3 border-b border-ink/10 hover:opacity-70"
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}