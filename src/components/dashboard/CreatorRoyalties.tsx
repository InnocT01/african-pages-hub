import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMyBooks } from "@/hooks/useBooks";
import { Calculator, DollarSign, TrendingUp } from "lucide-react";

const PLATFORM_FEE = 0.15; // 15%

const CreatorRoyalties = () => {
  const { lang } = useLanguage();
  const { data: books = [] } = useMyBooks();

  const totalGross = books.reduce((s, b) => s + (b.sales_count || 0) * b.price, 0);
  const totalFees = totalGross * PLATFORM_FEE;
  const totalNet = totalGross - totalFees;

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">{lang === "fr" ? "Calculez vos royalties sur chaque vente. KitabuShop prélève 15% de commission." : "Calculate your royalties on each sale. KitabuShop takes a 15% commission."}</p>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="bg-accent/5 border-accent/10">
          <CardContent className="p-5">
            <DollarSign className="h-5 w-5 text-accent mb-2" />
            <p className="text-2xl font-extrabold">${totalGross.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">{lang === "fr" ? "Revenus bruts" : "Gross Revenue"}</p>
          </CardContent>
        </Card>
        <Card className="bg-destructive/5 border-destructive/10">
          <CardContent className="p-5">
            <Calculator className="h-5 w-5 text-destructive mb-2" />
            <p className="text-2xl font-extrabold">-${totalFees.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">{lang === "fr" ? `Commission (${PLATFORM_FEE * 100}%)` : `Commission (${PLATFORM_FEE * 100}%)`}</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/10">
          <CardContent className="p-5">
            <TrendingUp className="h-5 w-5 text-primary mb-2" />
            <p className="text-2xl font-extrabold text-primary">${totalNet.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">{lang === "fr" ? "Revenus nets" : "Net Revenue"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Per-book breakdown */}
      <Card>
        <CardHeader><CardTitle className="text-base">{lang === "fr" ? "Détail par livre" : "Per-Book Breakdown"}</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-2 font-semibold text-xs text-muted-foreground">{lang === "fr" ? "Livre" : "Book"}</th>
                  <th className="py-2 font-semibold text-xs text-muted-foreground text-right">{lang === "fr" ? "Prix" : "Price"}</th>
                  <th className="py-2 font-semibold text-xs text-muted-foreground text-right">{lang === "fr" ? "Ventes" : "Sales"}</th>
                  <th className="py-2 font-semibold text-xs text-muted-foreground text-right">{lang === "fr" ? "Brut" : "Gross"}</th>
                  <th className="py-2 font-semibold text-xs text-muted-foreground text-right">{lang === "fr" ? "Commission" : "Fee"}</th>
                  <th className="py-2 font-semibold text-xs text-muted-foreground text-right">{lang === "fr" ? "Net" : "Net"}</th>
                </tr>
              </thead>
              <tbody>
                {books.map(book => {
                  const gross = (book.sales_count || 0) * book.price;
                  const fee = gross * PLATFORM_FEE;
                  const net = gross - fee;
                  return (
                    <tr key={book.id} className="border-b border-border last:border-0">
                      <td className="py-2.5 font-medium truncate max-w-[200px]">{book.title}</td>
                      <td className="py-2.5 text-right tabular-nums">${book.price.toFixed(2)}</td>
                      <td className="py-2.5 text-right tabular-nums">{book.sales_count || 0}</td>
                      <td className="py-2.5 text-right tabular-nums">${gross.toFixed(2)}</td>
                      <td className="py-2.5 text-right tabular-nums text-destructive">-${fee.toFixed(2)}</td>
                      <td className="py-2.5 text-right tabular-nums font-bold text-primary">${net.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Payout info */}
      <Card className="bg-secondary">
        <CardContent className="p-5">
          <h4 className="font-bold text-sm mb-2">{lang === "fr" ? "💳 Informations de paiement" : "💳 Payout Information"}</h4>
          <p className="text-xs text-muted-foreground">{lang === "fr" ? "Les versements sont effectués mensuellement via virement bancaire. Assurez-vous que vos informations bancaires sont à jour dans les Paramètres." : "Payouts are made monthly via bank transfer. Make sure your banking information is up to date in Settings."}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatorRoyalties;
