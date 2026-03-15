import { Link } from "react-router-dom";
import { ShoppingCart, Headphones, BookOpen, Package, Image, FileText, GraduationCap, Newspaper, Star, Truck, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Book } from "@/types/book";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const typeIcons: Record<string, React.ElementType> = {
  ebook: BookOpen, audio: Headphones, physical: Package, bd: Image,
  manuel_scolaire: GraduationCap, revue: FileText, article: Newspaper,
};

const BookCard = ({ book }: { book: Book }) => {
  const { addToCart } = useCart();
  const { t, lang } = useLanguage();
  const TypeIcon = typeIcons[book.content_type] || BookOpen;

  const effectivePrice = book.on_sale && book.sale_price ? book.sale_price : book.price;
  const hasPhysical = book.format === "paperback" || book.format === "both";
  const inStock = book.stock_count === null || book.stock_count > 0;

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="group">
      <Link to={`/book/${book.id}`} className="block">
        <div className="relative overflow-hidden rounded-xl bg-card shadow-sm border border-border transition-shadow group-hover:shadow-lg">
          <AspectRatio ratio={2 / 3}>
            {book.cover_url ? (
              <img src={book.cover_url} alt={book.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
            ) : (
              <div className="h-full w-full bg-muted flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-muted-foreground/30" />
              </div>
            )}
          </AspectRatio>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {book.is_new && <Badge className="bg-accent text-accent-foreground text-[9px] px-1.5 py-0.5">{lang === "fr" ? "Neuf" : "New"}</Badge>}
            {book.on_sale && <Badge className="bg-destructive text-destructive-foreground text-[9px] px-1.5 py-0.5">Promo</Badge>}
            {book.featured && <Badge className="bg-primary text-primary-foreground text-[9px] px-1.5 py-0.5 gap-0.5"><Star className="h-2.5 w-2.5 fill-current" />Vedette</Badge>}
          </div>
          <Badge className="absolute top-2 right-2 bg-background/90 text-foreground backdrop-blur text-[9px] gap-0.5">
            <TypeIcon className="h-3 w-3" />
            {t(`filter.${book.content_type}`)}
          </Badge>

          {/* Stock indicator for physical */}
          {hasPhysical && (
            <div className="absolute bottom-2 left-2">
              <Badge className={`text-[9px] ${inStock ? "bg-accent/90 text-accent-foreground" : "bg-destructive/90 text-destructive-foreground"}`}>
                {inStock ? (book.stock_count !== null ? `${book.stock_count} ${lang === "fr" ? "en stock" : "in stock"}` : (lang === "fr" ? "En stock" : "In Stock")) : (lang === "fr" ? "Rupture" : "Out of stock")}
              </Badge>
            </div>
          )}

          {/* Quick actions overlay */}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100">
            <div className="flex gap-1.5">
              <Button size="icon" className="h-8 w-8 rounded-full shadow-md" onClick={(e) => { e.preventDefault(); addToCart(book); }}>
                <ShoppingCart className="h-3.5 w-3.5" />
              </Button>
              {hasPhysical && (
                <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-md" onClick={(e) => e.preventDefault()}>
                  <Truck className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </Link>
      <div className="mt-2.5 space-y-0.5 px-0.5">
        <Link to={`/book/${book.id}`}>
          <h3 className="font-sans text-sm font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">{book.title}</h3>
        </Link>
        <p className="text-xs text-muted-foreground">{book.author_name || "Auteur inconnu"}</p>
        {(book.rating ?? 0) > 0 && (
          <div className="flex items-center gap-1">
            <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className={`h-3 w-3 ${i < Math.floor(book.rating || 0) ? "fill-primary text-primary" : "text-border"}`} />)}</div>
            <span className="text-[10px] text-muted-foreground">({book.review_count || 0})</span>
          </div>
        )}
        <div className="flex items-center gap-2 pt-0.5">
          {book.on_sale && book.sale_price ? (
            <>
              <span className="font-sans text-base font-bold text-destructive tabular-nums">${book.sale_price.toFixed(2)}</span>
              <span className="font-sans text-xs text-muted-foreground line-through tabular-nums">${book.price.toFixed(2)}</span>
            </>
          ) : (
            <span className="font-sans text-base font-bold tabular-nums text-primary">${book.price.toFixed(2)}</span>
          )}
        </div>
        {/* Format indicator */}
        <p className="text-[10px] text-muted-foreground">
          {book.format === "both" ? "📱 E-book + 📦 Broché" : book.format === "paperback" ? "📦 Broché" : "📱 E-book"}
        </p>
      </div>
    </motion.div>
  );
};

export default BookCard;
