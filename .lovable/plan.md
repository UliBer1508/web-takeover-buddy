## Problem

Die Editor-Preview zeigt nichts an. Der Vite-Dev-Server läuft sauber (Logs zeigen `ready in 591 ms` und HMR-Updates), aber der Browser bekommt 502 vom Preview-Host. Mehrere zusammenwirkende Ursachen:

1. **`index.html` referenziert `/manifest.webmanifest`**, aber die Datei existiert im Dev-Modus nicht (PWA-Plugin ist `disable: mode !== "production"`). Das erzeugt eine 404 bei jedem Page-Load und kann in Kombination mit dem Reload-Loop unten den Editor in eine Endlosschleife schicken.
2. **`src/main.tsx` führt einen `window.location.reload()`-Loop aus**, sobald irgendein Service Worker oder ein Cache-Eintrag vorhanden ist. In der Lovable-Iframe-Preview kann das bei jedem Reload erneut auslösen → weißer Screen / 502, weil der Iframe nie zur Ruhe kommt.
3. **`isPreviewHost`-Logik ist fehlerhaft**: `hostname.includes("lovable.app") === false && hostname.includes("lovable.dev")` — falsche Operator-Präzedenz; auf der `lovable.app`-Preview-Domain wird der SW dort fälschlich als „kein Preview" eingestuft.
4. **`tailwind.config.ts` hat einen doppelten `colors`-Key** (Zeile 16 und Zeile 66). Esbuild gibt eine Warnung aus, der zweite Block überschreibt den ersten — funktional ok, aber unnötig und potentiell verwirrend.

## Lösung

### 1. `index.html`
- `<link rel="manifest" href="/manifest.webmanifest" />` entfernen. Das PWA-Plugin injiziert das Manifest im Production-Build automatisch über `injectRegister`/`includeAssets`. Im Dev-Mode existiert die Datei nicht und produziert nur 404.

### 2. `src/main.tsx` — defensiver SW-Cleanup ohne Reload-Loop
- Den automatischen `window.location.reload()` entfernen. Stattdessen nur stillschweigend SW abmelden + Caches löschen. Der nächste echte Page-Load übernimmt dann den sauberen Zustand.
- `isPreviewHost`-Check vereinfachen: `lovableproject.com`, `lovable.app`, `lovable.dev`, `id-preview--` allesamt als Preview behandeln.
- Außerdem `if (window.top !== window.self)` (Iframe) immer als Preview behandeln — egal welcher Host.

### 3. `tailwind.config.ts`
- Den zweiten, duplizierten `colors`-Block (Zeilen ~66 bis zum Ende des Blocks) entfernen. Sicherstellen, dass alle dort definierten Farben bereits im ersten Block stehen (sind sie laut Inspektion).

### 4. Verifikation
- Nach den Änderungen: kurz checken, dass `tail /tmp/dev-server-logs/dev-server.log` keine Duplicate-Key-Warnung mehr zeigt und die Preview wieder lädt.

## Technische Details

**`src/main.tsx` (vereinfacht):**
```ts
const isInIframe = (() => { try { return window.self !== window.top; } catch { return true; } })();
const h = window.location.hostname;
const isPreviewHost =
  h.includes("id-preview--") ||
  h.includes("lovableproject.com") ||
  h.includes("lovable.app") ||
  h.includes("lovable.dev");

if ("serviceWorker" in navigator) {
  if (import.meta.env.PROD && !isInIframe && !isPreviewHost) {
    import("virtual:pwa-register").then(({ registerSW }) => registerSW({ immediate: true })).catch(() => {});
  } else {
    navigator.serviceWorker.getRegistrations()
      .then((regs) => regs.forEach((r) => r.unregister()))
      .catch(() => {});
    if ("caches" in window) {
      caches.keys().then((keys) => keys.forEach((k) => caches.delete(k))).catch(() => {});
    }
    // KEIN reload — würde Iframe-Loop erzeugen.
  }
}
```

**Geänderte Dateien:**
- `index.html` — Manifest-Link entfernen
- `src/main.tsx` — Reload-Loop entfernen, Preview-Detection korrigieren
- `tailwind.config.ts` — duplizierten `colors`-Block entfernen

PWA in Production bleibt voll funktionsfähig (Manifest wird vom Plugin generiert, SW registriert sich nur im echten Browser-Tab auf der Production-Domain).