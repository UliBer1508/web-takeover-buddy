import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const RegionGuideFooter = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "de";

  return (
    <footer className="border-t mt-20 bg-muted/30">
      <div className="container mx-auto px-4 py-10 text-center space-y-3">
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {lang === "de"
            ? "Ein Reise-Guide für die Region Hohe Tauern, Pinzgau & Pongau. Inspiration für Ausflüge, Wanderungen, Skitage und Kulturerlebnisse."
            : "A travel guide for the Hohe Tauern, Pinzgau & Pongau region. Inspiration for outings, hikes, ski days, and cultural experiences."}
        </p>
        <p className="text-xs text-muted-foreground">
          {lang === "de" ? "Unterkunft in der Region: " : "Accommodation in the region: "}
          <Link to="/" className="underline hover:text-foreground">
            steinbockchalets.com
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default RegionGuideFooter;
