import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { infoArticles } from "@/content/info-articles";
import NotFound from "./NotFound";

const RegionArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "de";

  const article = infoArticles.find((a) => a.id === slug);

  if (!article) return <NotFound />;

  const Icon = article.icon;
  const rawTitle = `${article.title[lang]} – Steinbock Chalet`;
  const pageTitle = rawTitle.length > 60 ? `${article.title[lang]}` : rawTitle;
  const rawDesc = article.subtitle[lang] || article.shortDescription[lang] || "";
  const description = rawDesc.length > 160 ? `${rawDesc.slice(0, 157)}...` : rawDesc;
  const canonical = `https://steinbockchalets.com/region/${article.id}`;

  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="article" />
        {article.coverImage && <meta property="og:image" content={article.coverImage} />}
      </Helmet>

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative h-[45vh] min-h-[320px] overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${article.gradient}`} />
        <img
          src={article.coverImage}
          alt={article.title[lang]}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        <div className="absolute top-4 left-4 right-4 max-w-5xl mx-auto">
          <Link
            to="/region"
            className="inline-flex items-center gap-2 text-sm text-white/90 hover:text-white bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            {lang === "de" ? "Alle Artikel" : "All articles"}
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-5xl mx-auto text-white">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-1.5">
                <Icon className="h-4 w-4" strokeWidth={2} />
              </div>
              <span className="text-xs font-medium uppercase tracking-wide">
                {t(`infoGallery.topics.${article.topic}`)}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-2">{article.title[lang]}</h1>
            <p className="text-base md:text-lg text-white/85">{article.subtitle[lang]}</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-8">
        {article.stats.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.stats.map((s, i) => (
              <Badge key={i} variant="secondary" className="text-sm py-1.5 px-3">
                <span className="text-muted-foreground mr-1.5">{s.label[lang]}:</span>
                <span className="font-semibold">{s.value[lang]}</span>
              </Badge>
            ))}
          </div>
        )}

        <p className="text-lg text-muted-foreground leading-relaxed">
          {article.shortDescription[lang]}
        </p>

        <div className="space-y-6">
          {article.sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-xl md:text-2xl font-semibold mb-2 text-foreground">
                {section.heading[lang]}
              </h2>
              {section.body && (
                <p className="text-muted-foreground leading-relaxed">{section.body[lang]}</p>
              )}
              {section.bullets && (
                <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
                  {section.bullets.map((b, j) => (
                    <li key={j}>{b[lang]}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {article.gallery.length > 0 && (
          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-3 text-foreground">
              {t("infoGallery.dialog.impressions")}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {article.gallery.map((img, i) => (
                <figure key={i} className="relative overflow-hidden rounded-lg aspect-[4/3]">
                  <img
                    src={img.url}
                    alt={img.caption[lang]}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </figure>
              ))}
            </div>
          </div>
        )}

        <div className="border-t pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {t("infoGallery.source")}:{" "}
            <a
              href={article.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              {article.sourceLabel}
            </a>
          </p>
          <Button asChild>
            <a href={article.externalUrl} target="_blank" rel="noopener noreferrer">
              {t("infoGallery.visitOfficial")}
              <ExternalLink className="ml-1 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </main>
  );
};

export default RegionArticle;
