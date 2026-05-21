import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Datenschutz = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{t("legal.privacy.title")} | Steinbock Chalets</title>
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://steinbockchalets.com/datenschutz" />
      </Helmet>
      <Navigation />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 max-w-3xl">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          {t("legal.backHome")}
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6">{t("legal.privacy.title")}</h1>
        <p className="text-muted-foreground mb-10">{t("legal.privacy.intro")}</p>

        <div className="space-y-8 text-base leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-primary">{t("legal.privacy.contactTitle")}</h2>
            <p>{t("legal.privacy.contactText")}</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3 text-primary">{t("legal.privacy.hostingTitle")}</h2>
            <p>{t("legal.privacy.hostingText")}</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3 text-primary">{t("legal.privacy.cookiesTitle")}</h2>
            <p>{t("legal.privacy.cookiesText")}</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3 text-primary">{t("legal.privacy.rightsTitle")}</h2>
            <p>{t("legal.privacy.rightsText")}</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Datenschutz;
