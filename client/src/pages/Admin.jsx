import React, { useCallback, useEffect, useState } from "react";
import { get, post, setToken } from "../api";
import { useToast } from "../components/Toast";
import AdminLogin from "../components/admin/AdminLogin";
import AdminOverview from "../components/admin/AdminOverview";
import AdminResourcePage from "../components/admin/AdminResourcePage";
import AdminInquiries from "../components/admin/AdminInquiries";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminSettings from "../components/admin/AdminSettings";
import AdminSecurity from "../components/admin/AdminSecurity";

const sections = ["offers", "posts", "reviews", "videos", "inquiries", "settings", "security"];

export default function Admin() {
  const notify = useToast();
  const [logged, setLogged] = useState(!!sessionStorage.getItem("height_token"));
  const [login, setLogin] = useState({ username: "", password: "" });
  const [section, setSection] = useState("overview");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const logout = useCallback(() => {
    setToken("");
    setLogged(false);
  }, []);

  const load = useCallback(async () => {
    if (!logged) return;
    setLoading(true);
    setItems(section === "overview" ? {} : []);
    try {
      if (section === "overview") {
        const [offers, posts, reviews, videos, inquiries] = await Promise.all(
          ["offers", "posts", "reviews", "videos", "inquiries"].map((name) =>
            get("/admin/" + name),
          ),
        );
        setItems({ offers, posts, reviews, videos, inquiries });
      } else if (section === "settings") {
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

  const refresh = () => setRefreshKey((key) => key + 1);
  const title = section === "overview"
    ? "Overview"
    : section === "security"
      ? "Security"
      : section.charAt(0).toUpperCase() + section.slice(1);
  const records = Array.isArray(items) ? items : [];

  return (
    <div className="admin-app min-h-screen bg-[#f5f6f8] text-slate-900">
      <AdminSidebar active={section} onSelect={setSection} onLogout={logout} />
      <main className="min-h-screen lg:pl-[260px]">
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur md:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-slate-400">HEIGHT / ADMIN</p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight">{title}</h1>
          </div>
          <button className="admin-quiet-button" onClick={load} disabled={loading}>
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </header>
        <div className="mx-auto max-w-[1440px] p-5 md:p-10">
          {section === "overview" && <AdminOverview stats={items} onSelect={setSection} />}
          {section === "settings" && (
            <AdminSettings settings={items} onSaved={refresh} />
          )}
          {section === "security" && <AdminSecurity />}
          {section === "inquiries" && (
            <AdminInquiries records={records} loading={loading} onChanged={refresh} />
          )}
          {sections.includes(section) && !["settings", "security", "inquiries"].includes(section) && (
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
