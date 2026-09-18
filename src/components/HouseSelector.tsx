import { Home } from "lucide-react";
import type { SelectableHouse } from "@/hooks/useHouseSelection";

interface HouseSelectorProps {
  houses: SelectableHouse[];
  selectedHouseId: string | null;
  onHouseChange: (houseId: string) => void;
}

/**
 * Umschalter zwischen den Haeusern. Wird nur gezeigt, wenn mehr als ein Haus
 * freigeschaltet ist - bei einem Haus verhaelt sich die Seite wie vorher.
 * Die Haeuser kommen als Prop herein, damit Selector und Kalender garantiert
 * dieselbe Liste und dieselben Farben verwenden.
 */
const HouseSelector = ({ houses, selectedHouseId, onHouseChange }: HouseSelectorProps) => {
  if (!houses || houses.length <= 1) return null;

  const activeId = selectedHouseId || houses[0]?.id;

  return (
    <div className="flex justify-center py-3">
      <div
        role="tablist"
        aria-label="Haus auswählen"
        className="inline-flex gap-1 p-1 rounded-full bg-muted/70 border"
      >
        {houses.map((house) => {
          const isActive = house.id === activeId;
          return (
            <button
              key={house.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onHouseChange(house.id)}
              className={`
                flex items-center gap-2 h-11 px-5 rounded-full text-sm transition-colors
                ${isActive
                  ? "bg-foreground text-background font-semibold shadow-sm"
                  : "text-muted-foreground hover:text-foreground font-medium"}
              `}
            >
              <span
                aria-hidden="true"
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: house.color }}
              />
              <span className="hidden sm:inline">{house.name}</span>
              <span className="sm:hidden flex items-center gap-1">
                <Home className="h-4 w-4" />
                {house.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HouseSelector;
