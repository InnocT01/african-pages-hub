import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Star, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useBooks } from "@/hooks/useBooks";
import { Skeleton } from "@/components/ui/skeleton";

const HeroSection = () => {
  const { lang } = useLanguage();
  const { format: formatPrice } = useCurrency();
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
      <div className="py-8">
        <div className="container mx-auto px-4">
          <Skeleton className="h-[380px] rounded-3xl" />
        </div>
      </div>
    );
  }

  if (featured.length === 0) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            {lang === "fr" ? "La bibliothèque africaine du futur" : "The African Library of the Future"}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            <span className="gradient-text">{lang === "fr" ? "Découvrez" : "Discover"}</span>{" "}
            {lang === "fr" ? "la littérature africaine" : "African Literature"}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {lang === "fr"
              ? "Publiez, partagez et explorez les plus belles œuvres du continent."
              : "Publish, share, and explore the finest works from the continent."}
          </p>
          <div className="flex gap-3 justify-center pt-4">
            <Button asChild size="lg" className="rounded-2xl font-semibold gap-2">
              <Link to="/catalog">{lang === "fr" ? "Explorer" : "Explore"} <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-2xl">
              <Link to="/signup">{lang === "fr" ? "Publier mon œuvre" : "Publish my work"}</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const book = featured[current];

  return (
    <div className="py-6 md:py-8">
      <div className="container mx-auto px-4">
        {/* Main hero card */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-foreground via-foreground/95 to-foreground/85 min-h-[340px] md:min-h-[400px] shadow-glass-lg">
          {/* Decorative elements */}
          <div className="absolute inset-0 kente-pattern opacity-30" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-gold to-accent" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 p-8 md:p-12 h-full">
            {/* Text side */}
            <div className="flex-1 space-y-4 animate-fade-up" key={current}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 backdrop-blur-sm">
                <Sparkles className="h-3 w-3 text-gold" />
                <span className="text-[11px] font-semibold text-gold uppercase tracking-wider">
                  {lang === "fr" ? "Livre vedette" : "Featured Book"}
                </span>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-extrabold leading-[1.1] text-background font-display">
                {book.title}
              </h2>
              
              {book.subtitle && (
                <p className="text-sm text-background/50 font-medium">{book.subtitle}</p>
              )}
              
              <p className="text-sm text-background/40">
                {lang === "fr" ? "par" : "by"}{" "}
                <span className="text-gold font-semibold">{book.author_name || "—"}</span>
                {book.origin && <span className="ml-2 text-background/25">· {book.origin}</span>}
              </p>
              
              <div className="flex items-center gap-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.round(book.rating || 0) ? "fill-gold text-gold" : "text-background/15"}`} />
                  ))}
                </div>
                <span className="text-xs text-background/40">
                  ({book.review_count || 0} {lang === "fr" ? "avis" : "reviews"})
                </span>
              </div>
              
              <div className="flex items-center gap-4 pt-1">
                <span className="text-3xl font-extrabold text-background">
                  {formatPrice(book.on_sale && book.sale_price ? book.sale_price : book.price)}
                </span>
                {book.on_sale && book.sale_price && (
                  <span className="text-sm text-background/30 line-through">{formatPrice(book.price)}</span>
                )}
              </div>
              
              <div className="flex gap-3 pt-3">
                <Button asChild className="rounded-2xl font-semibold gap-2 h-11 px-6 bg-primary hover:bg-primary/90">
                  <Link to={`/book/${book.id}`}>
                    {lang === "fr" ? "Découvrir" : "Discover"} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-2xl h-11 px-6 border-background/20 text-background hover:bg-background/10 hover:text-background">
                  <Link to="/catalog">{lang === "fr" ? "Explorer tout" : "Browse All"}</Link>
                </Button>
              </div>
            </div>

            {/* Cover image */}
            <div className="shrink-0 relative animate-float" key={`cover-${current}`}>
              <div className="w-44 md:w-56 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-background/10 animate-fade-up">
                {book.cover_url ? (
                  <img src={book.cover_url} alt={book.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-muted flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground/30" />
                  </div>
                )}
              </div>
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-primary/15 rounded-3xl blur-2xl -z-10" />
            </div>
          </div>

          {/* Nav arrows */}
          {featured.length > 1 && (
            <>
              <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-xl bg-background/10 hover:bg-background/20 backdrop-blur-sm flex items-center justify-center text-background transition-colors">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-xl bg-background/10 hover:bg-background/20 backdrop-blur-sm flex items-center justify-center text-background transition-colors">
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {featured.slice(0, 8).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-primary" : "w-2 bg-background/20 hover:bg-background/40"}`}
              />
            ))}
          </div>
        </div>

        {/* Featured thumbnails */}
        {featured.length > 1 && (
          <div className="flex gap-3 mt-6 overflow-x-auto scrollbar-hide pb-1">
            {featured.slice(0, 8).map((fb, i) => (
              <button
                key={fb.id}
                onClick={() => setCurrent(i)}
                className={`shrink-0 group cursor-pointer transition-all duration-300 ${i === current ? "scale-105" : "opacity-60 hover:opacity-100"}`}
              >
                <div className="w-16 space-y-1.5">
                  <div className={`aspect-[2/3] rounded-xl overflow-hidden shadow-sm transition-all duration-300 ${i === current ? "ring-2 ring-primary shadow-glow" : "ring-1 ring-border group-hover:ring-primary/30"}`}>
                    {fb.cover_url ? (
                      <img src={fb.cover_url} alt={fb.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-muted flex items-center justify-center">
                        <BookOpen className="h-3 w-3 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <p className="text-[9px] font-medium line-clamp-1 text-center text-muted-foreground">{fb.title}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
