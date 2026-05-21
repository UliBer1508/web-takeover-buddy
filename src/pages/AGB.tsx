import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const AGB = () => {
  const { t } = useTranslation();

  const sections = [
    { titleKey: "legal.terms.bookingTitle", textKey: "legal.terms.bookingText" },
    { titleKey: "legal.terms.paymentTitle", textKey: "legal.terms.paymentText" },
    { titleKey: "legal.terms.cancellationTitle", textKey: "legal.terms.cancellationText" },
    { titleKey: "legal.terms.liabilityTitle", textKey: "legal.terms.liabilityText" },
    { titleKey: "legal.terms.jurisdictionTitle", textKey: "legal.terms.jurisdictionText" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{t("legal.terms.title")} | Steinbock Chalets</title>
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://steinbockchalets.com/agb" />
      </Helmet>
      <Navigation />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 max-w-3xl">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          {t("legal.backHome")}
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-10">{t("legal.terms.title")}</h1>

        <div className="space-y-8 text-base leading-relaxed">
          {sections.map((s) => (
            <section key={s.titleKey}>
              <h2 className="text-xl font-semibold mb-3 text-primary">{t(s.titleKey)}</h2>
              <p>{t(s.textKey)}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AGB;
