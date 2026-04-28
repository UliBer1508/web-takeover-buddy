import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { infoArticles, infoTopics, type InfoTopic } from "@/content/info-articles";
import RegionGuideHeader from "@/components/region-guide/RegionGuideHeader";
import RegionGuideFooter from "@/components/region-guide/RegionGuideFooter";
import ArticleCard from "@/components/region-guide/ArticleCard";

const TOPIC_ORDER: InfoTopic[] = ["skiing", "hiking", "cycling", "culture"];

const RegionGuide = () => {
  const { i18n, t } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "de";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const grouped = useMemo(() => {
    return TOPIC_ORDER.map((topic) => ({
      topic,
      articles: infoArticles.filter((a) => a.topic === topic),
    })).filter((g) => g.articles.length > 0);
  }, []);

  const title =
    lang === "de"
      ? "Region-Guide Hohe Tauern – Skigebiete, Wanderungen & Ausflüge"
      : "Hohe Tauern Region Guide – Ski areas, hikes & day trips";
  const description =
    lang === "de"
      ? "Insider-Tipps für die Region Hohe Tauern, Pinzgau und Pongau: Skigebiete, Wanderungen, Almen, Radwege und Kulturziele."
      : "Insider tips for the Hohe Tauern, Pinzgau and Pongau region: ski areas, hikes, alpine huts, cycle paths, and cultural attractions.";

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://steinbockchalets.com/region-guide" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <RegionGuideHeader />

        <main className="flex-1">
          {/* Hero */}
          <section className="relative border-b bg-gradient-to-b from-muted/40 to-background">
            <div className="container mx-auto px-4 py-14 md:py-20 text-center max-w-3xl">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-3">
                {lang === "de" ? "Region-Guide" : "Region Guide"}
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-5">
                {lang === "de"
                  ? "Hohe Tauern, Pinzgau & Pongau"
                  : "Hohe Tauern, Pinzgau & Pongau"}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {lang === "de"
                  ? "Eine handverlesene Sammlung von Skigebieten, Wanderzielen, Almhütten, Radwegen und Kulturhighlights – für unvergessliche Tage in den österreichischen Alpen."
                  : "A handpicked collection of ski areas, hiking destinations, alpine huts, cycle paths and cultural highlights – for unforgettable days in the Austrian Alps."}
              </p>
            </div>
          </section>

          {/* Grouped sections */}
          <div className="container mx-auto px-4 py-12 md:py-16 space-y-16">
            {grouped.map(({ topic, articles }) => {
              const topicDef = infoTopics.find((tt) => tt.id === topic);
              const TopicIcon = topicDef?.icon;
              return (
                <section key={topic} aria-labelledby={`topic-${topic}`}>
                  <div className="flex items-center gap-3 mb-6">
                    {TopicIcon && (
                      <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
                        <TopicIcon className="h-5 w-5" />
                      </span>
                    )}
                    <h2
                      id={`topic-${topic}`}
                      className="font-serif text-2xl md:text-3xl font-semibold text-foreground"
                    >
                      {t(`infoGallery.topics.${topic}`)}
                    </h2>
                    <span className="text-sm text-muted-foreground">({articles.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {articles.map((article, i) => (
                      <ArticleCard key={article.id} article={article} index={i} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </main>

        <RegionGuideFooter />
      </div>
    </>
  );
};

export default RegionGuide;
