import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/EmptyState";
import {
  Package, CheckCircle2, Clock, Truck, Home, XCircle, Download,
  ArrowLeft, Receipt, ShoppingBag, MapPin, CreditCard, Hash,
} from "lucide-react";
import { format } from "date-fns";
import { fr as frLocale, enUS } from "date-fns/locale";
import { toast } from "sonner";
import jsPDF from "jspdf";

type Step = { key: string; label_fr: string; label_en: string; icon: any };

const STEPS: Step[] = [
  { key: "pending",    label_fr: "Commande reçue",      label_en: "Order received",   icon: Receipt },
  { key: "paid",       label_fr: "Paiement confirmé",   label_en: "Payment confirmed", icon: CreditCard },
  { key: "processing", label_fr: "En préparation",      label_en: "Processing",       icon: Package },
  { key: "shipped",    label_fr: "Expédiée",            label_en: "Shipped",          icon: Truck },
  { key: "delivered",  label_fr: "Livrée",              label_en: "Delivered",        icon: Home },
];

const statusIndex = (s: string) => {
  const i = STEPS.findIndex(x => x.key === s);
  return i === -1 ? 0 : i;
};

const statusBadge = (s: string) => {
  if (s === "cancelled") return "bg-destructive/10 text-destructive";
  if (s === "delivered") return "bg-emerald-500/10 text-emerald-600";
  if (s === "shipped") return "bg-blue-500/10 text-blue-600";
  if (s === "processing") return "bg-amber-500/10 text-amber-600";
  if (s === "paid") return "bg-primary/10 text-primary";
  return "bg-muted text-muted-foreground";
};

