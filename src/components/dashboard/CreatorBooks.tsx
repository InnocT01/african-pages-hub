import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyBooks, useDeleteBook, useUpdateBook } from "@/hooks/useBooks";
import { Eye, Edit, Trash2, BarChart3, BookOpen, MoreHorizontal, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useCurrency } from "@/contexts/CurrencyContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const CreatorBooks = () => {
  const { t, lang } = useLanguage();
  const { format: formatPrice } = useCurrency();
  const { data: books = [], isLoading } = useMyBooks();
  const deleteBook = useDeleteBook();
  const updateBook = useUpdateBook();

  const handleDelete = async (id: string) => {
    if (!confirm(lang === "fr" ? "Supprimer ce livre ?" : "Delete this book?")) return;
    try {
      await deleteBook.mutateAsync(id);
      toast.success(lang === "fr" ? "Livre supprimé" : "Book deleted");
    } catch (e: any) { toast.error(e.message); }
  };

  const handleToggleStatus = async (id: string, current: string) => {
    const newStatus = current === "published" ? "draft" : "published";
    try {
      await updateBook.mutateAsync({ id, status: newStatus });
      toast.success(lang === "fr" ? "Statut mis à jour" : "Status updated");
    } catch (e: any) { toast.error(e.message); }
  };

  if (isLoading) {
    return <div className="space-y-4">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}</div>;
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <BookOpen className="h-10 w-10 text-primary" />
        </div>
        <p className="text-lg font-semibold">{lang === "fr" ? "Aucun livre encore" : "No books yet"}</p>
        <p className="text-sm text-muted-foreground mt-1">{lang === "fr" ? "Commencez à publier via KDP" : "Start publishing via KDP"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Stats bar */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
        <span className="font-medium text-foreground">{books.length} {lang === "fr" ? "livres" : "books"}</span>
        <span>·</span>
        <span>{books.filter(b => b.status === "published").length} {lang === "fr" ? "publiés" : "published"}</span>
        <span>·</span>
        <span>{books.filter(b => b.status === "draft").length} {lang === "fr" ? "brouillons" : "drafts"}</span>
      </div>

      {books.map((book) => (
        <Card key={book.id} className="border-border/50 hover:shadow-glass transition-all duration-300 overflow-hidden group">
          <CardContent className="flex gap-4 p-4">
            <div className="shrink-0">
              {book.cover_url ? (
                <img src={book.cover_url} alt={book.title} className="h-28 w-20 rounded-xl object-cover shadow-sm group-hover:shadow-glass transition-shadow" />
              ) : (
                <div className="h-28 w-20 rounded-xl bg-secondary flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-muted-foreground/20" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-base truncate group-hover:text-primary transition-colors">{book.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{book.genre} · {book.origin} · {book.format === "both" ? "E-book + Broché" : book.format === "paperback" ? "Broché" : "E-book"}</p>
                </div>
                <Badge 
                  variant={book.status === "published" ? "default" : "secondary"} 
                  className={`text-[10px] rounded-lg shrink-0 ${book.status === "published" ? "bg-primary/10 text-primary" : ""}`}
                >
                  {t(`creator.status.${book.status}`)}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="font-bold text-foreground text-base">{formatPrice(book.price)}</span>
                <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{book.review_count || 0} {lang === "fr" ? "avis" : "reviews"}</span>
                <span className="flex items-center gap-1"><BarChart3 className="h-3 w-3" />{book.sales_count || 0} {lang === "fr" ? "ventes" : "sales"}</span>
                {book.stock_count !== null && (
                  <span className="flex items-center gap-1"><span className={`h-1.5 w-1.5 rounded-full ${book.stock_count > 0 ? "bg-primary" : "bg-destructive"}`} />{book.stock_count} stock</span>
                )}
              </div>
            </div>
            <div className="flex items-center shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl w-44">
                  {book.status === "published" && (
                    <DropdownMenuItem className="rounded-lg gap-2" onClick={() => window.open(`/book/${book.id}`, "_blank")}>
                      <ExternalLink className="h-3.5 w-3.5" />{lang === "fr" ? "Voir la page" : "View Page"}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="rounded-lg gap-2" onClick={() => handleToggleStatus(book.id, book.status)}>
                    <Edit className="h-3.5 w-3.5" />{book.status === "published" ? (lang === "fr" ? "Dépublier" : "Unpublish") : (lang === "fr" ? "Publier" : "Publish")}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg gap-2 text-destructive" onClick={() => handleDelete(book.id)}>
                    <Trash2 className="h-3.5 w-3.5" />{t("common.delete")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CreatorBooks;
