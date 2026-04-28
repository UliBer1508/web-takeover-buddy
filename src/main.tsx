import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n";

// --- PWA / Service Worker ---------------------------------------------------
// Wir registrieren den Service Worker NUR im Production-Build und nur wenn die
// App nicht in einem Iframe oder auf einem Lovable-Preview-Host läuft. In der
// Lovable-Editor-Preview würde ein SW Dev-Module cachen und zu weißem
// Bildschirm / 404 führen. In allen anderen Fällen melden wir vorhandene SWs ab
// und löschen die Caches, damit keine Altlasten zurückbleiben.
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
  hostname.includes("lovable.app") === false && hostname.includes("lovable.dev");

const canUseSW = typeof navigator !== "undefined" && "serviceWorker" in navigator;

if (canUseSW) {
  if (import.meta.env.PROD && !isInIframe && !isPreviewHost) {
    // Production + echter Browser-Tab: PWA aktivieren.
    import("virtual:pwa-register")
      .then(({ registerSW }) => {
        registerSW({ immediate: true });
      })
      .catch(() => {
        /* virtuelles Modul nicht vorhanden (z. B. PWA in Dev disabled) */
      });
  } else {
    // Dev / Preview / Iframe: alle alten Service Worker abmelden + Caches leeren.
    navigator.serviceWorker
      .getRegistrations()
      .then((regs) => {
        const hadAny = regs.length > 0;
        regs.forEach((r) => r.unregister());
        if (hadAny && typeof window !== "undefined" && "caches" in window) {
          caches
            .keys()
            .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
            .finally(() => window.location.reload());
        }
      })
      .catch(() => {
        /* ignore */
      });
  }
}

createRoot(document.getElementById("root")!).render(<App />);
