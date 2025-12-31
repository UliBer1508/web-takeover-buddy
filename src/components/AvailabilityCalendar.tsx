import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { externalSupabase } from "@/integrations/external-supabase/client";
import { DayPicker, DateRange } from "react-day-picker";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Calendar as CalendarIcon, AlertCircle, CheckCircle, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { format, differenceInDays, isSameDay } from "date-fns";
import { de } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import "react-day-picker/dist/style.css";

interface OccupiedDate {
  check_in: string;
  check_out: string;
}

interface AvailabilityCalendarProps {
  externalHouseId?: string | null;
  onDateRangeSelect?: (checkIn: Date | null, checkOut: Date | null) => void;
}

export const AvailabilityCalendar = ({ externalHouseId, onDateRangeSelect }: AvailabilityCalendarProps) => {
  const [selected, setSelected] = useState<DateRange | undefined>();
  // Query ONLY bookings table from external database using external_house_id
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['availability', externalHouseId],
    queryFn: async () => {
      if (!externalHouseId) return [];
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 Sekunden Timeout
      
      try {
        const { data: bookings, error: bookingsError } = await externalSupabase
          .from('bookings')
          .select('check_in, check_out')
          .eq('house_id', externalHouseId)
          .in('status', ['confirmed', 'completed'])
          .abortSignal(controller.signal);

        clearTimeout(timeoutId);

        if (bookingsError) {
          console.error('Error fetching bookings:', bookingsError);
          throw new Error(`bookings: ${bookingsError.message}`);
        }

        console.log(`Loaded ${bookings?.length || 0} confirmed bookings`);
        return (bookings || []) as OccupiedDate[];
      } catch (err) {
        clearTimeout(timeoutId);
        throw err;
      }
    },
    enabled: !!externalHouseId,
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    retry: 3, // 3 Versuche
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000) // Exponential Backoff
  });

  // Calculate all occupied dates
  const occupiedDates = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const dates: Date[] = [];
    data.forEach(booking => {
      const start = new Date(booking.check_in);
      const end = new Date(booking.check_out);
      
      let current = new Date(start);
      while (current <= end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
    });
    
    return dates;
  }, [data]);

  // Check if a date range is valid (no occupied dates in between)
  const isRangeValid = (range: DateRange | undefined) => {
    if (!range?.from || !range?.to) return true;
    
    let current = new Date(range.from);
    while (current <= range.to) {
      if (occupiedDates.some(d => isSameDay(d, current))) {
        return false;
      }
      current.setDate(current.getDate() + 1);
    }
    return true;
  };

  // Handle date selection with validation
  const handleSelect = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      const nights = differenceInDays(range.to, range.from);
      
      // Check minimum stay (4 nights)
      if (nights < 4) {
        toast({
          title: "Mindestaufenthalt nicht erfüllt",
          description: "Bitte wählen Sie mindestens 4 Nächte",
          variant: "destructive"
        });
        return;
      }
      
      // Check for occupied dates in range
      if (!isRangeValid(range)) {
        toast({
          title: "Zeitraum nicht verfügbar",
          description: "Der gewählte Zeitraum enthält bereits belegte Tage",
          variant: "destructive"
        });
        return;
      }
      
      setSelected(range);
      onDateRangeSelect?.(range.from, range.to);
    } else {
      setSelected(range);
    }
  };

  // Reset selection
  const handleReset = () => {
    setSelected(undefined);
    onDateRangeSelect?.(null, null);
  };

  const modifiers = { occupied: occupiedDates };
  const modifiersClassNames = {
    occupied: 'calendar-occupied',
  };

  return (
    <>
      <style>{`
        .calendar-premium {
          width: 100%;
        }
        
        .calendar-premium .rdp {
          margin: 0;
          width: 100%;
        }
        
        .calendar-premium .rdp-months {
          display: flex;
          gap: 3rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .calendar-premium .rdp-month {
          flex: 1;
          min-width: 320px;
          max-width: 420px;
        }
        
        .calendar-premium .rdp-caption {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1.5rem 0;
          margin-bottom: 1rem;
        }
        
        .calendar-premium .rdp-caption_label {
          font-size: 1.5rem;
          font-weight: 700;
          color: hsl(var(--foreground));
          text-transform: capitalize;
        }
        
        .calendar-premium .rdp-head_cell {
          font-size: 0.875rem;
          font-weight: 600;
          color: hsl(var(--muted-foreground));
          text-transform: uppercase;
          padding: 0.75rem 0;
          letter-spacing: 0.05em;
        }
        
        .calendar-premium .rdp-cell {
          padding: 0.25rem;
        }
        
        .calendar-premium .rdp-day {
          width: 56px;
          height: 56px;
          font-size: 1.125rem;
          font-weight: 600;
          border-radius: 0.5rem;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border: 2px solid transparent;
          background: hsl(var(--background));
          color: hsl(var(--foreground));
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
        
        .calendar-premium .calendar-occupied::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 10%;
          right: 10%;
          height: 2px;
          background: white;
          transform: translateY(-50%);
        }
        
        .calendar-premium .calendar-occupied:hover {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%) !important;
          transform: scale(0.98);
        }
        
        .calendar-premium .rdp-day_today:not(.calendar-occupied) {
          border-color: hsl(var(--primary));
          background: hsl(var(--primary) / 0.1);
          font-weight: 700;
        }
        
        /* Range selection styles */
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
        
        @media (max-width: 768px) {
          .calendar-premium .rdp-day {
            width: 48px;
            height: 48px;
            font-size: 1rem;
          }
          
          .calendar-premium .rdp-months {
            gap: 1.5rem;
          }
        }
      `}</style>
      
      <Card className="shadow-xl border-2">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <CalendarIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-3xl">Verfügbarkeitskalender</CardTitle>
              <CardDescription className="text-base mt-1">
                Belegte Tage sind rot markiert und durchgestrichen
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="px-6 pb-8">
          {isLoading && (
            <div className="flex flex-col justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <span className="text-lg text-muted-foreground">Lade Verfügbarkeit...</span>
            </div>
          )}
          
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription className="space-y-3">
                <div>
                  <strong className="text-base">Verbindungsproblem</strong>
                  <p className="text-sm mt-2">
                    Die Buchungsdaten können momentan nicht geladen werden. 
                    Die externe Datenbank ist möglicherweise pausiert oder nicht erreichbar.
                  </p>
                  <p className="text-sm mt-1 opacity-75">{(error as Error).message}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => refetch()}
                  className="bg-background hover:bg-accent"
                >
                  Erneut versuchen
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          {!isLoading && !error && (
            <div className="space-y-8">
              {/* Selected Range Display */}
              {selected?.from && selected?.to && (
                <Alert className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-800 dark:text-green-200 flex items-center justify-between">
                    <div>
                      <strong className="font-semibold">Ausgewählter Zeitraum:</strong>
                      <div className="mt-1 text-base">
                        {format(selected.from, 'dd. MMMM yyyy', { locale: de })} bis{' '}
                        {format(selected.to, 'dd. MMMM yyyy', { locale: de })}
                        <span className="ml-2 font-semibold">
                          ({differenceInDays(selected.to, selected.from)} {differenceInDays(selected.to, selected.from) === 1 ? 'Nacht' : 'Nächte'})
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleReset}
                      className="ml-4 text-green-700 hover:text-green-900 hover:bg-green-100 dark:text-green-300 dark:hover:text-green-100"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Zurücksetzen
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="calendar-premium">
                <DayPicker
                  mode="range"
                  selected={selected}
                  onSelect={handleSelect}
                  numberOfMonths={2}
                  disabled={{ before: new Date() }}
                  modifiers={modifiers}
                  modifiersClassNames={modifiersClassNames}
                  showOutsideDays
                  fixedWeeks
                />
              </div>
              
              {/* Legend */}
              <div className="flex flex-wrap gap-6 justify-center pt-6 border-t">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-background border-2 border-primary shadow-sm"></div>
                  <span className="font-semibold text-base">Verfügbar</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600 shadow-sm relative">
                    <div className="absolute top-1/2 left-1 right-1 h-0.5 bg-white transform -translate-y-1/2"></div>
                  </div>
                  <span className="font-semibold text-base">Belegt</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted opacity-30 shadow-sm"></div>
                  <span className="font-semibold text-base">Vergangen</span>
                </div>
              </div>

              {/* Statistics */}
              {data && data.length > 0 && (
                <div className="text-center">
                  <p className="text-base text-muted-foreground font-medium">
                    📊 {data.length} bestätigte {data.length === 1 ? 'Buchung' : 'Buchungen'}
                  </p>
                </div>
              )}
              
              {data && data.length === 0 && (
                <div className="text-center">
                  <p className="text-base text-green-600 font-semibold">
                    ✓ Aktuell keine bestätigten Buchungen
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};
