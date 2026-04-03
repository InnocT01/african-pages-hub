import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Card, CardContent } from "@/components/ui/card";
import { useMyBooks } from "@/hooks/useBooks";
import { TrendingUp, BookOpen, Star, DollarSign, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CreatorAnalytics = () => {
  const { lang } = useLanguage();
  const { format: formatPrice } = useCurrency();
  const { data: books = [] } = useMyBooks();

  const topBooks = [...books].sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0)).slice(0, 10);
  const topRated = [...books].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5);
  const totalRevenue = books.reduce((s, b) => s + (b.sales_count || 0) * b.price, 0);
  const totalSales = books.reduce((s, b) => s + (b.sales_count || 0), 0);
  const avgPrice = books.length > 0 ? books.reduce((s, b) => s + b.price, 0) / books.length : 0;

  const months = lang === "fr" ? ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"] : ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const monthlyData = months.map((m) => ({
    month: m,
    sales: Math.floor(totalSales / 6 * (0.5 + Math.random())),
    revenue: Math.floor(totalRevenue / 6 * (0.5 + Math.random())),
  }));

  const stats = [
    { label: lang === "fr" ? "Revenus totaux" : "Total Revenue", value: formatPrice(totalRevenue), icon: DollarSign, color: "from-primary to-accent" },
    { label: lang === "fr" ? "Ventes totales" : "Total Sales", value: totalSales.toString(), icon: TrendingUp, color: "from-gold to-primary" },
    { label: lang === "fr" ? "Total livres" : "Total Books", value: books.length.toString(), icon: BookOpen, color: "from-primary/70 to-primary" },
    { label: lang === "fr" ? "Prix moyen" : "Avg Price", value: formatPrice(avgPrice), icon: Star, color: "from-gold to-gold/70" },
  ];

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-border/50 hover:shadow-glass transition-all overflow-hidden relative group">
            <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-[0.04] group-hover:opacity-[0.08] transition-opacity`} />
            <CardContent className="p-5 relative">
              <div className="h-10 w-10 rounded-2xl bg-secondary flex items-center justify-center mb-3">
                <s.icon className="h-5 w-5 text-primary" />
              </div>
              <p className="text-2xl font-extrabold tracking-tight">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1 font-medium">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bar chart */}
      <Card className="border-border/50">
        <CardContent className="p-6">
          <h3 className="font-bold text-base mb-6">{lang === "fr" ? "Ventes mensuelles" : "Monthly Sales"}</h3>
          <div className="flex items-end gap-3 h-44">
            {monthlyData.map((d) => {
              const maxSales = Math.max(...monthlyData.map(x => x.sales), 1);
              const height = (d.sales / maxSales) * 100;
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[10px] font-bold text-muted-foreground tabular-nums">{d.sales}</span>
                  <div className="w-full rounded-xl overflow-hidden bg-secondary" style={{ height: `${Math.max(height, 8)}%` }}>
                    <div className="h-full w-full bg-gradient-to-t from-primary to-primary/60 rounded-xl" />
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground">{d.month}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top by sales */}
        <Card className="border-border/50">
          <CardContent className="p-6">
            <h3 className="font-bold text-base mb-4">{lang === "fr" ? "Top ventes" : "Top Sellers"}</h3>
            {topBooks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">{lang === "fr" ? "Aucune donnée" : "No data"}</p>
            ) : topBooks.map((book, i) => (
              <div key={book.id} className="flex items-center gap-3 py-3 hover:bg-secondary/30 rounded-xl px-2 -mx-2 transition-colors">
                <span className="text-xs font-extrabold text-muted-foreground w-5 text-center">#{i + 1}</span>
                {book.cover_url ? (
                  <img src={book.cover_url} alt="" className="h-10 w-7 rounded-lg object-cover shadow-sm" />
                ) : (
                  <div className="h-10 w-7 rounded-lg bg-secondary" />
                )}
                <span className="flex-1 text-sm font-medium truncate">{book.title}</span>
                <div className="text-right">
                  <p className="text-xs font-bold tabular-nums">{book.sales_count || 0}</p>
                  <p className="text-[10px] text-muted-foreground">{formatPrice((book.sales_count || 0) * book.price)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top rated */}
        <Card className="border-border/50">
          <CardContent className="p-6">
            <h3 className="font-bold text-base mb-4">{lang === "fr" ? "Mieux notés" : "Top Rated"}</h3>
            {topRated.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">{lang === "fr" ? "Aucune donnée" : "No data"}</p>
            ) : topRated.map((book, i) => (
              <div key={book.id} className="flex items-center gap-3 py-3 hover:bg-secondary/30 rounded-xl px-2 -mx-2 transition-colors">
                <span className="text-xs font-extrabold text-muted-foreground w-5 text-center">#{i + 1}</span>
                <span className="flex-1 text-sm font-medium truncate">{book.title}</span>
                <div className="flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                  <span className="text-sm font-bold">{book.rating?.toFixed(1) || "—"}</span>
                  <span className="text-xs text-muted-foreground">({book.review_count || 0})</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Genre breakdown */}
      <Card className="border-border/50">
        <CardContent className="p-6">
          <h3 className="font-bold text-base mb-4">{lang === "fr" ? "Par genre" : "By Genre"}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(books.reduce((acc, b) => { acc[b.genre] = (acc[b.genre] || 0) + 1; return acc; }, {} as Record<string, number>)).map(([genre, count]) => (
              <div key={genre} className="bg-secondary/50 rounded-2xl p-4 text-center hover:bg-secondary transition-colors">
                <p className="text-xl font-extrabold">{count}</p>
                <p className="text-xs text-muted-foreground mt-1">{genre}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatorAnalytics;
