import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown, X } from "lucide-react";
import BrandButton from "./BrandButton";

const links = [
  ["/restro", "Restro"],
  ["/events", "Events"],
  ["/offers", "Offers"],
  ["/gallery", "Gallery"],
  ["/our-team", "Our Team"],
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
  ["/events", "Events"],
  ["/offers", "Offers"],
];

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

function AnimatedNavLink({ to, children }) {
  return (
    <NavLink
      to={to}
      className="group/link relative inline-flex py-2 text-[15px] lg:text-base font-light"
    >
      {({ isActive }) => (
        <>
          <span className="relative block overflow-hidden leading-[1.5]">
            <span
              className={`block transition-none group-hover/link:transition-transform group-hover/link:duration-700 ${EASE} group-hover/link:-translate-y-full`}
            >
              {children}
            </span>

            <span
              aria-hidden="true"
              className={`absolute left-0 top-0 block translate-y-full transition-none group-hover/link:transition-transform group-hover/link:duration-700 ${EASE} group-hover/link:translate-y-0`}
            >
              {children}
            </span>
          </span>

          <span
            aria-hidden="true"
            className={`absolute left-1/2 -bottom-1 h-1 w-1 -translate-x-1/2 rounded-full bg-current transition-all duration-500 ${EASE} ${
              isActive
                ? "scale-100 opacity-100"
                : "scale-0 opacity-0 group-hover/link:scale-100 group-hover/link:opacity-100"
            }`}
          />
        </>
      )}
    </NavLink>
  );
}

