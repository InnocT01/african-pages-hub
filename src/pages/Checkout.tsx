import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CreditCard, CheckCircle, ArrowLeft, Loader2, Truck, Upload, ImageIcon, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const Checkout = () => {
  const { t, lang } = useLanguage();
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const [confirmed, setConfirmed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [wantsDelivery, setWantsDelivery] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [paymentNote, setPaymentNote] = useState("");
  const proofRef = useRef<HTMLInputElement>(null);

  const hasPhysicalItems = items.some(i => i.book.format === "paperback" || i.book.format === "both");

  const handleProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setProofPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = async () => {
    if (!user) { toast.error(lang === "fr" ? "Connectez-vous pour commander" : "Sign in to order"); return; }
    if (!proofFile) {
      toast.error(lang === "fr" ? "Veuillez joindre la capture de confirmation de paiement" : "Please attach the payment confirmation screenshot");
      return;
    }
    setProcessing(true);
    try {
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({ user_id: user.id, total, payment_method: "bank_transfer", status: "pending_verification", currency: "USD" } as any)
        .select().single();
      if (orderErr) throw orderErr;

      const orderItems = items.map((item) => ({
        order_id: order.id, book_id: item.book.id, quantity: item.quantity,
        unit_price: item.book.on_sale && item.book.sale_price ? item.book.sale_price : item.book.price,
      }));
      const { error: itemsErr } = await supabase.from("order_items").insert(orderItems as any);
      if (itemsErr) throw itemsErr;

      // Upload proof
      const ext = proofFile.name.split(".").pop();
      const path = `${user.id}/${order.id}-proof.${ext}`;
      await supabase.storage.from("book-covers").upload(path, proofFile, { upsert: true });

      setConfirmed(true);
      clearCart();
    } catch (e: any) {
      toast.error(e.message || "Error");
    } finally {
      setProcessing(false);
    }
  };

  if (confirmed) {
    return (
      <div className="min-h-screen flex flex-col"><Header /><main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center space-y-4 max-w-md">
          <CheckCircle className="h-20 w-20 text-accent mx-auto" />
          <h1 className="text-3xl font-bold">{lang === "fr" ? "Commande soumise !" : "Order Submitted!"}</h1>
          <p className="text-muted-foreground">
            {lang === "fr"
              ? "Votre commande est en attente de vérification du paiement. Vous recevrez une confirmation une fois le paiement validé."
              : "Your order is pending payment verification. You'll receive confirmation once payment is validated."}
          </p>
          {wantsDelivery && <p className="text-sm text-accent font-medium">🚚 Kitabu Express {lang === "fr" ? "va traiter votre livraison." : "will handle your delivery."}</p>}
          <Button asChild className="rounded-full"><Link to="/">{t("cart.continue")}</Link></Button>
        </div>
      </main><Footer /></div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button variant="ghost" size="sm" asChild className="mb-6 gap-1"><Link to="/cart"><ArrowLeft className="h-4 w-4" />{t("common.back")}</Link></Button>
        <h1 className="text-3xl font-bold mb-8">{t("checkout.title")}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Bank Transfer Instructions */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <CreditCard className="h-5 w-5 text-primary" />
                  {lang === "fr" ? "Paiement par virement bancaire" : "Bank Transfer Payment"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-primary/5 rounded-xl p-4 space-y-2">
                  <h4 className="font-bold text-sm">{lang === "fr" ? "Coordonnées bancaires KitabuShop" : "KitabuShop Bank Details"}</h4>
                  <div className="text-sm space-y-1.5">
                    <p><span className="text-muted-foreground">{lang === "fr" ? "Banque :" : "Bank:"}</span> <strong>Rawbank</strong></p>
                    <p><span className="text-muted-foreground">{lang === "fr" ? "Titulaire :" : "Holder:"}</span> <strong>KitabuShop SARL</strong></p>
                    <p><span className="text-muted-foreground">{lang === "fr" ? "Numéro de compte :" : "Account:"}</span> <strong>05100-05101-01099918601-72</strong></p>
                    <p><span className="text-muted-foreground">SWIFT :</span> <strong>RAWBCDKI</strong></p>
                    <p><span className="text-muted-foreground">{lang === "fr" ? "Montant :" : "Amount:"}</span> <strong className="text-primary text-lg">${total.toFixed(2)} USD</strong></p>
                    <p><span className="text-muted-foreground">{lang === "fr" ? "Référence :" : "Reference:"}</span> <strong>KS-{Date.now().toString(36).toUpperCase()}</strong></p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 bg-amber-500/10 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-700">
                    {lang === "fr"
                      ? "Effectuez le virement, puis joignez la capture d'écran de confirmation ci-dessous. Votre commande sera validée après vérification."
                      : "Make the transfer, then attach the confirmation screenshot below. Your order will be validated after verification."}
                  </p>
                </div>

                {/* Proof upload */}
                <div className="space-y-2">
                  <Label className="font-semibold">
                    {lang === "fr" ? "Capture de confirmation du paiement *" : "Payment Confirmation Screenshot *"}
                  </Label>
                  <input ref={proofRef} type="file" accept="image/*" className="hidden" onChange={handleProofChange} />
                  <div
                    onClick={() => proofRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary transition-colors"
                  >
                    {proofPreview ? (
                      <img src={proofPreview} alt="Payment proof" className="max-h-48 rounded-lg mx-auto object-contain" />
                    ) : (
                      <div className="space-y-2">
                        <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground/40" />
                        <p className="text-sm text-muted-foreground">
                          {lang === "fr" ? "Cliquez pour joindre la capture" : "Click to attach screenshot"}
                        </p>
                      </div>
                    )}
                  </div>
                  {proofFile && <p className="text-xs text-accent">✅ {proofFile.name}</p>}
                </div>

                {/* Optional note */}
                <div className="space-y-2">
                  <Label className="text-xs">{lang === "fr" ? "Note (optionnel)" : "Note (optional)"}</Label>
                  <Textarea
                    value={paymentNote}
                    onChange={(e) => setPaymentNote(e.target.value)}
                    placeholder={lang === "fr" ? "Informations complémentaires..." : "Additional information..."}
                    className="min-h-[60px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Kitabu Express */}
            {hasPhysicalItems && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Truck className="h-8 w-8 text-accent shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold">🚚 Kitabu Express</p>
                      <p className="text-xs text-muted-foreground">{lang === "fr" ? "Livraison de vos livres brochés en RDC et Afrique de l'Est" : "Delivery of your paperback books in DRC and East Africa"}</p>
                    </div>
                    <Switch checked={wantsDelivery} onCheckedChange={setWantsDelivery} />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Summary */}
          <Card>
            <CardHeader><CardTitle className="text-xl">{lang === "fr" ? "Résumé" : "Summary"}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => {
                const itemPrice = item.book.on_sale && item.book.sale_price ? item.book.sale_price : item.book.price;
                return (
                  <div key={item.book.id} className="flex justify-between text-sm">
                    <span>{item.book.title} × {item.quantity}</span>
                    <span className="tabular-nums">${(itemPrice * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
              {wantsDelivery && (
                <div className="flex justify-between text-sm text-accent">
                  <span>🚚 Kitabu Express</span>
                  <span>{lang === "fr" ? "À confirmer" : "To confirm"}</span>
                </div>
              )}
              <hr className="border-border" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary tabular-nums">${total.toFixed(2)}</span>
              </div>
              <Button size="lg" className="w-full rounded-full" onClick={handleConfirm} disabled={processing || !proofFile}>
                {processing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {lang === "fr" ? "Soumettre la commande" : "Submit Order"}
              </Button>
              {!proofFile && (
                <p className="text-xs text-center text-muted-foreground">
                  {lang === "fr" ? "⚠️ La capture de paiement est requise" : "⚠️ Payment screenshot is required"}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
