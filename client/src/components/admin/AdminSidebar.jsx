import React from "react";
import {
  ArrowUpRight,
  BadgePercent,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquareQuote,
  Settings2,
  ShieldCheck,
  Video,
  Inbox,
} from "lucide-react";

const links = [
  ["overview", "Overview", LayoutDashboard],
  ["offers", "Offers", BadgePercent],
  ["posts", "Blog posts", FileText],
  ["reviews", "Reviews", MessageSquareQuote],
  ["videos", "Videos", Video],
  ["inquiries", "Inquiries", Inbox],
  ["settings", "Website settings", Settings2],
  ["security", "Security", ShieldCheck],
];

export default function AdminSidebar({ active, onSelect, onLogout }) {
  return (
    <aside className="border-b border-slate-200 bg-[#182b2a] text-white lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-[260px] lg:flex-col lg:border-0">
      <div className="flex h-[76px] items-center gap-3 border-b border-white/10 px-5 lg:px-7">
        <img src="/logo.png" alt="HEIGHT" className="h-9 w-9 rounded-lg bg-white object-contain p-1" />
        <div>
          <p className="font-semibold tracking-[.08em]">HEIGHT</p>
          <p className="text-[10px] uppercase tracking-[.2em] text-white/45">Management</p>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto p-3 lg:flex-1 lg:flex-col lg:gap-1.5 lg:overflow-y-auto lg:p-4">
        {links.map(([id, label, Icon]) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={
              "flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-medium transition " +
              (active === id
                ? "bg-white text-[#182b2a] shadow-sm"
                : "text-white/65 hover:bg-white/10 hover:text-white")
            }
          >
            <Icon size={18} strokeWidth={1.8} />
            <span className="whitespace-nowrap">{label}</span>
          </button>
        ))}
      </nav>
      <div className="hidden border-t border-white/10 p-4 lg:block">
        <a href="/" className="mb-2 flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm text-white/60 hover:bg-white/10 hover:text-white">
          <ArrowUpRight size={18} /> View website
        </a>
        <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm text-white/60 hover:bg-white/10 hover:text-white">
          <LogOut size={18} /> Sign out
        </button>
      </div>
      <button onClick={onLogout} className="flex items-center gap-2 px-5 pb-3 text-xs text-white/55 lg:hidden">
        <LogOut size={15} /> Sign out
      </button>
    </aside>
  );
}
