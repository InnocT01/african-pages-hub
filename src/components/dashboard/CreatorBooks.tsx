import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockBooks } from "@/data/mockBooks";
import { Eye, Edit, Trash2, BarChart3 } from "lucide-react";

const CreatorBooks = () => {
  const { t } = useLanguage();
  const myBooks = mockBooks.slice(0, 6);

  const statusColors: Record<string, string> = {
    published: "bg-savanna/10 text-savanna",
    draft: "bg-muted text-muted-foreground",
    archived: "bg-destructive/10 text-destructive",
  };

  return (
    <div className="space-y-4">
      {myBooks.map((book) => {
        const status = book.featured ? "published" : "draft";
        return (
          <Card key={book.id} className="overflow-hidden">
            <CardContent className="flex gap-4 p-4">
              <img src={book.cover} alt={book.title} className="h-24 w-16 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold truncate">{book.title}</h3>
                  <Badge className={`text-[10px] ${statusColors[status]}`}>
                    {t(`creator.status.${status}`)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{book.genre} · {book.origin} · {t(`filter.${book.type}`)}</p>
                <p className="text-primary font-bold">${book.price.toFixed(2)}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> 1,234</span>
                  <span className="flex items-center gap-1"><BarChart3 className="h-3 w-3" /> 45 ventes</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <Button variant="outline" size="sm" className="gap-1">
                  <Edit className="h-3 w-3" />{t("common.edit")}
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive gap-1">
                  <Trash2 className="h-3 w-3" />{t("common.delete")}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CreatorBooks;
