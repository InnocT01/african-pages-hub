import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Eye, Headphones, BookOpen, Package, Star } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookGrid from "@/components/BookGrid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { mockBooks } from "@/data/mockBooks";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";

const typeIcons = { ebook: BookOpen, audio: Headphones, physical: Package };

const BookDetail = () => {
  const { id } = useParams();
  const { t, lang } = useLanguage();
  const { addToCart } = useCart();

  const book = mockBooks.find((b) => b.id === id);
  if (!book) return <div className="min-h-screen flex items-center justify-center">Book not found</div>;

  const related = mockBooks.filter((b) => b.id !== book.id && (b.category === book.category || b.origin === book.origin)).slice(0, 5);
  const description = lang === "fr" ? book.description_fr : book.description_en;
  const TypeIcon = typeIcons[book.type];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button variant="ghost" size="sm" asChild className="mb-6 gap-1">
          <Link to="/catalog"><ArrowLeft className="h-4 w-4" />{t("common.back")}</Link>
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
          {/* Cover */}
          <div className="relative">
            <div className="aspect-[2/3] overflow-hidden rounded-2xl shadow-xl">
              <img src={book.cover} alt={book.title} className="h-full w-full object-cover" />
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-3 gap-1">
                <TypeIcon className="h-3 w-3" />{t(`filter.${book.type}`)}
              </Badge>
              <h1 className="text-3xl font-bold md:text-4xl">{book.title}</h1>
              <p className="text-lg text-muted-foreground mt-1">{t("book.by")} <span className="text-foreground font-medium">{book.author}</span></p>
              <p className="text-sm text-muted-foreground mt-1">{book.origin} · {book.genre}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => <Star key={i} className={`h-4 w-4 ${i < Math.floor(book.rating) ? "fill-primary text-primary" : "text-border"}`} />)}
              </div>
              <span className="text-sm text-muted-foreground">{book.rating} ({book.reviews})</span>
            </div>

            <p className="text-3xl font-bold text-primary tabular-nums">${book.price.toFixed(2)}</p>

            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="description" className="flex-1">{t("book.description")}</TabsTrigger>
                <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="pt-4">
                <p className="text-muted-foreground leading-relaxed font-sans">{description}</p>
              </TabsContent>
              <TabsContent value="details" className="pt-4">
                <dl className="space-y-2 text-sm font-sans">
                  <div className="flex justify-between"><dt className="text-muted-foreground">{t("filter.genre")}</dt><dd>{book.genre}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">{t("filter.origin")}</dt><dd>{book.origin}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">{t("filter.type")}</dt><dd>{t(`filter.${book.type}`)}</dd></div>
                </dl>
              </TabsContent>
            </Tabs>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="flex-1 rounded-full gap-2" onClick={() => addToCart(book)}>
                <ShoppingCart className="h-4 w-4" />{t("book.addtocart")}
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" variant="outline" className="flex-1 rounded-full gap-2">
                    <Eye className="h-4 w-4" />{t("book.preview")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{t("book.preview")} — {book.title}</DialogTitle>
                  </DialogHeader>
                  <div className="prose max-w-none py-4">
                    <p className="text-muted-foreground">{description}</p>
                    <p className="text-muted-foreground mt-4 italic">— {lang === "fr" ? "Fin de l'aperçu. Achetez le livre complet pour continuer." : "End of preview. Purchase the full book to continue."}</p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <BookGrid title={t("book.related")} books={related} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BookDetail;
