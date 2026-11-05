import React, { useCallback, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { get, logoutSession, post, setToken } from "../api";
import { useToast } from "../components/Toast";
import AdminLogin from "../components/admin/AdminLogin";
import AdminOverview from "../components/admin/AdminOverview";
import AdminResourcePage from "../components/admin/AdminResourcePage";
import AdminInquiries from "../components/admin/AdminInquiries";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminSettings from "../components/admin/AdminSettings";
import AdminSecurity from "../components/admin/AdminSecurity";

const sections = ["offers", "posts", "reviews", "videos", "gallery", "menus", "team_members", "services", "events", "spa_content", "spa_categories", "spa_treatments", "inquiries", "settings", "security"];

export default function Admin() {
  const notify = useToast();
  const [logged, setLogged] = useState(!!sessionStorage.getItem("height_token"));
  const [login, setLogin] = useState({ username: "", password: "" });
  const [section, setSection] = useState("overview");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const logout = useCallback(() => {
    setToken("");
    setLogged(false);
    logoutSession().catch((error) => notify(error.message, "error"));
  }, [notify]);

  useEffect(() => {
    const handleExpiredSession = () => logout();
    window.addEventListener("height:auth-expired", handleExpiredSession);
    return () =>
      window.removeEventListener("height:auth-expired", handleExpiredSession);
  }, [logout]);

  const load = useCallback(async () => {
    if (!logged) return;
    setLoading(true);
    setItems(section === "overview" ? {} : []);
    try {
      if (section === "overview") {
        const [offers, posts, reviews, videos, gallery, menus, team_members, events, inquiries] = await Promise.all(
          ["offers", "posts", "reviews", "videos", "gallery", "menus", "team_members", "events", "inquiries"].map((name) =>
            get("/admin/" + name),
          ),
        );
        setItems({ offers, posts, reviews, videos, gallery, menus, team_members, events, inquiries });
      } else if (section === "settings" || section === "spa_content") {
        setItems(await get("/admin/settings"));
      } else if (section !== "security") {
        setItems(await get("/admin/" + section));
      }
    } catch (error) {
      if (/token|unauthorized/i.test(error.message)) logout();
      else notify(error.message, "error");
    } finally {
      setLoading(false);
    }
  }, [logged, section, refreshKey, logout, notify]);

  useEffect(() => {
    load();
  }, [load]);

  async function enter(event) {
    event.preventDefault();
    try {
      const result = await post("/auth/login", login);
      setToken(result.token);
      setLogged(true);
      setSection("overview");
      notify("Welcome back");
    } catch (error) {
      notify(error.message, "error");
    }
  }

  if (!logged) return <AdminLogin login={login} setLogin={setLogin} onSubmit={enter} />;

  function selectSection(nextSection) {
    setSection(nextSection);
    setMobileNavOpen(false);
  }

  const refresh = () => setRefreshKey((key) => key + 1);
  const title = section === "overview"
    ? "Overview"
    : section === "security"
      ? "Security"
      : section === "spa_content"
        ? "Spa page content"
      : section.charAt(0).toUpperCase() + section.slice(1);
  const records = Array.isArray(items) ? items : [];

  return (
    <div className="admin-app min-h-screen w-full min-w-0 overflow-x-hidden bg-[#f5f6f8] text-slate-900">
      <AdminSidebar
        active={section}
        onSelect={selectSection}
        onLogout={logout}
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
      />
      <main className="min-h-screen min-w-0 lg:pl-[260px]">
        <header className="sticky top-0 z-20 flex h-[76px] min-w-0 items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-5 md:px-10">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen((open) => !open)}
              aria-label={mobileNavOpen ? "Close admin navigation" : "Open admin navigation"}
              aria-expanded={mobileNavOpen}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 lg:hidden"
            >
              {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[.18em] text-slate-400">HEIGHT / ADMIN</p>
              <h1 className="mt-1 truncate text-xl font-semibold tracking-tight">{title}</h1>
            </div>
          </div>
          <button className="admin-quiet-button shrink-0" onClick={load} disabled={loading}>
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </header>
        <div className="mx-auto min-w-0 max-w-[1440px] p-4 sm:p-5 md:p-10">
          {section === "overview" && <AdminOverview stats={items} onSelect={setSection} />}
          {section === "settings" && (
            <AdminSettings settings={items} onSaved={refresh} />
          )}
          {section === "spa_content" && (
            <AdminSettings settings={items} onSaved={refresh} spaOnly />
          )}
          {section === "security" && <AdminSecurity />}
          {section === "inquiries" && (
            <AdminInquiries records={records} loading={loading} onChanged={refresh} />
          )}
          {sections.includes(section) && !["settings", "spa_content", "security", "inquiries"].includes(section) && (
            <AdminResourcePage
              key={section}
              section={section}
              records={records}
              loading={loading}
              onChanged={refresh}
            />
          )}
        </div>
      </main>
    </div>
  );
}
