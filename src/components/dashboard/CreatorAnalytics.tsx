import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMyBooks } from "@/hooks/useBooks";
import { TrendingUp, BookOpen, Star, DollarSign, BarChart3, Eye } from "lucide-react";

const CreatorAnalytics = () => {
  const { lang } = useLanguage();
  const { data: books = [] } = useMyBooks();

  const topBooks = [...books].sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0)).slice(0, 10);
  const topRated = [...books].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5);
  const totalRevenue = books.reduce((s, b) => s + (b.sales_count || 0) * b.price, 0);
  const totalSales = books.reduce((s, b) => s + (b.sales_count || 0), 0);
  const avgPrice = books.length > 0 ? books.reduce((s, b) => s + b.price, 0) / books.length : 0;

  // Simulated monthly data
  const months = lang === "fr" ? ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"] : ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const monthlyData = months.map((m, i) => ({ month: m, sales: Math.floor(totalSales / 6 * (0.5 + Math.random())), revenue: Math.floor(totalRevenue / 6 * (0.5 + Math.random())) }));

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="p-4"><DollarSign className="h-4 w-4 text-accent mb-2" /><p className="text-xl font-extrabold">${totalRevenue.toFixed(0)}</p><p className="text-xs text-muted-foreground">{lang === "fr" ? "Revenus totaux" : "Total Revenue"}</p></CardContent></Card>
        <Card><CardContent className="p-4"><TrendingUp className="h-4 w-4 text-primary mb-2" /><p className="text-xl font-extrabold">{totalSales}</p><p className="text-xs text-muted-foreground">{lang === "fr" ? "Ventes totales" : "Total Sales"}</p></CardContent></Card>
        <Card><CardContent className="p-4"><BookOpen className="h-4 w-4 text-foreground mb-2" /><p className="text-xl font-extrabold">{books.length}</p><p className="text-xs text-muted-foreground">{lang === "fr" ? "Total livres" : "Total Books"}</p></CardContent></Card>
        <Card><CardContent className="p-4"><Star className="h-4 w-4 text-accent mb-2" /><p className="text-xl font-extrabold">${avgPrice.toFixed(2)}</p><p className="text-xs text-muted-foreground">{lang === "fr" ? "Prix moyen" : "Avg Price"}</p></CardContent></Card>
      </div>

      {/* Bar chart simulation */}
      <Card>
        <CardHeader><CardTitle className="text-base">{lang === "fr" ? "Ventes mensuelles" : "Monthly Sales"}</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-40">
            {monthlyData.map((d) => {
              const maxSales = Math.max(...monthlyData.map(x => x.sales), 1);
              const height = (d.sales / maxSales) * 100;
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-muted-foreground tabular-nums">{d.sales}</span>
                  <div className="w-full bg-primary/20 rounded-t-md relative" style={{ height: `${height}%`, minHeight: 4 }}>
                    <div className="absolute inset-0 bg-primary rounded-t-md" style={{ height: `${Math.min(100, height + 10)}%` }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{d.month}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top books */}
        <Card>
          <CardHeader><CardTitle className="text-base">{lang === "fr" ? "Top livres par ventes" : "Top Books by Sales"}</CardTitle></CardHeader>
          <CardContent>
            {topBooks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">{lang === "fr" ? "Aucune donnée" : "No data"}</p>
            ) : topBooks.map((book, i) => (
              <div key={book.id} className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
                <span className="text-sm font-bold text-muted-foreground w-5">#{i + 1}</span>
                {book.cover_url ? <img src={book.cover_url} alt="" className="h-8 w-6 rounded object-cover" /> : <div className="h-8 w-6 rounded bg-secondary" />}
                <span className="flex-1 text-sm font-medium truncate">{book.title}</span>
                <span className="text-xs text-muted-foreground tabular-nums">{book.sales_count || 0}</span>
                <span className="text-xs font-bold text-primary tabular-nums">${((book.sales_count || 0) * book.price).toFixed(0)}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top rated */}
        <Card>
          <CardHeader><CardTitle className="text-base">{lang === "fr" ? "Mieux notés" : "Top Rated"}</CardTitle></CardHeader>
          <CardContent>
            {topRated.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">{lang === "fr" ? "Aucune donnée" : "No data"}</p>
            ) : topRated.map((book, i) => (
              <div key={book.id} className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
                <span className="text-sm font-bold text-muted-foreground w-5">#{i + 1}</span>
                <span className="flex-1 text-sm font-medium truncate">{book.title}</span>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-accent text-accent" />
                  <span className="text-xs font-bold">{book.rating?.toFixed(1) || "—"}</span>
                </div>
                <span className="text-xs text-muted-foreground">({book.review_count || 0})</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Genre breakdown */}
      <Card>
        <CardHeader><CardTitle className="text-base">{lang === "fr" ? "Répartition par genre" : "Genre Breakdown"}</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(books.reduce((acc, b) => { acc[b.genre] = (acc[b.genre] || 0) + 1; return acc; }, {} as Record<string, number>)).map(([genre, count]) => (
              <div key={genre} className="bg-secondary rounded-xl p-3 text-center">
                <p className="text-lg font-extrabold">{count}</p>
                <p className="text-xs text-muted-foreground">{genre}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatorAnalytics;
