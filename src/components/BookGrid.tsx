import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookCard from "@/components/BookCard";
import type { Book } from "@/types/book";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useRef } from "react";

interface BookGridProps {
  title: string;
  books: Book[];
  categoryLink?: string;
  loading?: boolean;
  horizontal?: boolean;
  viewMode?: "grid" | "list";
}

const BookGrid = ({ title, books, categoryLink, loading, horizontal = true, viewMode = "grid" }: BookGridProps) => {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!loading && books.length === 0) return null;

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  return (
    <section className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border">
        <div className="space-y-3">
          <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight text-foreground">{title}</h2>
          <div className="editorial-rule" />
        </div>
        <div className="flex items-center gap-3">
          {horizontal && books.length > 4 && (
            <div className="hidden md:flex gap-1">
              <button onClick={() => scroll("left")} aria-label="Scroll left" className="h-9 w-9 rounded-none flex items-center justify-center border border-border hover:bg-secondary transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={() => scroll("right")} aria-label="Scroll right" className="h-9 w-9 rounded-none flex items-center justify-center border border-border hover:bg-secondary transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
          {categoryLink && (
            <Button variant="ghost" size="sm" asChild className="gap-2 text-primary font-bold text-[11px] uppercase tracking-[0.2em] rounded-none hover:bg-transparent hover:text-foreground group">
              <Link to={categoryLink}>{t("section.viewall")}<ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" /></Link>
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex gap-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="shrink-0 w-[140px] space-y-3">
              <Skeleton className="aspect-[2/3] rounded-2xl" />
              <Skeleton className="h-3 w-3/4 rounded-lg" />
              <Skeleton className="h-2.5 w-1/2 rounded-lg" />
            </div>
          ))}
        </div>
      ) : horizontal ? (
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory">
          {books.map((book) => (
            <div key={book.id} className="snap-start shrink-0 w-[140px] sm:w-[160px]">
              <BookCard book={book} />
            </div>
          ))}
        </div>
      ) : viewMode === "list" ? (
        <div className="divide-y divide-border/50">
          {books.map((book) => (
            <BookCard key={book.id} book={book} viewMode="list" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </section>
  );
};

export default BookGrid;
