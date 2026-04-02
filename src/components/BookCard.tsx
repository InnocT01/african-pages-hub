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
  const desc = lang === "fr" ? book.description_fr : book.description_en;

  if (viewMode === "list") {
    return (
      <Link to={`/book/${book.id}`} className="flex gap-4 py-4 border-b border-border hover:bg-secondary/30 transition-colors group">
        <div className="shrink-0 w-28 md:w-36">
          <div className="aspect-[2/3] rounded-md overflow-hidden shadow-sm">
            {book.cover_url ? (
              <img src={book.cover_url} alt={book.title} className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <div className="h-full w-full bg-muted flex items-center justify-center"><BookOpen className="h-8 w-8 text-muted-foreground/20" /></div>
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <h3 className="font-semibold text-base text-primary group-hover:text-accent transition-colors line-clamp-2 leading-snug">{book.title}</h3>
          {book.subtitle && <p className="text-sm text-muted-foreground line-clamp-1">{book.subtitle}</p>}
          <p className="text-xs text-muted-foreground">
            {lang === "fr" ? "par" : "by"} <span className="text-primary/80">{book.author_name || "—"}</span>
          </p>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium">{book.rating?.toFixed(1) || "—"}</span>
            <div className="flex gap-px">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-3 w-3 ${i < Math.round(book.rating || 0) ? "star-fill" : "text-border"}`} />
              ))}
            </div>
            <span className="text-xs text-primary/70">({book.review_count || 0})</span>
          </div>
          <div className="flex items-center gap-2 pt-0.5">
            <Badge variant="outline" className="text-[10px] font-medium rounded-sm px-1.5 py-0">
              {book.format === "both" ? "Kindle + Broché" : book.format === "paperback" ? "Broché" : "Kindle Edition"}
            </Badge>
            {book.is_new && <Badge className="bg-accent text-accent-foreground text-[10px] rounded-sm px-1.5 py-0">{lang === "fr" ? "Nouveau" : "New"}</Badge>}
          </div>
          <div className="pt-1">
            {book.on_sale && book.sale_price ? (
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-foreground">{formatPrice(book.sale_price)}</span>
                <span className="text-xs text-muted-foreground line-through">{formatPrice(book.price)}</span>
                <Badge className="bg-accent text-accent-foreground text-[10px] rounded-sm px-1 py-0">
                  -{Math.round((1 - book.sale_price / book.price) * 100)}%
                </Badge>
              </div>
            ) : (
              <span className="text-xl font-bold text-foreground">{formatPrice(book.price)}</span>
            )}
          </div>
          {hasPhysical && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-0.5">
              <Truck className="h-3 w-3" />
              <span>{inStock ? (lang === "fr" ? "Disponible — Kitabu Express" : "In Stock — Kitabu Express") : (lang === "fr" ? "Rupture de stock" : "Out of Stock")}</span>
            </div>
          )}
          {desc && <p className="text-xs text-muted-foreground line-clamp-2 pt-1">{desc}</p>}
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/book/${book.id}`} className="block group">
      <div className="space-y-2">
        <div className="relative aspect-[2/3] rounded-md overflow-hidden shadow-sm group-hover:shadow-lg transition-all group-hover:scale-[1.02] duration-200">
          {book.cover_url ? (
            <img src={book.cover_url} alt={book.title} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="h-full w-full bg-muted flex items-center justify-center"><BookOpen className="h-8 w-8 text-muted-foreground/20" /></div>
          )}
          {book.on_sale && (
            <Badge className="absolute top-1.5 left-1.5 bg-accent text-accent-foreground text-[9px] rounded-sm px-1 py-0">
              -{Math.round((1 - (book.sale_price || book.price) / book.price) * 100)}%
            </Badge>
          )}
          {book.is_new && (
            <Badge className="absolute top-1.5 right-1.5 bg-primary text-primary-foreground text-[9px] rounded-sm px-1 py-0">
              {lang === "fr" ? "Nouveau" : "New"}
            </Badge>
          )}
          {book.featured && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
              <span className="text-[9px] text-white font-semibold flex items-center gap-0.5">
                <Star className="h-2.5 w-2.5 fill-[hsl(var(--kente-gold))] text-[hsl(var(--kente-gold))]" />
                {lang === "fr" ? "Vedette" : "Featured"}
              </span>
            </div>
          )}
        </div>
        <div className="space-y-0.5 px-0.5">
          <h3 className="text-xs font-semibold line-clamp-2 leading-snug group-hover:text-primary transition-colors">{book.title}</h3>
          <p className="text-[10px] text-muted-foreground">{book.author_name || "—"}</p>
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-2.5 w-2.5 ${i < Math.round(book.rating || 0) ? "star-fill" : "text-border"}`} />
            ))}
            <span className="text-[10px] text-muted-foreground ml-0.5">({book.review_count || 0})</span>
          </div>
          <div className="flex items-baseline gap-1">
            {book.on_sale && book.sale_price ? (
              <>
                <span className="text-sm font-bold">{formatPrice(book.sale_price)}</span>
                <span className="text-[10px] text-muted-foreground line-through">{formatPrice(book.price)}</span>
              </>
            ) : (
              <span className="text-sm font-bold">{formatPrice(book.price)}</span>
            )}
          </div>
          <p className="text-[9px] text-muted-foreground">
            {book.format === "both" ? "Kindle + Broché" : book.format === "paperback" ? "Broché" : "Kindle Edition"}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
