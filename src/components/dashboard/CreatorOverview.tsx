import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Card, CardContent } from "@/components/ui/card";
import { useMyBooks } from "@/hooks/useBooks";
import { BookOpen, DollarSign, TrendingUp, Star, ShoppingBag, Package, BarChart3, PenTool } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

const CreatorOverview = () => {
  const { t, lang } = useLanguage();
  const { format: formatPrice } = useCurrency();
  const { data: books = [] } = useMyBooks();

  const totalSales = books.reduce((s, b) => s + (b.sales_count || 0), 0);
  const totalRevenue = books.reduce((s, b) => s + (b.sales_count || 0) * b.price, 0);
  const totalReviews = books.reduce((s, b) => s + (b.review_count || 0), 0);
  const published = books.filter(b => b.status === "published").length;
  const drafts = books.filter(b => b.status === "draft").length;
  const avgRating = books.length > 0 ? books.reduce((s, b) => s + (b.rating || 0), 0) / books.length : 0;
  const totalStock = books.reduce((s, b) => s + (b.stock_count || 0), 0);
  const onSale = books.filter(b => b.on_sale).length;
  const netRevenue = totalRevenue * 0.85; // 15% platform fee

  const stats = [
    { label: lang === "fr" ? "Revenus nets" : "Net Revenue", value: formatPrice(netRevenue), icon: DollarSign, color: "text-primary", bg: "bg-primary/10" },
    { label: lang === "fr" ? "Ventes totales" : "Total Sales", value: totalSales.toString(), icon: TrendingUp, color: "text-accent", bg: "bg-accent/10" },
    { label: lang === "fr" ? "Livres publiés" : "Published", value: published.toString(), icon: BookOpen, color: "text-foreground", bg: "bg-secondary" },
    { label: lang === "fr" ? "Note moyenne" : "Avg Rating", value: avgRating.toFixed(1) + " ⭐", icon: Star, color: "text-[hsl(var(--kente-gold))]", bg: "bg-[hsl(var(--kente-gold))]/10" },
  ];

  const recentBooks = [...books].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="rounded-xl bg-gradient-to-r from-[hsl(var(--header-bg))] to-[hsl(var(--earth-brown))] p-6 text-white kente-pattern">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold">{lang === "fr" ? "Tableau de bord Créateur" : "Creator Dashboard"}</h2>
            <p className="text-sm text-white/60 mt-1">{t("creator.welcome")}</p>
          </div>
          <Button asChild size="sm" className="rounded-full gap-1.5 bg-primary hover:bg-primary/90">
            <Link to="/creator?tab=upload"><PenTool className="h-3.5 w-3.5" />{lang === "fr" ? "Publier" : "Publish"}</Link>
          </Button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s) => (
          <Card key={s.label} className="border-border/50 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className={`inline-flex p-2 rounded-lg ${s.bg} mb-3`}>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <p className="text-2xl font-extrabold tabular-nums">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-border/50"><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">{lang === "fr" ? "Brouillons" : "Drafts"}</p>
          <p className="text-lg font-bold">{drafts}</p>
        </CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">{lang === "fr" ? "Avis" : "Reviews"}</p>
          <p className="text-lg font-bold">{totalReviews}</p>
        </CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">{lang === "fr" ? "Stock total" : "Total Stock"}</p>
          <p className="text-lg font-bold">{totalStock}</p>
        </CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">{lang === "fr" ? "En promo" : "On Sale"}</p>
          <p className="text-lg font-bold text-accent">{onSale}</p>
        </CardContent></Card>
      </div>

      {/* Recent activity */}
      <Card>
        <CardContent className="p-5">
          <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            {lang === "fr" ? "Activité récente" : "Recent Activity"}
          </h3>
          {recentBooks.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <BookOpen className="h-12 w-12 text-muted-foreground/20 mx-auto" />
              <p className="text-sm text-muted-foreground">{lang === "fr" ? "Publiez votre premier livre via KDP" : "Publish your first book via KDP"}</p>
              <Button asChild size="sm" className="rounded-full"><Link to="/creator?tab=upload">{lang === "fr" ? "Commencer" : "Get Started"}</Link></Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentBooks.map(book => (
                <div key={book.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                  {book.cover_url ? (
                    <img src={book.cover_url} alt={book.title} className="h-12 w-8 rounded-md object-cover shadow-sm" />
                  ) : (
                    <div className="h-12 w-8 rounded-md bg-secondary flex items-center justify-center"><BookOpen className="h-3 w-3 text-muted-foreground/30" /></div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{book.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">{new Date(book.created_at).toLocaleDateString()}</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs font-medium">{formatPrice(book.price)}</span>
                    </div>
                  </div>
                  <Badge variant={book.status === "published" ? "default" : "secondary"} className="text-[10px]">
                    {t(`creator.status.${book.status}`)}
                  </Badge>
                  <div className="text-right">
                    <p className="text-sm font-bold tabular-nums">{book.sales_count || 0}</p>
                    <p className="text-[10px] text-muted-foreground">{lang === "fr" ? "ventes" : "sales"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick tips with African patterns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="bg-primary/5 border-primary/10">
          <CardContent className="p-4">
            <h4 className="text-sm font-bold mb-1">📊 {lang === "fr" ? "Conseil" : "Tip"}</h4>
            <p className="text-xs text-muted-foreground">{lang === "fr" ? "Les livres avec couverture se vendent 3x plus. Utilisez le créateur de couverture !" : "Books with covers sell 3x more. Use the cover creator!"}</p>
          </CardContent>
        </Card>
        <Card className="bg-accent/5 border-accent/10">
          <CardContent className="p-4">
            <h4 className="text-sm font-bold mb-1">💡 {lang === "fr" ? "Astuce" : "Tip"}</h4>
            <p className="text-xs text-muted-foreground">{lang === "fr" ? "Proposez vos livres en format broché + e-book pour toucher plus de lecteurs." : "Offer your books in paperback + e-book to reach more readers."}</p>
          </CardContent>
        </Card>
        <Card className="bg-[hsl(var(--kente-gold))]/5 border-[hsl(var(--kente-gold))]/10">
          <CardContent className="p-4">
            <h4 className="text-sm font-bold mb-1">🌍 {lang === "fr" ? "Marché" : "Market"}</h4>
            <p className="text-xs text-muted-foreground">{lang === "fr" ? "Les lecteurs d'Afrique de l'Est préfèrent les livres en langues nationales." : "East African readers prefer books in national languages."}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatorOverview;
