import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { InfoArticle } from "@/content/info-articles";

interface Props {
  article: InfoArticle;
  index: number;
}

const ArticleCard = ({ article, index }: Props) => {
  const { i18n, t } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "de";
  const Icon = article.icon;

  return (
    <Link
      to={`/region-guide/${article.id}`}
      className="group relative overflow-hidden rounded-xl aspect-[4/3] animate-fade-in-up focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      style={{ animationDelay: `${Math.min(index, 10) * 0.05}s` }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${article.gradient}`} />
      <img
        src={article.coverImage}
        alt={article.title[lang]}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute top-3 left-3 bg-background/30 backdrop-blur-sm rounded-full p-2">
        <Icon className="h-4 w-4 text-primary-foreground" strokeWidth={2} />
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 text-primary-foreground">
        <p className="text-xs font-medium uppercase tracking-wide text-accent">
          {t(`infoGallery.topics.${article.topic}`)}
        </p>
        <p className="text-lg font-semibold leading-tight">{article.title[lang]}</p>
        <p className="text-xs mt-1 opacity-90 line-clamp-2">{article.shortDescription[lang]}</p>
      </div>
    </Link>
  );
};

export default ArticleCard;
