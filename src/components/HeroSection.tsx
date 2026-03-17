import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useBooks } from "@/hooks/useBooks";
import { Skeleton } from "@/components/ui/skeleton";

const HeroSection = () => {
  const { lang } = useLanguage();
  const { data: featured = [], isLoading } = useBooks({ featured: true, limit: 6 });
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (featured.length === 0) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % featured.length), 5000);
    return () => clearInterval(timer);
  }, [featured.length]);

  if (isLoading) {
    return (
      <div className="bg-secondary border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <Skeleton className="h-48 rounded-lg" />
        </div>
      </div>
    );
  }

  const book = featured.length > 0 ? featured[current % featured.length] : null;

  return (
    <div className="bg-gradient-to-r from-primary/10 via-background to-accent/10 border-b border-border">
      <div className="container mx-auto px-4 py-6">
        {/* Amazon-style promotional banner */}
        <div className="rounded-lg overflow-hidden bg-gradient-to-r from-primary/20 to-accent/10 p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 space-y-3">
              <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
                {lang === "fr" ? "Découvrez la littérature africaine" : "Discover African Literature"}
              </h2>
              <p className="text-sm text-muted-foreground max-w-lg">
                {lang === "fr"
                  ? "E-books, livres brochés, audio — des milliers d'œuvres d'auteurs africains. Publiez vos livres via Kitabu Direct Publishing."
                  : "E-books, paperbacks, audio — thousands of works from African authors. Publish your books via Kitabu Direct Publishing."}
              </p>
              <div className="flex gap-3 pt-2">
                <Button asChild size="sm" className="rounded-sm font-semibold text-xs">
                  <Link to="/catalog">{lang === "fr" ? "Explorer le catalogue" : "Browse Catalog"} <ArrowRight className="h-3.5 w-3.5 ml-1" /></Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="rounded-sm text-xs">
                  <Link to="/signup">{lang === "fr" ? "Publier un livre" : "Publish a Book"}</Link>
                </Button>
              </div>
            </div>

            {/* Featured books scroll */}
            {featured.length > 0 && (
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                {featured.slice(0, 5).map((fb) => (
                  <Link key={fb.id} to={`/book/${fb.id}`} className="shrink-0 group">
                    <div className="w-28 space-y-1.5">
                      <div className="aspect-[2/3] rounded-md overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                        {fb.cover_url ? (
                          <img src={fb.cover_url} alt={fb.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full bg-muted flex items-center justify-center"><BookOpen className="h-6 w-6 text-muted-foreground/30" /></div>
                        )}
                      </div>
                      <p className="text-[10px] font-medium line-clamp-1">{fb.title}</p>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-2.5 w-2.5 ${i < Math.round(fb.rating || 0) ? "star-fill" : "text-border"}`} />
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
