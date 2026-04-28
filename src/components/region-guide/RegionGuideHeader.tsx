import { Link, useLocation } from "react-router-dom";
import { Mountain } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const RegionGuideHeader = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "de";
  const location = useLocation();
  const showBack = location.pathname !== "/region-guide";

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/region-guide" className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity">
          <Mountain className="h-5 w-5 text-primary" />
          <span className="font-serif text-lg md:text-xl font-semibold tracking-tight">
            {lang === "de" ? "Region-Guide Hohe Tauern" : "Region Guide Hohe Tauern"}
          </span>
        </Link>
        <div className="flex items-center gap-3">
          {showBack && (
            <Link
              to="/region-guide"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:inline"
            >
              {lang === "de" ? "Übersicht" : "Overview"}
            </Link>
          )}
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};

export default RegionGuideHeader;
