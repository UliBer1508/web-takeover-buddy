import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { externalSupabase } from "@/integrations/external-supabase/client";
import { DayPicker, DateRange, DayContentProps } from "react-day-picker";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Calendar as CalendarIcon, AlertCircle, CheckCircle, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { format, differenceInDays, isSameDay } from "date-fns";
import { de, enUS } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from "react-i18next";
import "react-day-picker/dist/style.css";

/** Status eines Tages fuer EIN Haus. */
type DayStatus = "free" | "occupied" | "checkIn" | "checkOut" | "changeover";

interface AvailabilityRow {
  house_id: string;
  check_in: string;
  check_out: string;
  status: string | null;
}

/** Nur die Felder, die der Kalender braucht. */
export interface CalendarHouse {
  id: string;
  name: string;
  external_house_id: string | null;
  color: string;
}

interface AvailabilityCalendarProps {
  /** Alle freigeschalteten Haeuser. Der Kalender zeigt die Belegung von allen. */
  houses: CalendarHouse[];
  /** Fuer dieses Haus wird ausgewaehlt und gebucht. */
  selectedHouseId: string | null;
  onDateRangeSelect?: (checkIn: Date | null, checkOut: Date | null) => void;
}

const dayKey = (d: Date) => d.toDateString();

export const AvailabilityCalendar = ({
  houses,
  selectedHouseId,
  onDateRangeSelect,
}: AvailabilityCalendarProps) => {
  const { t, i18n } = useTranslation();
  const [selected, setSelected] = useState<DateRange | undefined>();
  const isMobile = useIsMobile();
  const dateLocale = i18n.language === "de" ? de : enUS;

  // Haeuser, die tatsaechlich einen Kalender in der Hausverwaltung haben.
  const housesWithCalendar = useMemo(
    () => houses.filter(h => !!h.external_house_id),
    [houses]
  );
  const externalIds = useMemo(
    () => housesWithCalendar.map(h => h.external_house_id as string),
    [housesWithCalendar]
  );

  const selectedHouse =
    houses.find(h => h.id === selectedHouseId) || houses[0] || null;

  // EINE Abfrage fuer alle Haeuser. Die Belegung aller Haeuser wird im Kalender
  // angezeigt; gebucht wird immer nur das gerade gewaehlte Haus.
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["availability", externalIds.join(",")],
    queryFn: async () => {
      if (externalIds.length === 0) return [] as AvailabilityRow[];

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      try {
        const { data: rows, error: queryError } = await externalSupabase
          .from("public_availability")
          .select("house_id, check_in, check_out, status")
          .in("house_id", externalIds)
          .abortSignal(controller.signal);

        if (queryError) {
          console.error("Error fetching availability:", queryError);
          throw new Error(`public_availability: ${queryError.message}`);
        }

        // Sicherheitsnetz: Die View public_availability liefert bereits nur
        // 'confirmed' und 'checked_in'. Der Filter bleibt als zweite Ebene,
        // falls die View-Definition erweitert wird.
        const confirmedStatuses = ["confirmed", "checked_in", "bestätigt", "eingescheckt"];
        const bookings = (rows || []).filter(b =>
          confirmedStatuses.some(s => b.status?.toLowerCase() === s.toLowerCase())
        );

        clearTimeout(timeoutId);
        return bookings as AvailabilityRow[];
      } catch (err) {
        clearTimeout(timeoutId);
        throw err;
      }
    },
    enabled: externalIds.length > 0,
    refetchInterval: 5 * 60 * 1000,
    staleTime: 2 * 60 * 1000,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  // Je Haus eine Tages-Landkarte aufbauen.
  // Belegt = Tag NACH Check-in bis Tag VOR Check-out (der Check-in-Tag selbst
  // ist vormittags noch frei, der Check-out-Tag nachmittags wieder).
  const statusByHouse = useMemo(() => {
    const map = new Map<string, Map<string, DayStatus>>();
    housesWithCalendar.forEach(h => map.set(h.id, new Map()));
    if (!data || data.length === 0) return map;

    housesWithCalendar.forEach(house => {
      const rows = data.filter(b => b.house_id === house.external_house_id);
      const days = map.get(house.id)!;
      const checkIns = new Set<string>();
      const checkOuts = new Set<string>();

      rows.forEach(booking => {
        const start = new Date(booking.check_in);
        const end = new Date(booking.check_out);
        checkIns.add(dayKey(start));
        checkOuts.add(dayKey(end));

        const current = new Date(start);
        current.setDate(current.getDate() + 1);
        while (current < end) {
          days.set(dayKey(current), "occupied");
          current.setDate(current.getDate() + 1);
        }
      });

      checkIns.forEach(key => {
        days.set(key, checkOuts.has(key) ? "changeover" : "checkIn");
      });
      checkOuts.forEach(key => {
        if (!checkIns.has(key)) days.set(key, "checkOut");
      });
    });

    return map;
  }, [data, housesWithCalendar]);

  const selectedHouseDays = useMemo(
    () => (selectedHouse ? statusByHouse.get(selectedHouse.id) ?? new Map() : new Map()),
    [statusByHouse, selectedHouse]
  );

  // Modifier-Listen fuer das gewaehlte Haus - sie steuern die Farbflaechen,
  // genau wie vorher beim Ein-Haus-Kalender.
  const { occupiedDates, transitionDates, checkOutDates, changeoverDates } = useMemo(() => {
    const occupied: Date[] = [];
    const transitions: Date[] = [];
    const checkOutOnly: Date[] = [];
    const changeover: Date[] = [];

    selectedHouseDays.forEach((status: DayStatus, key: string) => {
      const date = new Date(key);
      if (status === "occupied") occupied.push(date);
      else if (status === "checkIn") transitions.push(date);
      else if (status === "checkOut") checkOutOnly.push(date);
      else if (status === "changeover") changeover.push(date);
    });

    return {
      occupiedDates: occupied,
      transitionDates: transitions,
      checkOutDates: checkOutOnly,
      changeoverDates: changeover,
    };
  }, [selectedHouseDays]);

  // Gueltigkeit prueft NUR das gewaehlte Haus.
  const isRangeValid = (range: DateRange | undefined) => {
    if (!range?.from || !range?.to) return true;
    const current = new Date(range.from);
    while (current < range.to) {
      if (occupiedDates.some(d => isSameDay(d, current))) return false;
      current.setDate(current.getDate() + 1);
    }
    return true;
  };

  const handleSelect = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      const nights = differenceInDays(range.to, range.from);

      if (nights < 4) {
        toast({
          title: t("calendar.minStay"),
          description: t("calendar.minStayDesc"),
          variant: "destructive",
        });
        return;
      }

      if (!isRangeValid(range)) {
        toast({
          title: t("calendar.notAvailable"),
          description: t("calendar.notAvailableDesc"),
          variant: "destructive",
        });
        return;
      }

      setSelected(range);
      onDateRangeSelect?.(range.from, range.to);
    } else {
      setSelected(range);
    }
  };

  const handleReset = () => {
    setSelected(undefined);
    onDateRangeSelect?.(null, null);
  };

  const modifiers = {
    occupied: occupiedDates,
    transition: transitionDates,
    checkOut: checkOutDates,
    changeover: changeoverDates,
  };
  const modifiersClassNames = {
    occupied: "calendar-occupied",
    transition: "calendar-checkin-only",
    checkOut: "calendar-checkout-only",
    changeover: "calendar-changeover",
  };

  // Punkt je Haus: gefuellt = belegt, halb = An-/Abreise, leer = frei.
  const dotStyle = (status: DayStatus, color: string): React.CSSProperties => {
    if (status === "occupied" || status === "changeover") {
      return { background: color, borderColor: color };
    }
    if (status === "checkIn") {
      return { background: `linear-gradient(135deg, transparent 50%, ${color} 50%)`, borderColor: color };
    }
    if (status === "checkOut") {
      return { background: `linear-gradient(135deg, ${color} 50%, transparent 50%)`, borderColor: color };
    }
    return { background: "transparent", borderColor: "currentColor", opacity: 0.35 };
  };

  const showDots = housesWithCalendar.length > 1;

  const DayContent = (props: DayContentProps) => {
    const key = dayKey(props.date);
    return (
      <span className="day-content">
        <span className="day-number">{props.date.getDate()}</span>
        {showDots && (
          <span className="house-dots">
            {housesWithCalendar.map(house => {
              const status = (statusByHouse.get(house.id)?.get(key) ?? "free") as DayStatus;
              return (
                <span
                  key={house.id}
                  className="house-dot"
                  style={dotStyle(status, house.color)}
                  title={`${house.name}: ${
                    status === "free" ? "frei" : status === "occupied" ? "belegt" : "An-/Abreise"
                  }`}
                />
              );
            })}
          </span>
        )}
      </span>
    );
  };

  // Anzahl bestaetigter Buchungen des gewaehlten Hauses.
  const selectedHouseBookings = selectedHouse
    ? (data || []).filter(b => b.house_id === selectedHouse.external_house_id).length
    : 0;

  return (
    <>
      <style>{`
        .calendar-premium {
          width: 100%;
          overflow-x: hidden;
        }

        .calendar-premium .rdp {
          margin: 0;
          width: 100%;
        }

        .calendar-premium .rdp-months {
          display: flex;
          gap: ${isMobile ? "1rem" : "3rem"};
          justify-content: center;
          flex-wrap: wrap;
        }

        .calendar-premium .rdp-month {
          flex: ${isMobile ? "0 0 100%" : "1"};
          min-width: ${isMobile ? "auto" : "320px"};
          max-width: ${isMobile ? "100%" : "420px"};
          width: ${isMobile ? "100%" : "auto"};
        }

        .calendar-premium .rdp-table {
          width: 100%;
        }

        .calendar-premium .rdp-caption {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: ${isMobile ? "0.75rem 0" : "1.5rem 0"};
          margin-bottom: ${isMobile ? "0.5rem" : "1rem"};
        }

        .calendar-premium .rdp-caption_label {
          font-size: ${isMobile ? "1.125rem" : "1.5rem"};
          font-weight: 700;
          color: hsl(var(--foreground));
          text-transform: capitalize;
        }

        .calendar-premium .rdp-head_cell {
          font-size: ${isMobile ? "0.7rem" : "0.875rem"};
          font-weight: 600;
          color: hsl(var(--muted-foreground));
          text-transform: uppercase;
          padding: ${isMobile ? "0.5rem 0" : "0.75rem 0"};
          letter-spacing: 0.05em;
        }

        .calendar-premium .rdp-cell {
          padding: ${isMobile ? "1px" : "0.25rem"};
        }

        .calendar-premium .rdp-day {
          width: ${isMobile ? "40px" : "56px"};
          height: ${isMobile ? "40px" : "56px"};
          font-size: ${isMobile ? "0.875rem" : "1.125rem"};
          font-weight: 600;
          border-radius: ${isMobile ? "0.375rem" : "0.5rem"};
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border: 2px solid transparent;
          background: hsl(var(--background));
          color: hsl(var(--foreground));
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Tagesinhalt: Zahl, darunter ein Punkt je Haus */
        .calendar-premium .day-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: ${isMobile ? "2px" : "3px"};
          line-height: 1;
        }

        .calendar-premium .day-number {
          line-height: 1;
        }

        .calendar-premium .house-dots {
          display: flex;
          gap: ${isMobile ? "2px" : "3px"};
        }

        .calendar-premium .house-dot {
          width: ${isMobile ? "5px" : "7px"};
          height: ${isMobile ? "5px" : "7px"};
          border-radius: 50%;
          border: 1px solid;
          box-sizing: border-box;
          display: block;
        }

        .calendar-premium .rdp-day:hover:not(.rdp-day_disabled):not(.calendar-occupied) {
          transform: scale(1.08);
          background: hsl(var(--accent));
          border-color: hsl(var(--primary));
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 10;
        }

        .calendar-premium .rdp-day_disabled {
          opacity: 0.3;
          color: hsl(var(--muted-foreground));
          cursor: not-allowed;
        }

        .calendar-premium .calendar-occupied {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
          color: white !important;
          font-weight: 700;
          position: relative;
          transform: scale(0.95);
          border-color: #b91c1c;
        }

        .calendar-premium .calendar-occupied:hover {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%) !important;
          transform: scale(0.98);
        }

        /* Check-in-only Tag: Diagonal geteilt - oben-links frei, unten-rechts belegt */
        .calendar-premium .calendar-checkin-only {
          background: linear-gradient(
            135deg,
            hsl(var(--background)) 0%,
            hsl(var(--background)) 42%,
            #9ca3af 42%,
            #9ca3af 58%,
            #ef4444 58%,
            #ef4444 100%
          ) !important;
          color: hsl(var(--foreground)) !important;
          font-weight: 700;
          position: relative;
          border: 2px solid #d1d5db;
        }

        .calendar-premium .calendar-checkin-only:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        /* Check-out-only Tag: oben-links belegt, unten-rechts frei */
        .calendar-premium .calendar-checkout-only {
          background: linear-gradient(
            135deg,
            #ef4444 0%,
            #ef4444 42%,
            #9ca3af 42%,
            #9ca3af 58%,
            hsl(var(--background)) 58%,
            hsl(var(--background)) 100%
          ) !important;
          color: hsl(var(--foreground)) !important;
          font-weight: 700;
          position: relative;
          border: 2px solid #d1d5db;
        }

        .calendar-premium .calendar-checkout-only:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        /* Wechseltag: beide Ecken rot, grauer Streifen in der Mitte */
        .calendar-premium .calendar-changeover {
          background: linear-gradient(
            135deg,
            #ef4444 0%,
            #ef4444 42%,
            #9ca3af 42%,
            #9ca3af 58%,
            #ef4444 58%,
            #ef4444 100%
          ) !important;
          color: hsl(var(--foreground)) !important;
          font-weight: 700;
          position: relative;
          border: 2px solid #d1d5db;
        }

        .calendar-premium .calendar-changeover:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .calendar-premium .rdp-day_today:not(.calendar-occupied) {
          border-color: hsl(var(--primary));
          background: hsl(var(--primary) / 0.1);
          font-weight: 700;
        }

        .calendar-premium .rdp-day_range_start,
        .calendar-premium .rdp-day_range_end {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
          color: white !important;
          font-weight: 700;
          border-color: #047857 !important;
          transform: scale(1.05);
          box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);
        }

        .calendar-premium .rdp-day_range_middle {
          background: hsl(var(--primary) / 0.15) !important;
          border-color: hsl(var(--primary) / 0.3) !important;
          color: hsl(var(--foreground));
        }

        .calendar-premium .rdp-day_range_start:hover,
        .calendar-premium .rdp-day_range_end:hover {
          transform: scale(1.08);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
        }
      `}</style>

      <Card className="shadow-xl border-2">
        <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
              <CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl sm:text-3xl">
                {isMobile ? t("calendar.titleMobile") : t("calendar.title")}
              </CardTitle>
              <CardDescription className="text-sm sm:text-base mt-0.5 sm:mt-1">
                {selectedHouse && showDots
                  ? `Auswahl gilt für: ${selectedHouse.name}`
                  : isMobile
                    ? t("calendar.subtitleMobile")
                    : t("calendar.subtitle")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-2 sm:px-6 pb-4 sm:pb-8">
          {isLoading && (
            <div className="flex flex-col justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <span className="text-lg text-muted-foreground">{t("calendar.loading")}</span>
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription className="space-y-3">
                <div>
                  <strong className="text-base">{t("calendar.connectionError")}</strong>
                  <p className="text-sm mt-2">{t("calendar.connectionErrorDesc")}</p>
                  <p className="text-sm mt-1 opacity-75">{(error as Error).message}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  className="bg-background hover:bg-accent"
                >
                  {t("calendar.retry")}
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {!isLoading && !error && (
            <div className="space-y-4 sm:space-y-8">
              {selected?.from && selected?.to && (
                <Alert className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-800 dark:text-green-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <strong className="font-semibold text-sm sm:text-base">
                        {t("calendar.selectedRange")}
                        {selectedHouse && showDots ? ` — ${selectedHouse.name}` : ""}
                      </strong>
                      <div className="mt-0.5 sm:mt-1 text-sm sm:text-base">
                        {format(selected.from, isMobile ? "dd.MM.yy" : "dd. MMMM yyyy", { locale: dateLocale })} –{" "}
                        {format(selected.to, isMobile ? "dd.MM.yy" : "dd. MMMM yyyy", { locale: dateLocale })}
                        <span className="ml-1 sm:ml-2 font-semibold">
                          ({differenceInDays(selected.to, selected.from)}{" "}
                          {differenceInDays(selected.to, selected.from) === 1
                            ? t("calendar.night")
                            : t("calendar.nights")})
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleReset}
                      className="self-start sm:self-auto text-green-700 hover:text-green-900 hover:bg-green-100 dark:text-green-300 dark:hover:text-green-100"
                    >
                      <X className="h-4 w-4 mr-1" />
                      {t("calendar.reset")}
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              <div className="calendar-premium">
                <DayPicker
                  mode="range"
                  selected={selected}
                  onSelect={handleSelect}
                  numberOfMonths={isMobile ? 1 : 2}
                  disabled={{ before: new Date() }}
                  modifiers={modifiers}
                  modifiersClassNames={modifiersClassNames}
                  showOutsideDays={false}
                  locale={dateLocale}
                  components={{ DayContent }}
                />
              </div>

              {/* Punkte-Legende: nur sinnvoll, wenn mehrere Haeuser sichtbar sind */}
              {showDots && (
                <div className="rounded-lg border bg-muted/40 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                    Punkte unter der Zahl = Belegung je Haus
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {housesWithCalendar.map(house => (
                      <div key={house.id} className="flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className="w-2.5 h-2.5 rounded-full border"
                          style={{ background: house.color, borderColor: house.color }}
                        />
                        <span
                          className={`text-sm ${
                            house.id === selectedHouse?.id ? "font-semibold" : "text-muted-foreground"
                          }`}
                        >
                          {house.name}
                          {house.id === selectedHouse?.id && " (ausgewählt)"}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="w-2.5 h-2.5 rounded-full border border-muted-foreground/50"
                      />
                      <span className="text-sm text-muted-foreground">leer = frei</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Flaechen-Legende gilt fuer das ausgewaehlte Haus */}
              <div className="flex flex-wrap gap-3 sm:gap-6 justify-center pt-4 sm:pt-6 border-t">
                <div className="flex items-center gap-1.5 sm:gap-3">
                  <div className="w-5 h-5 sm:w-8 sm:h-8 rounded sm:rounded-lg bg-background border-2 border-primary shadow-sm"></div>
                  <span className="font-medium sm:font-semibold text-xs sm:text-base">
                    {t("calendar.available")}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-3">
                  <div className="w-5 h-5 sm:w-8 sm:h-8 rounded sm:rounded-lg bg-gradient-to-br from-red-500 to-red-600 shadow-sm relative"></div>
                  <span className="font-medium sm:font-semibold text-xs sm:text-base">
                    {t("calendar.occupied")}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-3">
                  <div
                    className="w-5 h-5 sm:w-8 sm:h-8 rounded sm:rounded-lg shadow-sm relative overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(135deg, white 0%, white 42%, #9ca3af 42%, #9ca3af 58%, #ef4444 58%, #ef4444 100%)",
                      border: "2px solid #d1d5db",
                    }}
                  ></div>
                  <span className="font-medium sm:font-semibold text-xs sm:text-base">
                    {t("calendar.checkInDay")}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-3">
                  <div
                    className="w-5 h-5 sm:w-8 sm:h-8 rounded sm:rounded-lg shadow-sm relative overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(135deg, #ef4444 0%, #ef4444 42%, #9ca3af 42%, #9ca3af 58%, white 58%, white 100%)",
                      border: "2px solid #d1d5db",
                    }}
                  ></div>
                  <span className="font-medium sm:font-semibold text-xs sm:text-base">
                    {t("calendar.checkOutDay")}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-3">
                  <div
                    className="w-5 h-5 sm:w-8 sm:h-8 rounded sm:rounded-lg shadow-sm relative overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(135deg, #ef4444 0%, #ef4444 42%, #9ca3af 42%, #9ca3af 58%, #ef4444 58%, #ef4444 100%)",
                      border: "2px solid #d1d5db",
                    }}
                  ></div>
                  <span className="font-medium sm:font-semibold text-xs sm:text-base">
                    {t("calendar.changeoverDay")}
                  </span>
                </div>
              </div>

              {selectedHouse && selectedHouseBookings > 0 && (
                <div className="text-center">
                  <p className="text-base text-muted-foreground font-medium">
                    {selectedHouseBookings}{" "}
                    {selectedHouseBookings === 1
                      ? t("calendar.confirmedBooking")
                      : t("calendar.confirmedBookings")}
                    {showDots ? ` — ${selectedHouse.name}` : ""}
                  </p>
                </div>
              )}

              {selectedHouse && selectedHouseBookings === 0 && (
                <div className="text-center">
                  <p className="text-base text-green-600 font-semibold">
                    ✓ {t("calendar.noBookings")}
                  </p>
                </div>
              )}

              {selectedHouse && !selectedHouse.external_house_id && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Für dieses Haus ist noch kein Kalender verknüpft. Die angezeigte
                    Verfügbarkeit ist deshalb unvollständig — bitte Anfrage stellen,
                    wir bestätigen den Zeitraum persönlich.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};
