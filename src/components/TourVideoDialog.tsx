import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Video, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { SelectableHouse } from "@/hooks/useHouseSelection";
import { useSprache } from "@/lib/sprache";
import { aufnahmeFormat, aufnehmen, zeichneFrame } from "@/lib/tour";
import { useTourPlan } from "./VirtualTour";

interface TourVideoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  house: SelectableHouse | null;
}

const FORMATE = {
  quer: { w: 1920, h: 1080, label: "Querformat 16:9 (Website, YouTube, Portale)" },
  hoch: { w: 1080, h: 1920, label: "Hochformat 9:16 (Instagram, Reels, Shorts)" },
} as const;

/**
 * Admin „Video“: nimmt den Rundgang (lib/tour.ts, dieselbe Animation wie auf der Website)
 * als Videodatei auf — MP4 (H.264), wenn der Browser es kann (Chrome/Edge aktuell), sonst WebM.
 * Die Aufnahme läuft in Echtzeit; das Fenster muss sichtbar bleiben.
 * Sprache der Einblendungen = aktuelle Sprache der Website (oben DE/EN umschalten).
 */
const TourVideoDialog = ({ open, onOpenChange, house }: TourVideoDialogProps) => {
  const sprache = useSprache();
  const [format, setFormat] = useState<keyof typeof FORMATE>("quer");
  const [maxBilder, setMaxBilder] = useState("24");
  const { data: plan, isLoading } = useTourPlan(house, Number(maxBilder), open);
  // Callback-Ref: Der Dialog hängt sein Canvas erst nach dem Öffnen ein (Portal/Animation),
  // ein useEffect liefe vorher ins Leere. Gezeichnet wird, sobald das Canvas da ist.
  const vorschauRef = useCallback((canvas: HTMLCanvasElement | null) => {
    const ctx = canvas?.getContext("2d");
    if (ctx && plan) zeichneFrame(ctx, plan, plan.dauerTitel * 0.6);
  }, [plan]);
  const [fortschritt, setFortschritt] = useState<number | null>(null);
  const [ergebnis, setErgebnis] = useState<{ url: string; name: string; mb: string } | null>(null);
  const abbruch = useRef({ abgebrochen: false });
  const unterstuetzt = aufnahmeFormat();

  // Ergebnis-URL freigeben, wenn sie nicht mehr gebraucht wird
  useEffect(() => () => { if (ergebnis) URL.revokeObjectURL(ergebnis.url); }, [ergebnis]);

  useEffect(() => {
    if (!open) { abbruch.current.abgebrochen = true; setFortschritt(null); }
  }, [open]);

  if (!house) return null;
  const { w, h } = FORMATE[format];

  const starten = async () => {
    if (!plan) return;
    if (ergebnis) { URL.revokeObjectURL(ergebnis.url); setErgebnis(null); }
    abbruch.current = { abgebrochen: false };
    setFortschritt(0);
    try {
      const { blob, endung } = await aufnehmen(plan, w, h, setFortschritt, abbruch.current);
      const name = `rundgang-${house.slug}-${sprache}-${format}.${endung}`;
      setErgebnis({ url: URL.createObjectURL(blob), name, mb: (blob.size / 1024 / 1024).toFixed(1) });
      toast({ title: "Video fertig", description: name });
    } catch (e: any) {
      if (e?.message !== "abgebrochen") {
        console.error("Video-Aufnahme:", e);
        toast({ title: "Aufnahme fehlgeschlagen", description: e?.message, variant: "destructive" });
      }
    } finally {
      setFortschritt(null);
    }
  };

  const sekunden = plan ? Math.round(plan.gesamt) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Video-Rundgang — {house.name}</DialogTitle>
          <DialogDescription>
            Aus den Galerie-Bildern dieses Hauses (Titelbild zuerst, dann nach Kategorie). Einblendungen in der
            aktuellen Website-Sprache: <strong>{sprache === "en" ? "Englisch" : "Deutsch"}</strong> (oben DE/EN umschalten).
          </DialogDescription>
        </DialogHeader>

        <div className="grid sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Format</Label>
            <Select value={format} onValueChange={v => setFormat(v as keyof typeof FORMATE)} disabled={fortschritt !== null}>
              <SelectTrigger aria-label="Format"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(FORMATE).map(([k, f]) => <SelectItem key={k} value={k}>{f.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Höchstens Bilder</Label>
            <Select value={maxBilder} onValueChange={setMaxBilder} disabled={fortschritt !== null}>
              <SelectTrigger aria-label="Höchstens Bilder"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["12", "18", "24", "30"].map(n => <SelectItem key={n} value={n}>{n} Bilder</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className={`mx-auto rounded-lg overflow-hidden bg-[#1e2a23] ${format === "quer" ? "w-full aspect-video" : "w-48 aspect-[9/16]"}`}>
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center text-white/80 py-10">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : plan ? (
            <canvas key={format} ref={vorschauRef} width={format === "quer" ? 960 : 540} height={format === "quer" ? 540 : 960} className="w-full h-full" />
          ) : (
            <p className="text-sm text-white/80 p-6 text-center">Mindestens 3 Bilder in der Galerie nötig.</p>
          )}
        </div>

        {plan && (
          <p className="text-xs text-muted-foreground">
            {plan.bilder.length} Bilder · Länge ca. {Math.floor(sekunden / 60)}:{String(sekunden % 60).padStart(2, "0")} Min.
            {" "}· Datei: {unterstuetzt ? unterstuetzt.endung.toUpperCase() : "—"} {w}×{h}.
            Die Aufnahme dauert so lange wie das Video — Fenster offen und sichtbar lassen.
          </p>
        )}
        {!unterstuetzt && (
          <p className="text-sm text-destructive">Dieser Browser kann keine Videos aufnehmen. Bitte Chrome oder Edge verwenden.</p>
        )}

        {fortschritt !== null && (
          <div className="space-y-1">
            <Progress value={Math.round(fortschritt * 100)} />
            <p className="text-xs text-muted-foreground">Aufnahme läuft … {Math.round(fortschritt * 100)} %</p>
          </div>
        )}

        {ergebnis && (
          <div className="rounded-lg border bg-muted/40 p-3 flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm">{ergebnis.name} · {ergebnis.mb} MB</span>
            <Button asChild size="sm">
              <a href={ergebnis.url} download={ergebnis.name}><Download className="h-4 w-4 mr-1" />Herunterladen</a>
            </Button>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-3 border-t">
          {fortschritt !== null ? (
            <Button variant="outline" onClick={() => { abbruch.current.abgebrochen = true; }}>
              <X className="h-4 w-4 mr-1" />Abbrechen
            </Button>
          ) : (
            <Button variant="outline" onClick={() => onOpenChange(false)}>Schließen</Button>
          )}
          <Button onClick={starten} disabled={!plan || !unterstuetzt || fortschritt !== null}>
            <Video className="h-4 w-4 mr-1" />{ergebnis ? "Neu aufnehmen" : "Video erzeugen"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TourVideoDialog;
