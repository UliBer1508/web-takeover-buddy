-- Alle Hausinhalte zweisprachig (Deutsch / Englisch)
-- Im SQL-Editor von wlmdjljyzdwvpqefwdmy ausführen, BEVOR der Code hochgeladen wird.
--
-- Bisher gab es Beschreibung, Kurztext, Merkmale, Highlights und Ausstattung
-- nur einmal (deutsch). Ab jetzt je eine englische Spalte daneben. Ist ein
-- englisches Feld leer, zeigt die englische Seite den deutschen Text.
-- Anfahrt, Vermietungshinweis, Bildtitel, Aktionen und Bewertungen waren
-- bereits zweisprachig und bleiben unverändert.

-- 1) Spalten -------------------------------------------------------------------
alter table public.houses add column if not exists short_description_en text;
alter table public.houses add column if not exists description_en       text;
alter table public.houses add column if not exists highlights_en        text[];

alter table public.house_features add column if not exists title_en       text;
alter table public.house_features add column if not exists description_en text;

-- 2) Startwerte: englische Fassung der bekannten Texte (nur wo noch leer) ---------

-- Beschreibung (die beiden Standard-Absätze vom 19.09.2026)
update public.houses
set description_en =
  'Experience alpine luxury at its finest. Our exclusive chalet offers you the perfect retreat amid the majestic mountains. With lovingly designed rooms, state-of-the-art amenities and a breathtaking panoramic view, your stay becomes an unforgettable experience.'
  || E'\n\n' ||
  'Whether a winter holiday on the slopes or a summer retreat in the mountains – the Steinbock Chalet is your ideal base for alpine adventures and relaxing hours.'
where description_en is null
  and description like 'Erleben Sie alpinen Luxus in seiner schönsten Form.%';

-- Merkmale auf der Hauskarte (Wort für Wort, unbekannte bleiben deutsch)
update public.houses h
set highlights_en = (
  select array_agg(
    case m
      when 'Private Sauna'    then 'Private sauna'
      when 'Kaminofen'        then 'Wood-burning stove'
      when 'Panoramaterrasse' then 'Panoramic terrace'
      when 'Gletscherblick'   then 'Glacier view'
      when 'Sauna'            then 'Sauna'
      when 'Kamin'            then 'Fireplace'
      when 'Garten'           then 'Garden'
      when 'Balkon'           then 'Balcony'
      else m
    end order by ord)
  from unnest(h.highlights) with ordinality as t(m, ord)
)
where h.highlights_en is null and h.highlights is not null;

-- Highlights und Ausstattung
update public.house_features f
set title_en = v.title_en, description_en = v.description_en
from (values
  ('Bergpanorama',      'Mountain panorama',   'Breathtaking 360° view of the Alps'),
  ('Luxusausstattung',  'Luxury amenities',    'High-quality furnishings and modern comforts'),
  ('Wellness',          'Wellness',            'Private sauna and relaxation area'),
  ('Wohlfühloase',      'Feel-good retreat',   'Cosy atmosphere for unforgettable moments'),
  ('3 Schlafzimmer',    '3 bedrooms',          'Comfortable rooms with high-quality mattresses and alpine charm'),
  ('Gourmet-Küche',     'Gourmet kitchen',     'Fully equipped kitchen with premium appliances and a large dining area'),
  ('Wellness & Sauna',  'Wellness & sauna',    'Private sauna and relaxation area for ultimate recovery'),
  ('Terrasse & Garten', 'Terrace & garden',    'Spacious outdoor areas with panoramic mountain views'),
  ('High-Speed WLAN',   'High-speed Wi-Fi',    'Fast internet throughout the chalet'),
  ('Parkplätze',        'Parking',             'Private parking spaces right at the chalet'),
  ('Private Sauna',     'Private sauna',       null),
  ('Kaminofen',         'Wood-burning stove',  null),
  ('Panoramaterrasse',  'Panoramic terrace',   null),
  ('Gletscherblick',    'Glacier view',        null)
) as v(title_de, title_en, description_en)
where f.title = v.title_de
  and f.title_en is null;

-- Kontrolle: was hat noch keine englische Fassung?
select 'haus' as art, h.name as haus, 'Beschreibung' as feld
from public.houses h where h.description is not null and h.description_en is null
union all
select 'haus', h.name, 'Kurztext'
from public.houses h where h.short_description is not null and h.short_description_en is null
union all
select f.section, h.name, f.title
from public.house_features f join public.houses h on h.id = f.house_id
where f.title_en is null
order by 2, 1, 3;
