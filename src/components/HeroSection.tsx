import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Star, BookOpen, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useBooks } from "@/hooks/useBooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const HeroSection = () => {
  const { t, lang } = useLanguage();
  const { addToCart } = useCart();
  const { data: featured = [], isLoading } = useBooks({ featured: true, limit: 6 });
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (featured.length === 0) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % featured.length), 5000);
    return () => clearInterval(timer);
  }, [featured.length]);

  if (isLoading) {
    return (
      <section className="bg-[hsl(20,45%,22%)] text-[hsl(30,25%,97%)]">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <Skeleton className="w-48 md:w-56 aspect-[2/3] rounded-2xl bg-white/10" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-6 w-32 bg-white/10" />
              <Skeleton className="h-12 w-3/4 bg-white/10" />
              <Skeleton className="h-4 w-1/2 bg-white/10" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (featured.length === 0) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(20,45%,22%)] to-[hsl(25,35%,30%)] text-[hsl(30,25%,97%)]">
        <div className="container mx-auto px-4 py-16 md:py-20 text-center">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-primary opacity-60" />
          <h2 className="text-3xl font-bold md:text-5xl mb-4">{t("hero.nobooks")}</h2>
          <Button size="lg" asChild className="rounded-full gap-2 mt-4">
            <Link to="/signup">{t("cta.creator.button")}<ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    );
  }

  const book = featured[current % featured.length];
  if (!book) return null;

  const prev = () => setCurrent((c) => (c - 1 + featured.length) % featured.length);
  const next = () => setCurrent((c) => (c + 1) % featured.length);
  const description = lang === "fr" ? book.description_fr : book.description_en;
  const effectivePrice = book.on_sale && book.sale_price ? book.sale_price : book.price;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(20,45%,22%)] via-[hsl(25,35%,25%)] to-[hsl(20,30%,18%)] text-[hsl(30,25%,97%)]">
      <AnimatePresence mode="wait">
        <motion.div
          key={book.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.15, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: book.cover_url ? `url(${book.cover_url})` : undefined }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(20,45%,22%)] via-[hsl(20,45%,22%)]/95 to-transparent" />

      <div className="container relative mx-auto px-4 py-14 md:py-20">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-14">
          <AnimatePresence mode="wait">
            <motion.div key={book.id} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.5 }} className="shrink-0">
              <Link to={`/book/${book.id}`}>
                <div className="relative w-44 md:w-52 lg:w-60 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl shadow-black/30 hover:shadow-primary/30 transition-shadow">
                  {book.cover_url ? (
                    <img src={book.cover_url} alt={book.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-muted flex items-center justify-center"><BookOpen className="h-16 w-16 text-muted-foreground/30" /></div>
                  )}
                </div>
              </Link>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div key={book.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex-1 space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary">
                <Star className="h-3 w-3 fill-primary" />{t("hero.featured")}
              </div>
              <h2 className="text-3xl font-bold md:text-5xl lg:text-6xl leading-tight">{book.title}</h2>
              <p className="text-lg opacity-70 font-sans">{t("book.by")} <span className="text-primary font-medium">{book.author_name || "Auteur"}</span> · {book.origin}</p>
              {description && <p className="text-sm opacity-50 max-w-lg font-sans line-clamp-3">{description}</p>}
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className={`h-4 w-4 ${i < Math.floor(book.rating || 0) ? "fill-primary text-primary" : "text-white/20"}`} />)}</div>
                <span className="text-sm opacity-50">({book.review_count || 0})</span>
              </div>
              <div className="flex items-center gap-3 justify-center md:justify-start">
                {book.on_sale && book.sale_price ? (
                  <>
                    <span className="text-3xl font-bold text-primary tabular-nums">${book.sale_price.toFixed(2)}</span>
                    <span className="text-xl line-through opacity-40 tabular-nums">${book.price.toFixed(2)}</span>
                    <Badge className="bg-destructive text-destructive-foreground">Promo</Badge>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-primary tabular-nums">${book.price.toFixed(2)}</span>
                )}
              </div>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
                <Button size="lg" className="rounded-full text-base gap-2" onClick={() => addToCart(book)}>
                  <ShoppingCart className="h-4 w-4" />{t("book.addtocart")}
                </Button>
                <Button size="lg" variant="outline" asChild className="rounded-full text-base gap-2 border-white/20 text-white hover:bg-white/10">
                  <Link to={`/book/${book.id}`}>{t("hero.details")}<ArrowRight className="h-4 w-4" /></Link>
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {featured.length > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button variant="ghost" size="icon" onClick={prev} className="rounded-full text-white/50 hover:text-white hover:bg-white/10"><ChevronLeft className="h-5 w-5" /></Button>
            <div className="flex gap-2">{featured.map((_, i) => <button key={i} onClick={() => setCurrent(i)} className={`h-2 rounded-full transition-all ${i === current % featured.length ? "w-8 bg-primary" : "w-2 bg-white/20 hover:bg-white/40"}`} />)}</div>
            <Button variant="ghost" size="icon" onClick={next} className="rounded-full text-white/50 hover:text-white hover:bg-white/10"><ChevronRight className="h-5 w-5" /></Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
