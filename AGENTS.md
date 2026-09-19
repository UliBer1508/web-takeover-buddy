# AGENTS.md — Pflicht vor jeder Arbeit an diesem Repo

Dieses Repo ist die öffentliche Website **steinbockchalets.com**.

**Bevor irgendetwas geändert, vorgeschlagen oder behauptet wird, in dieser
Reihenfolge lesen:**

1. `docs/WEBSITE-MASTER.md` — Infrastruktur, welche Datenbank, Datenmodell,
   Seitenaufbau, Admin, Regeln, offene Punkte
2. Die Session-Dokumente in `docs/` (neueste zuerst), insbesondere
   `docs/Session-2026-09-19-Hausinhalte-aus-Datenbank.md` und
   `docs/Session-2026-09-18-Datenbank-Umzug-und-zwei-Haeuser.md`
3. Für das Gesamtsystem: `hausmanagement-selfhosted/docs/PROJEKT-REGELN.md`,
   `ARBEITSWEISE-CLAUDE-LESSONS.md` und
   `Steinbock-Chalets-Gesamtdokumentation-MASTER.md`

## Kurzfassung der Regeln

- **Website-Datenbank = Supabase `wlmdjljyzdwvpqefwdmy`** (Konto
  steinbockchalets@gmail.com). Kalender und Anfragen zusätzlich in der
  Hausverwaltung `usblrulkcgucxtkhugck`. `xcohqbdgzprkixeycdhk` ist stillgelegt.
- **Keine Hausinhalte im Code.** Beschreibung, Highlights, Ausstattung,
  Kennzahlen kommen je Haus aus der Datenbank. Fehlt ein Wert, Block weglassen —
  keine festen Rückfalltexte, keine Sonderbehandlung einzelner Häuser.
- **Erst SQL, dann Code.** Jeder Commit auf `main` geht sofort live.
  Zusammengehörige Dateien in einem Commit.
- **Build wirklich prüfen:** `npx vite build` und
  `npx tsc --noEmit -p tsconfig.app.json` (Fehlerzahl vor/nach vergleichen,
  siehe WEBSITE-MASTER 8).
- **Doku im selben Schritt pflegen:** `docs/WEBSITE-MASTER.md` aktualisieren
  und ein Session-Dokument `docs/Session-JJJJ-MM-TT-<Thema>.md` anlegen.
