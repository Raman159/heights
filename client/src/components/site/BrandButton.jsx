import React from "react";
import { Link } from "react-router-dom";

const tones = {
  clay: {
    button: "bg-clay text-white hover:bg-ink",
    mark: "brightness-0 invert opacity-55",
  },
  dark: {
    button: "bg-ink text-white hover:bg-ink/85",
    mark: "brightness-0 invert opacity-55",
  },
  light: {
    button: "bg-white text-ink hover:bg-white/85",
    mark: "opacity-55",
  },
  glass: {
    button: "bg-white/20 text-white backdrop-blur-sm hover:bg-white/30",
    mark: "brightness-0 invert opacity-60",
  },
};

const sizes = {
  default: "gap-3 px-2 py-2 text-sm",
  small: "gap-2 px-4 py-2.5 text-xs font-semibold md:px-6 md:py-3 md:text-sm",
};

const ROLL_EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

export default function BrandButton({
  to,
  href,
  as = "button",
  type = "button",
  disabled = false,
  tone = "clay",
  size = "default",
  markSize,
  className = "",
  children,
  ...props
}) {
  const selectedTone = tones[tone] || tones.clay;
  const selectedSize = sizes[size] || sizes.default;
  const markClass = `object-contain ${markSize || (size === "small" ? "size-5" : "size-8")} ${selectedTone.mark}`;
  const content = (
    <>
      <img src="/watermark.png" alt="" aria-hidden="true" className={markClass} />
      <span className="relative block overflow-hidden leading-[1.5]">
        <span
          className={`block group-hover/brand-button:-translate-y-full group-hover/brand-button:transition-transform group-hover/brand-button:duration-700 group-hover/brand-button:${ROLL_EASE} group-focus-visible/brand-button:-translate-y-full group-focus-visible/brand-button:transition-transform group-focus-visible/brand-button:duration-700 group-focus-visible/brand-button:${ROLL_EASE}`}
        >
          {children}
        </span>
        <span
          aria-hidden="true"
          className={`absolute left-0 top-0 block translate-y-full group-hover/brand-button:translate-y-0 group-hover/brand-button:transition-transform group-hover/brand-button:duration-700 group-hover/brand-button:${ROLL_EASE} group-focus-visible/brand-button:translate-y-0 group-focus-visible/brand-button:transition-transform group-focus-visible/brand-button:duration-700 group-focus-visible/brand-button:${ROLL_EASE}`}
        >
          {children}
        </span>
      </span>
      <img src="/watermark.png" alt="" aria-hidden="true" className={`${markClass} scale-x-[-1]`} />
    </>
  );
  const classes = `group/brand-button inline-flex items-center justify-center rounded-full font-medium backdrop-blur-sm transition-colors duration-300 ${selectedSize} ${selectedTone.button} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    );
  }

  if (as === "span") {
    return (
      <span className={classes} {...props}>
        {content}
      </span>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${classes} disabled:cursor-not-allowed disabled:opacity-60`}
      {...props}
    >
      {content}
    </button>
  );
}
