import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMyBooks } from "@/hooks/useBooks";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Star, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";

const CreatorReviews = () => {
  const { lang } = useLanguage();
  const { data: books = [] } = useMyBooks();
  const bookIds = books.map(b => b.id);

  const { data: reviews = [] } = useQuery({
    queryKey: ["creator-reviews", bookIds],
    queryFn: async () => {
      if (bookIds.length === 0) return [];
      const { data } = await supabase.from("reviews").select("*, profiles(display_name)").in("book_id", bookIds).order("created_at", { ascending: false }).limit(50);
      return data || [];
    },
    enabled: bookIds.length > 0,
  });

  const avgRating = reviews.length > 0 ? reviews.reduce((s, r: any) => s + r.rating, 0) / reviews.length : 0;
  const fiveStars = reviews.filter((r: any) => r.rating === 5).length;
  const fourStars = reviews.filter((r: any) => r.rating === 4).length;
  const threeOrLess = reviews.filter((r: any) => r.rating <= 3).length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="p-4"><MessageSquare className="h-4 w-4 text-primary mb-2" /><p className="text-xl font-extrabold">{reviews.length}</p><p className="text-xs text-muted-foreground">{lang === "fr" ? "Total avis" : "Total Reviews"}</p></CardContent></Card>
        <Card><CardContent className="p-4"><Star className="h-4 w-4 text-accent mb-2" /><p className="text-xl font-extrabold">{avgRating.toFixed(1)}</p><p className="text-xs text-muted-foreground">{lang === "fr" ? "Note moyenne" : "Avg Rating"}</p></CardContent></Card>
        <Card><CardContent className="p-4"><ThumbsUp className="h-4 w-4 text-accent mb-2" /><p className="text-xl font-extrabold">{fiveStars + fourStars}</p><p className="text-xs text-muted-foreground">{lang === "fr" ? "Avis positifs (4-5★)" : "Positive (4-5★)"}</p></CardContent></Card>
        <Card><CardContent className="p-4"><ThumbsDown className="h-4 w-4 text-destructive mb-2" /><p className="text-xl font-extrabold">{threeOrLess}</p><p className="text-xs text-muted-foreground">{lang === "fr" ? "À améliorer (1-3★)" : "Needs work (1-3★)"}</p></CardContent></Card>
      </div>

      {/* Rating distribution */}
      <Card>
        <CardHeader><CardTitle className="text-base">{lang === "fr" ? "Distribution des notes" : "Rating Distribution"}</CardTitle></CardHeader>
        <CardContent>
          {[5, 4, 3, 2, 1].map(r => {
            const count = reviews.filter((rv: any) => rv.rating === r).length;
            const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={r} className="flex items-center gap-3 py-1.5">
                <span className="text-sm w-6 text-right">{r}★</span>
                <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-muted-foreground w-8 text-right">{count}</span>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Review list */}
      <Card>
        <CardHeader><CardTitle className="text-base">{lang === "fr" ? "Derniers avis" : "Latest Reviews"}</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">{lang === "fr" ? "Aucun avis reçu" : "No reviews yet"}</p>
          ) : reviews.slice(0, 20).map((review: any) => {
            const book = books.find(b => b.id === review.book_id);
            return (
              <div key={review.id} className="flex gap-3 py-3 border-b border-border last:border-0">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-primary text-primary" : "text-border"}`} />)}</div>
                    <span className="text-xs text-muted-foreground">{review.profiles?.display_name || (lang === "fr" ? "Lecteur" : "Reader")}</span>
                    <span className="text-[10px] text-muted-foreground">· {new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                  {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
                  <p className="text-xs text-primary mt-1">📖 {book?.title || "—"}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatorReviews;
