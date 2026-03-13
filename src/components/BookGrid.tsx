import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookCard from "@/components/BookCard";
import type { Book } from "@/types/book";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";

interface BookGridProps {
  title: string;
  books: Book[];
  categoryLink?: string;
  loading?: boolean;
}

const BookGrid = ({ title, books, categoryLink, loading }: BookGridProps) => {
  const { t } = useLanguage();

  if (!loading && books.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
        {categoryLink && (
          <Button variant="ghost" size="sm" asChild className="gap-1 text-muted-foreground hover:text-primary">
            <Link to={categoryLink}>
              {t("section.viewall")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[2/3] rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </section>
  );
};

export default BookGrid;
