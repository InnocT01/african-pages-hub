import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, Eye, Headphones, BookOpen, Package, Star, MessageSquare, Truck, Share2, Heart, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookGrid from "@/components/BookGrid";
import BookReader from "@/components/BookReader";
import FollowAuthorButton from "@/components/FollowAuthorButton";
import GiftBookDialog from "@/components/GiftBookDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useBook, useBooks } from "@/hooks/useBooks";
import { useReviews, useCreateReview } from "@/hooks/useReviews";
import { useWishlist, useToggleWishlist } from "@/hooks/useWishlist";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const typeIcons: Record<string, React.ElementType> = { ebook: BookOpen, audio: Headphones, physical: Package };

const BookDetail = () => {
  const { id } = useParams();
  const { t, lang } = useLanguage();
  const { format: formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { data: book, isLoading } = useBook(id);
  const { data: related = [] } = useBooks({ category: book?.category, limit: 5 });
  const { data: reviews = [] } = useReviews(id);
  const createReview = useCreateReview();
  const { data: wishlistIds = [] } = useWishlist();
  const toggleWishlist = useToggleWishlist();
  const { addViewed } = useRecentlyViewed();

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [showReader, setShowReader] = useState(false);
  const [showDelivery, setShowDelivery] = useState(false);

  useEffect(() => {
    if (id) addViewed(id);
  }, [id, addViewed]);

  const isInWishlist = id ? wishlistIds.includes(id) : false;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="aspect-[2/3] rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" /><Skeleton className="h-6 w-1/2" /><Skeleton className="h-40 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!book) return <div className="min-h-screen flex items-center justify-center bg-background">Book not found</div>;

  const description = lang === "fr" ? book.description_fr : book.description_en;
  const TypeIcon = typeIcons[book.content_type] || BookOpen;
  const relatedFiltered = related.filter((b) => b.id !== book.id).slice(0, 5);
  const hasPhysical = book.format === "paperback" || book.format === "both";
  const effectivePrice = book.on_sale && book.sale_price ? book.sale_price : book.price;
  const inStock = book.stock_count === null || book.stock_count > 0;

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: book.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success(lang === "fr" ? "Lien copié !" : "Link copied!");
    }
  };

  const handleToggleWishlist = () => {
    if (!user) { toast.error(lang === "fr" ? "Connectez-vous" : "Sign in first"); return; }
    toggleWishlist.mutate(book.id, {
      onSuccess: (result) => {
        toast.success(result.added
          ? (lang === "fr" ? "Ajouté à la liste de souhaits" : "Added to wishlist")
          : (lang === "fr" ? "Retiré de la liste de souhaits" : "Removed from wishlist"));
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6 flex-wrap">
          <Link to="/" className="hover:text-primary">{lang === "fr" ? "Accueil" : "Home"}</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/catalog" className="hover:text-primary">{lang === "fr" ? "Catalogue" : "Catalog"}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground truncate max-w-[200px]">{book.title}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
          <div className="relative">
            <div className="aspect-[2/3] overflow-hidden rounded-xl shadow-xl bg-card">
              {book.cover_url ? (
                <img src={book.cover_url} alt={book.title} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-muted flex items-center justify-center"><BookOpen className="h-20 w-20 text-muted-foreground/20" /></div>
              )}
            </div>
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {book.is_new && <Badge className="bg-accent text-accent-foreground">{lang === "fr" ? "Neuf" : "New"}</Badge>}
              {book.on_sale && <Badge className="bg-destructive text-destructive-foreground">Promo</Badge>}
              {book.featured && <Badge className="bg-primary text-primary-foreground gap-1"><Star className="h-3 w-3 fill-current" />{lang === "fr" ? "Vedette" : "Featured"}</Badge>}
            </div>
            <button onClick={handleToggleWishlist} className="absolute top-4 right-4 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-transform">
              <Heart className={`h-5 w-5 ${isInWishlist ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="gap-1"><TypeIcon className="h-3 w-3" />{t(`filter.${book.content_type}`)}</Badge>
                <Badge variant="outline" className="text-xs">
                  {book.format === "both" ? "E-book + Broché" : book.format === "paperback" ? "Broché" : "E-book"}
                </Badge>
              </div>
              <h1 className="text-3xl font-extrabold md:text-4xl font-display">{book.title}</h1>
              {book.subtitle && <p className="text-lg text-muted-foreground mt-1">{book.subtitle}</p>}
              <p className="text-lg text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
                <span>{t("book.by")}{" "}
                  <Link to={`/author/${book.author_id}`} className="text-primary font-medium hover:underline">{book.author_name || "Auteur"}</Link>
                </span>
                <FollowAuthorButton authorId={book.author_id} />
              </p>
              <p className="text-sm text-muted-foreground mt-1">{book.origin} · {book.genre}</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className={`h-4 w-4 ${i < Math.floor(book.rating || 0) ? "star-fill" : "text-border"}`} />)}</div>
              <span className="text-sm text-muted-foreground">{book.rating || 0} ({book.review_count || 0} {t("book.reviews").toLowerCase()})</span>
            </div>

            {/* Price with currency */}
            <div className="flex items-center gap-3">
              {book.on_sale && book.sale_price ? (
                <>
                  <span className="text-3xl font-extrabold text-destructive">{formatPrice(book.sale_price)}</span>
                  <span className="text-xl text-muted-foreground line-through">{formatPrice(book.price)}</span>
                  <Badge className="bg-destructive/10 text-destructive">-{Math.round((1 - book.sale_price / book.price) * 100)}%</Badge>
                </>
              ) : (
                <span className="text-3xl font-extrabold text-primary">{formatPrice(book.price)}</span>
              )}
            </div>

            {hasPhysical && (
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${inStock ? "bg-accent" : "bg-destructive"}`} />
                <span className="text-sm">{inStock ? (book.stock_count ? `${book.stock_count} ${lang === "fr" ? "en stock" : "in stock"}` : (lang === "fr" ? "En stock" : "In Stock")) : (lang === "fr" ? "Rupture de stock" : "Out of stock")}</span>
              </div>
            )}

            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="description" className="flex-1">{t("book.description")}</TabsTrigger>
                <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
                <TabsTrigger value="reviews" className="flex-1">{t("book.reviews")} ({reviews.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="pt-4">
                <p className="text-muted-foreground leading-relaxed">{description || "—"}</p>
              </TabsContent>
              <TabsContent value="details" className="pt-4">
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between"><dt className="text-muted-foreground">{t("filter.genre")}</dt><dd>{book.genre}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">{t("filter.origin")}</dt><dd>{book.origin}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Format</dt><dd>{book.format === "both" ? "E-book + Broché" : book.format === "paperback" ? "Broché" : "E-book"}</dd></div>
                  {book.page_count && <div className="flex justify-between"><dt className="text-muted-foreground">{t("book.pages")}</dt><dd>{book.page_count}</dd></div>}
                  {book.duration_minutes && <div className="flex justify-between"><dt className="text-muted-foreground">{t("book.minutes")}</dt><dd>{book.duration_minutes} min</dd></div>}
                  {book.isbn && <div className="flex justify-between"><dt className="text-muted-foreground">ISBN</dt><dd>{book.isbn}</dd></div>}
                  {book.language && <div className="flex justify-between"><dt className="text-muted-foreground">{lang === "fr" ? "Langue" : "Language"}</dt><dd>{book.language}</dd></div>}
                </dl>
              </TabsContent>
              <TabsContent value="reviews" className="pt-4 space-y-4">
                {reviews.length === 0 && <p className="text-muted-foreground text-sm">{t("book.noreviews")}</p>}
                {reviews.map((review) => (
                  <div key={review.id} className="border border-border rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className={`h-3 w-3 ${i < review.rating ? "star-fill" : "text-border"}`} />)}</div>
                      <span className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                    {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
                  </div>
                ))}
                {user && (
                  <div className="border border-border rounded-lg p-4 space-y-3">
                    <h4 className="font-semibold text-sm">{t("book.addreview")}</h4>
                    <div className="flex gap-1">{[1,2,3,4,5].map((s) => (<button key={s} onClick={() => setReviewRating(s)}><Star className={`h-5 w-5 ${s <= reviewRating ? "star-fill" : "text-border"} transition-colors`} /></button>))}</div>
                    <Textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} placeholder={lang === "fr" ? "Votre commentaire..." : "Your comment..."} className="min-h-[60px]" />
                    <Button size="sm" onClick={handleSubmitReview} disabled={createReview.isPending} className="rounded-full">{createReview.isPending ? t("common.loading") : t("book.addreview")}</Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {/* Reader preview */}
              <Button variant="outline" className="rounded-full gap-2" onClick={() => setShowReader(true)}>
                <Eye className="h-4 w-4" />{lang === "fr" ? "Lire un extrait" : "Read Excerpt"}
              </Button>

              <Button className="rounded-full gap-2" onClick={() => { addToCart(book); toast.success(t("book.addtocart")); }}>
                <ShoppingCart className="h-4 w-4" />{t("book.addtocart")}
              </Button>

              {hasPhysical && (
                <Button variant="outline" className="rounded-full gap-2 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground" onClick={() => { addToCart(book); toast.success(lang === "fr" ? "Ajouté au panier — Kitabu Express" : "Added to cart — Kitabu Express"); }}>
                  <Truck className="h-4 w-4" />Kitabu Express
                </Button>
              )}

              <Button variant="outline" className="rounded-full gap-2" onClick={handleToggleWishlist}>
                <Heart className={`h-4 w-4 ${isInWishlist ? "fill-destructive text-destructive" : ""}`} />
                {isInWishlist ? (lang === "fr" ? "Dans ma liste" : "In Wishlist") : (lang === "fr" ? "Favoris" : "Wishlist")}
              </Button>

              <GiftBookDialog bookId={book.id} bookTitle={book.title} />

              <Button variant="ghost" className="rounded-full gap-2" onClick={handleShare}>
                <Share2 className="h-4 w-4" />{lang === "fr" ? "Partager" : "Share"}
              </Button>
            </div>
          </div>
        </div>

        {relatedFiltered.length > 0 && (
          <div className="mt-16"><BookGrid title={t("book.related")} books={relatedFiltered} /></div>
        )}
      </main>
      <Footer />

      {/* Book Reader */}
      <BookReader
        book={book}
        open={showReader}
        onClose={() => setShowReader(false)}
        onPurchase={() => {
          addToCart(book);
          setShowReader(false);
          toast.success(t("book.addtocart"));
        }}
      />
    </div>
  );
};

export default BookDetail;
