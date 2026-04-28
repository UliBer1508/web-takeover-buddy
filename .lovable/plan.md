Ich habe die Preview geprüft: Die Seite bleibt weiß, obwohl der Dev-Server läuft. In der Browser-Konsole erscheinen 404-Fehler auf einzelne Vite-Module/Assets und ein fehlgeschlagener Vite-WebSocket. Das deutet auf eine instabile/zu schwere Dev-Preview-Auslieferung nach den vielen direkten Bild-Imports hin. Lokal sind die Dateien vorhanden, aber die Preview lädt sie teils nicht zuverlässig.

Plan zur Behebung:

1. Start-Bundle deutlich entlasten
   - `InfoGallery` aus `Gallery.tsx` lazy laden, damit die ganzen Ski-/Kultur-/Rad-/Wander-Artikel samt Bildern nicht direkt beim Seitenstart geladen werden.
   - Die Info-Galerie erst importieren, wenn der Nutzer auf den Info-/Region-Tab klickt.
   - Einen kleinen Ladezustand anzeigen, statt die ganze Startseite zu blockieren.

2. Admin-/Dialog-Komponenten lazy laden
   - Große Dialoge wie Upload, Bildbearbeitung, Haus-/Promotion-Einstellungen und Review-Dialoge nur laden, wenn sie wirklich geöffnet werden.
   - Dadurch werden unnötige Imports wie `switch.tsx` und Admin-Formularcode nicht beim ersten Laden angefordert.

3. Bilder robuster einbinden
   - Für die neuen Info-Artikel prüfen, ob die direkten statischen Bild-Imports die Preview überladen.
   - Falls nötig: große Artikelbilder als öffentliche Asset-Pfade oder über lazy Datenmodule strukturieren, damit Vite nicht alle Bilder als JavaScript-Importmodule beim Start anfordert.
   - Optional die größten Bilder moderat komprimieren, ohne sichtbaren Qualitätsverlust.

4. Fehlende PWA-Assets korrigieren
   - `index.html`/PWA-Konfiguration referenziert `pwa-512x512.png`, das aktuell 404 liefert.
   - Entweder die fehlende Datei ergänzen oder die Referenz auf vorhandene Icons korrigieren.

5. Validierung
   - TypeScript-Prüfung erneut ausführen.
   - Preview neu laden und kontrollieren, dass die Startseite wieder sichtbar ist.
   - Danach prüfen, dass Galerie-Fotos und der Info-Tab mit den Ski-/Kultur-Karten weiterhin funktionieren.

Technische Details:
- Keine Datenbankänderung nötig.
- Ursache ist sehr wahrscheinlich nicht der Content selbst, sondern dass `Gallery.tsx` aktuell `InfoGallery` direkt importiert. Dadurch werden alle Artikel und sehr viele Bilder bereits beim App-Start in den Modulgraph gezogen.
- Das Entkoppeln per `React.lazy`/`Suspense` sollte die weiße Preview beheben und die Seite schneller starten lassen.