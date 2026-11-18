-- Wohnen auf Zeit — Schritt 3 + 4: interne Kalkulation und persönliches Angebot
-- Im SQL-Editor von wlmdjljyzdwvpqefwdmy ausführen (Konto steinbockchalets@gmail.com,
-- Projekt „steinbockchalets-webseite“), BEVOR der Code hochgeladen wird.
-- NICHT in der Hausverwaltung (usblrulkcgucxtkhugck) ausführen.
-- Voraussetzung: 20261118_wohnen_auf_zeit.sql ist gelaufen.
-- Das Skript darf mehrfach laufen.
--
-- Grundsatz (Uli, 18.11.2026): Preise für Wohnen auf Zeit sind NIE öffentlich lesbar.
--   long_term_calculation : nur Admins (lesen + schreiben)
--   long_term_offers      : nur Admins; ein Kunde sieht SEIN Angebot ausschließlich über
--                           die Funktion get_long_term_offer(token) und nur, wenn Uli es
--                           freigegeben hat.

-- 1) Interne Kalkulation je Haus (alle Beträge in Euro pro JAHR, außer wo anders angegeben)
create table if not exists public.long_term_calculation (
  house_id              uuid primary key references public.houses(id) on delete cascade,
  -- Fixkosten
  insurance             numeric(10,2) not null default 0,  -- Versicherungen
  property_tax          numeric(10,2) not null default 0,  -- Grundsteuer
  municipal_fees        numeric(10,2) not null default 0,  -- Kanal, Müll, Wasser
  internet              numeric(10,2) not null default 0,  -- Internet / TV
  financing             numeric(10,2) not null default 0,  -- Finanzierung (Zinsen/Raten)
  depreciation          numeric(10,2) not null default 0,  -- AfA
  -- Energie (nach Abzug des PV-Anteils)
  electricity           numeric(10,2) not null default 0,
  heating               numeric(10,2) not null default 0,
  -- Rücklagen und Betrieb
  maintenance           numeric(10,2) not null default 0,  -- Instandhaltung
  furniture_wear        numeric(10,2) not null default 0,  -- Abnutzung Möbel/Inventar
  management            numeric(10,2) not null default 0,  -- Verwaltung
  cleaning              numeric(10,2) not null default 0,  -- Reinigung/Garten während der Mietzeit
  extra_costs           jsonb not null default '[]'::jsonb, -- [{ "name": "...", "amount": 123, "utility": false }]
  -- Annahmen
  vacancy_months        numeric(4,1) not null default 1 check (vacancy_months >= 0 and vacancy_months < 12),
  profit_target         numeric(10,2) not null default 0,  -- Gewinnziel pro Jahr
  deposit_months        numeric(3,1) not null default 2 check (deposit_months >= 0 and deposit_months <= 3),
  final_cleaning_fee    numeric(10,2) not null default 0,  -- Endreinigung (einmalig)
  utilities_mode        text not null default 'flat' check (utilities_mode in ('flat','advance')),
  -- flat = Pauschale (abgegolten), advance = Vorauszahlung mit Abrechnung
  note                  text,
  updated_at            timestamptz not null default now()
);

alter table public.long_term_calculation enable row level security;

