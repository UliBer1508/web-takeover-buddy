## Ziel
Unter dem Satz „Tipps und offizielle Quellen rund um die Region – von Radwegen bis Kultur." (Tab „Infos" der Galerie) einen emotionalen Werbetext einfügen, der die Vorzüge der Region Pinzgau betont und Gäste zur Buchung des Chalets motiviert.

## Inhalt des Werbetexts (DE)
**Überschrift:** „Warum Ihr nächster Urlaub ins Pinzgau führen sollte"

**Fließtext (kurz, emotional, 3–4 Sätze):**
„Zwischen den Gipfeln der Hohen Tauern, glasklaren Bergbächen und sonnigen Almen erwartet Sie eine der schönsten Regionen Österreichs. Ob entspanntes Radeln am Tauernradweg, Wanderungen zu bewirtschafteten Almen, der Donnergesang der Krimmler Wasserfälle oder Skitage am Wildkogel – im Pinzgau findet jeder seinen Lieblingsmoment. Unten finden Sie eine Auswahl unserer persönlichen Empfehlungen rund um Touren, Natur und Kultur. Lassen Sie sich inspirieren – und buchen Sie Ihren Aufenthalt in unserem Chalet als Ausgangspunkt für all diese Erlebnisse."

**Call-to-Action-Button:** „Jetzt anfragen" → scrollt zu `#booking` (oder zur bestehenden Buchungssektion).

## Inhalt EN (Spiegelung)
**Heading:** „Why your next holiday belongs in the Pinzgau"

**Body:** „Between the peaks of the Hohe Tauern, crystal-clear mountain streams and sun-drenched alpine pastures lies one of Austria's most beautiful regions. Whether it's easy cycling along the Tauern Cycle Path, hikes to welcoming alpine huts, the thunder of the Krimml Waterfalls or ski days on the Wildkogel – the Pinzgau has a favourite moment for everyone. Below you'll find a curated selection of our personal recommendations on tours, nature and culture. Get inspired – and book your stay at our chalet as the perfect base for all these experiences."

**CTA:** „Book now"

## Technische Umsetzung
1. **i18n-Strings** in `src/i18n/locales/de.json` und `src/i18n/locales/en.json` unter `infoGallery` ergänzen:
   - `pitch.heading`, `pitch.body`, `pitch.cta`
2. **`src/components/InfoGallery.tsx`** anpassen: Direkt nach dem bestehenden Subtitle-Block (Zeile 23–25) eine neue, designkonforme Card einfügen:
   - Container mit `bg-card/60`, `border`, `rounded-2xl`, dezentem Schatten, max-w-3xl, zentriert
   - Headline in `text-2xl font-bold`, Body in `text-muted-foreground leading-relaxed`
   - CTA-Button (`variant="default"`) mit Anker-Link auf `#booking`
   - Nutzt ausschließlich Design-Tokens (kein hartkodiertes Farb-Styling)
3. **Sprachumschaltung** über bestehenden `useTranslation`-Hook.

## Was unverändert bleibt
- Topic-Tabs, Grid, Dialog, Routen, restliche Inhalte
- Bestehender Subtitle-Text
