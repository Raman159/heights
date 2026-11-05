import React, { useState } from "react";
import { post } from "../api";
import { useToast } from "./Toast";
import BrandButton from "./site/BrandButton";

export default function Inquiry({
  service = "",
  type = "service",
  compact = false,
}) {
  const notify = useToast();

  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    number_of_people: "1",
    service,
    preferred_date: "",
    message: "",
  });

  const [busy, setBusy] = useState(false);

  const change = (e) =>
    setValues((previous) => ({
      ...previous,
      [e.target.name]:
        e.target.name === "phone"
          ? e.target.value.replace(/\D/g, "").slice(0, 10)
          : e.target.value,
    }));

  async function submit(e) {
    e.preventDefault();
    const name = values.name.trim();
    if (
      name.length < 2 ||
      !/^[\p{L}\p{M}][\p{L}\p{M} .'\u2019-]*$/u.test(name)
    ) {
      notify("Enter a valid name using letters and common name punctuation.", "error");
      return;
    }

    if (!/^[0-9]{10}$/.test(values.phone)) {
      notify("Phone number must contain exactly 10 digits.", "error");
      return;
    }

    const peopleCount = Number(values.number_of_people);
    if (
      !Number.isSafeInteger(peopleCount) ||
      peopleCount < 1 ||
      peopleCount > 4294967295
    ) {
      notify("Number of people must be a positive whole number.", "error");
      return;
    }

    if (values.message.trim().length < 10) {
      notify("Message must be at least 10 characters.", "error");
      return;
    }

    if (values.preferred_date && values.preferred_date < minDate) {
      notify("Past dates cannot be selected.", "error");
      return;
    }

    setBusy(true);

    try {
      await post("/inquiries", { ...values, type });

      notify("Thank you! Your enquiry has been received.");

      setValues({
        name: "",
        email: "",
        phone: "",
        number_of_people: "1",
        service,
        preferred_date: "",
        message: "",
      });
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className={
        "grid gap-4 " +
        (compact
          ? ""
          : "rounded-[2rem] border border-ink/5 bg-white/80 p-6 shadow-[0_30px_80px_-55px_rgba(48,39,37,.4)] md:p-10")
      }
    >
      <div className="mb-3 border-b border-ink/10 pb-6">
        <p className="eyebrow">A note to our team</p>
        <h2 className="font-display mt-3 text-3xl font-light leading-[1.1] tracking-[-.04em] md:text-[2.4rem]">
          Tell us what you have in mind.
        </h2>
        <p className="mt-4 max-w-lg text-[1.05rem] font-light leading-8 text-ink/70">
          Share a few details and we’ll be in touch to help plan your experience.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="font-display text-base font-light tracking-wide text-ink">
          Full Name *
          <input
            className="field mt-2 font-sans text-sm font-normal tracking-normal"
            name="name"
            autoComplete="name"
            maxLength={120}
            minLength={2}
            required
            value={values.name}
            onChange={change}
          />
        </label>

        <label className="font-display text-base font-light tracking-wide text-ink">
          Email *
          <input
            className="field mt-2 font-sans text-sm font-normal tracking-normal"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={190}
            required
            value={values.email}
            onChange={change}
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="font-display text-base font-light tracking-wide text-ink">
          Phone *
          <input
            className="field mt-2 font-sans text-sm font-normal tracking-normal"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="numeric"
            pattern="\d{10}"
            minLength={10}
            maxLength={10}
            title="Enter exactly 10 digits."
            required
            value={values.phone}
            onChange={change}
            placeholder="98XXXXXXXX"
          />
        </label>

        <label className="font-display text-base font-light tracking-wide text-ink">
          Number of people *
          <input
            className="field mt-2 font-sans text-sm font-normal tracking-normal"
            name="number_of_people"
            type="number"
            inputMode="numeric"
            min="1"
            max="4294967295"
            step="1"
            required
            value={values.number_of_people}
            onChange={change}
          />
        </label>

        <label className="font-display text-base font-light tracking-wide text-ink">
          Preferred date
          <input
            type="date"
            className="field mt-2 font-sans text-sm font-normal tracking-normal"
            name="preferred_date"
            min={minDate}
            value={values.preferred_date}
            onChange={change}
          />
        </label>
      </div>

      <label className="font-display text-base font-light tracking-wide text-ink">
        Service or package
        <input
          className="field mt-2 font-sans text-sm font-normal tracking-normal"
          name="service"
          type="text"
          maxLength={120}
          value={values.service}
          onChange={change}
          placeholder="Which experience interests you?"
        />
      </label>

      <label className="font-display text-base font-light tracking-wide text-ink">
        Your message *
        <textarea
          className="field mt-2 font-sans text-sm font-normal leading-7 tracking-normal"
          name="message"
          maxLength={2000}
          minLength={10}
          rows={4}
          required
          value={values.message}
          onChange={change}
          placeholder="Tell us what you have in mind..."
        />
      </label>

      <BrandButton type="submit" disabled={busy} size="small">
        {busy ? "Sending..." : "Send Enquiry"}
      </BrandButton>
    </form>
  );
}
