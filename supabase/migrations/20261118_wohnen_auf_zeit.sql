-- Wohnen auf Zeit (Langzeitvermietung ab 6 Monaten) — Schritt 1 + 2
-- Im SQL-Editor von wlmdjljyzdwvpqefwdmy ausführen, BEVOR der Code hochgeladen wird.
-- Das Skript darf mehrfach laufen (if not exists / on conflict do nothing).
--
-- Je Haus zwei Vermietungsarten, frei kombinierbar:
--   houses.offer_short_term  = Urlaub / kurzzeitig (bisheriges Verhalten; "direkt buchbar"
--                              bzw. Plattform-Hinweis gilt nur hierfür)
--   houses.offer_long_term   = Wohnen auf Zeit (ab 6 Monaten, Anmeldung bei der Gemeinde)
--
-- WICHTIG: Für Wohnen auf Zeit stehen KEINE Preise in der Datenbank, die Gäste lesen
-- können. Preise und Konditionen bekommt ein Interessent erst nach der Besichtigung
-- (Schritt 3: interne Kalkulation + persönliches Angebot).

-- 1) Vermietungsarten je Haus --------------------------------------------------
alter table public.houses
  add column if not exists offer_short_term boolean not null default true,
  add column if not exists offer_long_term  boolean not null default false;

-- 2) Öffentliche Angaben „Wohnen auf Zeit“ je Haus (ohne Preise) ---------------
create table if not exists public.house_long_term (
  house_id              uuid primary key references public.houses(id) on delete cascade,
  min_months            integer not null default 6 check (min_months >= 1),
  max_months            integer check (max_months is null or max_months >= min_months), -- leer = unbefristet möglich
  available_from        date,                 -- leer = „nach Vereinbarung“
  registration_required boolean not null default true,  -- „Anmeldung bei der Gemeinde notwendig“
  text_de               text,                 -- Einleitung, Absätze durch Leerzeile
  text_en               text,
  included_de           text[] not null default '{}',   -- „Inklusive“: Strom, Heizung, Internet … (ohne Beträge)
  included_en           text[] not null default '{}',
  updated_at            timestamptz not null default now()
);

alter table public.house_long_term enable row level security;

drop policy if exists "oeffentlich lesen" on public.house_long_term;
create policy "oeffentlich lesen" on public.house_long_term
  for select to anon, authenticated
  using (exists (select 1 from public.houses h
                 where h.id = house_id and h.is_active and h.offer_long_term));

drop policy if exists "admins lesen alles" on public.house_long_term;
create policy "admins lesen alles" on public.house_long_term
  for select to authenticated using (public.is_admin());

drop policy if exists "admins verwalten" on public.house_long_term;
create policy "admins verwalten" on public.house_long_term
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Startzeile je Haus (leer bis auf Standardwerte). Nichts wird eingeschaltet.
insert into public.house_long_term (house_id)
select id from public.houses
on conflict (house_id) do nothing;

-- 3) Mietanfragen „Wohnen auf Zeit“ ---------------------------------------------
-- Eigene Tabelle, NICHT booking_inquiries: diese Anfragen haben keine Nächte/Preise
-- und dürfen in der Hausverwaltung (Max) nicht wie Urlaubsbuchungen verarbeitet
-- werden. Anbindung an die Hausverwaltung folgt in einem späteren Schritt.
create table if not exists public.long_term_inquiries (
  id                     uuid primary key default gen_random_uuid(),
  house_id               uuid not null references public.houses(id) on delete cascade,
  guest_name             text not null check (length(trim(guest_name)) between 2 and 100),
  guest_email            text not null check (length(guest_email) <= 255),
  guest_phone            text not null check (length(guest_phone) <= 40),
  move_in                date not null,
  duration_months        integer check (duration_months is null or duration_months between 1 and 120), -- leer = „länger / offen“
  persons                integer not null check (persons between 1 and 20),
  purpose                text check (purpose in ('work','home_office','other')),
  purpose_detail         text check (length(purpose_detail) <= 300),   -- z. B. Arbeitgeber, Projekt
  pets                   boolean not null default false,
  registration_confirmed boolean not null default false, -- Anmeldung bei der Gemeinde zugesagt (Pflicht im Formular, wenn verlangt)
  message                text check (length(message) <= 2000),
  language               text not null default 'de' check (language in ('de','en')),
  status                 text not null default 'new'
                         check (status in ('new','contacted','viewing','offer','rejected','closed')),
  admin_note             text,
  created_at             timestamptz not null default now()
);

create index if not exists long_term_inquiries_created_idx
  on public.long_term_inquiries (created_at desc);

alter table public.long_term_inquiries enable row level security;

-- Gäste dürfen nur anlegen (nicht lesen), und nur für sichtbare Häuser mit Wohnen auf Zeit.
drop policy if exists "gaeste anfragen" on public.long_term_inquiries;
create policy "gaeste anfragen" on public.long_term_inquiries
  for insert to anon, authenticated
  with check (status = 'new' and admin_note is null
              and exists (select 1 from public.houses h
                          where h.id = house_id and h.is_active and h.offer_long_term));

drop policy if exists "admins verwalten" on public.long_term_inquiries;
create policy "admins verwalten" on public.long_term_inquiries
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- 4) Einstellungen der Website (genau eine Zeile) --------------------------------
create table if not exists public.site_settings (
  id               boolean primary key default true check (id),
  show_mode_switch boolean not null default false,  -- Umschalter „Urlaub | Wohnen auf Zeit“ über den Hauskarten
  updated_at       timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "oeffentlich lesen" on public.site_settings;
create policy "oeffentlich lesen" on public.site_settings
  for select to anon, authenticated using (true);

drop policy if exists "admins verwalten" on public.site_settings;
create policy "admins verwalten" on public.site_settings
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

insert into public.site_settings (id) values (true) on conflict (id) do nothing;

-- Kontrolle: alle Häuser Urlaub = an, Wohnen auf Zeit = aus; je Haus eine Zeile house_long_term
select h.name, h.is_active, h.offer_short_term, h.offer_long_term, h.direct_booking,
       l.min_months, l.registration_required
from public.houses h
left join public.house_long_term l on l.house_id = h.id
order by h.sort_order;
select * from public.site_settings;
