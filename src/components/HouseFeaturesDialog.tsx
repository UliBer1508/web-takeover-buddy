import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { FEATURE_ICONS, featureIcon } from "@/lib/featureIcons";
import { HouseFeature, FeatureSection } from "@/hooks/useHouseFeatures";

interface Zeile {
  icon: string;
  title: string;
  description: string;
}

interface HouseFeaturesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  houseId: string | null;
  houseName: string;
}

const leer = (): Zeile => ({ icon: "sparkles", title: "", description: "" });

/**
 * Die vier Kacheln unter der Hausbeschreibung ("Highlights") und die Karten im
 * Abschnitt "Ausstattung" - beide je Haus frei bearbeitbar. Gespeichert wird
 * in einem Rutsch: alte Zeilen des Hauses loeschen, neue schreiben.
 */
const HouseFeaturesDialog = ({ open, onOpenChange, houseId, houseName }: HouseFeaturesDialogProps) => {
  const queryClient = useQueryClient();
  const [highlights, setHighlights] = useState<Zeile[]>([]);
  const [features, setFeatures] = useState<Zeile[]>([]);
  const [laedt, setLaedt] = useState(false);
  const [speichert, setSpeichert] = useState(false);

  useEffect(() => {
    if (!open || !houseId) return;
    setLaedt(true);
    supabase
      .from("house_features")
      .select("*")
      .eq("house_id", houseId)
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          toast({ title: "Konnte nicht geladen werden", description: error.message, variant: "destructive" });
        } else {
          const zeilen = (data || []) as HouseFeature[];
          const zu = (s: FeatureSection): Zeile[] =>
            zeilen
              .filter(z => z.section === s)
              .map(z => ({ icon: z.icon, title: z.title, description: z.description ?? "" }));
          setHighlights(zu("highlight"));
          setFeatures(zu("feature"));
        }
        setLaedt(false);
      });
  }, [open, houseId]);

  const speichern = async () => {
    if (!houseId) return;
    setSpeichert(true);
    try {
      const { error: loeschFehler } = await supabase
        .from("house_features")
        .delete()
        .eq("house_id", houseId);
      if (loeschFehler) throw loeschFehler;

      const zeilen = [
        ...highlights
          .filter(z => z.title.trim())
          .map((z, i) => ({
            house_id: houseId,
            section: "highlight",
            icon: z.icon,
            title: z.title.trim(),
            description: z.description.trim() || null,
            sort_order: i,
          })),
        ...features
          .filter(z => z.title.trim())
          .map((z, i) => ({
            house_id: houseId,
            section: "feature",
            icon: z.icon,
            title: z.title.trim(),
            description: z.description.trim() || null,
            sort_order: i,
          })),
      ];

      if (zeilen.length > 0) {
        const { error } = await supabase.from("house_features").insert(zeilen);
        if (error) throw error;
      }

      queryClient.invalidateQueries({ queryKey: ["house-features"] });
      toast({ title: "Gespeichert", description: `${houseName}: Highlights und Ausstattung aktualisiert.` });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Konnte nicht gespeichert werden",
        description: error?.message ?? "Unbekannter Fehler.",
        variant: "destructive",
      });
    } finally {
      setSpeichert(false);
    }
  };

  const block = (
    titel: string,
    hinweis: string,
    liste: Zeile[],
    setListe: (z: Zeile[]) => void,
    beschriftungPlatzhalter: string
  ) => {
    const aendern = (index: number, teil: Partial<Zeile>) =>
      setListe(liste.map((z, i) => (i === index ? { ...z, ...teil } : z)));

    const tauschen = (index: number, richtung: -1 | 1) => {
      const ziel = index + richtung;
      if (ziel < 0 || ziel >= liste.length) return;
      const kopie = [...liste];
      [kopie[index], kopie[ziel]] = [kopie[ziel], kopie[index]];
      setListe(kopie);
    };

    return (
      <div>
        <div className="flex items-baseline justify-between gap-3 mb-1">
          <h3 className="font-semibold">{titel}</h3>
          <Button variant="outline" size="sm" onClick={() => setListe([...liste, leer()])}>
            <Plus className="h-4 w-4 mr-1" />
            Hinzufügen
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mb-3">{hinweis}</p>

        {liste.length === 0 ? (
          <p className="text-sm text-muted-foreground border rounded-lg px-3 py-4">
            Noch nichts eingetragen — die Website zeigt hier für dieses Haus nichts an.
          </p>
        ) : (
          <div className="space-y-2">
            {liste.map((zeile, index) => {
              const Symbol = featureIcon(zeile.icon);
              return (
                <div key={index} className="flex flex-wrap items-start gap-2 border rounded-lg p-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-9 h-9 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Symbol className="w-4 h-4" />
                    </span>
                    <select
                      value={zeile.icon}
                      onChange={e => aendern(index, { icon: e.target.value })}
                      aria-label="Symbol"
                      className="h-9 rounded-md border bg-background px-2 text-sm"
                    >
                      {FEATURE_ICONS.map(s => (
                        <option key={s.key} value={s.key}>{s.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-grow min-w-[12rem] space-y-2">
                    <Input
                      value={zeile.title}
                      onChange={e => aendern(index, { title: e.target.value })}
                      placeholder={beschriftungPlatzhalter}
                      aria-label="Überschrift"
                    />
                    <Input
                      value={zeile.description}
                      onChange={e => aendern(index, { description: e.target.value })}
                      placeholder="Kurze Erklärung (optional)"
                      aria-label="Beschreibung"
                    />
                  </div>

                  <div className="flex gap-1">
                    <Button
                      variant="ghost" size="icon" aria-label="Nach oben"
                      disabled={index === 0}
                      onClick={() => tauschen(index, -1)}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost" size="icon" aria-label="Nach unten"
                      disabled={index === liste.length - 1}
                      onClick={() => tauschen(index, 1)}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost" size="icon" aria-label="Entfernen"
                      onClick={() => setListe(liste.filter((_, i) => i !== index))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Highlights &amp; Ausstattung — {houseName}</DialogTitle>
          <DialogDescription>
            Gilt nur für dieses Haus. Beide Chalets sehen gleich aus, zeigen aber ihre
            eigenen Angaben.
          </DialogDescription>
        </DialogHeader>


        {laedt ? (
          <div className="flex items-center gap-2 text-muted-foreground py-10 justify-center">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Wird geladen…</span>
          </div>
        ) : (
          <div className="space-y-7">
            {block(
              "Highlights",
              "Die Kacheln direkt unter der Hausbeschreibung. Vier wirken am besten.",
              highlights,
              setHighlights,
              "z. B. Bergpanorama"
            )}
            {block(
              "Ausstattung",
              "Die Karten im Abschnitt „Ausstattung“ weiter unten.",
              features,
              setFeatures,
              "z. B. Private Sauna"
            )}
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

export default HouseFeaturesDialog;
