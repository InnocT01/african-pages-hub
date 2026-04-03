import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Card, CardContent } from "@/components/ui/card";
import { useMyBooks } from "@/hooks/useBooks";
import { BookOpen, DollarSign, TrendingUp, Star, PenTool, ArrowUpRight, Sparkles, BarChart3, Package, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
  const netRevenue = totalRevenue * 0.85;

  const stats = [
    { label: lang === "fr" ? "Revenus nets" : "Net Revenue", value: formatPrice(netRevenue), icon: DollarSign, trend: "+12%", color: "from-primary to-accent" },
    { label: lang === "fr" ? "Ventes totales" : "Total Sales", value: totalSales.toString(), icon: TrendingUp, trend: "+8%", color: "from-gold to-primary" },
    { label: lang === "fr" ? "Publiés" : "Published", value: published.toString(), icon: BookOpen, trend: "", color: "from-primary/70 to-primary" },
    { label: lang === "fr" ? "Note moyenne" : "Avg Rating", value: `${avgRating.toFixed(1)} ★`, icon: Star, trend: "", color: "from-gold to-gold/70" },
  ];

  const recentBooks = [...books].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">
            {lang === "fr" ? "Bienvenue" : "Welcome back"} 👋
          </h2>
          <p className="text-sm text-muted-foreground mt-1">{t("creator.welcome")}</p>
        </div>
        <Button asChild className="rounded-2xl gap-2 font-semibold shadow-glow">
          <Link to="/creator?tab=upload"><PenTool className="h-4 w-4" />{lang === "fr" ? "Nouveau livre" : "New Book"}</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-border/50 hover:shadow-glass transition-all duration-300 overflow-hidden relative group">
            <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-[0.04] group-hover:opacity-[0.08] transition-opacity`} />
            <CardContent className="p-5 relative">
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-2xl bg-secondary flex items-center justify-center">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                {s.trend && (
                  <Badge variant="secondary" className="text-[10px] rounded-lg font-semibold text-primary">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" />{s.trend}
                  </Badge>
                )}
              </div>
              <p className="text-2xl font-extrabold tracking-tight">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1 font-medium">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: lang === "fr" ? "Brouillons" : "Drafts", value: drafts },
          { label: lang === "fr" ? "Avis" : "Reviews", value: totalReviews },
          { label: lang === "fr" ? "Total stock" : "Stock", value: books.reduce((s, b) => s + (b.stock_count || 0), 0) },
          { label: lang === "fr" ? "En promo" : "On Sale", value: books.filter(b => b.on_sale).length },
        ].map(s => (
          <div key={s.label} className="bg-secondary/50 rounded-2xl p-4 text-center">
            <p className="text-lg font-extrabold">{s.value}</p>
            <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              {lang === "fr" ? "Activité récente" : "Recent Activity"}
            </h3>
            <Button variant="ghost" size="sm" asChild className="text-xs rounded-xl text-primary">
              <Link to="/creator?tab=books">{lang === "fr" ? "Tout voir" : "View all"}</Link>
            </Button>
          </div>
          {recentBooks.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{lang === "fr" ? "Commencez votre aventure" : "Start your journey"}</p>
                <p className="text-xs text-muted-foreground mt-1">{lang === "fr" ? "Publiez votre premier livre via KDP" : "Publish your first book via KDP"}</p>
              </div>
              <Button asChild className="rounded-2xl"><Link to="/creator?tab=upload">{lang === "fr" ? "Publier un livre" : "Publish a Book"}</Link></Button>
            </div>
          ) : (
            <div className="space-y-1">
              {recentBooks.map(book => (
                <div key={book.id} className="flex items-center gap-4 py-3 px-2 rounded-xl hover:bg-secondary/50 transition-colors group">
                  {book.cover_url ? (
                    <img src={book.cover_url} alt={book.title} className="h-14 w-10 rounded-xl object-cover shadow-sm" />
                  ) : (
                    <div className="h-14 w-10 rounded-xl bg-secondary flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">{book.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground">{new Date(book.created_at).toLocaleDateString()}</span>
                      <span className="text-xs font-medium">{formatPrice(book.price)}</span>
                    </div>
                  </div>
                  <Badge variant={book.status === "published" ? "default" : "secondary"} className="text-[10px] rounded-lg">
                    {t(`creator.status.${book.status}`)}
                  </Badge>
                  <div className="text-right min-w-[60px]">
                    <p className="text-sm font-extrabold tabular-nums">{book.sales_count || 0}</p>
                    <p className="text-[10px] text-muted-foreground">{lang === "fr" ? "ventes" : "sales"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { emoji: "📊", title: lang === "fr" ? "Conseil" : "Tip", text: lang === "fr" ? "Les livres avec couverture se vendent 3x plus. Utilisez le créateur de couverture !" : "Books with covers sell 3x more. Use the cover creator!", bg: "bg-primary/5" },
          { emoji: "💡", title: lang === "fr" ? "Astuce" : "Tip", text: lang === "fr" ? "Proposez vos livres en format broché + e-book pour toucher plus de lecteurs." : "Offer in paperback + e-book to reach more readers.", bg: "bg-accent/5" },
          { emoji: "🌍", title: lang === "fr" ? "Marché" : "Market", text: lang === "fr" ? "Les lecteurs d'Afrique de l'Est préfèrent les livres en langues nationales." : "East African readers prefer books in national languages.", bg: "bg-gold/5" },
        ].map((tip, i) => (
          <div key={i} className={`${tip.bg} rounded-2xl p-5 space-y-2`}>
            <p className="text-sm font-bold">{tip.emoji} {tip.title}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{tip.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreatorOverview;
