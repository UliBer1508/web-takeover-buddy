import { useState, lazy, Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Pencil, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";
const ReviewEditDialog = lazy(() => import("./ReviewEditDialog"));
const ReviewAddDialog = lazy(() => import("./ReviewAddDialog"));
import { format } from "date-fns";
import { de, enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";

interface Review {
  id: string;
  guest_name: string;
  review_date: string;
  rating: number;
  text: string;
  text_en: string | null;
  is_visible: boolean;
  sort_order: number;
}

const MAX_TEXT_LENGTH = 200;

const Testimonials = () => {
  const { t, i18n } = useTranslation();
  const { isAdmin } = useAdmin();
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

  const toggleExpanded = (reviewId: string) => {
    setExpandedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const { data: reviews, isLoading } = useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data as Review[];
    },
  });

  const formatDate = (dateString: string) => {
    try {
      const locale = i18n.language === 'en' ? enUS : de;
      return format(new Date(dateString), 'MMMM yyyy', { locale });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {t("testimonials.title")}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-5 w-32 mb-4" />
                  <Skeleton className="h-20 w-full mb-4" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // For authenticated users, show all reviews (including hidden)
  // For guests, RLS automatically filters to only visible ones
  const displayReviews = reviews || [];

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t("testimonials.title")}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            {t("testimonials.subtitle")}
          </p>
          
          {/* Bewertung hinzufügen - für alle sichtbar */}
          <Button
            onClick={() => setAddDialogOpen(true)}
            className="mt-4"
            size="lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t("testimonials.addReview")}
          </Button>
        </div>

        {displayReviews.length === 0 ? (
          <p className="text-center text-muted-foreground">{t("testimonials.noReviews")}</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {displayReviews.map((review, index) => (
              <Card
                key={review.id}
                className={`hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-scale-in relative ${
                  !review.is_visible ? 'opacity-50 border-dashed' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Bearbeiten - nur für Admins */}
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => setEditingReview(review)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                )}
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                    {[...Array(5 - review.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-muted-foreground" />
                    ))}
                  </div>
                  <div className="text-muted-foreground mb-4 italic">
                    {(() => {
                      const displayText = i18n.language === 'en' && review.text_en ? review.text_en : review.text;
                      return displayText.length > MAX_TEXT_LENGTH ? (
                        <>
                          <p>
                            "{expandedReviews.has(review.id) 
                              ? displayText 
                              : `${displayText.substring(0, MAX_TEXT_LENGTH)}...`}"
                          </p>
                          <button
                            onClick={() => toggleExpanded(review.id)}
                            className="text-primary hover:text-primary/80 font-medium text-sm mt-2 transition-colors"
                          >
                            {expandedReviews.has(review.id) ? t("testimonials.showLess") : t("testimonials.readMore")}
                          </button>
                        </>
                      ) : (
                        <p>"{displayText}"</p>
                      );
                    })()}
                  </div>
                  <div className="border-t pt-4">
                    <p className="font-semibold text-foreground">{review.guest_name}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(review.review_date)}</p>
                    {!review.is_visible && isAdmin && (
                      <p className="text-xs text-destructive mt-1">{t("testimonials.hidden")}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {editingReview && (
        <ReviewEditDialog
          review={editingReview}
          open={!!editingReview}
          onOpenChange={(open) => !open && setEditingReview(null)}
        />
      )}

      <ReviewAddDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
      />
    </section>
  );
};

export default Testimonials;
