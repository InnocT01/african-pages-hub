import { Link } from "react-router-dom";
import { ShoppingCart, Star, Truck, BookOpen, Headphones, Package, Image, FileText, GraduationCap, Newspaper } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Book } from "@/types/book";

const typeIcons: Record<string, React.ElementType> = {
  ebook: BookOpen, audio: Headphones, physical: Package, bd: Image,
  manuel_scolaire: GraduationCap, revue: FileText, article: Newspaper,
};

const BookCard = ({ book }: { book: Book }) => {
  const { addToCart } = useCart();
  const { t, lang } = useLanguage();

  const effectivePrice = book.on_sale && book.sale_price ? book.sale_price : book.price;
  const hasPhysical = book.format === "paperback" || book.format === "both";
  const inStock = book.stock_count === null || book.stock_count > 0;

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="group">
      <Link to={`/book/${book.id}`} className="block">
        <div className="relative overflow-hidden rounded-2xl bg-card border border-border transition-all group-hover:shadow-xl group-hover:border-primary/20">
          <div className="relative aspect-[3/4] overflow-hidden">
            {book.cover_url ? (
              <img src={book.cover_url} alt={book.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
            ) : (
              <div className="h-full w-full bg-secondary flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-muted-foreground/20" />
              </div>
            )}

            {/* Rating overlay */}
            {(book.rating ?? 0) > 0 && (
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-foreground/75 backdrop-blur-sm text-primary-foreground px-2 py-0.5 rounded-md">
                <span className="text-xs font-bold">{book.rating?.toFixed(1)}</span>
                <Star className="h-2.5 w-2.5 fill-accent text-accent" />
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-2.5 right-2.5 flex flex-col gap-1">
              {book.is_new && <Badge className="bg-accent text-accent-foreground text-[9px] px-1.5 py-0 font-semibold">{lang === "fr" ? "Nouveau" : "New"}</Badge>}
              {book.on_sale && <Badge className="bg-destructive text-destructive-foreground text-[9px] px-1.5 py-0 font-semibold">-{Math.round((1 - (book.sale_price || book.price) / book.price) * 100)}%</Badge>}
              {book.featured && <Badge className="bg-primary text-primary-foreground text-[9px] px-1.5 py-0">★</Badge>}
            </div>

            {/* Price overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/60 to-transparent p-3 pt-8">
              <div className="flex items-end justify-between">
                <div>
                  {book.on_sale && book.sale_price ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg font-extrabold text-primary-foreground tabular-nums">${book.sale_price.toFixed(2)}</span>
                      <span className="text-xs text-primary-foreground/60 line-through tabular-nums">${book.price.toFixed(2)}</span>
                    </div>
                  ) : (
                    <span className="text-lg font-extrabold text-primary-foreground tabular-nums">${book.price.toFixed(2)}</span>
                  )}
                </div>
                <Button size="icon" className="h-8 w-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.preventDefault(); addToCart(book); }}>
                  <ShoppingCart className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Stock */}
            {hasPhysical && (
              <div className="absolute bottom-12 left-3">
                <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${inStock ? "bg-accent/90 text-accent-foreground" : "bg-destructive/90 text-destructive-foreground"}`}>
                  {inStock ? (book.stock_count !== null ? `${book.stock_count} stock` : "✓ Stock") : "✗ Rupture"}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
      <div className="mt-2.5 px-0.5">
        <Link to={`/book/${book.id}`}>
          <h3 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">{book.title}</h3>
        </Link>
        <p className="text-xs text-muted-foreground mt-0.5">{book.author_name || "—"} · {book.origin}</p>
        <p className="text-[10px] text-muted-foreground/60 mt-0.5">
          {book.format === "both" ? "📱+📦" : book.format === "paperback" ? "📦 Broché" : "📱 E-book"}
        </p>
      </div>
    </motion.div>
  );
};

export default BookCard;