export default function Navbar() {
  const [scroll, setScroll] = useState(false);
  const [menu, setMenu] = useState(false);
  const [sub, setSub] = useState(false);
  const [mega, setMega] = useState(false);

  const loc = useLocation();

  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const drawerRef = useRef(null);
  const menuButtonRef = useRef(null);

  // Scroll detection
  useEffect(() => {
    const update = () => {
      setScroll(window.scrollY > 40);
    };

    window.addEventListener("scroll", update, {
      passive: true,
    });

    update();

    return () => {
      window.removeEventListener("scroll", update);
    };
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMenu(false);
    setSub(false);
    setMega(false);
  }, [loc.pathname]);

  // Prevent background scrolling while drawer is open
  useEffect(() => {
    if (!menu) return;

    const previousOverflow = document.body.style.overflow;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setMenu(false);
      }

      if (event.key === "Tab") {
        const focusable = drawerRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );

        if (!focusable?.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    const focusFrame = requestAnimationFrame(() => {
      drawerRef.current
        ?.querySelector('button[aria-label="Close menu"]')
        ?.focus();
    });

    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      menuButtonRef.current?.focus();
    };
  }, [menu]);

  // Close Wellness mega menu on outside click / Escape
  useEffect(() => {
    if (!mega) return;

    const onKey = (event) => {
      if (event.key === "Escape") {
        setMega(false);
        triggerRef.current?.focus();
      }
    };

    const onPointerDown = (event) => {
      const target = event.target;

      if (triggerRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;

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
  const light = !solid;

  const wellnessActive = wellness.some(
    (item) =>
      loc.pathname === item.to || loc.pathname.startsWith(`${item.to}/`),
  );

  return (
    <>
      {/* MEGA MENU OVERLAY */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 z-40 hidden bg-ink/25 backdrop-blur-[2px] transition-opacity duration-700 md:block ${
          mega ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* HEADER */}
      <header
        className={`fixed left-0 top-0 z-50 w-full transition-all duration-500 ${
          solid
            ? mega
              ? "bg-cream py-2"
              : "bg-cream/95 py-2 shadow-sm backdrop-blur-xl"
            : "bg-transparent py-3 md:py-4"
        }`}
      >
        {/* 
          MOBILE:
          Flexible left/right areas + auto-sized center.
          Keeps logo centered without clipping the button.

          DESKTOP:
          Retains original three-column composition.
        */}
        <div
          className="
            grid w-full
            grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]
            items-center gap-2
            px-3
            sm:px-4
            md:grid-cols-3
            md:gap-0
            md:px-8
          "
        >
          {/* LEFT SECTION */}
          <div className="flex min-w-0 items-center justify-start gap-8 lg:gap-12">
            {/* HAMBURGER */}
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => {
                setMega(false);
                setMenu(true);
              }}
              aria-label="Open menu"
              aria-expanded={menu}
              aria-controls="site-drawer"
              className={`flex shrink-0 items-center transition-opacity hover:opacity-70 ${
                light ? "text-white" : "text-ink"
              }`}
            >
              <span className="flex w-7 flex-col gap-[5px]">
                <span className="h-[2px] w-4 rounded-full bg-current" />
                <span className="h-[2px] w-6 rounded-full bg-current" />
                <span className="h-[2px] w-7 rounded-full bg-current" />
              </span>
            </button>

            {/* VERTICAL DIVIDER */}
            <span
              aria-hidden="true"
              className={`hidden h-5 w-px shrink-0 bg-current opacity-30 md:block ${
                light ? "text-white" : "text-ink"
              }`}
            />

            {/* DESKTOP NAVIGATION */}
            <nav
              aria-label="Quick links"
              className={`hidden items-center gap-5 transition-colors duration-500 md:flex lg:gap-8 ${
                light ? "text-white" : "text-ink"
              }`}
            >
              {/* RESTRO FIRST */}
              <AnimatedNavLink to="/restro">Restro</AnimatedNavLink>

              {/* WELLNESS SECOND */}
              <button
                ref={triggerRef}
                type="button"
                onClick={() => setMega((value) => !value)}
                aria-expanded={mega}
                aria-controls="wellness-mega"
                className="group/link relative inline-flex items-center gap-1.5 py-2 text-[15px] font-light transition-transform duration-200 active:scale-95 lg:text-base"
              >
                <span className="relative block overflow-hidden leading-[1.5]">
                  <span
                    className={`block transition-transform duration-700 ${EASE} group-hover/link:-translate-y-full`}
                  >
                    Wellness
                  </span>

                  <span
                    aria-hidden="true"
                    className={`absolute left-0 top-0 block translate-y-full transition-transform duration-700 ${EASE} group-hover/link:translate-y-0`}
                  >
                    Wellness
                  </span>
                </span>

                <ChevronDown
                  size={14}
                  aria-hidden="true"
                  className={`transition-transform duration-500 ${EASE} ${
                    mega ? "rotate-180" : ""
                  }`}
                />

                <span
                  aria-hidden="true"
                  className={`absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-current transition-all duration-500 ${
                    mega || wellnessActive
                      ? "scale-100 opacity-100"
                      : "scale-0 opacity-0 group-hover/link:scale-100 group-hover/link:opacity-100"
                  }`}
                />
              </button>

              {/* EVENTS / OFFERS / GALLERY */}
              {quick.map(([to, label]) => (
                <AnimatedNavLink key={to} to={to}>
                  {label}
                </AnimatedNavLink>
              ))}
            </nav>
          </div>

          {/* CENTER LOGO */}
          <div className="flex shrink-0 justify-center">
            <Link
              to="/"
              aria-label="Height home"
              onClick={() => setMega(false)}
            >
              <img
                src="/logo.png"
                alt="HEIGHT Restro & Wellness"
                className={`w-11 object-contain transition-all duration-500 sm:w-12 md:w-16 ${
                  light ? "brightness-0 invert" : ""
                }`}
              />
            </Link>
          </div>

          {/* RIGHT BOOKING BUTTON */}
          <div className="flex min-w-0 items-center justify-end">
            <BrandButton
              to="/contact"
              size="large"
              tone={light ? "glass" : "clay"}
              className="shrink-0 whitespace-nowrap"
              markSize="size-3 sm:size-4 md:size-6"
            >
              <span className="hidden sm:inline">Book an Experience</span>

              <span className="sm:hidden">Enquire</span>
            </BrandButton>
          </div>
        </div>

        {/* WELLNESS MEGA MENU */}
        <div
          ref={panelRef}
          id="wellness-mega"
          aria-hidden={!mega}
          inert={!mega}
          className={`absolute left-0 top-full hidden w-full border-t border-ink/10 bg-cream text-ink shadow-[0_30px_60px_-30px_rgba(0,0,0,0.25)] transition-[clip-path,opacity] duration-700 md:block ${EASE} ${
            mega
              ? "opacity-100 [clip-path:inset(0_0_-48px_0)]"
              : "pointer-events-none opacity-0 [clip-path:inset(0_0_100%_0)]"
          }`}
        >
          <div className="mx-auto grid max-w-6xl grid-cols-4 px-8 py-8">
            {wellness.map((item, index) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMega(false)}
                style={{
                  transitionDelay: mega ? `${180 + index * 80}ms` : "0ms",
                }}
                className={`group/card flex flex-col gap-4 border-l border-ink/10 px-6 font-sans transition-all duration-700 first:border-l-0 ${EASE} ${
                  mega ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                }`}
              >
                {/* IMAGE */}
                <div className="aspect-[3/4] w-full overflow-hidden rounded-t-full bg-ink/10">
                  <img
                    src={item.img}
                    alt=""
                    className={`h-full w-full object-cover transition-[transform,opacity] duration-[1200ms] ${EASE} group-hover/card:scale-[1.04] group-hover/card:opacity-70`}
                  />
                </div>

                {/* CONTENT */}
                <div>
                  <h4 className="font-display text-lg font-light tracking-tight">
                    {item.label}
                  </h4>

                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink/60">
                    {item.desc}
                  </p>
                </div>
              </NavLink>
            ))}
          </div>
        </div>
      </header>

      {/* DRAWER OVERLAY */}
      <div
        onClick={() => setMenu(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-500 ${
          menu ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* MOBILE / FULL MENU DRAWER */}
      <aside
        ref={drawerRef}
        id="site-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!menu}
        inert={!menu}
        className={`fixed left-0 top-0 z-[70] flex h-full w-[85%] max-w-sm flex-col bg-cream text-ink shadow-2xl transition-transform duration-500 ${EASE} ${
          menu ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* DRAWER HEADER */}
        <div className="flex items-center justify-between px-6 py-4">
          <Link to="/" aria-label="Height home" onClick={() => setMenu(false)}>
            <img
              src="/logo.png"
              alt="HEIGHT Restro & Wellness"
              className="w-12 object-contain"
            />
          </Link>

          <button
            type="button"
            onClick={() => setMenu(false)}
            aria-label="Close menu"
            className="hover:opacity-70 [&_svg]:size-6"
          >
            <X />
          </button>
        </div>

        {/* DRAWER LINKS */}
        <nav className="flex flex-1 flex-col overflow-y-auto px-6 pb-8 text-lg font-light">
          {/* HOME */}
          {/* <NavLink
            to="/"
            onClick={() => setMenu(false)}
            className="border-b border-ink/10 py-3 hover:opacity-70"
          >
            Home
          </NavLink> */}

          {/* RESTRO */}
          <NavLink
            to="/restro"
            onClick={() => setMenu(false)}
            className="border-b border-ink/10 py-3 hover:opacity-70"
          >
            Restro
          </NavLink>

          {/* WELLNESS ACCORDION */}
          <div className="border-b border-ink/10">
            <button
              type="button"
              onClick={() => setSub((value) => !value)}
              aria-expanded={sub}
              className="flex w-full items-center justify-between py-3 hover:opacity-70"
            >
              Wellness
              <ChevronDown
                size={18}
                className={`transition-transform duration-300 ${
                  sub ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`grid transition-all duration-300 ${
                sub ? "grid-rows-[1fr] pb-3" : "grid-rows-[0fr]"
              }`}
            >
              <div className="flex flex-col gap-1 overflow-hidden pl-4 text-base">
                {wellness.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMenu(false)}
                    className="rounded-lg py-2 hover:opacity-70"
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          {/* OTHER LINKS */}
          {links.slice(1).map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenu(false)}
              className="border-b border-ink/10 py-3 hover:opacity-70"
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
