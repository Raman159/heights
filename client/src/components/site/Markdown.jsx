import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { mediaUrl } from "../../api";

/* ---------- helpers (shared with the Blog page) ---------- */

export const slugify = (s = "") =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");

const nodeText = (n) =>
  typeof n === "string"
    ? n
    : Array.isArray(n)
    ? n.map(nodeText).join("")
    : n?.props?.children
    ? nodeText(n.props.children)
    : "";

/* Headings (## only) for the table of contents */
export const getHeadings = (md = "") =>
  [...md.matchAll(/^##\s+(.+)$/gm)].map((m) => {
    const text = m[1].replace(/[*_`]/g, "").trim();
    return { text, id: slugify(text) };
  });

/* Plain-text excerpt from the first paragraph of markdown */
export const excerptFromMarkdown = (md = "", max = 160) => {
  const first =
    md
      .split(/\n{2,}/)
      .map((b) => b.trim())
      .find((b) => b && !/^(#|!\[|>|[-*]\s|\d+\.\s|```)/.test(b)) || "";
  const text = first
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? text.slice(0, max).replace(/\s+\S*$/, "") + "…" : text;
};

/* ---------- renderer ---------- */

const dropCap =
  "[&>p:first-of-type]:first-letter:float-left [&>p:first-of-type]:first-letter:mr-3 [&>p:first-of-type]:first-letter:mt-1 [&>p:first-of-type]:first-letter:font-display [&>p:first-of-type]:first-letter:text-[4.5rem] [&>p:first-of-type]:first-letter:font-light [&>p:first-of-type]:first-letter:leading-[.8] [&>p:first-of-type]:first-letter:text-clay";

const components = {
  h2: ({ children }) => (
    <h2 id={slugify(nodeText(children))} className="font-display mb-6 mt-16 scroll-mt-28 text-3xl font-light leading-tight tracking-[-.03em]">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-display mb-4 mt-12 text-2xl font-light leading-snug tracking-[-.02em]">{children}</h3>
  ),
  p: ({ node, children }) =>
    node?.children?.length === 1 && node.children[0].tagName === "img" ? (
      <>{children}</>
    ) : (
      <p className="mb-7 text-[1.08rem] font-light leading-[2] text-ink/80">{children}</p>
    ),
  strong: ({ children }) => <strong className="font-medium text-ink">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ href = "", children }) => {
    const external = /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="text-clay underline decoration-clay/40 underline-offset-4 transition-colors hover:decoration-clay"
      >
        {children}
      </a>
    );
  },
  ul: ({ children }) => <ul className="mb-7 list-disc space-y-2 pl-6 text-[1.05rem] font-light leading-8 text-ink/80 marker:text-clay">{children}</ul>,
  ol: ({ children }) => <ol className="mb-7 list-decimal space-y-2 pl-6 text-[1.05rem] font-light leading-8 text-ink/80 marker:text-clay">{children}</ol>,
  blockquote: ({ children }) => (
    <blockquote className="font-display my-12 border-l-2 border-clay pl-6 text-2xl font-light leading-snug tracking-[-.02em] [&>p]:mb-0 [&>p]:text-2xl [&>p]:leading-snug [&>p]:text-ink">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-14 border-ink/10" />,
  img: ({ src, alt }) => (
    <figure className="my-12 lg:-mx-12">
      <img src={mediaUrl(src)} alt={alt || ""} loading="lazy" className="w-full" />
      {alt && <figcaption className="mt-3 text-center text-sm text-ink/55">{alt}</figcaption>}
    </figure>
  ),
  pre: ({ children }) => <pre className="mb-7 overflow-x-auto bg-ink p-5 text-sm leading-7 text-white">{children}</pre>,
  code: ({ className, children }) =>
    className ? (
      <code className={className}>{children}</code>
    ) : (
      <code className="bg-skin px-1.5 py-0.5 text-[.92em]">{children}</code>
    ),
  table: ({ children }) => (
    <div className="mb-7 overflow-x-auto">
      <table className="w-full border-collapse text-left text-[.95rem]">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="border-b border-ink/25 px-3 py-2 font-medium">{children}</th>,
  td: ({ children }) => <td className="border-b border-ink/10 px-3 py-2 text-ink/80">{children}</td>,
};

export default function Markdown({ text }) {
  return (
    <div className={dropCap}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {text || ""}
      </ReactMarkdown>
    </div>
  );
}