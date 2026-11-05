import React, { useEffect, useState } from "react";
import { pic } from "../data";
import { get } from "../api";
import Inquiry from "../components/Forms";
import Banner from "../components/site/Banner";
import { useToast } from "../components/Toast";
import { getTenDigitPhoneNumber, parsePhoneNumbers } from "../utils/phoneNumbers";

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
  const phoneNumbers = parsePhoneNumbers(contact?.whatsapp_number);

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
          <h2 className="font-display mb-6 text-4xl font-light leading-[1.1] tracking-[-.04em] md:text-[2.8rem]">
            We'd love to hear from you.
          </h2>
          <p className="max-w-lg text-[1.08rem] font-light leading-[2] text-ink/70">
            Tell us how we can make your visit memorable. Our team will respond
            to your enquiry directly.
          </p>
          <div className="mt-8 space-y-5 text-[1.02rem] font-light leading-8 text-ink/75">
            {contact?.whatsapp_number && (
              <p>
                <span className="font-semibold text-ink">Phone:</span>
                {phoneNumbers.map((number, index) => {
                  const digits = getTenDigitPhoneNumber(number);
                  return (
                    <span key={`${number}-${index}`} className="block">
                      {digits ? (
                        <a
                          href={`https://wa.me/${digits}`}
                          className="hover:text-clay"
                        >
                          {number}
                        </a>
                      ) : (
                        <span>{number}</span>
                      )}
                    </span>
                  );
                })}
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
                <span className="font-semibold text-ink">Opening hours:</span>
                <span className="block whitespace-pre-line">
                  {contact.opening_hours}
                </span>
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
