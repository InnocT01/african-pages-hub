import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Eye, Headphones, BookOpen, Package, Star, MessageSquare, Truck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookGrid from "@/components/BookGrid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useBook, useBooks } from "@/hooks/useBooks";
import { useReviews, useCreateReview } from "@/hooks/useReviews";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const typeIcons: Record<string, React.ElementType> = { ebook: BookOpen, audio: Headphones, physical: Package };

const BookDetail = () => {
  const { id } = useParams();
  const { t, lang } = useLanguage();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { data: book, isLoading } = useBook(id);
  const { data: related = [] } = useBooks({ category: book?.category, limit: 5 });
  const { data: reviews = [] } = useReviews(id);
  const createReview = useCreateReview();

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="aspect-[2/3] rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!book) return <div className="min-h-screen flex items-center justify-center">Book not found</div>;

  const description = lang === "fr" ? book.description_fr : book.description_en;
  const TypeIcon = typeIcons[book.content_type] || BookOpen;
  const relatedFiltered = related.filter((b) => b.id !== book.id).slice(0, 5);

  const handleSubmitReview = async () => {
    if (!user) { toast.error(lang === "fr" ? "Connectez-vous pour laisser un avis" : "Sign in to leave a review"); return; }
    try {
      await createReview.mutateAsync({ book_id: book.id, rating: reviewRating, comment: reviewComment || undefined });
      setReviewComment("");
      toast.success(lang === "fr" ? "Avis publié !" : "Review submitted!");
    } catch (e: any) {
      toast.error(e.message || t("kdp.error"));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button variant="ghost" size="sm" asChild className="mb-6 gap-1">
          <Link to="/catalog"><ArrowLeft className="h-4 w-4" />{t("common.back")}</Link>
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
          <div className="relative">
            <div className="aspect-[2/3] overflow-hidden rounded-2xl shadow-xl">
              {book.cover_url ? (
                <img src={book.cover_url} alt={book.title} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-muted flex items-center justify-center">
                  <BookOpen className="h-20 w-20 text-muted-foreground/20" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-3 gap-1">
                <TypeIcon className="h-3 w-3" />{t(`filter.${book.content_type}`)}
              </Badge>
              <h1 className="text-3xl font-bold md:text-4xl">{book.title}</h1>
              {book.subtitle && <p className="text-lg text-muted-foreground mt-1">{book.subtitle}</p>}
              <p className="text-lg text-muted-foreground mt-1">{t("book.by")} <span className="text-foreground font-medium">{book.author_name || "Auteur"}</span></p>
              <p className="text-sm text-muted-foreground mt-1">{book.origin} · {book.genre}</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => <Star key={i} className={`h-4 w-4 ${i < Math.floor(book.rating || 0) ? "fill-primary text-primary" : "text-border"}`} />)}
              </div>
              <span className="text-sm text-muted-foreground">{book.rating || 0} ({book.review_count || 0} {t("book.reviews").toLowerCase()})</span>
            </div>

            <p className="text-3xl font-bold text-primary tabular-nums">${book.price.toFixed(2)}</p>

            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="description" className="flex-1">{t("book.description")}</TabsTrigger>
                <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
                <TabsTrigger value="reviews" className="flex-1">{t("book.reviews")} ({reviews.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="pt-4">
                <p className="text-muted-foreground leading-relaxed font-sans">{description || "—"}</p>
              </TabsContent>
              <TabsContent value="details" className="pt-4">
                <dl className="space-y-2 text-sm font-sans">
                  <div className="flex justify-between"><dt className="text-muted-foreground">{t("filter.genre")}</dt><dd>{book.genre}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">{t("filter.origin")}</dt><dd>{book.origin}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">{t("filter.type")}</dt><dd>{t(`filter.${book.content_type}`)}</dd></div>
                  {book.page_count && <div className="flex justify-between"><dt className="text-muted-foreground">{t("book.pages")}</dt><dd>{book.page_count}</dd></div>}
                  {book.duration_minutes && <div className="flex justify-between"><dt className="text-muted-foreground">{t("book.minutes")}</dt><dd>{book.duration_minutes} min</dd></div>}
                  {book.isbn && <div className="flex justify-between"><dt className="text-muted-foreground">ISBN</dt><dd>{book.isbn}</dd></div>}
                </dl>
              </TabsContent>
              <TabsContent value="reviews" className="pt-4 space-y-4">
                {reviews.length === 0 && <p className="text-muted-foreground text-sm">{t("book.noreviews")}</p>}
                {reviews.map((review) => (
                  <div key={review.id} className="border border-border rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => <Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-primary text-primary" : "text-border"}`} />)}
                      </div>
                      <span className="text-xs text-muted-foreground">{(review as any).profiles?.display_name || "Lecteur"}</span>
                    </div>
                    {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
                  </div>
                ))}
                {user && (
                  <div className="border border-border rounded-lg p-4 space-y-3">
                    <h4 className="font-semibold text-sm">{t("book.addreview")}</h4>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map((s) => (
                        <button key={s} onClick={() => setReviewRating(s)}>
                          <Star className={`h-5 w-5 ${s <= reviewRating ? "fill-primary text-primary" : "text-border"} transition-colors`} />
                        </button>
                      ))}
                    </div>
                    <Textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} placeholder={lang === "fr" ? "Votre commentaire..." : "Your comment..."} className="min-h-[60px]" />
                    <Button size="sm" onClick={handleSubmitReview} disabled={createReview.isPending} className="rounded-full">
                      {createReview.isPending ? t("common.loading") : t("book.addreview")}
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="rounded-full gap-2">
                    <Eye className="h-4 w-4" />{t("book.read")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{t("book.readpreview")} — {book.title}</DialogTitle>
                  </DialogHeader>
                  <div className="prose max-w-none py-4 max-h-[60vh] overflow-y-auto">
                    <p className="text-muted-foreground">{description}</p>
                    <p className="text-muted-foreground mt-4">{description}</p>
                    <div className="mt-6 p-4 bg-muted rounded-lg text-center">
                      <p className="font-semibold text-foreground">{t("book.purchasetocontinue")}</p>
                      <Button className="mt-3 rounded-full" onClick={() => { addToCart(book); setShowPreview(false); toast.success(t("book.addtocart")); }}>
                        <ShoppingCart className="h-4 w-4 mr-2" />{t("book.addtocart")} — ${book.price.toFixed(2)}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button className="rounded-full gap-2" onClick={() => { addToCart(book); toast.success(t("book.addtocart")); }}>
                <ShoppingCart className="h-4 w-4" />{t("book.addtocart")}
              </Button>

              {book.content_type === "physical" && (
                <Button variant="outline" className="rounded-full gap-2" onClick={() => toast.info(lang === "fr" ? "Demande de livraison enregistrée" : "Delivery request recorded")}>
                  <Truck className="h-4 w-4" />{t("book.delivery")}
                </Button>
              )}

              <Button variant="outline" className="rounded-full gap-2" onClick={() => {
                const el = document.querySelector('[value="reviews"]') as HTMLElement;
                el?.click();
              }}>
                <MessageSquare className="h-4 w-4" />{t("book.rate")}
              </Button>
            </div>
          </div>
        </div>

        {relatedFiltered.length > 0 && (
          <div className="mt-16">
            <BookGrid title={t("book.related")} books={relatedFiltered} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BookDetail;
