const ROOT = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");
const API_ORIGIN = new URL(
  ROOT,
  typeof window === "undefined" ? "http://localhost" : window.location.origin,
).origin;
let token = sessionStorage.getItem("height_token") || "";
let refreshRequest;

export function mediaUrl(url) {
  if (typeof url !== "string" || !url.startsWith("/uploads/")) return url;
  return new URL(url, API_ORIGIN).href;
}

export function setToken(v) {
  token = v || "";
  if (v) sessionStorage.setItem("height_token", v);
  else sessionStorage.removeItem("height_token");
}

async function readResponse(res) {
  const data = await res.json().catch(() => ({ error: "Invalid response" }));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

async function refreshAccessToken() {
  if (!refreshRequest) {
    refreshRequest = fetch(ROOT + "/auth/refresh", {
      method: "POST",
      credentials: "include",
    })
      .then(readResponse)
      .then((data) => {
        setToken(data.token);
        return data.token;
      })
      .finally(() => {
        refreshRequest = undefined;
      });
  }
  return refreshRequest;
}

async function send(path, opts, retry = true) {
  const headers = {
    ...(typeof FormData !== "undefined" && opts.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: "Bearer " + token } : {}),
    ...opts.headers,
  };
  const res = await fetch(ROOT + path, {
    ...opts,
    credentials: "include",
    headers,
  });
  if (
    retry &&
    res.status === 401 &&
    !["/auth/login", "/auth/refresh", "/auth/logout"].includes(path)
  ) {
    const data = await res.json().catch(() => ({ error: "Invalid response" }));
    if (data.code === "ACCESS_TOKEN_EXPIRED") {
      try {
        await refreshAccessToken();
      } catch {
        setToken("");
        window.dispatchEvent(new Event("height:auth-expired"));
        throw new Error("Admin session expired. Please sign in again.");
      }
      return send(path, opts, false);
    }
    throw new Error(data.error || "Request failed");
  }
  return readResponse(res);
}

export function api(path, opts = {}) {
  return send(path, opts);
}

export async function logoutSession() {
  setToken("");
  try {
    await send("/auth/logout", { method: "POST" }, false);
  } finally {
    setToken("");
  }
}

export const get = (p, opts = {}) => api(p, opts);
export const post = (p, body) =>
  api(p, { method: "POST", body: JSON.stringify(body) });
export const put = (p, body) =>
  api(p, { method: "PUT", body: JSON.stringify(body) });
export const del = (p) => api(p, { method: "DELETE" });
export const upload = (file) => {
  const form = new FormData();
  form.append("file", file);
  return api("/admin/upload", { method: "POST", body: form });
};
