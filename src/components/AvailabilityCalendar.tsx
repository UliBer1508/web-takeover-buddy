import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { externalSupabase } from "@/integrations/external-supabase/client";
import { DayPicker } from "react-day-picker";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Calendar as CalendarIcon, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const HOUSE_ID = "f5b4588b-96cf-46f7-b84a-5f6750f7088e";

interface OccupiedDate {
  check_in: string;
  check_out: string;
}

export const AvailabilityCalendar = () => {
  // Query ONLY bookings table
  const { data, isLoading, error } = useQuery({
    queryKey: ['availability', HOUSE_ID],
    queryFn: async () => {
      const { data: bookings, error: bookingsError } = await externalSupabase
        .from('bookings')
        .select('check_in, check_out')
        .eq('house_id', HOUSE_ID)
        .in('status', ['confirmed', 'completed']);

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError);
        throw new Error(`bookings: ${bookingsError.message}`);
      }

      console.log(`Loaded ${bookings?.length || 0} confirmed bookings`);
      return (bookings || []) as OccupiedDate[];
    },
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    retry: 2
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

  const modifiers = { occupied: occupiedDates };
  const modifiersClassNames = {
    occupied: 'bg-red-500 text-white hover:bg-red-600 line-through font-bold',
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          <CardTitle>Verfügbarkeitskalender</CardTitle>
        </div>
        <CardDescription>
          Belegte Tage sind rot markiert. Wählen Sie freie Tage für Ihre Buchungsanfrage.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Lade Verfügbarkeit...</span>
          </div>
        )}
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Fehler beim Laden der Verfügbarkeit</strong>
              <p className="text-sm mt-1">{(error as Error).message}</p>
              <p className="text-xs mt-2 opacity-80">
                Mögliche Ursachen: Tabelle existiert nicht, Netzwerkfehler, oder Berechtigungen fehlen.
              </p>
            </AlertDescription>
          </Alert>
        )}
        
        {!isLoading && !error && (
          <>
            <DayPicker
              mode="single"
              disabled={{ before: new Date() }}
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
              className="rounded-md border p-4 shadow-sm"
              showOutsideDays
              fixedWeeks
            />
            
            {/* Legend */}
            <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-500 rounded shadow-sm"></div>
                <span className="font-medium">Verfügbar</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-red-500 rounded shadow-sm"></div>
                <span className="font-medium">Belegt</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-300 rounded shadow-sm"></div>
                <span className="font-medium">Vergangen</span>
              </div>
            </div>

            {/* Statistics */}
            {data && data.length > 0 && (
              <p className="mt-4 text-sm text-muted-foreground">
                📊 {data.length} bestätigte {data.length === 1 ? 'Buchung' : 'Buchungen'}
              </p>
            )}
            
            {data && data.length === 0 && (
              <p className="mt-4 text-sm text-green-600 font-medium">
                ✓ Aktuell keine bestätigten Buchungen
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
