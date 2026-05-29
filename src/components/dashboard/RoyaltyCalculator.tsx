import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calculator, TrendingUp, DollarSign } from "lucide-react";

const RoyaltyCalculator = () => {
  const [price, setPrice] = useState(9.99);
  const [royaltyRate, setRoyaltyRate] = useState(85);
  const [estimatedSales, setEstimatedSales] = useState([100]);

  const calc = useMemo(() => {
    const perSale = price * (royaltyRate / 100);
    const monthly = perSale * estimatedSales[0];
    const yearly = monthly * 12;
    return { perSale, monthly, yearly };
  }, [price, royaltyRate, estimatedSales]);

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-primary" />
        <h3 className="font-display text-xl">Calculateur de royalties</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <Label htmlFor="price" className="text-xs">Prix de vente (USD)</Label>
          <Input id="price" type="number" min={0.99} step={0.01} value={price}
            onChange={e => setPrice(parseFloat(e.target.value) || 0)} className="mt-1" />
        </div>
        <div>
          <Label className="text-xs">Taux de royalty</Label>
          <div className="flex gap-2 mt-1">
            <button onClick={() => setRoyaltyRate(70)} className={`flex-1 py-2 text-sm rounded border ${royaltyRate === 70 ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>70%</button>
            <button onClick={() => setRoyaltyRate(85)} className={`flex-1 py-2 text-sm rounded border ${royaltyRate === 85 ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>85%</button>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <Label className="text-xs">Ventes estimées par mois : <span className="font-bold text-primary">{estimatedSales[0]}</span></Label>
        <Slider value={estimatedSales} onValueChange={setEstimatedSales} min={1} max={5000} step={10} className="mt-2" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Stat icon={DollarSign} label="Par vente" value={`$${calc.perSale.toFixed(2)}`} />
        <Stat icon={TrendingUp} label="Par mois" value={`$${calc.monthly.toFixed(0)}`} highlight />
        <Stat icon={TrendingUp} label="Par an" value={`$${calc.yearly.toFixed(0)}`} />
      </div>
    </Card>
  );
};

const Stat = ({ icon: Icon, label, value, highlight }: any) => (
  <div className={`p-3 rounded-md border ${highlight ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"}`}>
    <Icon className="w-4 h-4 opacity-70 mb-1" />
    <p className="text-[10px] uppercase tracking-wide opacity-80">{label}</p>
    <p className="text-lg font-bold">{value}</p>
  </div>
);

export default RoyaltyCalculator;
