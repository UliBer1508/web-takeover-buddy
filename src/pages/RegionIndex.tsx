import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { infoArticles } from "@/content/info-articles";

const RegionIndex = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "de";

  const title = lang === "de"
    ? "Region & Aktivitäten – Steinbock Chalet"
    : "Region & Activities – Steinbock Chalet";
  const description = lang === "de"
    ? "Skigebiete, Wanderungen, Radtouren und Kultur rund um das Steinbock Chalet in Neukirchen am Großvenediger."
    : "Ski areas, hiking trails, cycling routes and culture around Steinbock Chalet in Neukirchen am Großvenediger.";

  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href="https://steinbockchalets.com/region" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content="https://steinbockchalets.com/region" />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          {lang === "de" ? "Zurück zur Startseite" : "Back to home"}
        </Link>

        <header className="mb-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            {lang === "de" ? "Region & Aktivitäten" : "Region & Activities"}
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            {lang === "de"
              ? "Skigebiete, Wanderungen, Radtouren und Kultur rund um das Steinbock Chalet."
              : "Ski areas, hiking, cycling and culture around Steinbock Chalet."}
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {infoArticles.map((article) => {
            const Icon = article.icon;
            return (
              <Link
                key={article.id}
                to={`/region/${article.id}`}
                className="group relative overflow-hidden rounded-xl border border-border bg-card hover:shadow-lg transition-all"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${article.gradient}`} />
                  <img
                    src={article.coverImage}
                    alt={article.title[lang]}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm rounded-full p-1.5">
                    <Icon className="h-4 w-4 text-foreground" strokeWidth={2} />
                  </div>
                </div>
                <div className="p-4">
                  <h2 className="font-semibold text-lg mb-1 line-clamp-1">{article.title[lang]}</h2>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {article.shortDescription[lang]}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default RegionIndex;
