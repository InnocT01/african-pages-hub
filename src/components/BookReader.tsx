import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ShoppingCart, Lock, BookOpen } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Book } from "@/types/book";

interface BookReaderProps {
  book: Book;
  open: boolean;
  onClose: () => void;
  onPurchase: () => void;
}

const BookReader = ({ book, open, onClose, onPurchase }: BookReaderProps) => {
  const { lang } = useLanguage();
  const [page, setPage] = useState(0);
  const desc = lang === "fr" ? book.description_fr : book.description_en;
  const MAX_FREE_PAGES = 3;

  // Simulate pages from description
  const fullText = desc || (lang === "fr" ? "Aucun aperçu disponible pour ce livre." : "No preview available for this book.");
  const words = fullText.split(" ");
  const wordsPerPage = Math.max(60, Math.floor(words.length / 5));
  const pages: string[] = [];
  for (let i = 0; i < words.length; i += wordsPerPage) {
    pages.push(words.slice(i, i + wordsPerPage).join(" "));
  }
  // Pad to at least 5 pages
  while (pages.length < 5) {
    pages.push(lang === "fr" 
      ? "Suite du texte... Ce contenu est un aperçu. Le texte complet est disponible après l'achat."
      : "Continued text... This content is a preview. The full text is available after purchase.");
  }

  const isLocked = page >= MAX_FREE_PAGES;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-5 pb-3 border-b border-border">
          <DialogTitle className="flex items-center gap-2 text-base">
            <BookOpen className="h-4 w-4 text-primary" />
            {book.title}
            <span className="text-xs text-muted-foreground font-normal ml-2">
              {lang === "fr" ? `Page ${page + 1}` : `Page ${page + 1}`}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="relative min-h-[400px] px-8 py-6">
          {isLocked ? (
            <div className="flex flex-col items-center justify-center h-[400px] gap-4 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">
                {lang === "fr" ? "Aperçu terminé" : "Preview Complete"}
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {lang === "fr"
                  ? `Vous avez lu les ${MAX_FREE_PAGES} premières pages gratuites. Achetez le livre pour continuer votre lecture.`
                  : `You've read the first ${MAX_FREE_PAGES} free pages. Purchase the book to continue reading.`}
              </p>
              <div className="flex items-center gap-3 pt-2">
                <span className="text-2xl font-extrabold text-primary">
                  ${book.on_sale && book.sale_price ? book.sale_price.toFixed(2) : book.price.toFixed(2)}
                </span>
                {book.on_sale && book.sale_price && (
                  <span className="text-sm text-muted-foreground line-through">${book.price.toFixed(2)}</span>
                )}
              </div>
              <Button onClick={onPurchase} className="rounded-full gap-2 mt-2">
                <ShoppingCart className="h-4 w-4" />
                {lang === "fr" ? "Acheter maintenant" : "Buy Now"} — ${(book.on_sale && book.sale_price ? book.sale_price : book.price).toFixed(2)}
              </Button>
            </div>
          ) : (
            <div className="animate-fade-up" key={page}>
              {/* Page content */}
              <div className="prose prose-sm max-w-none font-serif leading-relaxed text-foreground/90">
                <p className="first-letter:text-4xl first-letter:font-display first-letter:font-bold first-letter:text-primary first-letter:mr-1 first-letter:float-left">
                  {pages[page]}
                </p>
              </div>
              {/* Page progress */}
              <div className="mt-6 flex items-center gap-2">
                <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${((page + 1) / MAX_FREE_PAGES) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">
                  {page + 1}/{MAX_FREE_PAGES} {lang === "fr" ? "pages gratuites" : "free pages"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-muted/30">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="gap-1 text-xs"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            {lang === "fr" ? "Précédent" : "Previous"}
          </Button>
          <span className="text-xs text-muted-foreground">
            {page + 1} / {MAX_FREE_PAGES + 1}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage(Math.min(MAX_FREE_PAGES, page + 1))}
            disabled={page >= MAX_FREE_PAGES}
            className="gap-1 text-xs"
          >
            {lang === "fr" ? "Suivant" : "Next"}
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookReader;
