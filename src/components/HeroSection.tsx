import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useBooks } from "@/hooks/useBooks";
import { Skeleton } from "@/components/ui/skeleton";

const HeroSection = () => {
  const { lang } = useLanguage();
  const { data: featured = [], isLoading } = useBooks({ featured: true, limit: 8 });
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (featured.length === 0) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % featured.length), 5000);
    return () => clearInterval(timer);
  }, [featured.length]);

  const prev = () => setCurrent((c) => (c - 1 + featured.length) % featured.length);
  const next = () => setCurrent((c) => (c + 1) % featured.length);

  if (isLoading) {
    return (
      <div className="bg-secondary border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (featured.length === 0) return null;

  const book = featured[current];

  return (
    <div className="border-b border-border kente-pattern">
      <div className="container mx-auto px-4 py-6">
        {/* Main hero banner - sliding featured book */}
        <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-[hsl(var(--header-bg))] via-[hsl(var(--earth-brown))] to-[hsl(var(--header-bg))] min-h-[280px] md:min-h-[320px]">
          {/* Kente decorative stripe */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-[hsl(var(--kente-gold))] to-accent" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 p-6 md:p-10 h-full">
            {/* Text side */}
            <div className="flex-1 space-y-3 text-white animate-fade-up" key={current}>
              <span className="text-[10px] uppercase tracking-widest font-semibold text-[hsl(var(--kente-gold))]">
                {lang === "fr" ? "📚 Livre vedette" : "📚 Featured Book"}
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold leading-tight font-display">
                {book.title}
              </h2>
              {book.subtitle && <p className="text-sm text-white/70">{book.subtitle}</p>}
              <p className="text-sm text-white/60">
                {lang === "fr" ? "par" : "by"} <span className="text-[hsl(var(--kente-gold))] font-semibold">{book.author_name || "—"}</span>
                {book.origin && <span className="ml-2 text-white/40">· {book.origin}</span>}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(book.rating || 0) ? "fill-[hsl(var(--kente-gold))] text-[hsl(var(--kente-gold))]" : "text-white/20"}`} />
                  ))}
                </div>
                <span className="text-xs text-white/50">({book.review_count || 0} {lang === "fr" ? "avis" : "reviews"})</span>
              </div>
              <div className="flex items-center gap-4 pt-2">
                <span className="text-2xl font-extrabold text-[hsl(var(--kente-gold))]">
                  ${book.on_sale && book.sale_price ? book.sale_price.toFixed(2) : book.price.toFixed(2)}
                </span>
                {book.on_sale && book.sale_price && (
                  <span className="text-sm text-white/40 line-through">${book.price.toFixed(2)}</span>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <Button asChild size="sm" className="rounded-full font-semibold text-xs bg-primary hover:bg-primary/90 gap-1.5">
                  <Link to={`/book/${book.id}`}>{lang === "fr" ? "Découvrir" : "Discover"} <ArrowRight className="h-3.5 w-3.5" /></Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="rounded-full text-xs border-white/20 text-white hover:bg-white/10">
                  <Link to="/catalog">{lang === "fr" ? "Explorer le catalogue" : "Browse Catalog"}</Link>
                </Button>
              </div>
            </div>

            {/* Cover image side */}
            <div className="shrink-0 relative" key={`cover-${current}`}>
              <div className="w-40 md:w-48 aspect-[2/3] rounded-lg overflow-hidden shadow-2xl ring-2 ring-white/10 animate-fade-up">
                {book.cover_url ? (
                  <img src={book.cover_url} alt={book.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-muted flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground/30" />
                  </div>
                )}
              </div>
              {/* Decorative shadow */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-black/30 blur-xl rounded-full" />
            </div>
          </div>

          {/* Navigation arrows */}
          {featured.length > 1 && (
            <>
              <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors">
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {featured.slice(0, 8).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all ${i === current ? "w-6 bg-[hsl(var(--kente-gold))]" : "w-1.5 bg-white/30 hover:bg-white/50"}`}
              />
            ))}
          </div>
        </div>

        {/* Quick category scrollbar below */}
        <div className="flex gap-3 mt-5 overflow-x-auto scrollbar-hide pb-1">
          {featured.slice(0, 8).map((fb, i) => (
            <Link
              key={fb.id}
              to={`/book/${fb.id}`}
              onClick={() => setCurrent(i)}
              className={`shrink-0 group cursor-pointer transition-all ${i === current ? "scale-105" : "opacity-70 hover:opacity-100"}`}
            >
              <div className="w-20 space-y-1">
                <div className={`aspect-[2/3] rounded-md overflow-hidden shadow-sm ring-2 transition-all ${i === current ? "ring-primary" : "ring-transparent group-hover:ring-border"}`}>
                  {fb.cover_url ? (
                    <img src={fb.cover_url} alt={fb.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-muted flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
                <p className="text-[9px] font-medium line-clamp-1 text-center">{fb.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
