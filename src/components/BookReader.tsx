import { useState, useCallback, useEffect, forwardRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ShoppingCart, Lock, BookOpen, ZoomIn, ZoomOut, Type, Sun, Moon, Maximize2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import type { Book } from "@/types/book";

interface BookReaderProps {
  book: Book;
  open: boolean;
  onClose: () => void;
  onPurchase: () => void;
}

const FONTS = ["Georgia, serif", "'Playfair Display', serif", "Inter, sans-serif", "'Space Grotesk', sans-serif"];
const FONT_LABELS = ["Georgia", "Playfair", "Inter", "Space"];

const BookReader = ({ book, open, onClose, onPurchase }: BookReaderProps) => {
  const { lang } = useLanguage();
  const { format: formatPrice } = useCurrency();
  const [page, setPage] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [fontIdx, setFontIdx] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const MAX_FREE_PAGES = 3;

  const desc = lang === "fr" ? book.description_fr : book.description_en;
  const fullText = desc || (lang === "fr" ? "Aucun aperçu disponible pour ce livre." : "No preview available for this book.");

  // Split into realistic pages based on word count
  const words = fullText.split(/\s+/);
  const wordsPerPage = Math.max(40, Math.floor(words.length / 6));
  const pages: string[] = [];
  for (let i = 0; i < words.length; i += wordsPerPage) {
    pages.push(words.slice(i, i + wordsPerPage).join(" "));
  }
  while (pages.length < 5) {
    pages.push(lang === "fr"
      ? "Suite du texte… Ce contenu est un aperçu. Le texte complet est disponible après l'achat du livre."
      : "Continued text… This content is a preview. The full text is available after purchasing the book.");
  }

  const isLocked = page >= MAX_FREE_PAGES;
  const effectivePrice = book.on_sale && book.sale_price ? book.sale_price : book.price;

  // Keyboard nav
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && page < MAX_FREE_PAGES) setPage(p => Math.min(MAX_FREE_PAGES, p + 1));
      if (e.key === "ArrowLeft" && page > 0) setPage(p => Math.max(0, p - 1));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, page]);

  const readerBg = darkMode ? "bg-[hsl(24,20%,10%)]" : "bg-[hsl(40,30%,96%)]";
  const readerText = darkMode ? "text-[hsl(40,20%,85%)]" : "text-[hsl(240,10%,15%)]";
  const readerMuted = darkMode ? "text-[hsl(40,10%,50%)]" : "text-muted-foreground";

  return (
    <Dialog open={open} onOpenChange={() => { setPage(0); onClose(); }}>
      <DialogContent className="max-w-3xl max-h-[92vh] p-0 overflow-hidden rounded-2xl border-border/50 shadow-2xl">
        {/* Toolbar */}
        <div className={`flex items-center justify-between px-5 py-3 border-b border-border/50 ${darkMode ? "bg-[hsl(24,20%,8%)]" : "bg-card"}`}>
          <div className="flex items-center gap-2 min-w-0">
            <BookOpen className="h-4 w-4 text-primary shrink-0" />
            <span className={`text-sm font-semibold truncate ${darkMode ? "text-[hsl(40,20%,90%)]" : "text-foreground"}`}>{book.title}</span>
          </div>
          <div className="flex items-center gap-1">
            {/* Font size */}
            <button onClick={() => setFontSize(s => Math.max(12, s - 2))} className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors" title="Zoom out">
              <ZoomOut className={`h-3.5 w-3.5 ${readerMuted}`} />
            </button>
            <span className={`text-[10px] tabular-nums w-6 text-center ${readerMuted}`}>{fontSize}</span>
            <button onClick={() => setFontSize(s => Math.min(24, s + 2))} className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors" title="Zoom in">
              <ZoomIn className={`h-3.5 w-3.5 ${readerMuted}`} />
            </button>
            <div className="w-px h-4 bg-border mx-1" />
            {/* Font family */}
            <button onClick={() => setFontIdx(i => (i + 1) % FONTS.length)} className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors" title="Change font">
              <Type className={`h-3.5 w-3.5 ${readerMuted}`} />
            </button>
            <span className={`text-[10px] w-12 ${readerMuted}`}>{FONT_LABELS[fontIdx]}</span>
            <div className="w-px h-4 bg-border mx-1" />
            {/* Dark mode */}
            <button onClick={() => setDarkMode(d => !d)} className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors">
              {darkMode ? <Sun className="h-3.5 w-3.5 text-amber-400" /> : <Moon className={`h-3.5 w-3.5 ${readerMuted}`} />}
            </button>
          </div>
        </div>

        {/* Reading area */}
        <div className={`relative min-h-[420px] max-h-[60vh] overflow-y-auto px-8 sm:px-12 py-8 transition-colors duration-300 ${readerBg}`}>
          {isLocked ? (
            <div className="flex flex-col items-center justify-center h-[400px] gap-5 text-center">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                <Lock className="h-10 w-10 text-primary" />
              </div>
              <h3 className={`text-2xl font-bold font-display ${darkMode ? "text-[hsl(40,20%,90%)]" : "text-foreground"}`}>
                {lang === "fr" ? "Aperçu terminé" : "Preview Complete"}
              </h3>
              <p className={`text-sm max-w-md ${readerMuted}`}>
                {lang === "fr"
                  ? `Vous avez lu les ${MAX_FREE_PAGES} premières pages gratuites. Achetez le livre pour continuer votre lecture.`
                  : `You've read the first ${MAX_FREE_PAGES} free pages. Purchase the book to continue reading.`}
              </p>
              <div className="flex items-center gap-3 pt-1">
                <span className="text-3xl font-extrabold text-primary">{formatPrice(effectivePrice)}</span>
                {book.on_sale && book.sale_price && (
                  <span className={`text-base line-through ${readerMuted}`}>{formatPrice(book.price)}</span>
                )}
              </div>
              <Button onClick={onPurchase} size="lg" className="rounded-full gap-2 mt-1 px-8 shadow-lg">
                <ShoppingCart className="h-4 w-4" />
                {lang === "fr" ? "Acheter maintenant" : "Buy Now"} — {formatPrice(effectivePrice)}
              </Button>
            </div>
          ) : (
            <div className="animate-fade-up" key={page}>
              {/* Chapter header on first page */}
              {page === 0 && (
                <div className="text-center mb-8 pb-6 border-b border-border/30">
                  <p className={`text-xs uppercase tracking-widest mb-2 ${readerMuted}`}>
                    {lang === "fr" ? "Aperçu gratuit" : "Free Preview"}
                  </p>
                  <h2 className={`text-xl font-display font-bold ${darkMode ? "text-[hsl(40,20%,90%)]" : "text-foreground"}`}>
                    {book.title}
                  </h2>
                  {book.subtitle && <p className={`text-sm mt-1 ${readerMuted}`}>{book.subtitle}</p>}
                  <p className={`text-xs mt-2 ${readerMuted}`}>
                    {lang === "fr" ? "par" : "by"} {book.author_name || "—"}
                  </p>
                </div>
              )}
              {/* Page content */}
              <div
                className={`leading-[1.9] ${readerText} select-text`}
                style={{ fontFamily: FONTS[fontIdx], fontSize: `${fontSize}px` }}
              >
                {page === 0 ? (
                  <p className="first-letter:text-5xl first-letter:font-display first-letter:font-bold first-letter:text-primary first-letter:mr-1 first-letter:float-left first-letter:leading-[0.8]">
                    {pages[page]}
                  </p>
                ) : (
                  <p>{pages[page]}</p>
                )}
              </div>
              {/* Page number watermark */}
              <p className={`text-center mt-8 text-[10px] ${readerMuted}`}>— {page + 1} —</p>
            </div>
          )}
        </div>

        {/* Progress + nav */}
        <div className={`border-t border-border/50 ${darkMode ? "bg-[hsl(24,20%,8%)]" : "bg-card"}`}>
          {/* Progress bar */}
          <div className="px-6 pt-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((Math.min(page + 1, MAX_FREE_PAGES)) / MAX_FREE_PAGES) * 100}%` }}
                />
              </div>
              <span className={`text-[10px] shrink-0 tabular-nums ${readerMuted}`}>
                {Math.min(page + 1, MAX_FREE_PAGES)}/{MAX_FREE_PAGES} {lang === "fr" ? "pages gratuites" : "free pages"}
              </span>
            </div>
          </div>
          {/* Nav buttons */}
          <div className="flex items-center justify-between px-6 py-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="gap-1.5 text-xs rounded-full"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              {lang === "fr" ? "Précédent" : "Previous"}
            </Button>
            <div className="flex gap-1.5">
              {Array.from({ length: MAX_FREE_PAGES + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === page ? "w-6 bg-primary" : i >= MAX_FREE_PAGES ? "w-2 bg-border" : "w-2 bg-primary/30 hover:bg-primary/50"
                  }`}
                />
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage(Math.min(MAX_FREE_PAGES, page + 1))}
              disabled={page >= MAX_FREE_PAGES}
              className="gap-1.5 text-xs rounded-full"
            >
              {lang === "fr" ? "Suivant" : "Next"}
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookReader;