drop policy if exists "admins verwalten" on public.long_term_calculation;
create policy "admins verwalten" on public.long_term_calculation
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- 2) Persönliche Angebote ---------------------------------------------------------
create table if not exists public.long_term_offers (
  id                 uuid primary key default gen_random_uuid(),
  inquiry_id         uuid references public.long_term_inquiries(id) on delete set null,
  house_id           uuid not null references public.houses(id) on delete cascade,
  -- 64 Zeichen Zufall: Teil des Kunden-Links /angebot/<token>
  token              text not null unique
                     default replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', ''),
  guest_name         text not null,
  guest_email        text,
  language           text not null default 'de' check (language in ('de','en')),
  rent_month         numeric(10,2) not null check (rent_month >= 0),   -- Grundmiete pro Monat
  utilities_month    numeric(10,2) not null default 0 check (utilities_month >= 0),
  utilities_mode     text not null default 'flat' check (utilities_mode in ('flat','advance')),
  deposit            numeric(10,2) not null default 0 check (deposit >= 0),
  final_cleaning_fee numeric(10,2) not null default 0 check (final_cleaning_fee >= 0),
  move_in            date not null,
  duration_months    integer check (duration_months is null or duration_months between 1 and 120), -- leer = unbefristet / offen
  conditions_de      text,
  conditions_en      text,
  valid_until        date not null,
  status             text not null default 'draft'
                     check (status in ('draft','released','viewed','accepted','question','withdrawn')),
  released_at        timestamptz,
  viewed_at          timestamptz,
  responded_at       timestamptz,
  guest_message      text check (length(guest_message) <= 2000),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists long_term_offers_inquiry_idx on public.long_term_offers (inquiry_id);

alter table public.long_term_offers enable row level security;

-- Keine Policy für anon: Gäste lesen nie direkt aus dieser Tabelle.
drop policy if exists "admins verwalten" on public.long_term_offers;
create policy "admins verwalten" on public.long_term_offers
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- 3) Kunde liest SEIN Angebot über den Token ------------------------------------------
-- Nur freigegebene Angebote (nicht Entwurf, nicht zurückgezogen). Beim ersten Aufruf durch
-- den Kunden wird viewed_at gesetzt und der Status von 'released' auf 'viewed'.
create or replace function public.get_long_term_offer(p_token text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  o public.long_term_offers;
  h public.houses;
begin
  if p_token is null or length(p_token) < 32 then
    return null;
  end if;

  select * into o from public.long_term_offers
  where token = p_token and status in ('released','viewed','accepted','question');
  if not found then
    return null;
  end if;

  -- Öffnet Uli (Admin) den Link zur Kontrolle, zählt das nicht als „vom Kunden geöffnet“.
  if o.viewed_at is null and not coalesce(public.is_admin(), false) then
    update public.long_term_offers
      set viewed_at = now(),
          status = case when status = 'released' then 'viewed' else status end
      where id = o.id
      returning * into o;
  end if;

  select * into h from public.houses where id = o.house_id;

  return json_build_object(
    'house_name', h.name,
    'house_location', h.location,
    'house_slug', h.slug,
    'guest_name', o.guest_name,
    'language', o.language,
    'rent_month', o.rent_month,
    'utilities_month', o.utilities_month,
    'utilities_mode', o.utilities_mode,
    'deposit', o.deposit,
    'final_cleaning_fee', o.final_cleaning_fee,
    'move_in', o.move_in,
    'duration_months', o.duration_months,
    'conditions_de', o.conditions_de,
    'conditions_en', o.conditions_en,
    'valid_until', o.valid_until,
    'expired', o.valid_until < current_date,
    'status', o.status,
    'responded_at', o.responded_at
  );
end;
$$;

-- 4) Kunde antwortet: annehmen oder Rückfrage ------------------------------------------
-- Annehmen nur, solange das Angebot gilt und noch nicht angenommen ist.
create or replace function public.respond_long_term_offer(p_token text, p_response text, p_message text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  o public.long_term_offers;
begin
  if p_response not in ('accept','question') then
    return 'invalid';
  end if;

  select * into o from public.long_term_offers
  where token = p_token and status in ('released','viewed','question');
  if not found then
    return 'not_found';
  end if;

  if o.valid_until < current_date then
    return 'expired';
  end if;

  update public.long_term_offers
    set status = case when p_response = 'accept' then 'accepted' else 'question' end,
        responded_at = now(),
        -- leere Nachricht beim Annehmen überschreibt eine frühere Rückfrage nicht
        guest_message = coalesce(nullif(left(coalesce(p_message, ''), 2000), ''), guest_message),
        viewed_at = coalesce(viewed_at, now()),
        updated_at = now()
    where id = o.id;

  return 'ok';
end;
$$;

revoke all on function public.get_long_term_offer(text) from public;
revoke all on function public.respond_long_term_offer(text, text, text) from public;
grant execute on function public.get_long_term_offer(text) to anon, authenticated;
grant execute on function public.respond_long_term_offer(text, text, text) to anon, authenticated;

-- Startzeile Kalkulation je Haus (alles 0)
insert into public.long_term_calculation (house_id)
select id from public.houses
on conflict (house_id) do nothing;

-- Kontrolle: je Haus eine Kalkulationszeile; Angebote leer
select h.name, c.vacancy_months, c.deposit_months, c.utilities_mode
from public.houses h
left join public.long_term_calculation c on c.house_id = h.id
order by h.sort_order;
select count(*) as angebote from public.long_term_offers;
