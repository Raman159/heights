import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";

const links = [
  ["/", "Home"],
  ["/restro", "Restro"],
  ["/offers", "Offers"],
  ["/blog", "Blog"],
  ["/contact", "Contact Us"],
];

const wellness = [
  ["/wellness", "Wellness"],
  ["/gym", "Gym"],
  ["/spa", "Spa"],
  ["/services/salon", "Salon"],
];

export default function Navbar() {
  const [scroll, setScroll] = useState(false);
  const [menu, setMenu] = useState(false);
  const [sub, setSub] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const update = () => setScroll(window.scrollY > 40);
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  // close drawer on route change
  useEffect(() => {
    setMenu(false);
    setSub(false);
  }, [loc.pathname]);

  // lock body scroll + close on Escape while drawer is open
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

  const home = loc.pathname === "/";
  const solid = scroll || !home;
  const light = !solid; // white text over hero

  return (
    <>
      <header
        className={
          "fixed top-0 left-0 z-50 w-full transition-all duration-500 " +
          (solid
            ? "bg-cream/95 backdrop-blur-xl shadow-sm py-2"
            : "bg-transparent py-3 md:py-4")
        }
      >
        <div className="grid grid-cols-3 items-center w-full px-4 md:px-8">
          <div className="flex justify-start">
            <button
              onClick={() => setMenu(true)}
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
            <Link
              to="/contact"
              className={
                "inline-flex items-center gap-1.5 rounded-full font-semibold text-xs md:text-sm px-4 py-2.5 md:px-6 md:py-3 transition " +
                (light ? "bg-white text-ink" : "btn")
              }
            >
              <span className="hidden sm:inline">Book an Experience</span>
              <span className="sm:hidden">Enquire</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </header>

      {/* Overlay */}
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
          "flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] " +
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

        <nav className="flex-1 overflow-y-auto px-6 pb-8 flex flex-col text-lg font-medium">
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
                {wellness.map(([to, label]) => (
                  <NavLink
                    key={to}
                    to={to}
                    className="py-2 rounded-lg hover:opacity-70"
                  >
                    {label}
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
{/* 
          <Link to="/contact" className="btn mt-8 self-start">
            Book an Appointment <ArrowUpRight size={16} />
          </Link> */}
        </nav>
      </aside>
    </>
  );
}