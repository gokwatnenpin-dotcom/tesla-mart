import { createContext, useContext, useState, useCallback } from "react";
import { Icons } from "../components/Icons";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success", duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
      );
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 320);
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type} ${t.leaving ? "leaving" : ""}`}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              {t.type === "success" && <Icons.Check size={16} />}
              {t.type === "error"   && <Icons.Close size={16} />}
              {t.type === "info"    && <Icons.Info size={16} />}
              {t.message}
            </span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
