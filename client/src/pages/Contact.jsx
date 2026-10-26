import React, { useEffect, useState } from "react";
import { pic } from "../data";
import { get } from "../api";
import Inquiry from "../components/Forms";
import Banner from "../components/site/Banner";
import { useToast } from "../components/Toast";

export function Contact() {
  const params = new URLSearchParams(location.search);
  const notify = useToast();
  const [contact, setContact] = useState(null);

  useEffect(() => {
    get("/public/settings")
      .then(setContact)
      .catch((error) => notify(error.message, "error"));
  }, [notify]);

  const hasContactDetails =
    contact &&
    (contact.whatsapp_number ||
      contact.contact_email ||
      contact.address ||
      contact.opening_hours);
  const whatsappLink = contact?.whatsapp_number?.replace(/\D/g, "");

  return (
    <>
      <Banner
        tag="LET'S CONNECT"
        title="Your HEIGHT experience begins here."
        body="Questions, reservations, membership enquiries or special moments — let us help."
        image={pic("spa-lobby.webp")}
      />
      <section className="shell py-24 grid lg:grid-cols-[.75fr_1.25fr] gap-16">
        <div>
          <p className="eyebrow mb-5">Get in touch</p>
          <h2 className="h2 mb-6">We'd love to hear from you.</h2>
          <p className="text-muted leading-8">
            Tell us how we can make your visit memorable. Our team will respond
            to your enquiry directly.
          </p>
          <div className="mt-8 space-y-4 text-muted">
            {contact?.whatsapp_number && (
              <p>
                <span className="font-semibold text-ink">Phone: </span>
                <a
                  href={whatsappLink ? `https://wa.me/${whatsappLink}` : undefined}
                  className="hover:text-clay"
                >
                  {contact.whatsapp_number}
                </a>
              </p>
            )}
            {contact?.contact_email && (
              <p>
                <span className="font-semibold text-ink">Email: </span>
                <a
                  href={`mailto:${contact.contact_email}`}
                  className="hover:text-clay"
                >
                  {contact.contact_email}
                </a>
              </p>
            )}
            {contact?.address && (
              <p>
                <span className="font-semibold text-ink">Address: </span>
                {contact.address}
              </p>
            )}
            {contact?.opening_hours && (
              <p>
                <span className="font-semibold text-ink">Opening hours: </span>
                {contact.opening_hours}
              </p>
            )}
            {contact && !hasContactDetails && (
              <p>No contact details have been added yet.</p>
            )}
          </div>
        </div>
        <Inquiry
          key={params.get("service") || ""}
          service={params.get("service") || ""}
        />
      </section>
    </>
  );
}
