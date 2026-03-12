import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookCard from "@/components/BookCard";
import { Book } from "@/data/mockBooks";
import { useLanguage } from "@/contexts/LanguageContext";

interface BookGridProps {
  title: string;
  books: Book[];
  categoryLink?: string;
}

const BookGrid = ({ title, books, categoryLink }: BookGridProps) => {
  const { t } = useLanguage();

  if (books.length === 0) return null;

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
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
};

export default BookGrid;
