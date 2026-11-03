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

  small:
    "gap-2 px-4 py-2.5 text-xs font-semibold md:gap-3 md:px-6 md:py-3 md:text-sm",

  large:
    "gap-1.5 px-2.5 py-2 text-[11px] sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm md:gap-3 md:px-6 md:py-3",
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

  // Responsive watermark sizing
  const defaultMarkSize =
    size === "small"
      ? "size-5"
      : size === "large"
        ? "size-3 sm:size-4 md:size-6"
        : "size-8";

  const markClass = `
    shrink-0
    object-contain
    ${markSize || defaultMarkSize}
    ${selectedTone.mark}
  `;

  // Button content
  const content = (
    <>
      {/* LEFT WATERMARK */}
      <img
        src="/watermark.png"
        alt=""
        aria-hidden="true"
        className={markClass}
      />

      {/* ANIMATED TEXT */}
      <span className="relative block min-w-0 overflow-hidden whitespace-nowrap leading-[1.5]">
        {/* ORIGINAL TEXT */}
        <span
          className={`
            block
            transition-transform
            duration-700
            ${ROLL_EASE}
            group-hover/brand-button:-translate-y-full
            group-focus-visible/brand-button:-translate-y-full
            motion-reduce:transform-none
          `}
        >
          {children}
        </span>

        {/* REVEAL TEXT */}
        <span
          aria-hidden="true"
          className={`
            absolute left-0 top-0
            block translate-y-full
            transition-transform
            duration-700
            ${ROLL_EASE}
            group-hover/brand-button:translate-y-0
            group-focus-visible/brand-button:translate-y-0
            motion-reduce:hidden
          `}
        >
          {children}
        </span>
      </span>

      {/* RIGHT WATERMARK */}
      <img
        src="/watermark.png"
        alt=""
        aria-hidden="true"
        className={`${markClass} scale-x-[-1]`}
      />
    </>
  );

  // Shared styling
  const classes = `
    group/brand-button
    inline-flex
    max-w-full
    min-w-0
    shrink-0
    items-center
    justify-center
    whitespace-nowrap
    rounded-full
    font-medium
    backdrop-blur-sm
    transition-colors
    duration-300
    focus-visible:outline
    focus-visible:outline-2
    focus-visible:outline-offset-2
    ${selectedSize}
    ${selectedTone.button}
    ${className}
  `;

  // React Router Link
  if (to) {
    return (
      <Link
        to={to}
        className={classes}
        aria-disabled={disabled || undefined}
        {...props}
      >
        {content}
      </Link>
    );
  }

  // External link
  if (href) {
    return (
      <a
        href={href}
        className={classes}
        aria-disabled={disabled || undefined}
        {...props}
      >
        {content}
      </a>
    );
  }

  // Static span
  if (as === "span") {
    return (
      <span className={classes} {...props}>
        {content}
      </span>
    );
  }

  // Native button
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
