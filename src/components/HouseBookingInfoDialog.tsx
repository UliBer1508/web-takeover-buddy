import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { BookingPlatform, HouseBookingInfo } from "@/hooks/useHouseBookingInfo";

interface HouseBookingInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  houseId: string | null;
  houseName: string;
  directBooking: boolean;
  offerShortTerm: boolean;
  offerLongTerm: boolean;
}

/** Felder von public.house_long_term im Formular (Listen als ein Eintrag je Zeile). */
interface LangWerte {
  min_months: string; max_months: string; available_from: string;
  registration_required: boolean;
  text_de: string; text_en: string; included_de: string; included_en: string;
}

const langLeer = (): LangWerte => ({
  min_months: "6", max_months: "", available_from: "", registration_required: true,
  text_de: "", text_en: "", included_de: "", included_en: "",
});

const zeilen = (v: string) => v.split("\n").map(z => z.trim()).filter(Boolean);

interface Werte {
  title_de: string; title_en: string; text_de: string; text_en: string;
  main_label: string; main_url: string;
}

const leer = (): Werte => ({
  title_de: "", title_en: "", text_de: "", text_en: "", main_label: "", main_url: "",
});

const textOderNull = (v: string) => (v.trim() ? v.trim() : null);

/**
 * "Vermietung" eines Hauses:
 *  - Vermietungsarten: Urlaub (houses.offer_short_term) und/oder Wohnen auf Zeit
 *    (houses.offer_long_term), seit 18.11.2026
 *  - Urlaub: Schalter "Direkt buchbar" (houses.direct_booking) und der Hinweis, der
 *    statt des Anfrageformulars erscheint, wenn das Haus ueber eine Plattform
 *    vermietet wird (public.house_booking_info)
 *  - Wohnen auf Zeit: oeffentliche Angaben OHNE Preise (public.house_long_term)
 */
