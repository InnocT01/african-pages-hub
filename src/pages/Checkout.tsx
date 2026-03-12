import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Smartphone, CreditCard, CheckCircle, ArrowLeft } from "lucide-react";

const Checkout = () => {
  const { t } = useLanguage();
  const { items, total, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("mobilemoney");
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    setConfirmed(true);
    clearCart();
  };

  if (confirmed) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="text-center space-y-4 max-w-md">
            <CheckCircle className="h-20 w-20 text-savanna mx-auto" />
            <h1 className="text-3xl font-bold">{t("checkout.success")}</h1>
            <p className="text-muted-foreground">{t("checkout.success.msg")}</p>
            <Button asChild className="rounded-full">
              <Link to="/">{t("cart.continue")}</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button variant="ghost" size="sm" asChild className="mb-6 gap-1">
          <Link to="/cart"><ArrowLeft className="h-4 w-4" />{t("common.back")}</Link>
        </Button>

        <h1 className="text-3xl font-bold mb-8">{t("checkout.title")}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment method */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{t("checkout.payment")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                <Label htmlFor="pm-mobile" className={`flex items-center gap-4 rounded-xl border-2 p-4 cursor-pointer transition-all ${paymentMethod === "mobilemoney" ? "border-primary bg-primary/5" : "border-border"}`}>
                  <RadioGroupItem value="mobilemoney" id="pm-mobile" />
                  <Smartphone className="h-6 w-6 text-savanna" />
                  <div>
                    <p className="font-medium">{t("checkout.mobilemoney")}</p>
                    <p className="text-xs text-muted-foreground">M-Pesa, Orange Money, Airtel Money</p>
                  </div>
                </Label>
                <Label htmlFor="pm-card" className={`flex items-center gap-4 rounded-xl border-2 p-4 cursor-pointer transition-all ${paymentMethod === "card" ? "border-primary bg-primary/5" : "border-border"}`}>
                  <RadioGroupItem value="card" id="pm-card" />
                  <CreditCard className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-medium">{t("checkout.card")}</p>
                    <p className="text-xs text-muted-foreground">Visa, Mastercard</p>
                  </div>
                </Label>
              </RadioGroup>

              {paymentMethod === "mobilemoney" && (
                <div className="space-y-3 pt-2">
                  <div className="space-y-2">
                    <Label>Numéro de téléphone</Label>
                    <Input placeholder="+243 XXX XXX XXX" className="rounded-lg" />
                  </div>
                </div>
              )}

              {paymentMethod === "card" && (
                <div className="space-y-3 pt-2">
                  <div className="space-y-2">
                    <Label>Numéro de carte</Label>
                    <Input placeholder="4242 4242 4242 4242" className="rounded-lg" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Expiration</Label>
                      <Input placeholder="MM/AA" className="rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label>CVC</Label>
                      <Input placeholder="123" className="rounded-lg" />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Résumé</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.book.id} className="flex justify-between text-sm">
                  <span>{item.book.title} × {item.quantity}</span>
                  <span className="tabular-nums">${(item.book.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <hr className="border-border" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary tabular-nums">${total.toFixed(2)}</span>
              </div>
              <Button size="lg" className="w-full rounded-full" onClick={handleConfirm}>
                {t("checkout.confirm")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
