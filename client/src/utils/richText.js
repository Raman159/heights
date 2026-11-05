const allowedTags = new Set([
  "a",
  "b",
  "blockquote",
  "br",
  "div",
  "em",
  "h2",
  "h3",
  "hr",
  "i",
  "li",
  "ol",
  "p",
  "s",
  "span",
  "strong",
  "u",
  "ul",
]);

const blockedTags = new Set([
  "iframe",
  "object",
  "script",
  "style",
  "svg",
  "template",
]);

const safeHref = (value) => {
  const href = value.trim();
  if (href.startsWith("//")) return "";
  return /^(https?:|mailto:|tel:)/i.test(href) ||
    /^(\/(?!\/)|#|\?|\.{1,2}\/)/.test(href) ||
    !/^[a-z][a-z\d+.-]*:/i.test(href)
    ? href
    : "";
};

function copySafeNode(node, documentRef) {
  if (node.nodeType === 3) {
    return documentRef.createTextNode(node.nodeValue || "");
  }
  if (node.nodeType !== 1) return null;

  const tag = node.tagName.toLowerCase();
  if (blockedTags.has(tag)) return null;

  const children = [...node.childNodes]
    .map((child) => copySafeNode(child, documentRef))
    .filter(Boolean);

  if (!allowedTags.has(tag)) {
    const fragment = documentRef.createDocumentFragment();
    children.forEach((child) => fragment.appendChild(child));
    return fragment;
  }

  const clean = documentRef.createElement(tag);
  children.forEach((child) => clean.appendChild(child));

  if (tag === "a") {
    const href = safeHref(node.getAttribute("href") || "");
    if (href) clean.setAttribute("href", href);
  }

  const align = node.style?.textAlign?.toLowerCase();
  if (["left", "center", "right", "justify"].includes(align)) {
    clean.style.textAlign = align;
  }

  return clean;
}

export function sanitizeRichHtml(value = "") {
  if (typeof document === "undefined" || !value) return value || "";
  const parsed = new DOMParser().parseFromString(value, "text/html");
  const clean = document.createElement("div");
  [...parsed.body.childNodes]
    .map((node) => copySafeNode(node, document))
    .filter(Boolean)
    .forEach((node) => clean.appendChild(node));
  return clean.innerHTML;
}
