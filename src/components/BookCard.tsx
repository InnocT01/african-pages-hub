import { Link } from "react-router-dom";
import { Star, BookOpen, Truck, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import type { Book } from "@/types/book";

const BookCard = ({ book, viewMode = "grid" }: { book: Book; viewMode?: "grid" | "list" }) => {
  const { lang } = useLanguage();
  const { format: formatPrice } = useCurrency();
  const hasPhysical = book.format === "paperback" || book.format === "both";
  const inStock = book.stock_count === null || book.stock_count > 0;
  const desc = lang === "fr" ? book.description_fr : book.description_en;

  if (viewMode === "list") {
    return (
      <Link to={`/book/${book.id}`} className="flex gap-5 py-5 group">
        <div className="shrink-0 w-24 md:w-32">
          <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-glass group-hover:shadow-glass-lg transition-all duration-300 group-hover:scale-[1.02]">
            {book.cover_url ? (
              <img src={book.cover_url} alt={book.title} className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <div className="h-full w-full bg-muted flex items-center justify-center"><BookOpen className="h-8 w-8 text-muted-foreground/20" /></div>
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <h3 className="font-bold text-base group-hover:text-primary transition-colors line-clamp-2 leading-snug">{book.title}</h3>
          {book.subtitle && <p className="text-sm text-muted-foreground line-clamp-1">{book.subtitle}</p>}
          <p className="text-xs text-muted-foreground">
            {lang === "fr" ? "par" : "by"} <span className="text-primary/80 font-medium">{book.author_name || "—"}</span>
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
            <Badge variant="outline" className="text-[10px] font-medium rounded-lg px-2 py-0.5 border-border/50">
              {book.format === "both" ? "E-book + Broché" : book.format === "paperback" ? "Broché" : "E-book"}
            </Badge>
            {book.is_new && <Badge className="bg-primary text-primary-foreground text-[10px] rounded-lg px-2 py-0.5">{lang === "fr" ? "Nouveau" : "New"}</Badge>}
          </div>
          <div className="pt-1">
            {book.on_sale && book.sale_price ? (
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-extrabold">{formatPrice(book.sale_price)}</span>
                <span className="text-xs text-muted-foreground line-through">{formatPrice(book.price)}</span>
                <Badge className="bg-accent text-accent-foreground text-[10px] rounded-lg px-1.5 py-0">
                  -{Math.round((1 - book.sale_price / book.price) * 100)}%
                </Badge>
              </div>
            ) : (
              <span className="text-xl font-extrabold">{formatPrice(book.price)}</span>
            )}
          </div>
          {hasPhysical && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Truck className="h-3.5 w-3.5" />
              <span>{inStock ? (lang === "fr" ? "En stock · Kitabu Express" : "In Stock · Kitabu Express") : (lang === "fr" ? "Rupture de stock" : "Out of Stock")}</span>
            </div>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/book/${book.id}`} className="block group">
      <div className="space-y-3">
        <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-glass group-hover:shadow-glass-lg transition-all duration-500 group-hover:scale-[1.03]">
          {book.cover_url ? (
            <img src={book.cover_url} alt={book.title} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="h-full w-full bg-muted flex items-center justify-center"><BookOpen className="h-8 w-8 text-muted-foreground/20" /></div>
          )}
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {book.on_sale && (
            <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground text-[9px] rounded-lg px-2 py-0.5 font-bold shadow-sm">
              -{Math.round((1 - (book.sale_price || book.price) / book.price) * 100)}%
            </Badge>
          )}
          {book.is_new && (
            <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground text-[9px] rounded-lg px-2 py-0.5 font-bold shadow-sm">
              {lang === "fr" ? "Nouveau" : "New"}
            </Badge>
          )}
          {book.featured && !book.on_sale && !book.is_new && (
            <div className="absolute top-2 left-2">
              <Star className="h-4 w-4 fill-gold text-gold drop-shadow-sm" />
            </div>
          )}
        </div>
        <div className="space-y-1 px-0.5">
          <h3 className="text-sm font-bold line-clamp-2 leading-snug group-hover:text-primary transition-colors">{book.title}</h3>
          <p className="text-xs text-muted-foreground font-medium">{book.author_name || "—"}</p>
          <div className="flex items-center gap-1">
            <div className="flex gap-px">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-3 w-3 ${i < Math.round(book.rating || 0) ? "star-fill" : "text-border"}`} />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground ml-0.5">({book.review_count || 0})</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            {book.on_sale && book.sale_price ? (
              <>
                <span className="text-base font-extrabold">{formatPrice(book.sale_price)}</span>
                <span className="text-[10px] text-muted-foreground line-through">{formatPrice(book.price)}</span>
              </>
            ) : (
              <span className="text-base font-extrabold">{formatPrice(book.price)}</span>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground/70">
            {book.format === "both" ? "E-book + Broché" : book.format === "paperback" ? "Broché" : "E-book"}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
