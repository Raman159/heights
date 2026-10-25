import React from "react";
import { ArrowRight, BadgePercent, FileText, Inbox, MessageSquareQuote, Video } from "lucide-react";

const cards = [
  ["offers", "Offers", BadgePercent, "Current promotions"],
  ["posts", "Blog posts", FileText, "Published stories"],
  ["reviews", "Reviews", MessageSquareQuote, "Guest testimonials"],
  ["videos", "Videos", Video, "Media library"],
];

export default function AdminOverview({ stats, onSelect }) {
  const inquiries = stats?.inquiries || [];
  const open = inquiries.filter((item) => item.status !== "handled");
  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">A clear view of what is happening across your website.</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">Your workspace</h2>
        </div>
        <button onClick={() => onSelect("inquiries")} className="admin-primary-button">
          <Inbox size={17} /> {open.length} open inquiries <ArrowRight size={16} />
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([id, label, Icon, caption]) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className="group rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/60"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f1ed] text-[#9a6854]">
                <Icon size={19} />
              </span>
              <ArrowRight size={17} className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-600" />
            </div>
            <p className="mt-6 text-3xl font-semibold tracking-tight">{stats?.[id]?.length ?? "—"}</p>
            <p className="mt-1 text-sm font-semibold">{label}</p>
            <p className="mt-1 text-xs text-slate-500">{caption}</p>
          </button>
        ))}
      </div>
      <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 md:px-6">
          <div>
            <h3 className="font-semibold">Latest inquiries</h3>
            <p className="mt-1 text-xs text-slate-500">Recent messages from your website</p>
          </div>
          <button onClick={() => onSelect("inquiries")} className="text-sm font-semibold text-[#95614e] hover:text-[#182b2a]">View all</button>
        </div>
        {inquiries.length ? (
          <div className="divide-y divide-slate-100">
            {inquiries.slice(0, 5).map((item) => (
              <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 md:px-6">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.name} <span className="font-normal text-slate-500">· {item.type || "General inquiry"}</span></p>
                  <p className="mt-1 truncate text-xs text-slate-500">{item.email} · {item.phone}</p>
                </div>
                <span className={"rounded-full px-2.5 py-1 text-xs font-medium " + (item.status === "handled" ? "bg-slate-100 text-slate-500" : "bg-amber-50 text-amber-800")}>
                  {item.status === "handled" ? "Handled" : "Needs attention"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="px-6 py-10 text-center text-sm text-slate-500">Your latest inquiries will appear here.</p>
        )}
      </section>
    </div>
  );
}
