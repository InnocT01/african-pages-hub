import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2, ShoppingCart, BookOpen } from "lucide-react";

const Cart = () => {
  const { t } = useLanguage();
  const { items, removeFromCart, updateQuantity, total } = useCart();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t("cart.title")}</h1>
        {items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="h-20 w-20 mx-auto text-muted-foreground/20 mb-4" />
            <p className="text-lg text-muted-foreground mb-6">{t("cart.empty")}</p>
            <Button asChild className="rounded-full"><Link to="/catalog">{t("cart.continue")}</Link></Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.book.id} className="flex gap-4 p-4 rounded-xl border border-border bg-card">
                  {item.book.cover_url ? (
                    <img src={item.book.cover_url} alt={item.book.title} className="h-28 w-20 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="h-28 w-20 rounded-lg bg-muted flex items-center justify-center shrink-0"><BookOpen className="h-6 w-6 text-muted-foreground/30" /></div>
                  )}
                  <div className="flex-1 min-w-0 space-y-2">
                    <Link to={`/book/${item.book.id}`} className="font-semibold hover:text-primary">{item.book.title}</Link>
                    <p className="text-sm text-muted-foreground">{item.book.author_name}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-border rounded-full">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => updateQuantity(item.book.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-sm tabular-nums">{item.quantity}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => updateQuantity(item.book.id, item.quantity + 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm" className="text-destructive gap-1" onClick={() => removeFromCart(item.book.id)}>
                        <Trash2 className="h-3 w-3" />{t("cart.remove")}
                      </Button>
                    </div>
                  </div>
                  <p className="text-lg font-bold tabular-nums text-primary shrink-0">${(item.book.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-border bg-card p-6 space-y-4 h-fit sticky top-24">
              <h2 className="font-bold text-lg">{t("cart.subtotal")}</h2>
              <hr className="border-border" />
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-primary tabular-nums">${total.toFixed(2)}</span>
              </div>
              <Button size="lg" asChild className="w-full rounded-full"><Link to="/checkout">{t("cart.checkout")}</Link></Button>
              <Button variant="ghost" size="sm" asChild className="w-full"><Link to="/catalog">{t("cart.continue")}</Link></Button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
