-- Hausdaten für jedes Haus in die Datenbank eintragen
--
-- Die Website liest Beschreibung, Highlights und Ausstattung nur noch aus der
-- Datenbank. Dieses Skript trägt für JEDES Haus die bisher angezeigten
-- allgemeinen Werte ein - danach werden sie pro Haus im Admin geändert.
--
-- Mehrfaches Ausführen ist unschädlich: Es wird nur dort eingetragen, wo ein
-- Haus noch nichts hat. Bereits geänderte Angaben bleiben unangetastet.

-- 1) Beschreibung (nur wo leer) ---------------------------------------------
update public.houses
set description =
  'Erleben Sie alpinen Luxus in seiner schönsten Form. Unser exklusives Chalet bietet Ihnen den perfekten Rückzugsort inmitten der majestätischen Bergwelt. Mit liebevoll gestalteten Räumen, modernster Ausstattung und einem atemberaubenden Panoramablick wird Ihr Aufenthalt zu einem unvergesslichen Erlebnis.'
  || E'\n\n' ||
  'Ob Winterurlaub auf der Piste oder Sommerfrische in den Bergen – das Steinbock Chalet ist Ihr idealer Ausgangspunkt für alpine Abenteuer und erholsame Stunden.'
where description is null or btrim(description) = '';

-- 2) Highlights (nur für Häuser ohne Highlights) -----------------------------
insert into public.house_features (house_id, section, icon, title, description, sort_order)
select h.id, 'highlight', v.icon, v.title, v.description, v.sort_order
from public.houses h
cross join (values
  ('mountain',  'Bergpanorama',     'Atemberaubender 360° Blick auf die Alpen',            0),
  ('sparkles',  'Luxusausstattung', 'Hochwertige Einrichtung und moderne Annehmlichkeiten', 1),
  ('snowflake', 'Wellness',         'Private Sauna und Entspannungsbereich',               2),
  ('heart',     'Wohlfühloase',     'Gemütliche Atmosphäre für unvergessliche Momente',    3)
) as v(icon, title, description, sort_order)
where not exists (
  select 1 from public.house_features f
  where f.house_id = h.id and f.section = 'highlight'
);

-- 3) Ausstattung (nur für Häuser ohne Ausstattung) ---------------------------
insert into public.house_features (house_id, section, icon, title, description, sort_order)
select h.id, 'feature', v.icon, v.title, v.description, v.sort_order
from public.houses h
cross join (values
  ('bed',     '3 Schlafzimmer',    'Komfortable Zimmer mit hochwertigen Matratzen und alpinem Charme',  0),
  ('kitchen', 'Gourmet-Küche',     'Vollausgestattete Küche mit Premium-Geräten und großem Essbereich', 1),
  ('sauna',   'Wellness & Sauna',  'Private Sauna und Entspannungsbereich für ultimative Erholung',     2),
  ('terrace', 'Terrasse & Garten', 'Weitläufige Außenbereiche mit Panoramablick auf die Berge',         3),
  ('wifi',    'High-Speed WLAN',   'Schnelles Internet im gesamten Chalet verfügbar',                   4),
  ('parking', 'Parkplätze',        'Private Parkplätze direkt am Chalet',                               5)
) as v(icon, title, description, sort_order)
where not exists (
  select 1 from public.house_features f
  where f.house_id = h.id and f.section = 'feature'
);

-- Kontrolle: pro Haus sollten jetzt 4 Highlights und 6 Ausstattungen stehen
select h.name, f.section, count(*) as anzahl
from public.houses h
join public.house_features f on f.house_id = h.id
group by h.name, f.section
order by h.name, f.section;
