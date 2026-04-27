import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { InfoArticle } from "@/content/info-articles";

interface Props {
  article: InfoArticle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InfoArticleDialog = ({ article, open, onOpenChange }: Props) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "de";
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!article) return null;

  const Icon = article.icon;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
          {/* Cover with image */}
          <div className="relative h-56 md:h-72 overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${article.gradient}`} />
            <img
              src={article.coverImage}
              alt={article.title[lang]}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-primary-foreground">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-background/20 backdrop-blur-sm rounded-full p-1.5">
                  <Icon className="h-4 w-4 text-primary-foreground" strokeWidth={2} />
                </div>
                <span className="text-xs font-medium uppercase tracking-wide text-accent">
                  {t(`infoGallery.topics.${article.topic}`)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <DialogTitle className="text-2xl md:text-3xl font-bold mb-2">
                {article.title[lang]}
              </DialogTitle>
              <DialogDescription className="text-base">
                {article.subtitle[lang]}
              </DialogDescription>
            </div>

            {/* Stats */}
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

            {/* Sections */}
            <div className="space-y-5">
              {article.sections.map((section, i) => (
                <div key={i}>
                  <h4 className="text-lg font-semibold mb-2 text-foreground">
                    {section.heading[lang]}
                  </h4>
                  {section.body && (
                    <p className="text-muted-foreground leading-relaxed">{section.body[lang]}</p>
                  )}
                  {section.bullets && (
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {section.bullets.map((b, j) => (
                        <li key={j}>{b[lang]}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* Mini gallery */}
            {article.gallery.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-3 text-foreground">
                  {t("infoGallery.dialog.impressions")}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {article.gallery.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setLightboxIndex(i)}
                      className="group relative overflow-hidden rounded-md aspect-[4/3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      <img
                        src={img.url}
                        alt={img.caption[lang]}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="absolute bottom-1.5 left-2 right-2 text-[11px] text-white line-clamp-2">
                          {img.caption[lang]}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground mt-2">
                  {t("infoGallery.dialog.imageSource")}
                </p>
              </div>
            )}

            {/* CTA + Source */}
            <div className="border-t pt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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
        </DialogContent>
      </Dialog>

      {/* Lightbox for mini gallery */}
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

export default InfoArticleDialog;
