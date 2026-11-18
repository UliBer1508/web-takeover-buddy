import { useTranslation } from "react-i18next";
import { Sun, Home } from "lucide-react";
import type { Mietart } from "@/hooks/useLongTerm";

interface RentalModeSwitchProps {
  value: Mietart;
  onChange: (mode: Mietart) => void;
}

/**
 * Umschalter „Urlaub | Wohnen auf Zeit“ über den Hauskarten. Erscheint nur, wenn
 * er in den Website-Einstellungen eingeschaltet ist (site_settings.show_mode_switch)
 * und es Häuser in beiden Vermietungsarten gibt.
 */
const RentalModeSwitch = ({ value, onChange }: RentalModeSwitchProps) => {
  const { t } = useTranslation();
  const knopf = (mode: Mietart, Icon: typeof Sun, label: string) => (
    <button
      type="button"
      role="radio"
      aria-checked={value === mode}
      onClick={() => onChange(mode)}
      className={`inline-flex items-center gap-2 h-9 px-4 rounded-full text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
        value === mode ? "bg-primary text-primary-foreground shadow" : "text-foreground hover:bg-background/70"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );

  return (
    <div className="flex justify-center mb-3">
      <div
        role="radiogroup"
        aria-label={t("modeSwitch.label")}
        className="inline-flex gap-1 p-1 rounded-full bg-background/90 backdrop-blur-md shadow-lg"
      >
        {knopf("short", Sun, t("modeSwitch.short"))}
        {knopf("long", Home, t("modeSwitch.long"))}
      </div>
    </div>
  );
};

export default RentalModeSwitch;