const Orders = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { lang } = useLanguage();
  const { format: fmtPrice } = useCurrency();
  const qc = useQueryClient();
  const locale = lang === "fr" ? frLocale : enUS;

  useEffect(() => { if (!isAuthenticated) navigate("/login"); }, [isAuthenticated, navigate]);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders-tracking"],
    queryFn: async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) return [];
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*, books(id, title, author_name, cover_url, format))")
        .eq("user_id", u.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  // Realtime updates
  useEffect(() => {
    if (!user) return;
    const ch = supabase
      .channel("orders-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        qc.invalidateQueries({ queryKey: ["orders-tracking"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user, qc]);

  const selectedOrder = id ? orders.find((o: any) => o.id === id) : null;

  const downloadReceipt = (order: any) => {
    const doc = new jsPDF();
    const orange: [number, number, number] = [194, 74, 33];
    doc.setFillColor(...orange);
    doc.rect(0, 0, 210, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("KitabuShop", 14, 19);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(lang === "fr" ? "Reçu officiel" : "Official receipt", 196, 19, { align: "right" });

    doc.setTextColor(20, 20, 20);
    doc.setFontSize(11);
    let y = 44;
    doc.setFont("helvetica", "bold");
    doc.text(lang === "fr" ? "N° de commande :" : "Order #:", 14, y);
    doc.setFont("helvetica", "normal");
    doc.text(order.id.slice(0, 8).toUpperCase(), 60, y);
    y += 7;
    doc.setFont("helvetica", "bold");
    doc.text("Date :", 14, y);
    doc.setFont("helvetica", "normal");
    doc.text(format(new Date(order.created_at), "PPP", { locale }), 60, y);
    y += 7;
    doc.setFont("helvetica", "bold");
    doc.text("Statut :", 14, y);
    doc.setFont("helvetica", "normal");
    doc.text(order.status, 60, y);
    y += 7;
    doc.setFont("helvetica", "bold");
    doc.text(lang === "fr" ? "Paiement :" : "Payment:", 14, y);
    doc.setFont("helvetica", "normal");
    doc.text(order.payment_method || "—", 60, y);

    y += 12;
    doc.setDrawColor(220, 220, 220);
    doc.line(14, y, 196, y);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(lang === "fr" ? "Article" : "Item", 14, y);
    doc.text("Qté", 130, y);
    doc.text("Prix", 196, y, { align: "right" });
    y += 4;
    doc.line(14, y, 196, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    (order.order_items || []).forEach((it: any) => {
      const t = (it.books?.title || "—").slice(0, 60);
      doc.text(t, 14, y);
      doc.text(String(it.quantity), 130, y);
      doc.text(`${(it.unit_price * it.quantity).toFixed(2)} ${order.currency}`, 196, y, { align: "right" });
      y += 7;
    });

    y += 6;
    doc.line(14, y, 196, y);
    y += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Total", 130, y);
    doc.text(`${Number(order.total).toFixed(2)} ${order.currency}`, 196, y, { align: "right" });

    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(
      lang === "fr"
        ? "Merci pour votre achat — KitabuShop, Goma, RDC"
        : "Thank you for your purchase — KitabuShop, Goma, DRC",
      105, 285, { align: "center" }
    );

    doc.save(`KitabuShop-receipt-${order.id.slice(0, 8)}.pdf`);
    toast.success(lang === "fr" ? "Reçu téléchargé" : "Receipt downloaded");
  };

  // ----------------- DETAIL VIEW -----------------
  if (id) {
    if (isLoading) {
      return (
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="container mx-auto px-4 py-10 flex-1"><Skeleton className="h-96 rounded-3xl" /></main>
          <Footer />
        </div>
      );
    }
    if (!selectedOrder) {
      return (
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="container mx-auto px-4 py-10 flex-1">
            <EmptyState
              icon={Package}
              title={lang === "fr" ? "Commande introuvable" : "Order not found"}
              description={lang === "fr" ? "Cette commande n'existe pas ou ne vous appartient pas." : "This order doesn't exist or doesn't belong to you."}
              action={{ label: lang === "fr" ? "Voir mes commandes" : "View my orders", onClick: () => navigate("/orders") }}
            />
          </main>
          <Footer />
        </div>
      );
    }
    const o = selectedOrder;
    const currentStep = statusIndex(o.status);
    const isCancelled = o.status === "cancelled";

    return (
      <div className="min-h-screen flex flex-col bg-muted/20">
        <Header />
        <main className="container mx-auto max-w-4xl px-4 py-8 md:py-12 flex-1 space-y-6">
          <Link to="/orders" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> {lang === "fr" ? "Toutes mes commandes" : "All my orders"}
          </Link>

          {/* Header */}
          <Card className="border-border/50 overflow-hidden">
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                    {lang === "fr" ? "Commande" : "Order"}
                  </p>
                  <h1 className="font-display text-3xl md:text-4xl font-bold mt-1 flex items-center gap-2">
                    <Hash className="h-7 w-7 text-primary" />
                    {o.id.slice(0, 8).toUpperCase()}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-2">
                    {format(new Date(o.created_at), "PPPp", { locale })}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={`${statusBadge(o.status)} rounded-full px-3 py-1 text-xs uppercase`}>
                    {o.status}
                  </Badge>
                  <p className="font-display text-2xl font-bold">{fmtPrice(Number(o.total))}</p>
                  <Button size="sm" onClick={() => downloadReceipt(o)} className="rounded-full gap-2">
                    <Download className="h-4 w-4" />
                    {lang === "fr" ? "Reçu PDF" : "PDF Receipt"}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Timeline */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" />
                {lang === "fr" ? "Suivi de livraison" : "Delivery tracking"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isCancelled ? (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-destructive/5 text-destructive">
                  <XCircle className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">{lang === "fr" ? "Commande annulée" : "Order cancelled"}</p>
                    <p className="text-xs opacity-80">{lang === "fr" ? "Contactez le support pour plus d'informations." : "Contact support for more info."}</p>
                  </div>
                </div>
              ) : (
                <ol className="relative">
                  {STEPS.map((s, i) => {
                    const done = i <= currentStep;
                    const active = i === currentStep;
                    const Icon = s.icon;
                    return (
                      <li key={s.key} className="flex gap-4 pb-6 last:pb-0 relative">
                        {i < STEPS.length - 1 && (
                          <span className={`absolute left-5 top-10 bottom-0 w-0.5 ${done ? "bg-primary" : "bg-border"}`} />
                        )}
                        <div className={`shrink-0 h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all ${
                          done ? "bg-primary border-primary text-primary-foreground" : "bg-background border-border text-muted-foreground"
                        } ${active ? "ring-4 ring-primary/20 scale-110" : ""}`}>
                          {done ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                        </div>
                        <div className="pt-2">
                          <p className={`font-semibold ${done ? "text-foreground" : "text-muted-foreground"}`}>
                            {lang === "fr" ? s.label_fr : s.label_en}
                          </p>
                          {active && (
                            <p className="text-xs text-primary mt-0.5 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {lang === "fr" ? "Étape actuelle" : "Current step"}
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </CardContent>
          </Card>

          {/* Items */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-primary" />
                {lang === "fr" ? "Articles" : "Items"} ({(o.order_items || []).length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(o.order_items || []).map((it: any) => (
                <div key={it.id} className="flex gap-4 p-3 rounded-2xl hover:bg-muted/40 transition-colors">
                  {it.books?.cover_url ? (
                    <img src={it.books.cover_url} alt={it.books.title} className="h-20 w-14 rounded-xl object-cover shadow-sm" />
                  ) : (
                    <div className="h-20 w-14 rounded-xl bg-secondary flex items-center justify-center">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <Link to={`/book/${it.book_id}`} className="font-semibold hover:text-primary line-clamp-1">
                      {it.books?.title || "—"}
                    </Link>
                    <p className="text-xs text-muted-foreground">{it.books?.author_name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{lang === "fr" ? "Qté" : "Qty"}: {it.quantity}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold">{fmtPrice(Number(it.unit_price) * it.quantity)}</p>
                    <p className="text-xs text-muted-foreground">{fmtPrice(Number(it.unit_price))} / {lang === "fr" ? "u" : "ea"}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="border-border/50">
            <CardContent className="p-6 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">{lang === "fr" ? "Méthode de paiement" : "Payment method"}</span><span className="font-medium capitalize">{o.payment_method || "—"}</span></div>
              {o.coupon_code && <div className="flex justify-between"><span className="text-muted-foreground">{lang === "fr" ? "Coupon" : "Coupon"}</span><span className="font-medium">{o.coupon_code}</span></div>}
              {o.points_used > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Kitabu Points</span><span className="font-medium">-{o.points_used}</span></div>}
              {o.points_earned > 0 && <div className="flex justify-between"><span className="text-muted-foreground">{lang === "fr" ? "Points gagnés" : "Points earned"}</span><span className="font-medium text-primary">+{o.points_earned}</span></div>}
              <div className="border-t border-border my-2" />
              <div className="flex justify-between text-base"><span className="font-semibold">Total</span><span className="font-display font-bold">{fmtPrice(Number(o.total))}</span></div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // ----------------- LIST VIEW -----------------
  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <Header />
      <main className="container mx-auto max-w-5xl px-4 py-8 md:py-12 flex-1">
        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold">
            {lang === "fr" ? "Mes commandes" : "My orders"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {lang === "fr" ? "Suivi en temps réel · historique complet · reçus téléchargeables" : "Real-time tracking · full history · downloadable receipts"}
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}</div>
        ) : orders.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title={lang === "fr" ? "Aucune commande pour l'instant" : "No orders yet"}
            description={lang === "fr" ? "Explorez le catalogue et passez votre première commande." : "Browse the catalog and place your first order."}
            action={{ label: lang === "fr" ? "Voir le catalogue" : "Browse catalog", onClick: () => navigate("/catalog") }}
          />
        ) : (
          <div className="space-y-3">
            {orders.map((o: any) => {
              const stepI = statusIndex(o.status);
              const progress = o.status === "cancelled" ? 0 : ((stepI + 1) / STEPS.length) * 100;
              return (
                <Card key={o.id} className="border-border/50 hover:shadow-glass transition-all overflow-hidden group">
                  <CardContent className="p-0">
                    <Link to={`/orders/${o.id}`} className="block p-5 md:p-6">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <Package className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold flex items-center gap-2">
                              <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                              {o.id.slice(0, 8).toUpperCase()}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {format(new Date(o.created_at), "PPP", { locale })} · {(o.order_items || []).length} {lang === "fr" ? "article(s)" : "item(s)"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={`${statusBadge(o.status)} rounded-full text-[10px] uppercase`}>{o.status}</Badge>
                          <span className="font-display font-bold text-lg">{fmtPrice(Number(o.total))}</span>
                        </div>
                      </div>

                      {/* Mini progress */}
                      {o.status !== "cancelled" && (
                        <div className="mt-4">
                          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all" style={{ width: `${progress}%` }} />
                          </div>
                          <div className="flex justify-between mt-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                            {STEPS.map((s, i) => (
                              <span key={s.key} className={i <= stepI ? "text-primary font-semibold" : ""}>
                                {lang === "fr" ? s.label_fr.split(" ")[0] : s.label_en.split(" ")[0]}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </Link>
                    <div className="px-5 md:px-6 pb-4 flex gap-2">
                      <Button size="sm" variant="outline" className="rounded-full gap-2" onClick={() => downloadReceipt(o)}>
                        <Download className="h-3.5 w-3.5" />
                        {lang === "fr" ? "Reçu" : "Receipt"}
                      </Button>
                      <Button size="sm" variant="ghost" className="rounded-full ml-auto" asChild>
                        <Link to={`/orders/${o.id}`}>
                          {lang === "fr" ? "Détails →" : "Details →"}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Orders;
