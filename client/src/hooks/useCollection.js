import { useEffect, useState } from "react";
import { get } from "../api";
import { useToast } from "../components/Toast";

export default function useCollection(key) {
  const [value, setValue] = useState(null);
  const notify = useToast();
  useEffect(() => {
    let active = true;
    get("/public/" + key)
      .then((r) => {
        if (!Array.isArray(r)) throw new Error("Invalid collection response");
        if (active) setValue(r);
      })
      .catch((error) => {
        if (active) {
          setValue([]);
          notify(error.message, "error");
        }
      });
    return () => {
      active = false;
    };
  }, [key, notify]);
  return value;
}
