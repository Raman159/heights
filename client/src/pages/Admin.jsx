import React, { useEffect, useState } from "react";
import { get, post, put, del, setToken } from "../api";
import { useToast } from "../components/Toast";
const tabs = ["offers", "posts", "reviews", "videos", "inquiries", "settings"];
const defs = {
  offers: ["title", "description", "image_url", "link_url", "sort_order"],
  posts: ["title", "slug", "excerpt", "body", "image_url", "sort_order"],
  reviews: ["author", "quote", "sort_order"],
  videos: ["title", "video_url", "thumbnail_url", "sort_order"],
  settings: [
    "hero_video",
    "hero_image",
    "whatsapp_number",
    "contact_email",
    "address",
    "opening_hours",
  ],
};
const blank = (t) => Object.fromEntries((defs[t] || []).map((k) => [k, ""]));
export default function Admin() {
  const notify = useToast();
  const [logged, setLogged] = useState(
      !!sessionStorage.getItem("height_token"),
    ),
    [login, setLogin] = useState({ username: "", password: "" }),
    [tab, setTab] = useState("offers"),
    [items, setItems] = useState([]),
    [current, setCurrent] = useState({}),
    [pw, setPw] = useState({ old_password: "", new_password: "" }),
    [file, setFile] = useState(null);
  async function load(t) {
    try {
      setItems(
        t === "settings"
          ? [await get("/admin/settings")]
          : await get("/admin/" + t),
      );
      setCurrent(t === "settings" ? await get("/admin/settings") : blank(t));
    } catch (e) {
      if (e.message.includes("token") || e.message.includes("Unauthorized"))
        logout();
      else notify(e.message, "error");
    }
  }
  useEffect(() => {
    if (logged) load(tab);
  }, [tab, logged]);
  function logout() {
    setToken("");
    setLogged(false);
  }
  async function enter(e) {
    e.preventDefault();
    try {
      const r = await post("/auth/login", login);
      setToken(r.token);
      setLogged(true);
      notify("Signed in successfully");
    } catch (e) {
      notify(e.message, "error");
    }
  }
  async function save(e) {
    e.preventDefault();
    try {
      if (tab === "settings") {
        await put("/admin/settings", current);
      } else if (current.id) {
        await put("/admin/" + tab + "/" + current.id, current);
      } else {
        await post("/admin/" + tab, current);
      }
      notify("Saved successfully");
      await load(tab);
    } catch (e) {
      notify(e.message, "error");
    }
  }
  async function remove(id) {
    if (!window.confirm("Delete this record?")) return;
    try {
      await del("/admin/" + tab + "/" + id);
      await load(tab);
      notify("Deleted successfully");
    } catch (e) {
      notify(e.message, "error");
    }
  }
  async function password(e) {
    e.preventDefault();
    try {
      await post("/auth/change-password", pw);
      setPw({ old_password: "", new_password: "" });
      notify("Password changed");
    } catch (e) {
      notify(e.message, "error");
    }
  }
  async function upload() {
    if (!file) return;
    let form = new FormData();
    form.append("file", file);
    try {
      const r = await fetch(
        (import.meta.env.VITE_API_URL || "/api") + "/admin/upload",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("height_token"),
          },
          body: form,
        },
      );
      const d = await r.json();
      if (!r.ok) throw Error(d.error);
      navigator.clipboard?.writeText(d.url);
      notify("Uploaded. URL copied: " + d.url);
    } catch (e) {
      notify(e.message, "error");
    }
  }
  if (!logged)
    return (
      <div className="min-h-screen pt-36 pb-24 bg-cream">
        <form
          onSubmit={enter}
          className="max-w-md mx-auto bg-white rounded-3xl shadow-sm p-10 space-y-5"
        >
          <h1 className="h2 !text-3xl">HEIGHT Admin</h1>
          <label className="block">
            Username
            <input
              className="field mt-2"
              required
              autoComplete="username"
              value={login.username}
              onChange={(e) => setLogin({ ...login, username: e.target.value })}
            />
          </label>
          <label className="block">
            Password
            <input
              type="password"
              className="field mt-2"
              required
              autoComplete="current-password"
              value={login.password}
              onChange={(e) => setLogin({ ...login, password: e.target.value })}
            />
          </label>
          <button className="btn">Sign in</button>
        </form>
      </div>
    );
  return (
    <div className="bg-[#f7f0e8] min-h-screen pt-32 pb-24">
      <div className="shell">
        <div className="flex justify-between items-center gap-4 mb-8">
          <h1 className="h2 !text-3xl">Content manager</h1>
          <button className="btn-outline" onClick={logout}>
            Logout
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={
                "px-5 py-2.5 rounded-full capitalize " +
                (tab === t ? "bg-clay text-white" : "bg-white")
              }
            >
              {t}
            </button>
          ))}
          <button
            onClick={() => setTab("password")}
            className={
              "px-5 py-2.5 rounded-full " +
              (tab === "password" ? "bg-clay text-white" : "bg-white")
            }
          >
            Change password
          </button>
        </div>
        {tab === "password" ? (
          <form
            onSubmit={password}
            className="bg-white p-8 rounded-3xl max-w-lg space-y-5"
          >
            <input
              type="password"
              required
              className="field"
              placeholder="Current password"
              value={pw.old_password}
              onChange={(e) => setPw({ ...pw, old_password: e.target.value })}
            />
            <input
              type="password"
              required
              minLength="12"
              className="field"
              placeholder="New password (12+ characters)"
              value={pw.new_password}
              onChange={(e) => setPw({ ...pw, new_password: e.target.value })}
            />
            <button className="btn">Update password</button>
          </form>
        ) : tab === "inquiries" ? (
          <div className="space-y-3">
            {items.map((x) => (
              <div className="bg-white p-6 rounded-2xl" key={x.id}>
                <div className="font-bold">
                  {x.name} — {x.type} {x.service && "— " + x.service}
                </div>
                <div className="text-sm text-muted">
                  {x.email} | {x.phone} | {x.preferred_date || "No date"} |{" "}
                  {new Date(x.created_at).toLocaleString()}
                </div>
                <p className="mt-3 whitespace-pre-wrap">{x.message}</p>
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={async () => {
                      try {
                        await put("/admin/inquiries/" + x.id, {
                          status: "handled",
                        });
                        await load(tab);
                        notify("Inquiry marked as handled");
                      } catch (e) {
                        notify(e.message, "error");
                      }
                    }}
                    className="text-clay"
                  >
                    {x.status === "handled" ? "Handled ✓" : "Mark handled"}
                  </button>
                  <button onClick={() => remove(x.id)} className="text-red-700">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid lg:grid-cols-[.8fr_1.2fr] gap-6">
            <div className="space-y-3">
              <h2 className="text-xl font-medium mb-4">Records</h2>
              {tab !== "settings" && (
                <button
                  className="btn-outline"
                  onClick={() => setCurrent(blank(tab))}
                >
                  + New entry
                </button>
              )}
              {items.map((x, i) => (
                <button
                  key={x.id || i}
                  onClick={() => setCurrent(x)}
                  className={
                    "block text-left w-full p-4 rounded-2xl border " +
                    (current.id === x.id && x.id
                      ? "border-clay bg-skin"
                      : "border-transparent bg-white")
                  }
                >
                  <span className="font-semibold">
                    {x.title || x.author || x.hero_image || "#" + x.id}
                  </span>
                  <small className="block text-muted">
                    {x.slug || x.status || x.video_url}
                  </small>
                </button>
              ))}
            </div>
            <div className="bg-white p-6 md:p-9 rounded-3xl">
              <h2 className="text-xl mb-6">
                {tab === "settings"
                  ? "Website details"
                  : current.id
                    ? "Edit record"
                    : "New record"}
              </h2>
              <form onSubmit={save} className="space-y-4">
                {(defs[tab] || []).map((k) => (
                  <label key={k} className="block text-sm capitalize">
                    {k.replaceAll("_", " ")}
                    {["description", "body", "quote", "opening_hours"].includes(
                      k,
                    ) ? (
                      <textarea
                        className="field mt-2"
                        rows="4"
                        value={current[k] || ""}
                        onChange={(e) =>
                          setCurrent({ ...current, [k]: e.target.value })
                        }
                      />
                    ) : (
                      <input
                        className="field mt-2"
                        value={current[k] ?? ""}
                        type={k === "sort_order" ? "number" : "text"}
                        onChange={(e) =>
                          setCurrent({ ...current, [k]: e.target.value })
                        }
                      />
                    )}
                  </label>
                ))}
                <div className="flex gap-3 flex-wrap">
                  <button className="btn">Save changes</button>
                  {current.id && (
                    <button
                      type="button"
                      className="btn-outline text-red-700"
                      onClick={() => remove(current.id)}
                    >
                      Delete record
                    </button>
                  )}
                </div>
              </form>
              <div className="mt-10 border-t pt-6">
                <h3 className="font-semibold mb-3">Upload an image or video</h3>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,video/mp4,video/webm"
                  onChange={(e) => setFile(e.target.files?.[0])}
                />
                <button className="btn-outline mt-4" onClick={upload}>
                  Upload & copy URL
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
