import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyBooks, useDeleteBook, useUpdateBook } from "@/hooks/useBooks";
import { Eye, Edit, Trash2, BarChart3, BookOpen } from "lucide-react";
import { toast } from "sonner";

const CreatorBooks = () => {
  const { t, lang } = useLanguage();
  const { data: books = [], isLoading } = useMyBooks();
  const deleteBook = useDeleteBook();
  const updateBook = useUpdateBook();

  const statusColors: Record<string, string> = {
    published: "bg-accent/10 text-accent",
    draft: "bg-muted text-muted-foreground",
    archived: "bg-destructive/10 text-destructive",
  };

  const handleDelete = async (id: string) => {
    if (!confirm(lang === "fr" ? "Supprimer ce livre ?" : "Delete this book?")) return;
    try {
      await deleteBook.mutateAsync(id);
      toast.success(lang === "fr" ? "Livre supprimé" : "Book deleted");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleToggleStatus = async (id: string, current: string) => {
    const newStatus = current === "published" ? "draft" : "published";
    try {
      await updateBook.mutateAsync({ id, status: newStatus });
      toast.success(lang === "fr" ? "Statut mis à jour" : "Status updated");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  if (isLoading) {
    return <div className="space-y-4">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}</div>;
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-16">
        <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/20 mb-4" />
        <p className="text-muted-foreground">{lang === "fr" ? "Vous n'avez pas encore de livres" : "You don't have any books yet"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {books.map((book) => (
        <Card key={book.id} className="overflow-hidden">
          <CardContent className="flex gap-4 p-4">
            {book.cover_url ? (
              <img src={book.cover_url} alt={book.title} className="h-24 w-16 rounded-lg object-cover shrink-0" />
            ) : (
              <div className="h-24 w-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <BookOpen className="h-6 w-6 text-muted-foreground/30" />
              </div>
            )}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold truncate">{book.title}</h3>
                <Badge className={`text-[10px] ${statusColors[book.status] || statusColors.draft}`}>
                  {t(`creator.status.${book.status}`)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{book.genre} · {book.origin} · {t(`filter.${book.content_type}`)}</p>
              <p className="text-primary font-bold">${book.price.toFixed(2)}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {book.review_count || 0} avis</span>
                <span className="flex items-center gap-1"><BarChart3 className="h-3 w-3" /> {book.sales_count || 0} ventes</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <Button variant="outline" size="sm" className="gap-1" onClick={() => handleToggleStatus(book.id, book.status)}>
                <Edit className="h-3 w-3" />{book.status === "published" ? "Dépublier" : "Publier"}
              </Button>
              <Button variant="ghost" size="sm" className="text-destructive gap-1" onClick={() => handleDelete(book.id)}>
                <Trash2 className="h-3 w-3" />{t("common.delete")}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CreatorBooks;
