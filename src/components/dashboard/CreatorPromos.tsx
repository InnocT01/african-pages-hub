import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMyBooks, useUpdateBook } from "@/hooks/useBooks";
import { Tag, Star, Percent, Loader2 } from "lucide-react";
import { toast } from "sonner";

const CreatorPromos = () => {
  const { lang } = useLanguage();
  const { data: books = [] } = useMyBooks();
  const updateBook = useUpdateBook();
  const [editing, setEditing] = useState<string | null>(null);
  const [salePrice, setSalePrice] = useState("");

  const handleToggleSale = async (bookId: string, currentOnSale: boolean) => {
    if (!currentOnSale) {
      setEditing(bookId);
      return;
    }
    try {
      await updateBook.mutateAsync({ id: bookId, on_sale: false, sale_price: null });
      toast.success(lang === "fr" ? "Promo désactivée" : "Sale disabled");
    } catch (e: any) { toast.error(e.message); }
  };

  const handleSetSale = async (bookId: string) => {
    if (!salePrice || parseFloat(salePrice) <= 0) { toast.error("Invalid price"); return; }
    try {
      await updateBook.mutateAsync({ id: bookId, on_sale: true, sale_price: parseFloat(salePrice) });
      toast.success(lang === "fr" ? "Promo activée !" : "Sale enabled!");
      setEditing(null);
      setSalePrice("");
    } catch (e: any) { toast.error(e.message); }
  };

  const handleToggleFeatured = async (bookId: string, current: boolean | null) => {
    try {
      await updateBook.mutateAsync({ id: bookId, featured: !current });
      toast.success(lang === "fr" ? "Statut vedette mis à jour" : "Featured status updated");
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">{lang === "fr" ? "Gérez les promotions et mettez en avant vos livres." : "Manage promotions and feature your books."}</p>

      <div className="space-y-3">
        {books.length === 0 ? (
          <Card><CardContent className="p-8 text-center text-muted-foreground text-sm">{lang === "fr" ? "Aucun livre" : "No books"}</CardContent></Card>
        ) : books.map(book => (
          <Card key={book.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {book.cover_url ? <img src={book.cover_url} alt="" className="h-14 w-10 rounded object-cover shrink-0" /> : <div className="h-14 w-10 rounded bg-secondary shrink-0" />}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate">{book.title}</h4>
                  <p className="text-xs text-muted-foreground">${book.price.toFixed(2)}{book.on_sale && book.sale_price ? ` → $${book.sale_price.toFixed(2)}` : ""}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  {/* Featured */}
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground"><Star className="h-3 w-3 inline" /></Label>
                    <Switch checked={!!book.featured} onCheckedChange={() => handleToggleFeatured(book.id, book.featured)} />
                  </div>
                  {/* Sale */}
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground"><Percent className="h-3 w-3 inline" /></Label>
                    <Switch checked={book.on_sale} onCheckedChange={() => handleToggleSale(book.id, book.on_sale)} />
                  </div>
                  {book.on_sale && <Badge className="bg-destructive/10 text-destructive text-[10px]">Promo</Badge>}
                  {book.featured && <Badge className="bg-primary/10 text-primary text-[10px]">Vedette</Badge>}
                </div>
              </div>
              {editing === book.id && (
                <div className="flex items-center gap-3 mt-3 p-3 bg-secondary rounded-xl">
                  <Label className="text-xs shrink-0">{lang === "fr" ? "Prix promo ($)" : "Sale Price ($)"}</Label>
                  <Input type="number" step="0.01" min="0" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} className="h-8 w-28" placeholder={`< ${book.price}`} />
                  <Button size="sm" className="rounded-full h-8" onClick={() => handleSetSale(book.id)} disabled={updateBook.isPending}>
                    {updateBook.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "OK"}
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8" onClick={() => { setEditing(null); setSalePrice(""); }}>{lang === "fr" ? "Annuler" : "Cancel"}</Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CreatorPromos;
