import { useTranslation } from "react-i18next";
import { useAboutUs, aboutUsText } from "@/hooks/useAboutUs";
import { useSprache, lokal } from "@/lib/sprache";

/**
 * „Über uns“ - die Gastgeber (public.about_us). Gilt für die ganze Website.
 * Ohne Text oder ausgeschaltet: Abschnitt fehlt (und der Menüpunkt ebenso).
 */
const AboutUs = () => {
  const { t } = useTranslation();
  const sprache = useSprache();
  const { data } = useAboutUs();
  const text = aboutUsText(data, sprache);
  if (!data || !text) return null;

  const titel = lokal(data.title_de, data.title_en, sprache) ?? t("navigation.about");
  const absaetze = text.split(/\n\s*\n/).map(a => a.trim()).filter(Boolean);

  return (
    <section id="ueber-uns" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className={`grid gap-8 md:gap-12 items-center ${data.image_url ? "md:grid-cols-[2fr_3fr]" : ""}`}>
          {data.image_url && (
            <img
              src={data.image_url}
              alt={titel}
              loading="lazy"
              className="w-full aspect-[4/5] object-cover rounded-2xl shadow-md"
            />
          )}
          <div className={data.image_url ? "" : "text-center max-w-3xl mx-auto"}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">{titel}</h2>
            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
              {absaetze.map((a, i) => <p key={i} className="whitespace-pre-line">{a}</p>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
