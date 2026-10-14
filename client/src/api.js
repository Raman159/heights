const ROOT = import.meta.env.VITE_API_URL || "/api";
let token = sessionStorage.getItem("height_token") || "";
export function setToken(v) {
  token = v || "";
  if (v) sessionStorage.setItem("height_token", v);
  else sessionStorage.removeItem("height_token");
}
export async function api(path, opts = {}) {
  const res = await fetch(ROOT + path, {
    ...opts,
    headers: {
      ...(opts.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: "Bearer " + token } : {}),
      ...opts.headers,
    },
  });
  let data = await res.json().catch(() => ({ error: "Invalid response" }));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}
export const get = (p) => api(p);
export const post = (p, body) =>
  api(p, { method: "POST", body: JSON.stringify(body) });
export const put = (p, body) =>
  api(p, { method: "PUT", body: JSON.stringify(body) });
export const del = (p) => api(p, { method: "DELETE" });
