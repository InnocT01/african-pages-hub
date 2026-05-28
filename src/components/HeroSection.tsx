import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useBooks } from "@/hooks/useBooks";
import { Skeleton } from "@/components/ui/skeleton";

const HeroSection = () => {
  const { lang } = useLanguage();
  const { format: formatPrice } = useCurrency();
  const { data: featured = [], isLoading } = useBooks({ featured: true, limit: 6 });
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (featured.length === 0) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % featured.length), 6000);
    return () => clearInterval(timer);
  }, [featured.length]);

  const book = featured[current];

  return (
    <section className="relative bg-secondary overflow-hidden">
      {/* Decorative blur */}
      <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] bg-primary/[0.06] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-32 w-[24rem] h-[24rem] bg-accent/[0.06] rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — editorial copy */}
          <div className="relative z-10 space-y-7">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-primary" />
              <span className="text-primary tracking-[0.2em] uppercase text-[11px] font-bold">
                {lang === "fr" ? "Collection Héritage 2026" : "Heritage Collection 2026"}
              </span>
            </div>

            <h1 className="font-display text-6xl md:text-7xl xl:text-8xl font-medium leading-[0.88] text-foreground">
              {lang === "fr" ? (
                <>L'âme de <br /><span className="italic text-primary">la littérature</span> <br />Africaine.</>
              ) : (
                <>The soul of <br /><span className="italic text-primary">African</span> <br />literature.</>
              )}
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed font-light">
              {lang === "fr"
                ? "Une curation d'ouvrages d'exception qui racontent nos histoires. Des classiques intemporels aux voix émergentes de la diaspora."
                : "A curation of exceptional works that tell our stories. From timeless classics to emerging diaspora voices."}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button asChild size="lg" className="rounded-none px-10 h-12 text-xs uppercase tracking-[0.15em] font-bold shadow-xl shadow-primary/15 hover:-translate-y-0.5 transition-transform">
                <Link to="/catalog">{lang === "fr" ? "Explorer le catalogue" : "Explore the catalog"}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-none px-10 h-12 text-xs uppercase tracking-[0.15em] font-bold border-foreground/20 hover:border-primary hover:text-primary bg-transparent">
                <Link to="/signup">{lang === "fr" ? "Devenir auteur" : "Become an author"}</Link>
              </Button>
            </div>
          </div>

          {/* Right — featured book card */}
          <div className="relative flex justify-center lg:justify-end">
            {isLoading ? (
              <Skeleton className="w-full max-w-sm aspect-[3/4]" />
            ) : book ? (
              <Link
                to={`/book/${book.id}`}
                key={book.id}
                className="relative w-full max-w-sm aspect-[3/4] group animate-fade-up"
              >
                <div className="absolute inset-0 border-[10px] md:border-[12px] border-card z-20 pointer-events-none" />
                <div className="absolute inset-0 shadow-2xl transition-transform duration-700 group-hover:scale-[1.02] overflow-hidden bg-muted">
                  {book.cover_url ? (
                    <img src={book.cover_url} alt={book.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-muted-foreground/30" />
                    </div>
                  )}
                </div>

                {/* Floating caption card */}
                <div className="absolute -bottom-8 -left-6 md:-left-12 w-56 bg-card p-5 shadow-2xl z-30 border border-border/60 hidden md:block">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-2">
                    {lang === "fr" ? "Livre vedette" : "Featured book"}
                  </p>
                  <h3 className="font-display text-xl leading-tight mb-1 line-clamp-2">{book.title}</h3>
                  <p className="text-xs text-muted-foreground italic mb-3 font-display">
                    {book.author_name || "—"}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < Math.round(book.rating || 0) ? "star-fill" : "text-border"}`} />
                      ))}
                    </div>
                    <span className="text-primary font-bold text-sm">
                      {formatPrice(book.on_sale && book.sale_price ? book.sale_price : book.price)}
                    </span>
                  </div>
                </div>
              </Link>
            ) : null}
          </div>
        </div>

        {/* Carousel dots */}
        {featured.length > 1 && (
          <div className="flex justify-center lg:justify-end gap-2 mt-16 lg:mt-12 lg:mr-12">
            {featured.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-px transition-all duration-500 ${i === current ? "w-10 bg-primary" : "w-5 bg-foreground/20 hover:bg-foreground/40"}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
