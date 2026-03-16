import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { useMyBooks } from "@/hooks/useBooks";
import { BookOpen, Eye, DollarSign, TrendingUp, Star, ShoppingBag, Package, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CreatorOverview = () => {
  const { t, lang } = useLanguage();
  const { data: books = [] } = useMyBooks();

  const totalSales = books.reduce((s, b) => s + (b.sales_count || 0), 0);
  const totalRevenue = books.reduce((s, b) => s + (b.sales_count || 0) * b.price, 0);
  const totalReviews = books.reduce((s, b) => s + (b.review_count || 0), 0);
  const published = books.filter(b => b.status === "published").length;
  const drafts = books.filter(b => b.status === "draft").length;
  const avgRating = books.length > 0 ? books.reduce((s, b) => s + (b.rating || 0), 0) / books.length : 0;
  const totalStock = books.reduce((s, b) => s + (b.stock_count || 0), 0);
  const onSale = books.filter(b => b.on_sale).length;

  const stats = [
    { label: lang === "fr" ? "Revenus" : "Revenue", value: `$${totalRevenue.toFixed(0)}`, icon: DollarSign, color: "text-accent" },
    { label: lang === "fr" ? "Ventes" : "Sales", value: totalSales.toString(), icon: TrendingUp, color: "text-primary" },
    { label: lang === "fr" ? "Livres publiés" : "Published", value: published.toString(), icon: BookOpen, color: "text-foreground" },
    { label: lang === "fr" ? "Brouillons" : "Drafts", value: drafts.toString(), icon: BookOpen, color: "text-muted-foreground" },
    { label: lang === "fr" ? "Avis" : "Reviews", value: totalReviews.toString(), icon: Star, color: "text-accent" },
    { label: lang === "fr" ? "Note moyenne" : "Avg Rating", value: avgRating.toFixed(1), icon: Star, color: "text-primary" },
    { label: lang === "fr" ? "Stock total" : "Total Stock", value: totalStock.toString(), icon: Package, color: "text-foreground" },
    { label: lang === "fr" ? "En promo" : "On Sale", value: onSale.toString(), icon: ShoppingBag, color: "text-destructive" },
  ];

  const recentBooks = [...books].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground text-sm">{t("creator.welcome")}</p>
      
      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s) => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <p className="text-2xl font-extrabold tabular-nums">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent activity */}
      <Card>
        <CardContent className="p-5">
          <h3 className="font-bold text-sm mb-4">{lang === "fr" ? "Activité récente" : "Recent Activity"}</h3>
          {recentBooks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">{lang === "fr" ? "Publiez votre premier livre via KDP" : "Publish your first book via KDP"}</p>
          ) : (
            <div className="space-y-3">
              {recentBooks.map(book => (
                <div key={book.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                  {book.cover_url ? (
                    <img src={book.cover_url} alt={book.title} className="h-10 w-7 rounded object-cover" />
                  ) : (
                    <div className="h-10 w-7 rounded bg-secondary" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{book.title}</p>
                    <p className="text-xs text-muted-foreground">{new Date(book.created_at).toLocaleDateString()}</p>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">{book.status === "published" ? "✓" : "◯"} {t(`creator.status.${book.status}`)}</Badge>
                  <span className="text-xs text-muted-foreground tabular-nums">{book.sales_count || 0} {lang === "fr" ? "ventes" : "sales"}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="bg-primary/5 border-primary/10">
          <CardContent className="p-4">
            <h4 className="text-sm font-bold mb-1">📊 {lang === "fr" ? "Conseil" : "Tip"}</h4>
            <p className="text-xs text-muted-foreground">{lang === "fr" ? "Les livres avec couverture se vendent 3x plus. Ajoutez une couverture à tous vos livres !" : "Books with covers sell 3x more. Add a cover to all your books!"}</p>
          </CardContent>
        </Card>
        <Card className="bg-accent/5 border-accent/10">
          <CardContent className="p-4">
            <h4 className="text-sm font-bold mb-1">💡 {lang === "fr" ? "Astuce" : "Tip"}</h4>
            <p className="text-xs text-muted-foreground">{lang === "fr" ? "Proposez vos livres en format broché pour toucher plus de lecteurs." : "Offer your books in paperback to reach more readers."}</p>
          </CardContent>
        </Card>
        <Card className="bg-secondary border-border">
          <CardContent className="p-4">
            <h4 className="text-sm font-bold mb-1">🔒 {lang === "fr" ? "Sécurité" : "Security"}</h4>
            <p className="text-xs text-muted-foreground">{lang === "fr" ? "Utilisez la vérification anti-plagiat pour protéger vos œuvres." : "Use plagiarism check to protect your works."}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatorOverview;
