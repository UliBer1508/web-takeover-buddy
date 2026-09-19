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
}

interface Werte {
  title_de: string; title_en: string; text_de: string; text_en: string;
  main_label: string; main_url: string;
}

const leer = (): Werte => ({
  title_de: "", title_en: "", text_de: "", text_en: "", main_label: "", main_url: "",
});

const textOderNull = (v: string) => (v.trim() ? v.trim() : null);

/**
 * "Vermietung" eines Hauses: Schalter "Direkt buchbar" (houses.direct_booking)
 * und der Hinweis, der statt des Anfrageformulars erscheint, wenn das Haus
 * ueber eine Plattform vermietet wird (public.house_booking_info).
 */
const HouseBookingInfoDialog = ({
  open, onOpenChange, houseId, houseName, directBooking,
}: HouseBookingInfoDialogProps) => {
  const queryClient = useQueryClient();
  const [direkt, setDirekt] = useState(directBooking);
  const [werte, setWerte] = useState<Werte>(leer());
  const [plattformen, setPlattformen] = useState<BookingPlatform[]>([]);
  const [laedt, setLaedt] = useState(false);
  const [speichert, setSpeichert] = useState(false);

  useEffect(() => {
    if (!open || !houseId) return;
    setDirekt(directBooking);
    setLaedt(true);
    (supabase as any)
      .from("house_booking_info")
      .select("*")
      .eq("house_id", houseId)
      .maybeSingle()
      .then(({ data, error }: { data: HouseBookingInfo | null; error: any }) => {
        if (error) {
          toast({ title: "Konnte nicht geladen werden", description: error.message, variant: "destructive" });
        } else {
          const w = leer();
          if (data) (Object.keys(w) as (keyof Werte)[]).forEach(k => { w[k] = (data as any)[k] ?? ""; });
          setWerte(w);
          setPlattformen((data?.platforms || []).map(p => ({ name: p.name ?? "", url: p.url ?? "" })));
        }
        setLaedt(false);
      });
  }, [open, houseId, directBooking]);

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
    setSpeichert(true);
    try {
      const { error: e1 } = await supabase
        .from("houses").update({ direct_booking: direkt } as any).eq("id", houseId);
      if (e1) throw e1;

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

      ["houses-all", "houses-active", "houses-booking", "house-booking-info"]
        .forEach(key => queryClient.invalidateQueries({ queryKey: [key] }));
      toast({
        title: "Gespeichert",
        description: direkt
          ? `${houseName} ist direkt über die Website buchbar.`
          : `${houseName}: Gäste sehen den Hinweis statt des Anfrageformulars, keine Preise.`,
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
            Direkt buchbar: Anfrageformular und Preise wie gewohnt. Aus: Gäste sehen den
            Kalender, aber keine Preise, und statt des Formulars den Hinweis unten.
          </DialogDescription>
        </DialogHeader>

        {laedt ? (
          <div className="flex items-center gap-2 text-muted-foreground py-10 justify-center">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Wird geladen…</span>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
              <Label htmlFor="vermietung-direkt" className="font-semibold">Direkt über die Website buchbar</Label>
              <Switch id="vermietung-direkt" checked={direkt} onCheckedChange={setDirekt} />
            </div>

            <section className={`space-y-4 ${direkt ? "opacity-60" : ""}`}>
              <h3 className="font-semibold">Hinweis, wenn nicht direkt buchbar</h3>
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
