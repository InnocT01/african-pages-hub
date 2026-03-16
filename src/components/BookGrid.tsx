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
}

const BookGrid = ({ title, books, categoryLink, loading, horizontal = true }: BookGridProps) => {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!loading && books.length === 0) return null;

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = dir === "left" ? -300 : 300;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold md:text-2xl">{title}</h2>
        <div className="flex items-center gap-2">
          {horizontal && books.length > 4 && (
            <div className="hidden md:flex gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => scroll("left")}><ChevronLeft className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => scroll("right")}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          )}
          {categoryLink && (
            <Button variant="ghost" size="sm" asChild className="gap-1 text-primary font-semibold text-xs">
              <Link to={categoryLink}>{t("section.viewall")}<ArrowRight className="h-3.5 w-3.5" /></Link>
            </Button>
          )}
        </div>
      </div>
      {loading ? (
        <div className="flex gap-4 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="shrink-0 w-[170px] space-y-3">
              <Skeleton className="aspect-[3/4] rounded-2xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : horizontal ? (
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory">
          {books.map((book) => (
            <div key={book.id} className="snap-start shrink-0 w-[170px] sm:w-[185px] md:w-[195px]">
              <BookCard book={book} />
            </div>
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
