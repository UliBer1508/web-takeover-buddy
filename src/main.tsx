import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n";

// In Dev: alte Service Worker (z. B. aus früheren Preview-Builds) abmelden,
// damit sie nicht versuchen, Dev-Module aus dem Cache zu liefern → weißer Bildschirm.
if (import.meta.env.DEV && typeof navigator !== "undefined" && "serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    const hadAny = regs.length > 0;
    regs.forEach((r) => r.unregister());
    if (hadAny && typeof window !== "undefined" && "caches" in window) {
      caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)))
        .finally(() => window.location.reload());
    }
  }).catch(() => { /* ignore */ });
}

createRoot(document.getElementById("root")!).render(<App />);
