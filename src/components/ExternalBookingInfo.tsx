import { ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useHouseBookingInfo, infoText } from "@/hooks/useHouseBookingInfo";

interface ExternalBookingInfoProps {
  houseId: string;
  houseName: string;
}

/**
 * Ersetzt das Anfrageformular, wenn ein Haus nicht direkt buchbar ist
 * (houses.direct_booking = false). Titel, Text, Knopf und Plattformliste
 * kommen aus public.house_booking_info.
 */
const ExternalBookingInfo = ({ houseId, houseName }: ExternalBookingInfoProps) => {
  const { i18n } = useTranslation();
  const lang: "de" | "en" = i18n.language?.startsWith("en") ? "en" : "de";
  const { data: info, isLoading } = useHouseBookingInfo(houseId);

  if (isLoading || !info) return null;

  const titel = infoText(info, "title", lang);
  const text = infoText(info, "text", lang);
  const plattformen = (info.platforms || []).filter(p => p?.name?.trim());

  return (
    <Card className="shadow-xl animate-scale-in overflow-hidden">
      <CardHeader>
        {titel && <CardTitle>{titel}</CardTitle>}
        <CardDescription className="text-base">
          <span className="block font-medium text-foreground">{houseName}</span>
          {text && <span className="block mt-1">{text}</span>}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {plattformen.length > 0 && (
          <ul className="flex flex-wrap gap-2" aria-label={titel ?? houseName}>
            {plattformen.map((p, i) => (
              <li key={`${p.name}-${i}`}>
                {p.url ? (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-primary/40 text-primary text-sm font-medium hover:bg-primary/10 transition-colors"
                  >
                    {p.name}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <span className="inline-flex items-center h-8 px-3 rounded-full bg-muted text-muted-foreground text-sm">
                    {p.name}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}

        {info.main_url && (
          <Button asChild size="lg" className="w-full">
            <a href={info.main_url} target="_blank" rel="noopener noreferrer">
              {info.main_label?.trim() || info.main_url}
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ExternalBookingInfo;
