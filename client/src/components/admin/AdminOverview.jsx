import React from "react";
import {
  ArrowRight,
  BadgePercent,
  CheckCircle2,
  ChevronRight,
  FileText,
  Images,
  Inbox,
  MessageSquareQuote,
  Utensils,
  UsersRound,
  Video,
} from "lucide-react";

const content = [
  ["posts", "Blog posts", FileText, "Published stories"],
  ["offers", "Offers", BadgePercent, "Current promotions"],
  ["menus", "Restaurant menus", Utensils, "Food and drinks menus"],
  ["gallery", "Gallery", Images, "Website photography"],
  ["videos", "Videos", Video, "Media library"],
  ["reviews", "Reviews", MessageSquareQuote, "Guest testimonials"],
  ["team_members", "Our team", UsersRound, "Team profiles"],
];

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
};

const today = () =>
  new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

const ago = (v) => {
  const t = v ? new Date(v).getTime() : NaN;
  if (isNaN(t)) return "";
  const m = Math.round((Date.now() - t) / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m} min ago`;
  if (m < 1440) return `${Math.round(m / 60)} h ago`;
  if (m < 10080) return `${Math.round(m / 1440)} d ago`;
  return new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const initials = (name = "") =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?";

function Tile({ label, value, hint, tone = "plain", loading }) {
  const tones = {
    plain: "border-slate-200 bg-white",
    alert: "border-amber-200 bg-amber-50/70",
  };
  return (
    <div className={`rounded-2xl border p-5 ${tones[tone]}`}>
      <p className="text-sm text-slate-500">{label}</p>
      {loading ? (
        <div className="mt-3 h-9 w-16 animate-pulse rounded bg-slate-100" />
      ) : (
        <p className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">{value}</p>
      )}
      <p className="mt-2 text-xs text-slate-500">{hint}</p>
    </div>
  );
}

export default function AdminOverview({ stats, onSelect }) {
  const loading = !stats;
  const inquiries = stats?.inquiries || [];
  const open = inquiries.filter((i) => i.status !== "handled");
  const handled = inquiries.length - open.length;
  const totalContent = content.reduce((n, [id]) => n + (stats?.[id]?.length || 0), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{today()}</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{greeting()}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {loading
              ? "Loading your workspace…"
              : open.length
              ? `You have ${open.length} ${open.length === 1 ? "inquiry" : "inquiries"} waiting for a reply.`
              : "You are all caught up. No inquiries need attention."}
          </p>
        </div>
        {open.length > 0 ? (
          <button onClick={() => onSelect("inquiries")} className="admin-primary-button">
            <Inbox size={17} /> Review inquiries <ArrowRight size={16} />
          </button>
        ) : (
          <button onClick={() => onSelect("inquiries")} className="admin-quiet-button">
            View all inquiries
          </button>
        )}
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Tile
          label="Needs attention"
          value={open.length}
          hint={open.length ? "Reply to these first" : "Nothing waiting"}
          tone={open.length ? "alert" : "plain"}
          loading={loading}
        />
        <Tile label="Handled" value={handled} hint="Inquiries completed" loading={loading} />
        <Tile label="Website content" value={totalContent} hint="Items across all sections" loading={loading} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Inquiries */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 md:px-6">
            <div>
              <h3 className="font-semibold text-slate-900">Latest inquiries</h3>
              <p className="mt-0.5 text-xs text-slate-500">Recent messages from your website</p>
            </div>
            <button
              onClick={() => onSelect("inquiries")}
              className="rounded-lg px-2 py-1 text-sm font-semibold text-[#95614e] transition hover:bg-[#f5f1ed] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#a66d59]"
            >
              View all
            </button>
          </div>

          {loading ? (
            <div className="divide-y divide-slate-100">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex animate-pulse items-center gap-4 px-5 py-4 md:px-6">
                  <div className="h-10 w-10 rounded-full bg-slate-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-1/3 rounded bg-slate-100" />
                    <div className="h-3 w-1/2 rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : inquiries.length ? (
            <ul className="divide-y divide-slate-100">
              {inquiries.slice(0, 5).map((item) => {
                const isOpen = item.status !== "handled";
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => onSelect("inquiries")}
                      className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none md:px-6"
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                          isOpen ? "bg-[#f5f1ed] text-[#9a6854]" : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {initials(item.name)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline gap-2">
                          <span className={`truncate text-sm ${isOpen ? "font-semibold text-slate-900" : "font-medium text-slate-600"}`}>
                            {item.name || "Unnamed guest"}
                          </span>
                          <span className="hidden shrink-0 text-xs text-slate-400 sm:inline">
                            {item.type || "General inquiry"}
                          </span>
                        </span>
                        <span className="mt-1 block truncate text-xs text-slate-500">
                          {[item.email, item.phone].filter(Boolean).join("  |  ")}
                        </span>
                      </span>
                      <span className="flex shrink-0 flex-col items-end gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                            isOpen ? "bg-amber-50 text-amber-800" : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${isOpen ? "bg-amber-500" : "bg-slate-400"}`} />
                          {isOpen ? "Needs attention" : "Handled"}
                        </span>
                        {ago(item.created_at) && (
                          <span className="text-[11px] text-slate-400">{ago(item.created_at)}</span>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex flex-col items-center px-6 py-14 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <CheckCircle2 size={22} />
              </span>
              <p className="mt-4 text-sm font-medium text-slate-900">No inquiries yet</p>
              <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">
                Messages sent through your website contact form will appear here.
              </p>
            </div>
          )}
        </section>

        {/* Website content */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-5 py-4">
            <h3 className="font-semibold text-slate-900">Website content</h3>
            <p className="mt-0.5 text-xs text-slate-500">Choose a section to edit</p>
          </div>
          <ul className="divide-y divide-slate-100">
            {content.map(([id, label, Icon, caption]) => {
              const count = stats?.[id]?.length;
              return (
                <li key={id}>
                  <button
                    onClick={() => onSelect(id)}
                    className="group flex w-full items-center gap-3 px-5 py-3.5 text-left transition hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f5f1ed] text-[#9a6854]">
                      <Icon size={17} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-slate-900">{label}</span>
                      <span className="block truncate text-xs text-slate-500">{caption}</span>
                    </span>
                    {loading ? (
                      <span className="h-4 w-6 animate-pulse rounded bg-slate-100" />
                    ) : (
                      <span className={`text-sm font-semibold tabular-nums ${count ? "text-slate-900" : "text-slate-300"}`}>
                        {count ?? 0}
                      </span>
                    )}
                    <ChevronRight
                      size={16}
                      className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500"
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}