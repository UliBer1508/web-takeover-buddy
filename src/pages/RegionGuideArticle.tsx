import { useEffect, useMemo, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { infoArticles } from "@/content/info-articles";
import RegionGuideHeader from "@/components/region-guide/RegionGuideHeader";
import RegionGuideFooter from "@/components/region-guide/RegionGuideFooter";

const RegionGuideArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const { i18n, t } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "de";
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const article = useMemo(() => infoArticles.find((a) => a.id === slug), [slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!article) return <Navigate to="/region-guide" replace />;

  const Icon = article.icon;

  const schema = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: article.title[lang],
    description: article.shortDescription[lang],
    image: article.coverImage,
    url: `https://steinbockchalets.com/region-guide/${article.id}`,
  };

  return (
    <>
      <Helmet>
        <title>{`${article.title[lang]} – Region-Guide Hohe Tauern`}</title>
        <meta name="description" content={article.shortDescription[lang]} />
        <meta property="og:title" content={article.title[lang]} />
        <meta property="og:description" content={article.shortDescription[lang]} />
        <meta property="og:image" content={article.coverImage} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={`https://steinbockchalets.com/region-guide/${article.id}`} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <RegionGuideHeader />

        <main className="flex-1">
          {/* Hero */}
          <section className="relative h-[55vh] min-h-[360px] max-h-[560px] overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${article.gradient}`} />
            <img
              src={article.coverImage}
              alt={article.title[lang]}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
            <div className="absolute inset-x-0 bottom-0">
              <div className="container mx-auto px-4 pb-10 md:pb-14 text-primary-foreground">
                <Link
                  to="/region-guide"
                  className="inline-flex items-center gap-1.5 text-sm text-white/85 hover:text-white mb-4 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {lang === "de" ? "Zurück zur Übersicht" : "Back to overview"}
                </Link>
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-white/15 backdrop-blur-sm">
                    <Icon className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
                    {t(`infoGallery.topics.${article.topic}`)}
                  </span>
                </div>
                <h1 className="font-serif text-3xl md:text-5xl font-bold leading-tight max-w-3xl">
                  {article.title[lang]}
                </h1>
                <p className="mt-3 text-base md:text-lg text-white/90 max-w-2xl">
                  {article.subtitle[lang]}
                </p>
              </div>
            </div>
          </section>

          {/* Content */}
          <article className="container mx-auto px-4 py-12 md:py-16 max-w-3xl">
            <p className="text-lg text-foreground/90 leading-relaxed mb-8">
              {article.shortDescription[lang]}
            </p>

            {article.stats.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-10">
                {article.stats.map((s, i) => (
                  <Badge key={i} variant="secondary" className="text-sm py-1.5 px-3">
                    <span className="text-muted-foreground mr-1.5">{s.label[lang]}:</span>
                    <span className="font-semibold">{s.value[lang]}</span>
                  </Badge>
                ))}
              </div>
            )}

            <div className="space-y-8">
              {article.sections.map((section, i) => (
                <section key={i}>
                  <h2 className="font-serif text-2xl font-semibold mb-3 text-foreground">
                    {section.heading[lang]}
                  </h2>
                  {section.body && (
                    <p className="text-muted-foreground leading-relaxed text-base">
                      {section.body[lang]}
                    </p>
                  )}
                  {section.bullets && (
                    <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
                      {section.bullets.map((b, j) => (
                        <li key={j}>{b[lang]}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            {article.gallery.length > 0 && (
              <section className="mt-12">
                <h2 className="font-serif text-2xl font-semibold mb-4 text-foreground">
                  {t("infoGallery.dialog.impressions")}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {article.gallery.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setLightboxIndex(i)}
                      className="group relative overflow-hidden rounded-lg aspect-[4/3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      <img
                        src={img.url}
                        alt={img.caption[lang]}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="absolute bottom-2 left-2 right-2 text-[11px] text-white line-clamp-2">
                          {img.caption[lang]}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground mt-3">
                  {t("infoGallery.dialog.imageSource")}
                </p>
              </section>
            )}

            <div className="mt-12 border-t pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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
              <Button asChild variant="outline">
                <a href={article.externalUrl} target="_blank" rel="noopener noreferrer">
                  {t("infoGallery.visitOfficial")}
                  <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </Button>
            </div>
          </article>
        </main>

        <RegionGuideFooter />
      </div>

      <Dialog open={lightboxIndex !== null} onOpenChange={(o) => !o && setLightboxIndex(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
          <div className="sr-only">
            <DialogTitle>{article.title[lang]}</DialogTitle>
            <DialogDescription>
              {lightboxIndex !== null ? article.gallery[lightboxIndex].caption[lang] : ""}
            </DialogDescription>
          </div>
          {lightboxIndex !== null && (
            <div className="flex flex-col items-center justify-center p-4 max-h-[95vh]">
              <img
                src={article.gallery[lightboxIndex].url}
                alt={article.gallery[lightboxIndex].caption[lang]}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
              <p className="text-white text-center mt-4 text-sm">
                {article.gallery[lightboxIndex].caption[lang]}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RegionGuideArticle;