const HouseBookingInfoDialog = ({
  open, onOpenChange, houseId, houseName, directBooking, offerShortTerm, offerLongTerm,
}: HouseBookingInfoDialogProps) => {
  const queryClient = useQueryClient();
  const [direkt, setDirekt] = useState(directBooking);
  const [kurz, setKurz] = useState(offerShortTerm);
  const [lang, setLang] = useState(offerLongTerm);
  const [langWerte, setLangWerte] = useState<LangWerte>(langLeer());
  const [werte, setWerte] = useState<Werte>(leer());
  const [plattformen, setPlattformen] = useState<BookingPlatform[]>([]);
  const [laedt, setLaedt] = useState(false);
  const [speichert, setSpeichert] = useState(false);

  useEffect(() => {
    if (!open || !houseId) return;
    setDirekt(directBooking);
    setKurz(offerShortTerm);
    setLang(offerLongTerm);
    setLaedt(true);
    Promise.all([
      (supabase as any).from("house_booking_info").select("*").eq("house_id", houseId).maybeSingle(),
      (supabase as any).from("house_long_term").select("*").eq("house_id", houseId).maybeSingle(),
    ]).then(([info, lz]: { data: any; error: any }[]) => {
      const error = info.error || lz.error;
      if (error) {
        toast({ title: "Konnte nicht geladen werden", description: error.message, variant: "destructive" });
      } else {
        const data = info.data as HouseBookingInfo | null;
        const w = leer();
        if (data) (Object.keys(w) as (keyof Werte)[]).forEach(k => { w[k] = (data as any)[k] ?? ""; });
        setWerte(w);
        setPlattformen((data?.platforms || []).map(p => ({ name: p.name ?? "", url: p.url ?? "" })));

        const l = lz.data;
        setLangWerte(l ? {
          min_months: String(l.min_months ?? 6),
          max_months: l.max_months ? String(l.max_months) : "",
          available_from: l.available_from ?? "",
          registration_required: l.registration_required ?? true,
          text_de: l.text_de ?? "", text_en: l.text_en ?? "",
          included_de: (l.included_de || []).join("\n"),
          included_en: (l.included_en || []).join("\n"),
        } : langLeer());
      }
      setLaedt(false);
    });
  }, [open, houseId, directBooking, offerShortTerm, offerLongTerm]);

  const setzeLang = <K extends keyof LangWerte>(k: K, v: LangWerte[K]) =>
    setLangWerte(w => ({ ...w, [k]: v }));

  const setze = (k: keyof Werte, v: string) => setWerte(w => ({ ...w, [k]: v }));
  const aendern = (i: number, teil: Partial<BookingPlatform>) =>
    setPlattformen(l => l.map((p, j) => (j === i ? { ...p, ...teil } : p)));
  const tauschen = (i: number, r: -1 | 1) => {
    const z = i + r;
    if (z < 0 || z >= plattformen.length) return;
    const k = [...plattformen];
    [k[i], k[z]] = [k[z], k[i]];
    setPlattformen(k);
  };

  const speichern = async () => {
    if (!houseId) return;
    const minM = parseInt(langWerte.min_months);
    const maxM = langWerte.max_months.trim() ? parseInt(langWerte.max_months) : null;
    if (!minM || minM < 1 || (maxM !== null && (!maxM || maxM < minM))) {
      toast({
        title: "Mietdauer prüfen",
        description: "Mindestdauer ab 1 Monat; Höchstdauer leer oder mindestens so lang wie die Mindestdauer.",
        variant: "destructive",
      });
      return;
    }
    setSpeichert(true);
    try {
      const { error: e1 } = await supabase
        .from("houses")
        .update({ direct_booking: direkt, offer_short_term: kurz, offer_long_term: lang } as any)
        .eq("id", houseId);
      if (e1) throw e1;

      const { error: e3 } = await (supabase as any)
        .from("house_long_term")
        .upsert({
          house_id: houseId,
          min_months: minM,
          max_months: maxM,
          available_from: langWerte.available_from || null,
          registration_required: langWerte.registration_required,
          text_de: textOderNull(langWerte.text_de),
          text_en: textOderNull(langWerte.text_en),
          included_de: zeilen(langWerte.included_de),
          included_en: zeilen(langWerte.included_en),
          updated_at: new Date().toISOString(),
        }, { onConflict: "house_id" });
      if (e3) throw e3;

      const liste = plattformen
        .map(p => ({ name: p.name.trim(), url: (p.url ?? "").trim() || null }))
        .filter(p => p.name);
      const { error: e2 } = await (supabase as any)
        .from("house_booking_info")
        .upsert({
          house_id: houseId,
          title_de: textOderNull(werte.title_de),
          title_en: textOderNull(werte.title_en),
          text_de: textOderNull(werte.text_de),
          text_en: textOderNull(werte.text_en),
          main_label: textOderNull(werte.main_label),
          main_url: textOderNull(werte.main_url),
          platforms: liste,
          updated_at: new Date().toISOString(),
        }, { onConflict: "house_id" });
      if (e2) throw e2;

      ["houses-all", "houses-active", "houses-booking", "house-booking-info", "house-long-term"]
        .forEach(key => queryClient.invalidateQueries({ queryKey: [key] }));
      toast({
        title: "Gespeichert",
        description: [
          kurz ? (direkt ? "Urlaub: direkt buchbar" : "Urlaub: Hinweis auf Plattform") : "kein Urlaub",
          lang ? "Chalets auf Zeit: an" : "Chalets auf Zeit: aus",
        ].join(" · "),
      });
      onOpenChange(false);
    } catch (error: any) {
      toast({ title: "Konnte nicht gespeichert werden", description: error?.message ?? "Unbekannter Fehler.", variant: "destructive" });
    } finally {
      setSpeichert(false);
    }
  };

  const feld = (k: keyof Werte, label: string, mehrzeilig = false, platzhalter = "") => (
    <div className="space-y-1.5">
      <Label htmlFor={`vermietung-${k}`}>{label}</Label>
      {mehrzeilig ? (
        <Textarea id={`vermietung-${k}`} rows={2} value={werte[k]} placeholder={platzhalter}
          onChange={e => setze(k, e.target.value)} />
      ) : (
        <Input id={`vermietung-${k}`} value={werte[k]} placeholder={platzhalter}
          onChange={e => setze(k, e.target.value)} />
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Vermietung — {houseName}</DialogTitle>
          <DialogDescription>
            Vermietungsarten frei kombinierbar. Urlaub: Kalender und Anfrage (oder Hinweis auf
            Plattform). Chalets auf Zeit: Angaben und Mietanfrage, keine Preise.
          </DialogDescription>
        </DialogHeader>

        {laedt ? (
          <div className="flex items-center gap-2 text-muted-foreground py-10 justify-center">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Wird geladen…</span>
          </div>
        ) : (
          <div className="space-y-6">
            <section className="space-y-2">
              <h3 className="font-semibold">Vermietungsarten</h3>
              <div className="grid sm:grid-cols-2 gap-2">
                <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
                  <Label htmlFor="vermietung-kurz" className="font-medium">Urlaub (kurzzeitig)</Label>
                  <Switch id="vermietung-kurz" checked={kurz} onCheckedChange={setKurz} />
                </div>
                <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
                  <Label htmlFor="vermietung-lang" className="font-medium">Chalets auf Zeit</Label>
                  <Switch id="vermietung-lang" checked={lang} onCheckedChange={setLang} />
                </div>
              </div>
              {!kurz && !lang && (
                <p className="text-xs text-amber-700 dark:text-amber-500">
                  Keine Vermietungsart gewählt: Gäste sehen das Haus, aber weder Kalender noch Anfrage.
                </p>
              )}
            </section>

            <section className={`space-y-4 rounded-lg border p-3 ${lang ? "" : "opacity-60"}`}>
              <h3 className="font-semibold">Chalets auf Zeit</h3>
              <p className="text-xs text-muted-foreground">
                Keine Preise auf der Website. Miete und Konditionen bekommt der Interessent nach der Besichtigung.
              </p>
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="lz-min">Mindestdauer (Monate)</Label>
                  <Input id="lz-min" type="number" min={1} value={langWerte.min_months}
                    onChange={e => setzeLang("min_months", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lz-max">Höchstdauer (Monate)</Label>
                  <Input id="lz-max" type="number" min={1} value={langWerte.max_months} placeholder="leer = offen"
                    onChange={e => setzeLang("max_months", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lz-ab">Frei ab</Label>
                  <Input id="lz-ab" type="date" value={langWerte.available_from}
                    onChange={e => setzeLang("available_from", e.target.value)} />
                  <p className="text-[11px] text-muted-foreground">leer = „nach Vereinbarung“</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <Label htmlFor="lz-anmeldung">„Anmeldung bei der Gemeinde notwendig“ anzeigen und im Formular bestätigen lassen</Label>
                <Switch id="lz-anmeldung" checked={langWerte.registration_required}
                  onCheckedChange={v => setzeLang("registration_required", v)} />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="lz-text-de">Einleitung (Deutsch)</Label>
                  <Textarea id="lz-text-de" rows={3} value={langWerte.text_de}
                    onChange={e => setzeLang("text_de", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lz-text-en">Einleitung (Englisch)</Label>
                  <Textarea id="lz-text-en" rows={3} value={langWerte.text_en}
                    onChange={e => setzeLang("text_en", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lz-inkl-de">Inklusive (Deutsch, ein Punkt je Zeile, ohne Beträge)</Label>
                  <Textarea id="lz-inkl-de" rows={4} value={langWerte.included_de}
                    placeholder={"Strom und Heizung\nWLAN\nVoll möbliert"}
                    onChange={e => setzeLang("included_de", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lz-inkl-en">Inklusive (Englisch, ein Punkt je Zeile)</Label>
                  <Textarea id="lz-inkl-en" rows={4} value={langWerte.included_en}
                    onChange={e => setzeLang("included_en", e.target.value)} />
                </div>
              </div>
            </section>

            <div className={`flex items-center justify-between gap-3 rounded-lg border p-3 ${kurz ? "" : "opacity-60"}`}>
              <Label htmlFor="vermietung-direkt" className="font-semibold">Urlaub: direkt über die Website buchbar</Label>
              <Switch id="vermietung-direkt" checked={direkt} onCheckedChange={setDirekt} />
            </div>

            <section className={`space-y-4 ${direkt || !kurz ? "opacity-60" : ""}`}>
              <h3 className="font-semibold">Urlaub: Hinweis, wenn nicht direkt buchbar</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {feld("title_de", "Überschrift (Deutsch)", false, "Dieses Chalet wird über Belvilla vermietet")}
                {feld("title_en", "Überschrift (Englisch)")}
                {feld("text_de", "Text (Deutsch)", true)}
                {feld("text_en", "Text (Englisch)", true)}
                {feld("main_label", "Knopf – Beschriftung", false, "Belvilla")}
                {feld("main_url", "Knopf – Link", false, "https://…")}
              </div>

              <div>
                <div className="flex items-baseline justify-between gap-3 mb-1">
                  <h4 className="font-medium">Plattformen</h4>
                  <Button variant="outline" size="sm" onClick={() => setPlattformen([...plattformen, { name: "", url: "" }])}>
                    <Plus className="h-4 w-4 mr-1" />
                    Hinzufügen
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  Mit Link anklickbar, ohne Link nur als Name. Leere Namen werden verworfen.
                </p>
                <div className="space-y-2">
                  {plattformen.map((p, i) => (
                    <div key={i} className="flex flex-wrap items-center gap-2 border rounded-lg p-2">
                      <Input className="flex-1 min-w-[8rem]" value={p.name} placeholder="Name"
                        aria-label="Name" onChange={e => aendern(i, { name: e.target.value })} />
                      <Input className="flex-[2] min-w-[12rem]" value={p.url ?? ""} placeholder="Link (optional)"
                        aria-label="Link" onChange={e => aendern(i, { url: e.target.value })} />
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" aria-label="Nach oben" disabled={i === 0} onClick={() => tauschen(i, -1)}>
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" aria-label="Nach unten" disabled={i === plattformen.length - 1} onClick={() => tauschen(i, 1)}>
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" aria-label="Entfernen" onClick={() => setPlattformen(plattformen.filter((_, j) => j !== i))}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-3 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Abbrechen</Button>
          <Button onClick={speichern} disabled={speichert || laedt}>
            {speichert ? "Speichert…" : "Speichern"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HouseBookingInfoDialog;
