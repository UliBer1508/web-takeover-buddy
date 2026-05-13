## SEO-Review — Status

7 offene Findings vom letzten Scan. Google Search Console hängt am Republish (Verifizierungs-Tag liegt schon im Code). Restliche 6 lassen sich direkt im Code fixen.

## Was umgesetzt wird

**1. Sitemap mit allen Routen (mid)**
Aktuell enthält `public/sitemap.xml` nur `/`. Ich ersetze die statische Datei durch einen Generator `scripts/generate-sitemap.ts`, der bei `predev`/`prebuild` läuft und folgende Routen einträgt:
- `/`, `/galerie`, `/galerie/info`, `/region`
- `/region/{slug}` für alle 30 Artikel aus `src/content/info-articles`

`/gallery`, `/gallery/info`, `/admin`, `/*` bleiben raus (englische Duplikate, intern, catch-all).

**2. Social Previews — absolute og:image + per-Route OG-Tags (low)**
- `index.html`: og:image / twitter:image auf absolute URL (`https://steinbockchalets.com/pwa-512x512.png`) umstellen, og:url ergänzen.
- `RegionIndex` und `RegionArticle` setzen via Helmet bereits eigenen Title/Description — ich prüfe und ergänze fehlende `og:title` / `og:description` / `og:image` (Cover-Bild absolut) pro Route.

**3. Strukturierte Daten / JSON-LD (low)**
- `index.html`: `LodgingBusiness`-JSON-LD mit Name, Adresse (Bramberg am Wildkogel), Beschreibung, URL, Telefon (aus Booking-Daten), Bild.
- `RegionArticle`: pro Artikel ein `Article`-JSON-LD via Helmet (headline, description, image, author, datePublished falls vorhanden).

**4. /llms.txt (low)**
Neue Datei `public/llms.txt` mit H1 "Steinbock Chalet", Kurz­beschreibung und Link-Listen für Hauptseiten + Region-Übersicht + die wichtigsten Artikel.

**5. Lighthouse Performance — LCP-Hero (low)**
Im Hero-Bild (`src/components/Hero*` o.ä.) `loading="lazy"` entfernen, `fetchpriority="high"` und explizite `width`/`height` setzen. `font-display: swap` in allen `@font-face` Regeln in `index.css` sicherstellen.

**6. Lighthouse Accessibility — Kontrast (low)**
Helle `text-muted-foreground/50`, `text-gray-300/400` o.ä. auf hellem Background suchen und durch volle Design-Tokens (`text-muted-foreground`, `text-foreground`) ersetzen. Konkrete Stellen erst beim Umsetzen identifiziert.

**7. Google Search Console (mid)**
Nichts zu coden — Verifizierungs-Tag ist seit letztem Run in `index.html`. Nach Republish wird im nächsten Schritt verifiziert + Sitemap eingereicht. Bleibt als Pending bis publiziert.

## Technische Details

- Sitemap-Generator nutzt das `infoArticles`-Array (id = slug) — wenn Artikel hinzukommen, wird die Sitemap automatisch aktuell.
- `package.json` bekommt `predev` + `prebuild`-Scripts (`bunx tsx scripts/generate-sitemap.ts`).
- JSON-LD für Region-Artikel wird inline in der bestehenden `<Helmet>` der `RegionArticle.tsx` eingehängt.
- Findings 1–4 werden nach Code-Änderung als `fixed` markiert; #5/#6 ebenfalls (republish nötig); GSC bleibt offen.

## Was nicht angefasst wird

- Bestehende Helmet-Logik / Routing.
- Lovable Cloud-Setup, Auth, Booking, Realtime.
- Sprachen / i18n-Inhalte.
- Englische `/gallery*`-Routen (Duplikate ohne eigene UI).
