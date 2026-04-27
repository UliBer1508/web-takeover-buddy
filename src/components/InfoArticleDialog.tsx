import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
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

  if (!article) return null;

  const Icon = article.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        {/* Cover */}
        <div className={`relative h-48 bg-gradient-to-br ${article.gradient} flex items-center justify-center`}>
          <Icon className="!w-24 !h-24 text-primary-foreground/90" strokeWidth={1.5} />
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
  );
};

export default InfoArticleDialog;
