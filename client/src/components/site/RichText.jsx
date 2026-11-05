import React, { useMemo } from "react";
import { sanitizeRichHtml } from "../../utils/richText";

const renderNode = (node, key, allowLinks) => {
  if (node.nodeType === 3) return node.nodeValue;
  if (node.nodeType !== 1) return null;

  const tag = node.tagName.toLowerCase();
  const children = [...node.childNodes].map((child, index) =>
    renderNode(child, `${key}-${index}`, allowLinks),
  );
  if (tag === "a" && !allowLinks) {
    return React.createElement("span", { key }, ...children);
  }
  const props = { key };
  if (tag === "h2") {
    props.id = node.textContent
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "");
  }
  const align = node.style?.textAlign;
  if (["left", "center", "right", "justify"].includes(align)) {
    props.style = { textAlign: align };
  }
  if (tag === "a") {
    const href = node.getAttribute("href");
    if (href) {
      props.href = href;
      if (/^https?:\/\//i.test(href)) {
        props.target = "_blank";
        props.rel = "noopener noreferrer";
      }
    }
  }

  return React.createElement(tag, props, ...children);
};

export default function RichText({
  text,
  className = "",
  allowLinks = true,
  ...props
}) {
  const content = useMemo(() => {
    if (!text || typeof document === "undefined") return null;
    const safeHtml = sanitizeRichHtml(text);
    const container = document.createElement("div");
    container.innerHTML = safeHtml;
    return [...container.childNodes].map((node, index) =>
      renderNode(node, `rich-${index}`, allowLinks),
    );
  }, [text, allowLinks]);

  return (
    <div
      className={`rich-content whitespace-pre-line ${className}`}
      {...props}
    >
      {content}
    </div>
  );
}
