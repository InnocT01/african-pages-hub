import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingCart } from "lucide-react";

const Cart = () => {
  const { t } = useLanguage();
  const { items, removeFromCart, updateQuantity, total } = useCart();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t("cart.title")}</h1>

        {items.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground/30" />
            <p className="text-xl text-muted-foreground">{t("cart.empty")}</p>
            <Button asChild className="rounded-full">
              <Link to="/catalog">{t("cart.continue")}</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.book.id} className="flex gap-4 p-4 rounded-xl border border-border bg-card">
                  <img src={item.book.cover} alt={item.book.title} className="h-28 w-20 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0 space-y-2">
                    <Link to={`/book/${item.book.id}`} className="font-semibold hover:text-primary">{item.book.title}</Link>
                    <p className="text-sm text-muted-foreground">{item.book.author}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-border rounded-full">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => updateQuantity(item.book.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm tabular-nums">{item.quantity}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => updateQuantity(item.book.id, item.quantity + 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive gap-1" onClick={() => removeFromCart(item.book.id)}>
                        <Trash2 className="h-3 w-3" />{t("cart.remove")}
                      </Button>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-primary tabular-nums shrink-0">${(item.book.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>{t("cart.subtotal")}</span>
                  <span className="text-primary tabular-nums">${total.toFixed(2)}</span>
                </div>
                <Button size="lg" className="w-full rounded-full" asChild>
                  <Link to="/checkout">{t("cart.checkout")}</Link>
                </Button>
                <Button variant="ghost" className="w-full" asChild>
                  <Link to="/catalog"><ArrowLeft className="h-4 w-4 mr-1" />{t("cart.continue")}</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
