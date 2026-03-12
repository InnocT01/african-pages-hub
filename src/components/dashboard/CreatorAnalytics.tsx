import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, BarChart3 } from "lucide-react";
import { mockBooks } from "@/data/mockBooks";

const CreatorAnalytics = () => {
  const { t } = useLanguage();
  const myBooks = mockBooks.slice(0, 4);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle>Ventes mensuelles</CardTitle></CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground rounded-lg bg-muted/50">
            <TrendingUp className="h-10 w-10 mr-2 opacity-30" />
            <span className="text-sm">Graphique des ventes (données simulées)</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Revenus par catégorie</CardTitle></CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center text-muted-foreground rounded-lg bg-muted/50">
            <BarChart3 className="h-10 w-10 mr-2 opacity-30" />
            <span className="text-sm">Répartition des revenus</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Top livres</CardTitle></CardHeader>
        <CardContent>
          {myBooks.slice(0, 3).map((book, i) => (
            <div key={book.id} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
              <span className="text-lg font-bold text-muted-foreground w-6">#{i + 1}</span>
              <img src={book.cover} alt={book.title} className="h-10 w-7 rounded object-cover" />
              <span className="flex-1 font-medium truncate">{book.title}</span>
              <span className="text-primary font-bold tabular-nums">${(book.price * (30 - i * 8)).toFixed(0)}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatorAnalytics;
