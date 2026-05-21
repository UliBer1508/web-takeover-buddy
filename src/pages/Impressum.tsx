import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Impressum = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{t("legal.imprint.title")} | Steinbock Chalets</title>
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://steinbockchalets.com/impressum" />
      </Helmet>
      <Navigation />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 max-w-3xl">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          {t("legal.backHome")}
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-2">{t("legal.imprint.title")}</h1>
        <p className="text-muted-foreground mb-10">{t("legal.imprint.legalNote")}</p>

        <div className="space-y-8 text-base leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-primary">{t("legal.imprint.operator")}</h2>
            <p className="bg-muted/50 border border-border rounded-md px-4 py-3 font-medium">
              {t("legal.imprint.namePlaceholder")}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-primary">{t("legal.imprint.address")}</h2>
            <p>
              Venedigersiedlung 315<br />
              5741 Neukirchen am Großvenediger<br />
              Österreich
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-primary">{t("legal.imprint.contact")}</h2>
            <p>
              {t("legal.imprint.phone")}:{" "}
              <a href="tel:+4915757153466" className="text-accent hover:underline">
                +49 15757153466
              </a>
              <br />
              {t("legal.imprint.email")}:{" "}
              <a href="mailto:steinbockchalets@gmail.com" className="text-accent hover:underline">
                steinbockchalets@gmail.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-primary">{t("legal.imprint.disclaimer")}</h2>
            <p className="text-muted-foreground">{t("legal.imprint.disclaimerText")}</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Impressum;
