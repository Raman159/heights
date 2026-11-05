import React, { useState } from "react";
import {
  ArrowUpRight,
  BadgePercent,
  ChevronDown,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquareQuote,
  Settings2,
  ShieldCheck,
  Video,
  Inbox,
  Images,
  Utensils,
  UsersRound,
  Sparkles,
} from "lucide-react";

const overview = ["overview", "Overview", LayoutDashboard];

const groups = [
  {
    title: "Content",
    links: [
      ["offers", "Offers", BadgePercent],
      ["posts", "Blog posts", FileText],
      ["reviews", "Reviews", MessageSquareQuote],
      ["videos", "Videos", Video],
      ["gallery", "Gallery", Images],
      ["menus", "Restaurant menus", Utensils],
      ["team_members", "Our team", UsersRound],
    ],
  },
  {
    title: "Experiences",
    links: [
      ["services", "Service pages", Sparkles],
      ["spa_content", "Spa page content", Sparkles],
      ["spa_categories", "Spa categories", Sparkles],
      ["spa_treatments", "Spa treatments", Sparkles],
    ],
  },
];

const standaloneLinks = [
  ["inquiries", "Inquiries", Inbox],
  ["settings", "Homepage Settings", Settings2],
  ["security", "Security", ShieldCheck],
];

export default function AdminSidebar({
  active,
  onSelect,
  onLogout,
  mobileOpen = false,
  onMobileClose,
}) {
  const [openGroup, setOpenGroup] = useState("Content");

  const renderLink = ([id, label, Icon], groupTitle) => (
    <button
      key={id}
      onClick={() => {
        if (groupTitle) setOpenGroup(groupTitle);
        onSelect(id);
      }}
      aria-current={active === id ? "page" : undefined}
      className={
        "flex w-full shrink-0 items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-medium transition " +
        (active === id
          ? "bg-white text-[#182b2a] shadow-sm"
          : "text-white/65 hover:bg-white/10 hover:text-white")
      }
    >
      <Icon size={18} strokeWidth={1.8} />
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close admin navigation"
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}
      <aside
        aria-label="Admin navigation"
        className={
          "fixed inset-y-0 left-0 z-50 flex w-[min(84vw,280px)] -translate-x-full flex-col bg-[#182b2a] text-white shadow-2xl transition-transform duration-300 lg:z-30 lg:w-[260px] lg:translate-x-0 lg:shadow-none"
        }
        style={
          mobileOpen
            ? { transform: "translateX(0)", visibility: "visible" }
            : undefined
        }
      >
        <div className="flex h-[76px] shrink-0 items-center gap-3 border-b border-white/10 px-5 lg:px-7">
          <img src="/logo.png" alt="HEIGHT" className="h-9 w-9 rounded-lg bg-white object-contain p-1" />
          <div>
            <p className="font-semibold tracking-[.08em]">HEIGHT</p>
            <p className="text-[10px] uppercase tracking-[.2em] text-white/45">Management</p>
          </div>
        </div>
        <nav
          aria-label="Admin sections"
          className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overscroll-contain p-3 lg:p-4"
        >
          {renderLink(overview)}
          {groups.map((group) => {
            const expanded = openGroup === group.title;
            const containsActive = group.links.some(([id]) => id === active);
            return (
              <section key={group.title}>
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() =>
                    setOpenGroup((current) =>
                      current === group.title ? null : group.title,
                    )
                  }
                  className={`flex w-full items-center justify-between rounded-lg px-3.5 py-2 text-left text-[10px] font-semibold uppercase tracking-[.18em] transition ${
                    containsActive ? "text-white" : "text-white/45 hover:text-white/75"
                  }`}
                >
                  {group.title}
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${expanded ? "rotate-180" : ""}`}
                  />
                </button>
                {expanded && (
                  <div className="mt-1 flex flex-col gap-1">
                    {group.links.map((link) => renderLink(link, group.title))}
                  </div>
                )}
              </section>
            );
          })}
          <div className="flex flex-col gap-1">
            {standaloneLinks.map((link) => renderLink(link))}
          </div>
        </nav>
        <div className="border-t border-white/10 p-4">
          <a href="/" className="mb-2 flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm text-white/60 hover:bg-white/10 hover:text-white">
            <ArrowUpRight size={18} /> View website
          </a>
          <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm text-white/60 hover:bg-white/10 hover:text-white">
            <LogOut size={18} /> Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
