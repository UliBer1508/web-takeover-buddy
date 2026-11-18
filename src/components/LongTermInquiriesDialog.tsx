import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { Loader2, Mail, Phone, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import LongTermOfferDialog, { ANGEBOT_STATUS, LongTermOffer } from "./LongTermOfferDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface LongTermInquiriesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  houses: { id: string; name: string }[];
}

export interface LongTermInquiry {
  id: string; house_id: string; guest_name: string; guest_email: string; guest_phone: string;
  move_in: string; duration_months: number | null; persons: number;
  purpose: "work" | "home_office" | "other" | null; purpose_detail: string | null;
  pets: boolean; registration_confirmed: boolean; message: string | null;
  language: string; status: string; created_at: string;
}

export const STATUS: Record<string, string> = {
  new: "neu",
  contacted: "kontaktiert",
  viewing: "Besichtigung",
  offer: "Angebot",
  rejected: "abgesagt",
  closed: "erledigt",
};

const ZWECK: Record<string, string> = { work: "Arbeit", home_office: "Homeoffice", other: "Sonstiges" };

export const useLongTermInquiries = (enabled: boolean) =>
  useQuery({
    queryKey: ["long-term-inquiries"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("long_term_inquiries").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as LongTermInquiry[];
    },
    enabled,
  });

/** Angebote (nur Status-Felder) für die Übersicht und den Zähler im Admin-Panel. */
export const useLongTermOffers = (enabled: boolean) =>
  useQuery({
    queryKey: ["long-term-offers"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("long_term_offers")
        .select("id, inquiry_id, status, responded_at, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as Pick<LongTermOffer, "id" | "inquiry_id" | "status" | "responded_at" | "created_at">[];
    },
    enabled,
  });

const datum = (iso: string) => format(parseISO(iso), "dd.MM.yyyy");

/**
 * Mietanfragen „Wohnen auf Zeit“ (public.long_term_inquiries), nur für Admins.
 * Status von Hand setzen. Angebot mit Preis folgt in Schritt 3.
 */
const LongTermInquiriesDialog = ({ open, onOpenChange, houses }: LongTermInquiriesDialogProps) => {
  const queryClient = useQueryClient();
  const { data: anfragen = [], isLoading } = useLongTermInquiries(open);
  const { data: angebote = [] } = useLongTermOffers(open);
  const [angebotFuer, setAngebotFuer] = useState<LongTermInquiry | null>(null);
  // neuestes Angebot je Anfrage
  const angebotZu = (id: string) => angebote.find(o => o.inquiry_id === id);
  const hausName = (id: string) => houses.find(h => h.id === id)?.name ?? "—";

  const status = useMutation({
    mutationFn: async ({ id, wert }: { id: string; wert: string }) => {
      const { error } = await (supabase as any).from("long_term_inquiries").update({ status: wert }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["long-term-inquiries"] }),
    onError: (e: any) => toast({ title: "Konnte nicht gespeichert werden", description: e?.message, variant: "destructive" }),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Mietanfragen — Wohnen auf Zeit</DialogTitle>
          <DialogDescription>
            Neueste zuerst. Nach der Besichtigung: „Angebot erstellen“ → „Freigeben“ → Link an den Kunden.
            Diese Anfragen gehen (noch) nicht an die Hausverwaltung.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground py-10 justify-center">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Wird geladen…</span>
          </div>
        ) : anfragen.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Noch keine Mietanfragen.</p>
        ) : (
          <div className="space-y-3">
            {anfragen.map(a => (
              <div key={a.id} className={`rounded-lg border p-3 space-y-2 ${a.status === "new" ? "border-primary" : ""}`}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold">{a.guest_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {hausName(a.house_id)} · eingegangen {datum(a.created_at)} · {a.language.toUpperCase()}
                    </div>
                  </div>
                  <Select value={a.status} onValueChange={wert => status.mutate({ id: a.id, wert })}>
                    <SelectTrigger className="w-40 h-8" aria-label="Status"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(STATUS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid sm:grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <a href={`mailto:${a.guest_email}`} className="inline-flex items-center gap-1.5 text-primary hover:underline">
                    <Mail className="h-3.5 w-3.5" />{a.guest_email}
                  </a>
                  <a href={`tel:${a.guest_phone}`} className="inline-flex items-center gap-1.5 text-primary hover:underline">
                    <Phone className="h-3.5 w-3.5" />{a.guest_phone}
                  </a>
                  <span>Einzug: <strong>{datum(a.move_in)}</strong></span>
                  <span>Dauer: <strong>{a.duration_months ? `${a.duration_months} Monate` : "länger / offen"}</strong></span>
                  <span>Personen: <strong>{a.persons}</strong>{a.pets ? " · mit Haustier" : ""}</span>
                  <span>Anlass: <strong>{a.purpose ? ZWECK[a.purpose] : "—"}</strong>{a.purpose_detail ? ` – ${a.purpose_detail}` : ""}</span>
                  <span>Anmeldung Gemeinde: <strong>{a.registration_confirmed ? "zugesagt" : "nein"}</strong></span>
                </div>
                {a.message && <p className="text-sm whitespace-pre-line bg-muted/50 rounded p-2">{a.message}</p>}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <span className={`text-xs ${["accepted", "question"].includes(angebotZu(a.id)?.status ?? "") ? "font-semibold text-primary" : "text-muted-foreground"}`}>
                    {angebotZu(a.id) ? `Angebot: ${ANGEBOT_STATUS[angebotZu(a.id)!.status]}` : "Noch kein Angebot"}
                  </span>
                  <Button size="sm" variant={angebotZu(a.id) ? "outline" : "default"} onClick={() => setAngebotFuer(a)}>
                    <FileText className="h-4 w-4 mr-1" />
                    {angebotZu(a.id) ? "Angebot öffnen" : "Angebot erstellen"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
      <LongTermOfferDialog
        open={!!angebotFuer}
        onOpenChange={offen => !offen && setAngebotFuer(null)}
        inquiry={angebotFuer}
        houseName={angebotFuer ? hausName(angebotFuer.house_id) : ""}
      />
    </Dialog>
  );
};

export default LongTermInquiriesDialog;
