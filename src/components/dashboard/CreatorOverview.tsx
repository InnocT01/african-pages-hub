import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMyBooks } from "@/hooks/useBooks";
import { BookOpen, Eye, DollarSign, TrendingUp } from "lucide-react";

const CreatorOverview = () => {
  const { t } = useLanguage();
  const { data: books = [] } = useMyBooks();

  const totalSales = books.reduce((sum, b) => sum + (b.sales_count || 0), 0);
  const totalRevenue = books.reduce((sum, b) => sum + (b.sales_count || 0) * b.price, 0);
  const totalReviews = books.reduce((sum, b) => sum + (b.review_count || 0), 0);
  const publishedCount = books.filter(b => b.status === "published").length;

  const stats = [
    { key: "creator.revenue", value: `$${totalRevenue.toFixed(0)}`, icon: DollarSign },
    { key: "creator.sales", value: totalSales.toString(), icon: TrendingUp },
    { key: "creator.views", value: totalReviews.toString(), icon: Eye },
    { key: "creator.books", value: publishedCount.toString(), icon: BookOpen },
  ];

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">{t("creator.welcome")}</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.key}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <s.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold tabular-nums">{s.value}</p>
              <p className="text-xs text-muted-foreground">{t(s.key)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CreatorOverview;
