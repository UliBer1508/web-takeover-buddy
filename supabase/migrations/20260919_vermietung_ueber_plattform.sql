-- Vermietung über Plattform (z. B. Belvilla) statt Direktbuchung
-- Im SQL-Editor von wlmdjljyzdwvpqefwdmy ausführen, BEVOR der Code hochgeladen wird.
--
-- Je Haus gibt es jetzt zwei Schalter:
--   houses.is_active       = auf der Website sichtbar (bestehend)
--   houses.direct_booking  = direkt über die Website buchbar (neu)
-- Ist direct_booking aus, zeigt die Website für dieses Haus:
--   - den Kalender (Belegung aus der Hausverwaltung) wie bisher
--   - KEINE Preise (weder "ab … €" noch Preisliste/Gebühren)
--   - statt des Anfrageformulars den Hinweis aus house_booking_info
-- Text, Hauptlink und Plattformliste werden im Admin unter "Vermietung" gepflegt.

-- 1) Schalter -----------------------------------------------------------------
alter table public.houses
  add column if not exists direct_booking boolean not null default true;

-- 2) Hinweis und Plattformen je Haus -------------------------------------------
create table if not exists public.house_booking_info (
  house_id     uuid primary key references public.houses(id) on delete cascade,
  title_de     text,
  title_en     text,
  text_de      text,
  text_en      text,
  main_label   text,          -- Beschriftung des Knopfs, z. B. "Belvilla"
  main_url     text,          -- Ziel des Knopfs
  platforms    jsonb not null default '[]'::jsonb,  -- [{ "name": "...", "url": "..." | null }]
  updated_at   timestamptz not null default now()
);

alter table public.house_booking_info enable row level security;

-- Lesen nur für sichtbare Häuser (wie house_directions); Admins alles.
drop policy if exists "oeffentlich lesen" on public.house_booking_info;
create policy "oeffentlich lesen" on public.house_booking_info
  for select to anon, authenticated
  using (exists (select 1 from public.houses h where h.id = house_id and h.is_active));

drop policy if exists "admins lesen alles" on public.house_booking_info;
create policy "admins lesen alles" on public.house_booking_info
  for select to authenticated using (public.is_admin());

drop policy if exists "admins verwalten" on public.house_booking_info;
create policy "admins verwalten" on public.house_booking_info
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- 3) Wald Chalet: über Belvilla ------------------------------------------------
-- Erkannt über die Kalender-ID der Hausverwaltung (stabil, anders als Name/Slug).
-- Belvilla-Objekt 100015656. Links nur, wo die Zuordnung gesichert ist
-- (Belvilla, Vrbo, Traum-Ferienwohnungen); übrige Plattformen als Name.
update public.houses
set direct_booking = false
where external_house_id = 'a2b4d1f7-f396-40a5-b83f-174ccafa55fd';

insert into public.house_booking_info (
  house_id, title_de, title_en, text_de, text_en, main_label, main_url, platforms
)
select
  h.id,
  'Dieses Chalet wird über Belvilla vermietet',
  'This chalet is rented out via Belvilla',
  'Sie können es bei Belvilla und auf deren Partnerportalen buchen.',
  'You can book it on Belvilla and on their partner platforms.',
  'Belvilla',
  'https://www.belvilla.de/at/100015656/',
  '[
    {"name": "Belvilla", "url": "https://www.belvilla.de/at/100015656/"},
    {"name": "Vrbo", "url": "https://www.vrbo.com/8842832ha"},
    {"name": "Traum-Ferienwohnungen", "url": "https://www.traum-ferienwohnungen.de/240927/"},
    {"name": "Airbnb", "url": null},
    {"name": "Booking.com", "url": null},
    {"name": "Expedia", "url": null},
    {"name": "HomeToGo", "url": null},
    {"name": "TripAdvisor", "url": null},
    {"name": "Holidu", "url": null},
    {"name": "CHECK24", "url": null},
    {"name": "Casamundo", "url": null},
    {"name": "Trivago", "url": null},
    {"name": "Agoda", "url": null},
    {"name": "TUI", "url": null},
    {"name": "DER", "url": null},
    {"name": "Dogs Included", "url": null},
    {"name": "Cofman", "url": null},
    {"name": "DanCenter", "url": null},
    {"name": "Fejo", "url": null},
    {"name": "Campaya", "url": null},
    {"name": "D-Reizen", "url": null},
    {"name": "Locasun", "url": null},
    {"name": "Feline", "url": null},
    {"name": "BestFewo", "url": null},
    {"name": "Colorline", "url": null}
  ]'::jsonb
from public.houses h
where h.external_house_id = 'a2b4d1f7-f396-40a5-b83f-174ccafa55fd'
on conflict (house_id) do nothing;

-- Kontrolle: Venediger direkt buchbar, Wald über Belvilla mit 25 Plattformen
select h.name, h.is_active, h.direct_booking,
       i.main_label, jsonb_array_length(coalesce(i.platforms, '[]'::jsonb)) as plattformen
from public.houses h
left join public.house_booking_info i on i.house_id = h.id
order by h.sort_order;
