import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n";

// --- PWA / Service Worker ---------------------------------------------------
// Registrieren NUR im Production-Build und nur wenn die App nicht in einem
// Iframe oder auf einer Lovable-Preview-/Editor-Domain läuft. In allen anderen
// Fällen vorhandene SWs stillschweigend abmelden + Caches löschen — KEIN
// automatischer reload (würde im Iframe einen Endlos-Loop erzeugen).
const isInIframe = (() => {
  try {
    return typeof window !== "undefined" && window.self !== window.top;
  } catch {
    return true;
  }
})();

const hostname = typeof window !== "undefined" ? window.location.hostname : "";
const isPreviewHost =
  hostname.includes("id-preview--") ||
  hostname.includes("lovableproject.com") ||
  hostname.includes("lovable.app") ||
  hostname.includes("lovable.dev");

if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
  if (import.meta.env.PROD && !isInIframe && !isPreviewHost) {
    import("virtual:pwa-register")
      .then(({ registerSW }) => {
        registerSW({ immediate: true });
      })
      .catch(() => {
        /* PWA virtuelles Modul nicht vorhanden */
      });
  } else {
    navigator.serviceWorker
      .getRegistrations()
      .then((regs) => regs.forEach((r) => r.unregister()))
      .catch(() => {});
    if (typeof window !== "undefined" && "caches" in window) {
      caches
        .keys()
        .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
        .catch(() => {});
    }
  }
}

createRoot(document.getElementById("root")!).render(<App />);
