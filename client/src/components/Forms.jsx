import React, { useState } from "react";
import { post } from "../api";
import { useToast } from "./Toast";
export default function Inquiry({
  service = "",
  type = "service",
  compact = false,
}) {
  const notify = useToast();
  const [values, setValues] = useState({
      name: "",
      email: "",
      phone: "",
      service,
      preferred_date: "",
      message: "",
    }),
    [busy, setBusy] = useState(false);
  const change = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });
  async function submit(e) {
    e.preventDefault();
    if (values.name.trim().length < 2 || values.message.trim().length < 5) {
      notify("Please enter your name and a short message.", "error");
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
        (compact ? "" : "bg-white p-6 md:p-10 rounded-[2rem] shadow-sm")
      }
    >
      <div className="grid md:grid-cols-2 gap-4">
        <label className="text-sm">
          Full Name *
          <input
            className="field mt-2"
            name="name"
            maxLength="120"
            minLength="2"
            required
            value={values.name}
            onChange={change}
          />
        </label>
        <label className="text-sm">
          Email *
          <input
            className="field mt-2"
            name="email"
            type="email"
            maxLength="190"
            required
            value={values.email}
            onChange={change}
          />
        </label>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <label className="text-sm">
          Phone *
          <input
            className="field mt-2"
            name="phone"
            type="tel"
            minLength="7"
            maxLength="20"
            pattern="[+0-9 ()-]{7,20}"
            required
            value={values.phone}
            onChange={change}
          />
        </label>
        <label className="text-sm">
          Preferred date{" "}
          <input
            type="date"
            className="field mt-2"
            name="preferred_date"
            min={new Date().toISOString().slice(0, 10)}
            value={values.preferred_date}
            onChange={change}
          />
        </label>
      </div>
      <label className="text-sm">
        Service or package{" "}
        <input
          className="field mt-2"
          name="service"
          maxLength="120"
          value={values.service}
          onChange={change}
          placeholder="Which experience interests you?"
        />
      </label>
      <label className="text-sm">
        Your message *
        <textarea
          className="field mt-2"
          name="message"
          maxLength="2000"
          minLength="5"
          rows="4"
          required
          value={values.message}
          onChange={change}
          placeholder="Tell us what you have in mind..."
        />
      </label>
      <button type="submit" disabled={busy} className="btn w-fit">
        {busy ? "Sending..." : "Send Enquiry"} →
      </button>
    </form>
  );
}
