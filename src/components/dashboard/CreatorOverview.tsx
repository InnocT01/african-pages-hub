import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, BookOpen, Eye, DollarSign, TrendingUp } from "lucide-react";

const CreatorOverview = () => {
  const { t } = useLanguage();

  const stats = [
    { key: "creator.revenue", value: "$2,847", icon: DollarSign, change: "+12%" },
    { key: "creator.sales", value: "142", icon: TrendingUp, change: "+8%" },
    { key: "creator.views", value: "3,284", icon: Eye, change: "+23%" },
    { key: "creator.books", value: "4", icon: BookOpen, change: "" },
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
                {s.change && <span className="text-xs text-savanna font-medium">{s.change}</span>}
              </div>
              <p className="text-2xl font-bold tabular-nums">{s.value}</p>
              <p className="text-xs text-muted-foreground">{t(s.key)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>{t("creator.analytics")}</CardTitle></CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center text-muted-foreground rounded-lg bg-muted/50">
            <BarChart3 className="h-10 w-10 mr-2 opacity-30" />
            <span className="text-sm">Graphique des ventes (données simulées)</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatorOverview;
