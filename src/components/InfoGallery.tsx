import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { infoArticles, infoTopics, type TopicFilter, type InfoArticle } from "@/content/info-articles";
import InfoArticleDialog from "./InfoArticleDialog";

const InfoGallery = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "de";
  const [activeTopic, setActiveTopic] = useState<TopicFilter>("all");
  const [selected, setSelected] = useState<InfoArticle | null>(null);

  const filtered =
    activeTopic === "all" ? infoArticles : infoArticles.filter((a) => a.topic === activeTopic);

  const countFor = (topic: TopicFilter) =>
    topic === "all" ? infoArticles.length : infoArticles.filter((a) => a.topic === topic).length;

  return (
    <div>
      <div className="text-center mb-8">
        <p className="text-muted-foreground max-w-2xl mx-auto">{t("infoGallery.subtitle")}</p>
      </div>

      {/* Region pitch / call-to-action */}
      <div className="max-w-3xl mx-auto mb-10">
        <div className="rounded-2xl border bg-card/60 backdrop-blur-sm shadow-sm p-6 md:p-8 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
            {t("infoGallery.pitch.heading")}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            {t("infoGallery.pitch.body")}
          </p>
          <Button asChild size="lg" className="gap-2">
            <a href="#booking">{t("infoGallery.pitch.cta")}</a>
          </Button>
        </div>
      </div>

      {/* Topic Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {infoTopics.map((topic) => {
          const TopicIcon = topic.icon;
          const count = countFor(topic.id);
          const isActive = activeTopic === topic.id;
          return (
            <Button
              key={topic.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTopic(topic.id)}
              className="gap-2"
            >
              <TopicIcon className="h-4 w-4" />
              {t(topic.labelKey)}
              <Badge variant="secondary" className="ml-1 text-xs">
                {count}
              </Badge>
            </Button>
          );
        })}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">{t("infoGallery.comingSoon")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((article, index) => {
            const Icon = article.icon;
            return (
              <button
                key={article.id}
                onClick={() => setSelected(article)}
                className="group relative overflow-hidden rounded-lg cursor-pointer aspect-[4/3] animate-fade-in-up text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                style={{ animationDelay: `${Math.min(index, 10) * 0.1}s` }}
              >
                {/* Cover image with gradient fallback */}
                <div className={`absolute inset-0 bg-gradient-to-br ${article.gradient}`} />
                <img
                  src={article.coverImage}
                  alt={article.title[lang]}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Topic icon badge */}
                <div className="absolute top-3 left-3 bg-background/30 backdrop-blur-sm rounded-full p-2">
                  <Icon className="h-4 w-4 text-primary-foreground" strokeWidth={2} />
                </div>

                {/* Always-visible bottom label */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 text-primary-foreground">
                  <p className="text-xs font-medium uppercase tracking-wide text-accent">
                    {t(`infoGallery.topics.${article.topic}`)}
                  </p>
                  <p className="text-lg font-semibold leading-tight">{article.title[lang]}</p>
                  <p className="text-xs mt-1 opacity-90 line-clamp-2">
                    {article.shortDescription[lang]}
                  </p>
                </div>

                {/* Hover hint */}
                <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="h-4 w-4 text-foreground" />
                </div>
              </button>
            );
          })}
        </div>
      )}

      <InfoArticleDialog
        article={selected}
        open={!!selected}
        onOpenChange={(o) => !o && setSelected(null)}
      />
    </div>
  );
};

export default InfoGallery;
