import { Link } from "react-router-dom";
import { ShoppingCart, Headphones, BookOpen, Package } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Book } from "@/data/mockBooks";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const typeIcons = {
  ebook: BookOpen,
  audio: Headphones,
  physical: Package,
};

const BookCard = ({ book }: { book: Book }) => {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const TypeIcon = typeIcons[book.type];

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group"
    >
      <Link to={`/book/${book.id}`} className="block">
        <div className="relative overflow-hidden rounded-xl bg-card shadow-sm border border-border transition-shadow group-hover:shadow-lg">
          <AspectRatio ratio={2 / 3}>
            <img src={book.cover} alt={book.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </AspectRatio>
          {/* Type badge */}
          <Badge className="absolute top-2 right-2 bg-background/90 text-foreground backdrop-blur text-[10px] gap-1">
            <TypeIcon className="h-3 w-3" />
            {t(`filter.${book.type}`)}
          </Badge>
        </div>
      </Link>
      <div className="mt-3 space-y-1 px-1">
        <Link to={`/book/${book.id}`}>
          <h3 className="font-sans text-sm font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {book.title}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground">{book.author}</p>
        <div className="flex items-center justify-between pt-1">
          <span className="font-sans text-base font-bold tabular-nums text-primary">
            ${book.price.toFixed(2)}
          </span>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full hover:bg-primary hover:text-primary-foreground"
            onClick={(e) => { e.preventDefault(); addToCart(book); }}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;
