import React from "react";
import { Reveal } from "../Layout";

export default function SectionHead({ eyebrow, title, body }) {
  return (
    <Reveal className="text-center max-w-2xl mx-auto mb-12">
      <div className="eyebrow mb-4">{eyebrow}</div>
      <h2 className="h2 mb-5">{title}</h2>
      {body && <p className="text-muted leading-8">{body}</p>}
    </Reveal>
  );
}
