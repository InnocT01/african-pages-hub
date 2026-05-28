import { Link } from "react-router-dom";
import { Star, BookOpen, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import type { Book } from "@/types/book";

const BookCard = ({ book, viewMode = "grid" }: { book: Book; viewMode?: "grid" | "list" }) => {
  const { lang } = useLanguage();
  const { format: formatPrice } = useCurrency();
  const hasPhysical = book.format === "paperback" || book.format === "both";
  const inStock = book.stock_count === null || book.stock_count > 0;

  if (viewMode === "list") {
    return (
      <Link to={`/book/${book.id}`} className="flex gap-6 py-6 group">
        <div className="shrink-0 w-24 md:w-32">
          <div className="aspect-[3/4.5] overflow-hidden shadow-sm group-hover:shadow-xl transition-shadow duration-500 bg-muted">
            {book.cover_url ? (
              <img src={book.cover_url} alt={book.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
            ) : (
              <div className="h-full w-full flex items-center justify-center"><BookOpen className="h-8 w-8 text-muted-foreground/20" /></div>
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <h3 className="font-display text-2xl leading-tight group-hover:text-primary transition-colors line-clamp-2">{book.title}</h3>
          {book.subtitle && <p className="text-sm text-muted-foreground italic line-clamp-1 font-display">{book.subtitle}</p>}
          <p className="text-sm text-muted-foreground italic font-display">
            {lang === "fr" ? "par" : "by"} {book.author_name || "—"}
          </p>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(book.rating || 0) ? "star-fill" : "text-border"}`} />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({book.review_count || 0})</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-bold border border-border px-2 py-0.5">
              {book.format === "both" ? "E-book + Broché" : book.format === "paperback" ? "Broché" : "E-book"}
            </span>
            {book.is_new && <Badge className="bg-accent text-accent-foreground text-[10px] uppercase tracking-widest rounded-none px-2 py-0.5 font-bold">{lang === "fr" ? "Nouveau" : "New"}</Badge>}
          </div>
          <div className="pt-1">
            {book.on_sale && book.sale_price ? (
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-primary tracking-tight">{formatPrice(book.sale_price)}</span>
                <span className="text-xs text-muted-foreground line-through">{formatPrice(book.price)}</span>
                <span className="text-[10px] uppercase tracking-widest text-accent font-bold">
                  −{Math.round((1 - book.sale_price / book.price) * 100)}%
                </span>
              </div>
            ) : (
              <span className="text-xl font-bold text-primary tracking-tight">{formatPrice(book.price)}</span>
            )}
          </div>
          {hasPhysical && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Truck className="h-3.5 w-3.5" />
              <span>{inStock ? (lang === "fr" ? "En stock · Kitabu Express" : "In stock · Kitabu Express") : (lang === "fr" ? "Rupture de stock" : "Out of stock")}</span>
            </div>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/book/${book.id}`} className="block group">
      <div className="space-y-4">
        <div className="relative aspect-[3/4.5] bg-muted overflow-hidden shadow-sm group-hover:shadow-2xl transition-all duration-500">
          {book.cover_url ? (
            <img src={book.cover_url} alt={book.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
          ) : (
            <div className="h-full w-full flex items-center justify-center"><BookOpen className="h-8 w-8 text-muted-foreground/20" /></div>
          )}

          {book.on_sale && (
            <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-[10px] uppercase tracking-widest px-2 py-1 font-bold shadow-sm">
              −{Math.round((1 - (book.sale_price || book.price) / book.price) * 100)}%
            </span>
          )}
          {book.is_new && !book.on_sale && (
            <span className="absolute top-3 left-3 bg-foreground text-background text-[10px] uppercase tracking-widest px-2 py-1 font-bold shadow-sm">
              {lang === "fr" ? "Nouveau" : "New"}
            </span>
          )}
          {book.featured && !book.on_sale && !book.is_new && (
            <Star className="absolute top-3 right-3 h-4 w-4 fill-accent text-accent drop-shadow-sm" />
          )}

          {/* Hover preview chip */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {!book.featured && (
              <span className="bg-card/95 backdrop-blur-sm text-[10px] px-2.5 py-1 font-bold uppercase tracking-widest shadow-sm">
                {lang === "fr" ? "Aperçu" : "Preview"}
              </span>
            )}
          </div>
        </div>
        <div className="space-y-1 px-0.5">
          <h3 className="font-display text-lg font-medium leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {book.title}
          </h3>
          <p className="text-xs text-muted-foreground italic font-display">{book.author_name || "—"}</p>
          <div className="flex items-center gap-1 pt-0.5">
            <div className="flex gap-px">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-3 w-3 ${i < Math.round(book.rating || 0) ? "star-fill" : "text-border"}`} />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground ml-0.5">({book.review_count || 0})</span>
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            {book.on_sale && book.sale_price ? (
              <>
                <span className="text-base font-bold text-primary tracking-tight">{formatPrice(book.sale_price)}</span>
                <span className="text-[11px] text-muted-foreground line-through">{formatPrice(book.price)}</span>
              </>
            ) : (
              <span className="text-base font-bold text-primary tracking-tight">{formatPrice(book.price)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
