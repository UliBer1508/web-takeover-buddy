import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { de as deLocale, enGB } from "date-fns/locale";
import { Loader2, Check, MessageSquare, AlertTriangle, Home } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSprache, lokal } from "@/lib/sprache";
import { euro } from "@/lib/longTermCalc";

interface OeffentlichesAngebot {
  house_name: string;
  house_location: string | null;
  guest_name: string;
  language: "de" | "en";
  rent_month: number;
  utilities_month: number;
  utilities_mode: "flat" | "advance";
  deposit: number;
  final_cleaning_fee: number;
  move_in: string;
  duration_months: number | null;
  conditions_de: string | null;
  conditions_en: string | null;
  valid_until: string;
  expired: boolean;
  status: "released" | "viewed" | "accepted" | "question";
  responded_at: string | null;
}

/**
 * Persönliches Angebot „Wohnen auf Zeit“ unter /angebot/<token> bzw. /offer/<token>.
 * Daten nur über die Funktion get_long_term_offer (Token), nie direkt aus der Tabelle.
 * Entwürfe und zurückgezogene Angebote liefern nichts → „nicht gefunden“.
 */
const Angebot = () => {
  const { token = "" } = useParams();
  const { t, i18n } = useTranslation();
  const sprache = useSprache();
  const queryClient = useQueryClient();
  const spracheGesetzt = useRef(false);
  const [modus, setModus] = useState<"none" | "accept" | "question">("none");
  const [bestaetigt, setBestaetigt] = useState(false);
  const [nachricht, setNachricht] = useState("");
  const [sendet, setSendet] = useState(false);

  const { data: angebot, isLoading } = useQuery({
    queryKey: ["offer", token],
    queryFn: async () => {
      const { data, error } = await (supabase as any).rpc("get_long_term_offer", { p_token: token });
      if (error) throw error;
      return (data ?? null) as OeffentlichesAngebot | null;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Beim ersten Laden die Sprache des Angebots einstellen; danach entscheidet der Gast.
  useEffect(() => {
    if (!angebot || spracheGesetzt.current) return;
    spracheGesetzt.current = true;
    if (angebot.language && !i18n.language?.startsWith(angebot.language)) i18n.changeLanguage(angebot.language);
  }, [angebot, i18n]);

  const datum = (iso: string) =>
    format(parseISO(iso), sprache === "en" ? "d MMMM yyyy" : "d. MMMM yyyy", { locale: sprache === "en" ? enGB : deLocale });

  const antworten = async (art: "accept" | "question") => {
    if (art === "accept" && !bestaetigt) return;
    if (art === "question" && nachricht.trim().length < 3) return;
    setSendet(true);
    const { data, error } = await (supabase as any).rpc("respond_long_term_offer", {
      p_token: token, p_response: art, p_message: nachricht.trim(),
    });
    setSendet(false);
    if (error || data !== "ok") {
      toast({
        title: t("offer.errorTitle"),
        description: data === "expired" ? t("offer.expired") : t("offer.errorDesc"),
        variant: "destructive",
      });
      return;
    }
    setModus("none");
    setNachricht("");
    queryClient.invalidateQueries({ queryKey: ["offer", token] });
    toast({ title: art === "accept" ? t("offer.acceptedTitle") : t("offer.questionSentTitle") });
  };

  const gesamt = angebot ? Number(angebot.rent_month) + Number(angebot.utilities_month) : 0;
  const konditionen = angebot ? lokal(angebot.conditions_de, angebot.conditions_en, sprache) : null;
  const kannAntworten = angebot && !angebot.expired && angebot.status !== "accepted";

  const zeile = (label: string, wert: string, stark = false) => (
    <div className={`flex justify-between gap-4 py-2 border-b last:border-0 ${stark ? "font-semibold" : ""}`}>
      <span className={stark ? "" : "text-muted-foreground"}>{label}</span>
      <span className="text-right">{wert}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{t("offer.pageTitle")} | Steinbock Chalets</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-24 md:py-28 max-w-3xl">
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground justify-center py-20">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : !angebot ? (
          <Card>
            <CardHeader>
              <CardTitle>{t("offer.notFoundTitle")}</CardTitle>
              <CardDescription>{t("offer.notFoundText")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline"><Link to="/">{t("legal.backHome")}</Link></Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div>
              <span className="inline-flex items-center gap-2 h-7 px-3 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
                <Home className="h-3.5 w-3.5" />
                {t("longTerm.badge")}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold">{t("offer.title")}</h1>
              <p className="text-muted-foreground mt-2">
                {t("offer.greeting", { name: angebot.guest_name })}{" "}
                {t("offer.intro", { house: angebot.house_name })}
              </p>
            </div>

            {angebot.status === "accepted" && (
              <div className="flex gap-2 rounded-lg border border-primary bg-primary/5 p-4 text-sm">
                <Check className="h-5 w-5 text-primary shrink-0" />
                <span>
                  {t("offer.acceptedInfo", { date: angebot.responded_at ? datum(angebot.responded_at) : "" })}
                </span>
              </div>
            )}
            {angebot.status === "question" && (
              <div className="flex gap-2 rounded-lg border bg-muted/50 p-4 text-sm">
                <MessageSquare className="h-5 w-5 text-primary shrink-0" />
                <span>{t("offer.questionInfo")}</span>
              </div>
            )}
            {angebot.expired && angebot.status !== "accepted" && (
              <div className="flex gap-2 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/40 p-4 text-sm">
                <AlertTriangle className="h-5 w-5 text-amber-700 shrink-0" />
                <span>{t("offer.expired")}</span>
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>{angebot.house_name}</CardTitle>
                {angebot.house_location && <CardDescription>{angebot.house_location}</CardDescription>}
              </CardHeader>
              <CardContent className="text-sm">
                {zeile(t("offer.rent"), euro(Number(angebot.rent_month), sprache))}
                {zeile(
                  angebot.utilities_mode === "flat" ? t("offer.utilitiesFlat") : t("offer.utilitiesAdvance"),
                  euro(Number(angebot.utilities_month), sprache)
                )}
                {zeile(t("offer.totalMonth"), euro(gesamt, sprache), true)}
                {zeile(t("offer.deposit"), euro(Number(angebot.deposit), sprache))}
                {Number(angebot.final_cleaning_fee) > 0 && zeile(t("offer.finalCleaning"), euro(Number(angebot.final_cleaning_fee), sprache))}
                {zeile(t("offer.moveIn"), datum(angebot.move_in))}
                {zeile(
                  t("offer.duration"),
                  angebot.duration_months ? t("longTerm.months", { count: angebot.duration_months }) : t("offer.durationOpen")
                )}
                {zeile(t("offer.validUntil"), datum(angebot.valid_until))}
              </CardContent>
            </Card>

            {konditionen && (
              <Card>
                <CardHeader><CardTitle className="text-lg">{t("offer.conditions")}</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-1.5 text-sm">
                    {konditionen.split("\n").map(z => z.trim()).filter(Boolean).map((z, i) => (
                      <li key={i} className="flex gap-2"><Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />{z}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {kannAntworten && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t("offer.respondTitle")}</CardTitle>
                  <CardDescription>{t("offer.respondText")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {modus === "none" && (
                    <div className="flex flex-wrap gap-2">
                      <Button size="lg" onClick={() => setModus("accept")}>
                        <Check className="h-4 w-4 mr-2" />{t("offer.accept")}
                      </Button>
                      <Button size="lg" variant="outline" onClick={() => setModus("question")}>
                        <MessageSquare className="h-4 w-4 mr-2" />{t("offer.ask")}
                      </Button>
                    </div>
                  )}

                  {modus === "accept" && (
                    <div className="space-y-3">
                      <label className="flex items-start gap-2.5 text-sm cursor-pointer">
                        <Checkbox checked={bestaetigt} onCheckedChange={v => setBestaetigt(v === true)} className="mt-0.5" />
                        <span>{t("offer.acceptConfirm")}</span>
                      </label>
                      <Textarea rows={3} maxLength={2000} value={nachricht} placeholder={t("offer.messageOptional")}
                        onChange={e => setNachricht(e.target.value)} />
                      <div className="flex gap-2">
                        <Button disabled={!bestaetigt || sendet} onClick={() => antworten("accept")}>
                          {sendet && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}{t("offer.acceptSend")}
                        </Button>
                        <Button variant="ghost" onClick={() => setModus("none")}>{t("offer.cancel")}</Button>
                      </div>
                    </div>
                  )}

                  {modus === "question" && (
                    <div className="space-y-3">
                      <Textarea rows={4} maxLength={2000} value={nachricht} placeholder={t("offer.questionPlaceholder")}
                        onChange={e => setNachricht(e.target.value)} />
                      <div className="flex gap-2">
                        <Button disabled={nachricht.trim().length < 3 || sendet} onClick={() => antworten("question")}>
                          {sendet && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}{t("offer.questionSend")}
                        </Button>
                        <Button variant="ghost" onClick={() => setModus("none")}>{t("offer.cancel")}</Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <p className="text-xs text-muted-foreground">{t("offer.legalNote")}</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Angebot;
