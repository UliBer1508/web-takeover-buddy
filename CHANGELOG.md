# Changelog

Alle wichtigen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt folgt [Semantic Versioning](https://semver.org/lang/de/).

## [1.0.0] - 2025-01-05

### Hinzugefügt
- **Verfügbarkeitskalender**: Interaktiver Kalender mit Buchungsübersicht
  - Check-in Tage (grün mit diagonalem Streifen)
  - Check-out Tage (rot mit diagonalem Streifen)
  - Wechseltage (rot mit grauem Streifen für Check-out + neuer Check-in)
  - Geblockte Tage (rot)
  - Verfügbare Tage (grün)
- **Haus-Auswahl**: Umschaltung zwischen mehreren Chalets
- **Admin-Bereich**: Verwaltung von Buchungen und Einstellungen
- **Bildergalerie**: Verwaltung und Anzeige von Hausbildern
- **Bewertungssystem**: Gästebewertungen mit Übersetzungsfunktion
- **Promotion-Banner**: Konfigurierbare Aktionsbanner
- **Mehrsprachigkeit**: Deutsch und Englisch (i18next)
- **PWA-Unterstützung**: Progressive Web App für mobile Nutzung
- **Versionsanzeige**: App-Version im Footer

### Technisch
- React 18 mit TypeScript
- Vite als Build-Tool
- Tailwind CSS für Styling
- shadcn/ui Komponenten
- Supabase Backend (Datenbank, Auth, Storage)
- Edge Functions für Übersetzungen

## [Unreleased]

### Geplant
- Tooltip für Kalendertage mit Details (Check-in/Check-out Zeiten)
- Buchungsstatistiken mit Wechseltag-Zählung
