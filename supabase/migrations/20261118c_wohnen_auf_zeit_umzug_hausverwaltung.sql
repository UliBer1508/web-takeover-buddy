-- Wohnen auf Zeit: Anfragen, Kalkulation und Angebote sind in die HAUSVERWALTUNG umgezogen
-- (usblrulkcgucxtkhugck, SQL 72_mietinteressenten.sql, Tab Mieter → Interessenten).
-- Dieses Skript räumt die Tabellen und Funktionen in der WEBSITE-Datenbank auf, die am
-- 18.11.2026 (Teil 1 + 2) kurz hier angelegt waren.
--
-- Im SQL-Editor von wlmdjljyzdwvpqefwdmy ausführen (Konto steinbockchalets@gmail.com),
-- NACHDEM der neue Code live ist. NICHT in der Hausverwaltung.
-- Bleiben: houses.offer_short_term/offer_long_term, house_long_term (öffentliche Angaben
-- ohne Preise), site_settings.
--
-- Sicherung: bricht ab, wenn in den Tabellen noch echte (nicht als Test markierbare) Zeilen
-- stehen — dann zuerst ansehen. Testdaten vorher von Hand löschen oder den Block anpassen.
do $$
declare n int;
begin
  select (select count(*) from public.long_term_offers)
       + (select count(*) from public.long_term_inquiries) into n;
  if n > 0 then
    raise exception 'In long_term_inquiries/long_term_offers stehen noch % Zeilen — bitte zuerst prüfen (select * from public.long_term_inquiries;).', n;
  end if;
end $$;

drop function if exists public.get_long_term_offer(text);
drop function if exists public.respond_long_term_offer(text, text, text);
drop table if exists public.long_term_offers;
drop table if exists public.long_term_inquiries;
drop table if exists public.long_term_calculation;

select 'aufgeräumt' as ergebnis;
