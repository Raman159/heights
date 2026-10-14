import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [notification, setNotification] = useState(null);
  const timeout = useRef(null);

  const notify = useCallback((message, type = "success") => {
    if (!message) return;
    setNotification({ message, type });
    window.clearTimeout(timeout.current);
    timeout.current = window.setTimeout(() => setNotification(null), 5000);
  }, []);

  const dismiss = () => {
    window.clearTimeout(timeout.current);
    setNotification(null);
  };

  useEffect(
    () => () => window.clearTimeout(timeout.current),
    [],
  );

  return (
    <ToastContext.Provider value={notify}>
      {children}
      {notification && (
        <div
          role={notification.type === "error" ? "alert" : "status"}
          aria-live={notification.type === "error" ? "assertive" : "polite"}
          className={
            "fixed right-4 top-24 z-[100] flex w-[calc(100vw-2rem)] max-w-sm items-start gap-4 rounded-2xl px-5 py-4 text-sm text-white shadow-xl " +
            (notification.type === "error" ? "bg-red-800" : "bg-ink")
          }
        >
          <span className="min-w-0 flex-1 break-words">
            {notification.message}
          </span>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss notification"
            className="shrink-0 text-xl leading-4 opacity-80 hover:opacity-100"
          >
            ×
          </button>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const notify = useContext(ToastContext);
  if (!notify) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return notify;
}
