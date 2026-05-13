## Ziel

Sobald eine neue Buchungsanfrage über das Formular in der Datenbank landet, bekommst du eine **kurze Hinweis-Email** an `uli.berresheim@hotmail.de` und `steinbockchalets@gmail.com`. Die Bearbeitung der Anfrage selbst passiert weiter wie gewohnt in deiner Hausverwaltungs-App — die Mail ist nur ein Erinnerungs-Ping ("schau in die App").

## Inhalt der Email (bewusst minimal)

```
Betreff: 🔔 Neue Buchungsanfrage – Steinbock Chalets

Es ist eine neue Buchungsanfrage eingegangen.

Gast:      Uli Berresheim
Zeitraum:  16.05.2026 – 23.05.2026 (7 Nächte)
Personen:  6 Erwachsene
Haus:      Venedigersiedlung Chalet

Bitte öffne deine Hausverwaltungs-App, 
um die Anfrage zu prüfen, zu bestätigen oder abzulehnen.
```

Nur Eckdaten — die volle Bearbeitung passiert in der App.

## Technischer Ansatz

Da du **keine eigene Domain** einrichten möchtest, nutze ich **Resend mit der kostenlosen Test-Adresse** `onboarding@resend.dev` als Absender. Das ist absolut ausreichend, weil die Mail nur an dich selbst geht — kein Gast sieht den Absender.

**Vorteile:**
- Keine DNS-Einträge, keine Domain-Verifizierung.
- In wenigen Minuten einsatzbereit.
- 3.000 Mails/Monat kostenlos (mehr als ausreichend).

## Was du tun musst

1. Kostenlosen Account anlegen unter **resend.com**.
2. Im Resend-Dashboard unter **API Keys → Create API Key** einen Schlüssel erstellen.
3. Den Schlüssel im sicheren Eingabe-Dialog einfügen, den ich dir nach deiner Freigabe zeige (ich sehe ihn nicht, er wird verschlüsselt gespeichert).

## Umsetzung (nach deiner Freigabe)

1. **Backend-Funktion** `notify-booking-inquiry`:
   - Empfängt die wichtigsten Anfrage-Daten (Name, Zeitraum, Nächte, Personen, Haus).
   - Sendet die Hinweis-Mail an beide Adressen via Resend.
   - Setzt `Reply-To` auf die Email-Adresse des Gastes — du kannst direkt aus der Mail antworten.
   - Schlägt der Versand fehl, wird das geloggt; die Anfrage selbst bleibt aber wie gewohnt in der DB.

2. **Buchungsformular** (`src/components/BookingForm.tsx`):
   - Direkt nach erfolgreichem Speichern der Anfrage in der externen Datenbank (`usblrulkcgucxtkhugck`) wird die Funktion aufgerufen.
   - Falls die Mail mal nicht durchgeht, bekommt der Gast trotzdem die Erfolgsmeldung — Datenintegrität geht vor Benachrichtigung.
   - Doppelter Versand wird über die Anfrage-ID verhindert (kein Doppel-Ping bei Doppelklick).

## Was sich nicht ändert

- Die Speicherung in der externen DB bleibt 1:1 wie bisher.
- Die Hausverwaltungs-App empfängt die Anfrage weiterhin gleich.
- Validierung, Preisberechnung und Erfolgsdialog im Formular bleiben unverändert.

## Test

Nach der Einrichtung schicken wir gemeinsam eine Test-Anfrage. Du solltest binnen Sekunden die Hinweis-Mail in beiden Postfächern (Hotmail + Gmail) sehen.

Soll ich so loslegen?
