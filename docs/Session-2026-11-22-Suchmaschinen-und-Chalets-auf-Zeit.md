# Session 22.11.2026 — Suchmaschinen und Seite „Chalets auf Zeit“

## Anlass
Die Website sollte im Internet gefunden werden, vor allem das Venediger Chalet als Langzeitmiete.
Budget knapp: nur kostenlose Maßnahmen.

## Befund
- Google Search Console war schon eingerichtet (Konto Uli, Eigenschaft `https://steinbockchalets.com/`),
  Sitemap eingereicht (53 URLs). Aber: **1 Seite indexiert, 53 nicht**.
- Ursache: Vercel lieferte für jede Unterseite HTTP **404** (`x-vercel-error: NOT_FOUND`), nur `/` gab 200.
  Im Browser sah alles richtig aus (React-Router), Google glaubte dem 404. Es fehlte `vercel.json`.

## Änderungen
1. **`vercel.json`** (Hauptverzeichnis): Rewrite `/(.*)` → `/index.html`. Dateien (sitemap.xml,
   robots.txt, Bilder) werden weiter direkt ausgeliefert. Geprüft: alle Unterseiten jetzt 200.
2. **Search Console:** Indexierung beantragt für `/galerie`, `/anfahrt`, `/region`.
3. **Bing Webmaster Tools:** Import aus Search Console fand keine Seite → manuell hinzugefügt,
   bestätigt über `public/BingSiteAuth.xml`, Sitemap eingereicht. (Bing beliefert auch DuckDuckGo,
   Ecosia, ChatGPT-Suche.)
4. **Google Unternehmensprofil: verworfen** — Ferienhäuser/Mietobjekte sind laut Google-Richtlinien
   nicht zulässig; Risiko Kontosperre.
5. **Neue Seite `/chalets-auf-zeit`** (`src/pages/ChaletsAufZeit.tsx`, Alias `/long-stay-chalets`):
   eigene Adresse, eigener Titel/Beschreibung für Google, Sitemap-Eintrag, Menüpunkt. Details:
   WEBSITE-MASTER 5f.
6. Link auf die Website in der ImmoScout24-Beschreibung (von Uli eingetragen).

## Geänderte Dateien
`vercel.json` (neu, bereits hochgeladen), `public/BingSiteAuth.xml` (neu, bereits hochgeladen),
`src/pages/ChaletsAufZeit.tsx` (neu), `src/App.tsx`, `src/components/Navigation.tsx`,
`src/i18n/locales/de.json`, `src/i18n/locales/en.json`, `public/sitemap.xml`,
`docs/WEBSITE-MASTER.md`, dieses Dokument. Kein SQL.

## Prüfung
`npx vite build` ok; `tsc` 10 Fehler vorher/nachher (bekannte veraltete Typen, WEBSITE-MASTER 8).

## Nach dem Hochladen
- `https://steinbockchalets.com/chalets-auf-zeit` öffnen und prüfen.
- Search Console: URL-Prüfung `/chalets-auf-zeit` → Indexierung beantragen.
- Link `steinbockchalets.com/chalets-auf-zeit` in ImmoScout24/HousingAnywhere verwenden.
- In ca. 1 Woche: Search Console → Seiten (Zahl indexierter Seiten), Bing → Sitemaps.
