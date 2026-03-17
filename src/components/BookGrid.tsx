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
    scrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">{title}</h2>
        <div className="flex items-center gap-2">
          {horizontal && books.length > 4 && (
            <div className="hidden md:flex gap-1">
              <Button variant="outline" size="icon" className="h-7 w-7 rounded-sm" onClick={() => scroll("left")}><ChevronLeft className="h-3.5 w-3.5" /></Button>
              <Button variant="outline" size="icon" className="h-7 w-7 rounded-sm" onClick={() => scroll("right")}><ChevronRight className="h-3.5 w-3.5" /></Button>
            </div>
          )}
          {categoryLink && (
            <Button variant="ghost" size="sm" asChild className="gap-1 text-primary font-semibold text-xs">
              <Link to={categoryLink}>{t("section.viewall")}<ArrowRight className="h-3 w-3" /></Link>
            </Button>
          )}
        </div>
      </div>
      {loading ? (
        <div className="flex gap-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="shrink-0 w-[130px] space-y-2">
              <Skeleton className="aspect-[2/3] rounded-sm" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-2 w-1/2" />
            </div>
          ))}
        </div>
      ) : horizontal ? (
        <div ref={scrollRef} className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory">
          {books.map((book) => (
            <div key={book.id} className="snap-start shrink-0 w-[130px] sm:w-[150px]">
              <BookCard book={book} />
            </div>
          ))}
        </div>
      ) : viewMode === "list" ? (
        <div className="divide-y divide-border">
          {books.map((book) => (
            <BookCard key={book.id} book={book} viewMode="list" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </section>
  );
};

export default BookGrid;
