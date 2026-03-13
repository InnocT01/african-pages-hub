import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMyBooks } from "@/hooks/useBooks";
import { TrendingUp, BookOpen } from "lucide-react";

const CreatorAnalytics = () => {
  const { t, lang } = useLanguage();
  const { data: books = [] } = useMyBooks();

  const topBooks = [...books].sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0)).slice(0, 5);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle>{lang === "fr" ? "Top livres" : "Top Books"}</CardTitle></CardHeader>
        <CardContent>
          {topBooks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">{lang === "fr" ? "Publiez votre premier livre" : "Publish your first book"}</p>
            </div>
          ) : (
            topBooks.map((book, i) => (
              <div key={book.id} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
                <span className="text-lg font-bold text-muted-foreground w-6">#{i + 1}</span>
                {book.cover_url ? (
                  <img src={book.cover_url} alt={book.title} className="h-10 w-7 rounded object-cover" />
                ) : (
                  <div className="h-10 w-7 rounded bg-muted" />
                )}
                <span className="flex-1 font-medium truncate">{book.title}</span>
                <span className="text-sm text-muted-foreground">{book.sales_count || 0} ventes</span>
                <span className="text-primary font-bold tabular-nums">${((book.sales_count || 0) * book.price).toFixed(0)}</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatorAnalytics;
