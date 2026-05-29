import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useKitabuPoints } from "@/hooks/useKitabuPoints";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen, ShoppingBag, Heart, Settings, CreditCard, Loader2, Star, Download,
  MessageSquare, Bell, TrendingUp, Shield, Search, Clock, Eye, BarChart3,
  Bookmark, Award, Gift, Globe, ChevronRight, Library, Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const ReaderDashboard = () => {
  const { t, lang } = useLanguage();
  const { format: formatPrice } = useCurrency();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const queryClient = useQueryClient();
  const { data: points } = useKitabuPoints();

  // Data queries
  const { data: orders = [] } = useQuery({
    queryKey: ["my-orders"],
    queryFn: async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) return [];
      const { data } = await supabase.from("orders").select("*, order_items(*, books(*))").eq("user_id", u.id).order("created_at", { ascending: false });
      return data || [];
    },
  });

  const { data: wishlistBooks = [] } = useQuery({
    queryKey: ["my-wishlist"],
    queryFn: async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) return [];
      const { data } = await supabase.from("wishlist").select("*, books(*)").eq("user_id", u.id);
      return data || [];
    },
  });

  const { data: myReviews = [] } = useQuery({
    queryKey: ["my-reviews"],
    queryFn: async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) return [];
      const { data } = await supabase.from("reviews").select("*, books(title, cover_url)").eq("user_id", u.id).order("created_at", { ascending: false });
      return data || [];
    },
  });

  const { data: profile } = useQuery({
    queryKey: ["my-profile"],
    queryFn: async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) return null;
      const { data } = await supabase.from("profiles").select("*").eq("user_id", u.id).maybeSingle();
      return data;
    },
  });

  const { data: recommendations = [] } = useQuery({
    queryKey: ["recommendations"],
    queryFn: async () => {
      const { data } = await supabase.from("books").select("*").eq("status", "published").order("rating", { ascending: false }).limit(10);
      return data || [];
    },
  });

  // Profile form state
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [iban, setIban] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setBankName((profile as any).bank_name || "");
      setBankAccount((profile as any).bank_account_name || "");
      setIban((profile as any).iban || "");
      setPhone((profile as any).phone || "");
      setAddress((profile as any).address || "");
      setDisplayName((profile as any).display_name || "");
    }
  }, [profile]);

  const saveAll = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("profiles").update({
        display_name: displayName,
        bank_name: bankName || null,
        bank_account_name: bankAccount || null,
        iban: iban || null,
        phone: phone || null,
        address: address || null,
      } as any).eq("user_id", user.id);
      if (error) throw error;
      toast.success(lang === "fr" ? "Enregistré !" : "Saved!");
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
    } catch (e: any) { toast.error(e.message); } finally { setSaving(false); }
  };

  // Stats
  const totalBooks = orders.flatMap((o: any) => o.order_items || []).length;
  const totalSpent = orders.reduce((s: number, o: any) => s + (o.total || 0), 0);
  const avgRating = myReviews.length > 0 ? myReviews.reduce((s: number, r: any) => s + r.rating, 0) / myReviews.length : 0;

  const tabs = [
    { id: "overview", icon: BarChart3, label: lang === "fr" ? "Vue d'ensemble" : "Overview" },
    { id: "library", icon: Library, label: lang === "fr" ? "Bibliothèque" : "Library" },
    { id: "orders", icon: ShoppingBag, label: lang === "fr" ? "Commandes" : "Orders" },
    { id: "wishlist", icon: Heart, label: lang === "fr" ? "Favoris" : "Wishlist" },
    { id: "reviews", icon: MessageSquare, label: lang === "fr" ? "Avis" : "Reviews" },
    { id: "recs", icon: Sparkles, label: lang === "fr" ? "Pour vous" : "For You" },
    { id: "downloads", icon: Download, label: lang === "fr" ? "Downloads" : "Downloads" },
    { id: "bank", icon: CreditCard, label: lang === "fr" ? "Paiement" : "Payment" },
    { id: "settings", icon: Settings, label: lang === "fr" ? "Paramètres" : "Settings" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-border bg-card/50">
          {/* User card */}
          <div className="p-5 border-b border-border">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-bold text-lg">
                  {user?.name?.charAt(0)?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-bold text-sm truncate">{user?.name || "Lecteur"}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                <Badge variant="secondary" className="mt-1 text-[10px]">
                  <BookOpen className="h-2.5 w-2.5 mr-1" />
                  {lang === "fr" ? "Lecteur" : "Reader"}
                </Badge>
              </div>
            </div>
            {/* Reading streak */}
            <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-border/50">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium">{lang === "fr" ? "Livres lus" : "Books read"}</span>
                <span className="font-bold text-primary">{totalBooks}</span>
              </div>
              <Progress value={Math.min(totalBooks * 10, 100)} className="h-1.5" />
              <p className="text-[10px] text-muted-foreground mt-1">
                {totalBooks >= 10 ? "🏆 " : ""}{lang === "fr" ? `${10 - Math.min(totalBooks, 10)} pour le badge Or` : `${10 - Math.min(totalBooks, 10)} to Gold badge`}
              </p>
            </div>
          </div>
          {/* Nav */}
          <nav className="p-2 flex lg:flex-col gap-0.5 overflow-x-auto lg:overflow-visible">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <tab.icon className="h-4 w-4 shrink-0" />
                <span>{tab.label}</span>
                {tab.id === "wishlist" && wishlistBooks.length > 0 && (
                  <span className="ml-auto text-[10px] bg-accent text-accent-foreground rounded-full px-1.5 py-0.5">{wishlistBooks.length}</span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-8 max-w-5xl">
          {/* Overview */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold font-display">
                {lang === "fr" ? `Bonjour, ${user?.name?.split(" ")[0] || "Lecteur"} 👋` : `Hello, ${user?.name?.split(" ")[0] || "Reader"} 👋`}
              </h2>
              {/* Stats grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { icon: BookOpen, value: totalBooks, label: lang === "fr" ? "Livres" : "Books", color: "text-primary" },
                  { icon: ShoppingBag, value: orders.length, label: lang === "fr" ? "Commandes" : "Orders", color: "text-accent" },
                  { icon: Award, value: points?.balance ?? 0, label: "Kitabu Points", color: "text-primary" },
                  { icon: Star, value: avgRating.toFixed(1), label: lang === "fr" ? "Note moy." : "Avg Rating", color: "text-primary" },
                ].map((stat, i) => (
                  <Card key={i} className="border-border/50 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <stat.icon className={`h-5 w-5 ${stat.color} mb-2`} />
                      <p className="text-2xl font-extrabold tabular-nums">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {/* Recent orders */}
              {orders.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{lang === "fr" ? "Commandes récentes" : "Recent Orders"}</h3>
                    <button onClick={() => setActiveTab("orders")} className="text-xs text-primary font-medium flex items-center gap-1 hover:underline">
                      {lang === "fr" ? "Tout voir" : "View all"} <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {orders.slice(0, 3).map((order: any) => (
                      <Card key={order.id} className="border-border/50">
                        <CardContent className="flex items-center gap-4 p-4">
                          <div className="flex -space-x-2">
                            {(order.order_items || []).slice(0, 3).map((item: any, i: number) => (
                              item.books?.cover_url ? (
                                <img key={i} src={item.books.cover_url} alt="" className="h-10 w-7 rounded border-2 border-background object-cover" />
                              ) : <div key={i} className="h-10 w-7 rounded bg-secondary border-2 border-background" />
                            ))}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{(order.order_items || []).length} {lang === "fr" ? "articles" : "items"}</p>
                            <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                          <Badge variant="secondary" className="text-[10px]">{order.status}</Badge>
                          <span className="text-sm font-bold text-primary tabular-nums">{formatPrice(order.total)}</span>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              {/* Recommendations preview */}
              {recommendations.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" />{lang === "fr" ? "Recommandé pour vous" : "Recommended for you"}</h3>
                    <button onClick={() => setActiveTab("recs")} className="text-xs text-primary font-medium flex items-center gap-1 hover:underline">
                      {lang === "fr" ? "Tout voir" : "View all"} <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {recommendations.slice(0, 5).map((book: any) => (
                      <Link key={book.id} to={`/book/${book.id}`} className="group">
                        <div className="aspect-[2/3] rounded-lg overflow-hidden bg-secondary shadow-sm group-hover:shadow-md transition-shadow">
                          {book.cover_url ? <img src={book.cover_url} alt={book.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="h-full w-full flex items-center justify-center"><BookOpen className="h-6 w-6 text-muted-foreground/20" /></div>}
                        </div>
                        <p className="text-xs font-medium mt-1.5 truncate">{book.title}</p>
                        <p className="text-xs text-primary font-bold">{formatPrice(book.price)}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Library */}
          {activeTab === "library" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">{lang === "fr" ? "Ma bibliothèque" : "My Library"}</h2>
              {orders.length === 0 ? (
                <div className="text-center py-20">
                  <Library className="h-16 w-16 mx-auto text-muted-foreground/20 mb-4" />
                  <p className="text-muted-foreground mb-4">{lang === "fr" ? "Votre bibliothèque est vide" : "Your library is empty"}</p>
                  <Button asChild className="rounded-full"><Link to="/catalog">{lang === "fr" ? "Explorer le catalogue" : "Browse catalog"}</Link></Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {orders.flatMap((o: any) => o.order_items || []).map((item: any) => (
                    <Card key={item.id} className="overflow-hidden group border-border/50 hover:shadow-lg transition-all">
                      <Link to={`/book/${item.books?.id}`}>
                        <div className="aspect-[2/3] relative">
                          {item.books?.cover_url ? (
                            <img src={item.books.cover_url} alt={item.books?.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="h-full w-full bg-secondary flex items-center justify-center"><BookOpen className="h-8 w-8 text-muted-foreground/20" /></div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                            <Button size="sm" className="rounded-full text-[10px] h-7 w-full gap-1">
                              <Eye className="h-3 w-3" />{lang === "fr" ? "Lire" : "Read"}
                            </Button>
                          </div>
                        </div>
                      </Link>
                      <CardContent className="p-3">
                        <h3 className="font-semibold text-xs truncate">{item.books?.title}</h3>
                        <p className="text-[10px] text-muted-foreground truncate">{item.books?.author_name}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Orders */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">{lang === "fr" ? "Mes commandes" : "My Orders"}</h2>
              {orders.length === 0 ? (
                <p className="text-center py-20 text-muted-foreground">{lang === "fr" ? "Aucune commande" : "No orders"}</p>
              ) : orders.map((order: any) => (
                <Card key={order.id} className="border-border/50 hover:shadow-sm transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <span className="font-mono text-xs text-muted-foreground">#{order.id.slice(0, 8)}</span>
                        <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={order.status === "completed" ? "default" : "secondary"} className="text-[10px]">{order.status}</Badge>
                        <span className="text-lg font-extrabold text-primary tabular-nums">{formatPrice(order.total)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {(order.order_items || []).map((item: any) => (
                        <div key={item.id} className="flex items-center gap-2 bg-secondary/50 rounded-lg p-2 shrink-0">
                          {item.books?.cover_url ? <img src={item.books.cover_url} alt="" className="h-10 w-7 rounded object-cover" /> : <div className="h-10 w-7 rounded bg-secondary" />}
                          <div className="min-w-0">
                            <p className="text-xs font-medium truncate max-w-[120px]">{item.books?.title}</p>
                            <p className="text-[10px] text-muted-foreground">{formatPrice(item.unit_price)} × {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Wishlist */}
          {activeTab === "wishlist" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">{lang === "fr" ? "Mes favoris" : "My Wishlist"}</h2>
              {wishlistBooks.length === 0 ? (
                <div className="text-center py-20">
                  <Heart className="h-16 w-16 mx-auto text-muted-foreground/20 mb-4" />
                  <p className="text-muted-foreground mb-4">{lang === "fr" ? "Liste vide" : "Empty wishlist"}</p>
                  <Button asChild className="rounded-full"><Link to="/catalog">{lang === "fr" ? "Explorer" : "Browse"}</Link></Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {wishlistBooks.map((item: any) => (
                    <Card key={item.id} className="overflow-hidden group border-border/50 hover:shadow-lg transition-all">
                      <Link to={`/book/${item.books?.id}`}>
                        <div className="aspect-[2/3]">
                          {item.books?.cover_url ? <img src={item.books.cover_url} alt={item.books?.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="h-full w-full bg-secondary" />}
                        </div>
                        <CardContent className="p-3">
                          <h3 className="font-semibold text-xs truncate">{item.books?.title}</h3>
                          <p className="text-[10px] text-muted-foreground">{item.books?.author_name}</p>
                          <span className="text-sm font-bold text-primary">{formatPrice(item.books?.price || 0)}</span>
                        </CardContent>
                      </Link>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Reviews */}
          {activeTab === "reviews" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">{lang === "fr" ? "Mes avis" : "My Reviews"}</h2>
              {myReviews.length === 0 ? (
                <p className="text-center py-20 text-muted-foreground">{lang === "fr" ? "Aucun avis" : "No reviews yet"}</p>
              ) : myReviews.map((review: any) => (
                <Card key={review.id} className="border-border/50">
                  <CardContent className="flex gap-4 p-4">
                    <Link to={`/book/${review.book_id}`} className="shrink-0">
                      {review.books?.cover_url ? <img src={review.books.cover_url} alt="" className="h-16 w-11 rounded object-cover" /> : <div className="h-16 w-11 rounded bg-secondary" />}
                    </Link>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">{review.books?.title || "—"}</h4>
                      <div className="flex gap-0.5 my-1">{[...Array(5)].map((_, i) => <Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-primary text-primary" : "text-border"}`} />)}</div>
                      {review.comment && <p className="text-xs text-muted-foreground line-clamp-2">{review.comment}</p>}
                      <p className="text-[10px] text-muted-foreground mt-1">{new Date(review.created_at).toLocaleDateString()}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Recommendations */}
          {activeTab === "recs" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" />{lang === "fr" ? "Recommandé pour vous" : "Recommended for you"}</h2>
              <p className="text-sm text-muted-foreground">{lang === "fr" ? "Basé sur les meilleures notes et tendances." : "Based on top ratings and trends."}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {recommendations.map((book: any) => (
                  <Card key={book.id} className="overflow-hidden group border-border/50 hover:shadow-lg transition-all">
                    <Link to={`/book/${book.id}`}>
                      <div className="aspect-[2/3]">
                        {book.cover_url ? <img src={book.cover_url} alt={book.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="h-full w-full bg-secondary flex items-center justify-center"><BookOpen className="h-8 w-8 text-muted-foreground/20" /></div>}
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-semibold text-xs truncate">{book.title}</h3>
                        <p className="text-[10px] text-muted-foreground">{book.author_name}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 fill-primary text-primary" />
                          <span className="text-xs font-bold">{book.rating?.toFixed(1) || "—"}</span>
                        </div>
                        <span className="text-sm font-bold text-primary">{formatPrice(book.price)}</span>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Downloads */}
          {activeTab === "downloads" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">{lang === "fr" ? "Téléchargements" : "Downloads"}</h2>
              <p className="text-sm text-muted-foreground">{lang === "fr" ? "Vos e-books achetés." : "Your purchased e-books."}</p>
              {orders.flatMap((o: any) => o.order_items || []).filter((item: any) => item.books?.format !== "paperback").length === 0 ? (
                <p className="text-center py-20 text-muted-foreground">{lang === "fr" ? "Aucun e-book" : "No e-books"}</p>
              ) : orders.flatMap((o: any) => o.order_items || []).filter((item: any) => item.books?.format !== "paperback").map((item: any) => (
                <Card key={item.id} className="border-border/50">
                  <CardContent className="flex items-center gap-4 p-4">
                    {item.books?.cover_url ? <img src={item.books.cover_url} alt="" className="h-14 w-10 rounded object-cover" /> : <div className="h-14 w-10 rounded bg-secondary" />}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">{item.books?.title}</h4>
                      <p className="text-xs text-muted-foreground">{item.books?.format === "both" ? "E-book + Broché" : "E-book"}</p>
                    </div>
                    <Button size="sm" className="rounded-full gap-1.5">
                      <Download className="h-3.5 w-3.5" />{lang === "fr" ? "Télécharger" : "Download"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Bank info */}
          {activeTab === "bank" && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-xl font-bold">{lang === "fr" ? "Informations de paiement" : "Payment Information"}</h2>
              <Card className="border-border/50">
                <CardContent className="p-6 space-y-4">
                  <p className="text-xs text-muted-foreground">{lang === "fr" ? "Ces informations sont utilisées pour les transactions." : "Used for transactions."}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5"><Label className="text-xs">{lang === "fr" ? "Banque" : "Bank"}</Label><Input value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="Rawbank, Equity..." /></div>
                    <div className="space-y-1.5"><Label className="text-xs">{lang === "fr" ? "Titulaire" : "Holder"}</Label><Input value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} /></div>
                  </div>
                  <div className="space-y-1.5"><Label className="text-xs">IBAN / N° compte</Label><Input value={iban} onChange={(e) => setIban(e.target.value)} placeholder="CD XX XXXX..." /></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5"><Label className="text-xs">{lang === "fr" ? "Téléphone" : "Phone"}</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+243..." /></div>
                    <div className="space-y-1.5"><Label className="text-xs">{lang === "fr" ? "Adresse" : "Address"}</Label><Input value={address} onChange={(e) => setAddress(e.target.value)} /></div>
                  </div>
                  <Button onClick={saveAll} disabled={saving} className="rounded-full">
                    {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}{lang === "fr" ? "Enregistrer" : "Save"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Settings */}
          {activeTab === "settings" && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-xl font-bold">{lang === "fr" ? "Paramètres" : "Settings"}</h2>
              <Card className="border-border/50">
                <CardHeader><CardTitle className="text-base">{lang === "fr" ? "Mon profil" : "My Profile"}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="text-xl bg-primary/10 text-primary">{user?.name?.charAt(0)?.toUpperCase() || "?"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <div className="space-y-1.5"><Label className="text-xs">{lang === "fr" ? "Nom d'affichage" : "Display Name"}</Label><Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} /></div>
                  <div className="space-y-1.5"><Label className="text-xs">Email</Label><Input defaultValue={user?.email || ""} disabled /></div>
                  <Button className="rounded-full" onClick={saveAll} disabled={saving}>
                    {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}{lang === "fr" ? "Enregistrer" : "Save"}
                  </Button>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Shield className="h-4 w-4" />{lang === "fr" ? "Sécurité" : "Security"}</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{lang === "fr" ? "Pour changer votre mot de passe, utilisez 'Mot de passe oublié' sur la page de connexion." : "Use 'Forgot Password' on the login page to change your password."}</p>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ReaderDashboard;
