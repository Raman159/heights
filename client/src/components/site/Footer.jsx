import { useEffect, useState } from "react";
import { ArrowUpRight, Facebook, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { get } from "../../api";
import { useToast } from "../Toast";

/* Adjust the two import paths above to wherever this file lives.
   (Written for src/components/site/Footer.jsx.) */

const LINKS = [
  ["Spa", "/spa"],
  ["Gym", "/gym"],
  ["Wellness", "/wellness"],
  ["Restro", "/restro"],
  // ["Offers", "/offers"],
  // ["Blog", "/blog"],
  ["Contact Us", "/contact"],
];

const linkClass = "text-ink/70 underline-offset-4 hover:text-ink hover:underline";

export default function Footer() {
  const notify = useToast();
  const [contact, setContact] = useState(null);

  // Same call the Contact page uses
  useEffect(() => {
    get("/public/settings")
      .then(setContact)
      .catch((error) => notify(error.message, "error"));
  }, [notify]);

  const whatsapp = contact?.whatsapp_number?.replace(/\D/g, "");

  // instagram_url / facebook_url are guesses: rename to your real keys.
  const social = [
    { label: "Instagram", href: contact?.instagram_url, Icon: Instagram },
    { label: "Facebook", href: contact?.facebook_url, Icon: Facebook },
  ].filter((s) => s.href);

  return (
    <footer className="border-t border-ink/10 bg-cream text-ink">
      <div className="shell grid gap-12 py-14 text-sm md:grid-cols-2 md:py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        {/* Brand */}
        <div>
          <Link to="/" aria-label="HEIGHT home" className="inline-block">
            <img
              src="/logo.png"
              alt="HEIGHT Restro & Wellness"
              className="w-24 object-contain"
            />
          </Link>
          <p className="mt-5 max-w-xs leading-7 text-ink/70">
            Dine, move, heal &amp; reconnect. Wellness, restro, bar, gym, salon,
            jacuzzi and spa, all in one place.
          </p>
          {social.length > 0 && (
            <div className="mt-6 flex gap-3">
              {social.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex size-10 items-center justify-center rounded-full border border-ink/20 transition hover:bg-ink hover:text-cream"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Explore */}
        <nav aria-label="Footer">
          <h3 className="mb-4 font-semibold">Explore</h3>
          <ul className="space-y-3">
            {LINKS.map(([name, path]) => (
              <li key={path}>
                <Link to={path} className={linkClass}>
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Visit us */}
        <div>
          <h3 className="mb-4 font-semibold">Visit us</h3>
          <div className="space-y-3 text-ink/70">
            {contact?.address && (
              <p>
                <a
                  href="https://maps.app.goo.gl/QPqg5DpUnAMyYwJd8"
                  target="_blank"
                  rel="noreferrer"
                  className={linkClass}
                >
                  {contact.address}
                </a>
              </p>
            )}
            {contact?.opening_hours && (
              <p className="whitespace-pre-line">{contact.opening_hours}</p>
            )}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-4 font-semibold">Get in touch</h3>
          <div className="space-y-3">
            {contact?.whatsapp_number && (
              <p>
                <a
                  href={whatsapp ? `https://wa.me/${whatsapp}` : undefined}
                  target="_blank"
                  rel="noreferrer"
                  className={linkClass}
                >
                  {contact.whatsapp_number}
                </a>
              </p>
            )}
            {contact?.contact_email && (
              <p>
                <a
                  href={`mailto:${contact.contact_email}`}
                  className={`${linkClass} break-all`}
                >
                  {contact.contact_email}
                </a>
              </p>
            )}
          </div>
          <Link to="/contact" className="btn mt-6 inline-flex">
            Book an Appointment <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-ink/10">
        <div className="shell flex flex-wrap items-center justify-center gap-3 py-5 text-xs text-ink/60 md:justify-between">
          <span>
            © {new Date().getFullYear()} HEIGHT Restro &amp; Wellness. All
            rights reserved.
          </span>
          <button>
            Terms of Use
          </button>
        </div>
      </div>
    </footer>
  );
}