import { useEffect, useState } from "react";
import { get } from "../api";
import { useToast } from "../components/Toast";

export default function useCollection(key, { refreshOnFocus = false } = {}) {
  const [value, setValue] = useState(null);
  const notify = useToast();
  useEffect(() => {
    let active = true;
    let requestId = 0;
    const load = () => {
      const currentRequestId = ++requestId;
      get("/public/" + key, { cache: "no-store" })
        .then((r) => {
          if (!Array.isArray(r)) throw new Error("Invalid collection response");
          if (active && currentRequestId === requestId) setValue(r);
        })
        .catch((error) => {
          if (active && currentRequestId === requestId) {
            setValue([]);
            notify(error.message, "error");
          }
        });
    };

    load();
    if (refreshOnFocus) window.addEventListener("focus", load);
    return () => {
      active = false;
      if (refreshOnFocus) window.removeEventListener("focus", load);
    };
  }, [key, notify, refreshOnFocus]);
  return value;
}
