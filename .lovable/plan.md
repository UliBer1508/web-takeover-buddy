## Ziel

Empfehlungen aus deiner Liste – speziell relevant für Gäste aus arabischen Ländern und Israel im Frühling/Sommer – in die bestehende Info-Galerie integrieren, mit **exakt derselben Artikel-Struktur** wie bisher (Cover, Kurzbeschreibung, Stats, Sections, offizieller Link).

## Was bereits existiert (nicht neu anlegen)

Kitzsteinhorn · Wildkogel (Gipfel/Alm) · Krimmler Wasserfälle · Nationalparkzentrum Mittersill · KitzSki Kitzbühel · Skigebiete (Zillertal, Saalbach, Hochkönig, Schmittenhöhe etc.)

## Neue Artikel (15)

Jeder mit DE/EN Titel, Subtitle, kurzer Beschreibung (2–3 Sätze), 4 Stats, 2 Sections (Erlebnis + Highlights-Bullets), Cover-Gradient, Lucide-Icon, **offiziellem externalUrl**.

**Berge & Panorama**
1. Großglockner Hochalpenstraße → grossglockner.at
2. Mooserboden Stauseen (Kaprun) → verbund.com / kaprun-hochgebirgsstauseen

**Wasser, Seen & Klammen**
3. Sigmund-Thun-Klamm Kaprun → kaprun.com
4. Liechtensteinklamm St. Johann → liechtensteinklamm.at
5. Zeller See (Bootsfahrten, Promenade) → zellamsee-kaprun.com
6. Hintersee Mittersill → nationalpark.at

**Familie**
7. Rutschenweg & Mountaincarts Wildkogel (kombiniert, da gleicher Berg) → wildkogel-arena.at
8. Wildpark Ferleiten → wildpark-ferleiten.at
9. Alpakawanderung Bramberg/Mittersill → z. B. alpaka-tour.at

**Wellness**
10. Tauern Spa Kaprun → tauernspa.at

**Premium**
11. Helikopterflug Hohe Tauern → heli-austria / alpine helicopter Anbieter
12. Bootstour / privates Boot Zeller See → schmittenhoehe / zellamsee-kaprun
13. Pferdekutschenfahrt Kitzbühel → kitzbuehel.com

**Städte & Kultur**
14. Salzburg Altstadt (Festung, Mirabell, Mozart) → salzburg.info
15. Zell am See Altstadt & Promenade → zellamsee-kaprun.com

## Topic-Filter erweitern

Die aktuellen 4 Tabs (Radfahren · Wandern · Ski · Kultur) reichen nicht. Erweiterung auf **8 Topics**:

```text
Alle · Radfahren · Wandern · Ski · Panorama · Wasser & Seen · Familie · Wellness & Spa · Premium · Kultur & Städte
```

- Neue Werte in `InfoTopic` (types.ts): `panorama`, `water`, `family`, `wellness`, `premium` (culture bleibt für Städte/Museen).
- `infoTopics` in `index.ts` um die neuen Tabs mit passenden Lucide-Icons erweitern (Mountain, Waves, Users, Sparkles, Crown).
- i18n-Keys `infoGallery.topics.*` in DE/EN ergänzen.
- Bestehende Artikel bleiben unverändert in ihrem aktuellen Topic.

## Bilder

Reale Fotos von Wikimedia Commons (CC BY-SA), wie bei bestehenden Artikeln (z. B. krimmler-wasserfaelle). Pro neuem Artikel 1 Cover + 1–2 Galerie-Bilder, gespeichert unter `src/assets/{topic}/`. Wo kein freies Foto verfügbar (z. B. Helikopter, Alpaka), nur Gradient + Icon-Cover wie bisher als Fallback erlaubt.

## Dateien

**Neu:**
- `src/content/info-articles/articles/grossglockner-hochalpenstrasse.ts`
- `…/mooserboden-stauseen.ts`
- `…/sigmund-thun-klamm.ts`
- `…/liechtensteinklamm.ts`
- `…/zeller-see.ts`
- `…/hintersee-mittersill.ts`
- `…/wildkogel-family-fun.ts` (Rutschenweg + Mountaincarts)
- `…/wildpark-ferleiten.ts`
- `…/alpakawanderung.ts`
- `…/tauern-spa.ts`
- `…/helikopterflug-hohe-tauern.ts`
- `…/bootstour-zeller-see.ts`
- `…/pferdekutsche-kitzbuehel.ts`
- `…/salzburg-altstadt.ts`
- `…/zell-am-see-altstadt.ts`
- jeweilige Bild-Assets unter `src/assets/`

**Geändert:**
- `src/content/info-articles/types.ts` – `InfoTopic` erweitert
- `src/content/info-articles/index.ts` – Imports + `infoTopics` erweitert
- `src/i18n/locales/de.json` / `en.json` – neue `topics.*` keys
- `public/llms.txt` – neue Routen unter „Region-Artikel" ergänzen
- `public/sitemap.xml` + `scripts/generate-sitemap.ts` – neue `/region/{id}` Einträge

## Hinweis zur Sprache

Die neuen Artikel werden – konsistent mit dem Rest der Seite – auf **DE/EN** gepflegt. Arabisch/Hebräisch ist aktuell im i18n-Schema nicht vorgesehen; das wäre ein separater, größerer Umbau (RTL-Layout, vollständige Übersetzungen aller Artikel). Falls gewünscht, machen wir das als eigenes Projekt.
