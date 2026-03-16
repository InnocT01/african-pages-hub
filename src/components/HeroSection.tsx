import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Star, BookOpen, ShoppingCart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    const timer = setInterval(() => setCurrent((c) => (c + 1) % featured.length), 6000);
    return () => clearInterval(timer);
  }, [featured.length]);

  if (isLoading) {
    return (
      <section className="relative bg-gradient-to-br from-primary via-primary to-accent overflow-hidden">
        <div className="container mx-auto px-4 py-20 md:py-28 text-center">
          <Skeleton className="h-10 w-64 mx-auto bg-primary-foreground/10 mb-6" />
          <Skeleton className="h-14 w-full max-w-2xl mx-auto bg-primary-foreground/10 rounded-full" />
        </div>
      </section>
    );
  }

  const book = featured.length > 0 ? featured[current % featured.length] : null;
  const prev = () => setCurrent((c) => (c - 1 + featured.length) % featured.length);
  const next = () => setCurrent((c) => (c + 1) % featured.length);

  return (
    <section className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent" />
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

      <div className="container relative mx-auto px-4 py-16 md:py-24">
        {/* Title + Search */}
        <div className="text-center mb-12 md:mb-16">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight mb-4">
            {lang === "fr" ? "Découvrez la littérature africaine" : "Discover African Literature"}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg md:text-xl text-primary-foreground/70 mb-8 max-w-2xl mx-auto">
            {lang === "fr" ? "E-books, livres brochés, audio — des milliers d'œuvres à portée de main" : "E-books, paperbacks, audio — thousands of works at your fingertips"}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="max-w-2xl mx-auto">
            <form className="relative" onSubmit={(e) => { e.preventDefault(); const q = (e.target as any).search.value; if (q.trim()) window.location.href = `/catalog?search=${encodeURIComponent(q)}`; }}>
              <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input name="search" placeholder={lang === "fr" ? "Rechercher un livre, un auteur, un genre..." : "Search a book, author, genre..."} className="w-full h-14 pl-14 pr-32 rounded-full bg-background text-foreground shadow-2xl shadow-black/20 border-0 outline-none focus:ring-4 focus:ring-primary-foreground/20 text-base" />
              <Button type="submit" size="lg" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-10 px-6 font-semibold">
                {lang === "fr" ? "Chercher" : "Search"}
              </Button>
            </form>
          </motion.div>
        </div>

        {/* Featured book carousel */}
        {featured.length > 0 && book && (
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory">
              {featured.map((fb, i) => {
                const desc = lang === "fr" ? fb.description_fr : fb.description_en;
                const ep = fb.on_sale && fb.sale_price ? fb.sale_price : fb.price;
                return (
                  <Link key={fb.id} to={`/book/${fb.id}`} className="snap-start shrink-0 w-[280px] md:w-[320px] group">
                    <div className="bg-background rounded-2xl overflow-hidden shadow-lg shadow-black/10 hover:shadow-xl transition-shadow">
                      <div className="relative aspect-[3/2] overflow-hidden">
                        {fb.cover_url ? (
                          <img src={fb.cover_url} alt={fb.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="h-full w-full bg-secondary flex items-center justify-center"><BookOpen className="h-10 w-10 text-muted-foreground/30" /></div>
                        )}
                        {/* Rating badge */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-foreground/80 backdrop-blur-sm text-primary-foreground px-2 py-1 rounded-lg">
                          <span className="text-sm font-bold">{fb.rating?.toFixed(1) || "—"}</span>
                          <Star className="h-3 w-3 fill-current text-accent" />
                          <span className="text-[10px] opacity-70">{fb.review_count || 0} {lang === "fr" ? "avis" : "reviews"}</span>
                        </div>
                        {/* Price */}
                        <div className="absolute bottom-3 right-3 bg-background/95 backdrop-blur-sm rounded-lg px-3 py-1.5">
                          <span className="text-lg font-extrabold text-primary tabular-nums">${ep.toFixed(2)}</span>
                        </div>
                        {fb.on_sale && (
                          <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground text-[10px]">
                            -{Math.round((1 - (fb.sale_price || fb.price) / fb.price) * 100)}%
                          </Badge>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">{fb.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{fb.author_name} · {fb.origin}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                            {fb.format === "both" ? "E-book + Broché" : fb.format === "paperback" ? "Broché" : "E-book"}
                          </span>
                          <Button size="sm" variant="ghost" className="h-7 text-xs text-primary font-semibold gap-1 hover:bg-primary/5" onClick={(e) => { e.preventDefault(); addToCart(fb); }}>
                            <ShoppingCart className="h-3 w-3" />{lang === "fr" ? "Ajouter" : "Add"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
