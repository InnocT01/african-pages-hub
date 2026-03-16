import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, ShoppingBag, Heart, Settings, CreditCard, Loader2, Star, Download, MessageSquare, Bell, Gift, Target, Clock, TrendingUp, Shield, Globe } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const sidebarItems = [
  { key: "reader.library", icon: BookOpen, tab: "library" },
  { key: "reader.orders", icon: ShoppingBag, tab: "orders" },
  { key: "reader.wishlist", icon: Heart, tab: "wishlist" },
  { key: "reader.reviews_mine", icon: MessageSquare, tab: "myreviews" },
  { key: "reader.stats", icon: TrendingUp, tab: "stats" },
  { key: "reader.recommendations", icon: Star, tab: "recs" },
  { key: "reader.downloads", icon: Download, tab: "downloads" },
  { key: "reader.notifications", icon: Bell, tab: "notifs" },
  { key: "checkout.card", icon: CreditCard, tab: "bank" },
  { key: "reader.settings", icon: Settings, tab: "settings" },
];

const ReaderDashboard = () => {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("library");
  const queryClient = useQueryClient();

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

  // Bank info state
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [iban, setIban] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [savingBank, setSavingBank] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

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

  const saveBankInfo = async () => {
    if (!user) return;
    setSavingBank(true);
    try {
      const { error } = await supabase.from("profiles").update({
        bank_name: bankName || null,
        bank_account_name: bankAccount || null,
        iban: iban || null,
        phone: phone || null,
        address: address || null,
      } as any).eq("user_id", user.id);
      if (error) throw error;
      toast.success(lang === "fr" ? "Informations enregistrées" : "Information saved");
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
    } catch (e: any) { toast.error(e.message); } finally { setSavingBank(false); }
  };

  const saveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    try {
      const { error } = await supabase.from("profiles").update({ display_name: displayName } as any).eq("user_id", user.id);
      if (error) throw error;
      toast.success(lang === "fr" ? "Profil mis à jour" : "Profile updated");
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
    } catch (e: any) { toast.error(e.message); } finally { setSavingProfile(false); }
  };

  // Computed stats
  const totalBooks = orders.flatMap((o: any) => o.order_items || []).length;
  const totalSpent = orders.reduce((s: number, o: any) => s + (o.total || 0), 0);
  const avgRatingGiven = myReviews.length > 0 ? myReviews.reduce((s: number, r: any) => s + r.rating, 0) / myReviews.length : 0;

  const getTabLabel = (tab: string) => {
    const map: Record<string, string> = {
      library: lang === "fr" ? "Ma bibliothèque" : "My Library",
      orders: lang === "fr" ? "Mes commandes" : "My Orders",
      wishlist: lang === "fr" ? "Liste de souhaits" : "Wishlist",
      myreviews: lang === "fr" ? "Mes avis" : "My Reviews",
      stats: lang === "fr" ? "Mes statistiques" : "My Stats",
      recs: lang === "fr" ? "Recommandations" : "Recommendations",
      downloads: lang === "fr" ? "Téléchargements" : "Downloads",
      notifs: lang === "fr" ? "Notifications" : "Notifications",
      bank: lang === "fr" ? "Infos bancaires" : "Bank Info",
      settings: lang === "fr" ? "Paramètres" : "Settings",
    };
    return map[tab] || tab;
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar collapsible="icon">
            <SidebarContent className="pt-4">
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs">{t("nav.dashboard")}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {sidebarItems.map((item) => (
                      <SidebarMenuItem key={item.tab}>
                        <SidebarMenuButton isActive={activeTab === item.tab} onClick={() => setActiveTab(item.tab)} className="cursor-pointer">
                          <item.icon className="h-4 w-4" /><span>{getTabLabel(item.tab)}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>

          <main className="flex-1 p-4 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <SidebarTrigger />
              <h1 className="text-2xl font-bold md:text-3xl">{getTabLabel(activeTab)}</h1>
            </div>

            {/* Library */}
            {activeTab === "library" && (
              <div className="space-y-6">
                {orders.length === 0 ? (
                  <div className="text-center py-16">
                    <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/20 mb-4" />
                    <p className="text-muted-foreground">{t("reader.nobooks")}</p>
                    <Button asChild className="mt-4 rounded-full"><Link to="/catalog">{t("cart.continue")}</Link></Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {orders.flatMap((o: any) => o.order_items || []).map((item: any) => (
                      <Card key={item.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                        <div className="aspect-[2/3]">
                          {item.books?.cover_url ? (
                            <img src={item.books.cover_url} alt={item.books?.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="h-full w-full bg-secondary flex items-center justify-center"><BookOpen className="h-8 w-8 text-muted-foreground/20" /></div>
                          )}
                        </div>
                        <CardContent className="p-3">
                          <h3 className="font-semibold text-sm truncate">{item.books?.title}</h3>
                          <div className="flex gap-1.5 mt-2">
                            <Button size="sm" variant="default" className="flex-1 rounded-full text-[10px] h-7">{t("reader.startreading")}</Button>
                            <Button size="sm" variant="outline" className="rounded-full text-[10px] h-7"><Download className="h-3 w-3" /></Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Orders */}
            {activeTab === "orders" && (
              <div className="space-y-3">
                {orders.length === 0 ? (
                  <p className="text-center py-16 text-muted-foreground">{lang === "fr" ? "Aucune commande" : "No orders"}</p>
                ) : orders.map((order: any) => (
                  <Card key={order.id} className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-mono text-xs text-muted-foreground">#{order.id.slice(0, 8)}</span>
                        <Badge variant="secondary" className="text-[10px]">{order.status}</Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          {(order.order_items || []).slice(0, 3).map((item: any, i: number) => (
                            item.books?.cover_url ? (
                              <img key={i} src={item.books.cover_url} alt="" className="h-10 w-7 rounded border-2 border-background object-cover" />
                            ) : <div key={i} className="h-10 w-7 rounded bg-secondary border-2 border-background" />
                          ))}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{(order.order_items || []).length} {lang === "fr" ? "articles" : "items"}</p>
                          <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <span className="text-lg font-extrabold text-primary tabular-nums">${order.total.toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Wishlist */}
            {activeTab === "wishlist" && (
              <div className="space-y-3">
                {wishlistBooks.length === 0 ? (
                  <div className="text-center py-16">
                    <Heart className="h-16 w-16 mx-auto text-muted-foreground/20 mb-4" />
                    <p className="text-muted-foreground">{lang === "fr" ? "Votre liste de souhaits est vide" : "Your wishlist is empty"}</p>
                    <Button asChild className="mt-4 rounded-full"><Link to="/catalog">{t("cart.continue")}</Link></Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {wishlistBooks.map((item: any) => (
                      <Card key={item.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                        <Link to={`/book/${item.books?.id}`}>
                          <div className="aspect-[3/4]">
                            {item.books?.cover_url ? (
                              <img src={item.books.cover_url} alt={item.books?.title} className="h-full w-full object-cover" />
                            ) : <div className="h-full w-full bg-secondary" />}
                          </div>
                          <CardContent className="p-3">
                            <h3 className="font-semibold text-sm truncate">{item.books?.title}</h3>
                            <span className="text-primary font-bold text-sm">${item.books?.price?.toFixed(2)}</span>
                          </CardContent>
                        </Link>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* My Reviews */}
            {activeTab === "myreviews" && (
              <div className="space-y-3">
                {myReviews.length === 0 ? (
                  <p className="text-center py-16 text-muted-foreground">{lang === "fr" ? "Vous n'avez pas encore laissé d'avis" : "You haven't left any reviews yet"}</p>
                ) : myReviews.map((review: any) => (
                  <Card key={review.id}>
                    <CardContent className="flex gap-3 p-4">
                      {review.books?.cover_url ? <img src={review.books.cover_url} alt="" className="h-14 w-10 rounded object-cover shrink-0" /> : <div className="h-14 w-10 rounded bg-secondary shrink-0" />}
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

            {/* Stats */}
            {activeTab === "stats" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Card><CardContent className="p-4"><BookOpen className="h-4 w-4 text-primary mb-2" /><p className="text-xl font-extrabold">{totalBooks}</p><p className="text-xs text-muted-foreground">{lang === "fr" ? "Livres achetés" : "Books Purchased"}</p></CardContent></Card>
                  <Card><CardContent className="p-4"><ShoppingBag className="h-4 w-4 text-accent mb-2" /><p className="text-xl font-extrabold">{orders.length}</p><p className="text-xs text-muted-foreground">{lang === "fr" ? "Commandes" : "Orders"}</p></CardContent></Card>
                  <Card><CardContent className="p-4"><CreditCard className="h-4 w-4 text-foreground mb-2" /><p className="text-xl font-extrabold">${totalSpent.toFixed(0)}</p><p className="text-xs text-muted-foreground">{lang === "fr" ? "Total dépensé" : "Total Spent"}</p></CardContent></Card>
                  <Card><CardContent className="p-4"><Star className="h-4 w-4 text-accent mb-2" /><p className="text-xl font-extrabold">{avgRatingGiven.toFixed(1)}</p><p className="text-xs text-muted-foreground">{lang === "fr" ? "Note moy. donnée" : "Avg Rating Given"}</p></CardContent></Card>
                </div>
                <Card><CardContent className="p-4"><MessageSquare className="h-4 w-4 text-primary mb-2" /><p className="text-xl font-extrabold">{myReviews.length}</p><p className="text-xs text-muted-foreground">{lang === "fr" ? "Avis laissés" : "Reviews Left"}</p></CardContent></Card>
                <Card><CardContent className="p-4"><Heart className="h-4 w-4 text-destructive mb-2" /><p className="text-xl font-extrabold">{wishlistBooks.length}</p><p className="text-xs text-muted-foreground">{lang === "fr" ? "Dans la wishlist" : "In Wishlist"}</p></CardContent></Card>
              </div>
            )}

            {/* Recommendations */}
            {activeTab === "recs" && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{lang === "fr" ? "Basé sur les meilleures notes et les tendances." : "Based on top ratings and trends."}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {recommendations.map((book: any) => (
                    <Card key={book.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                      <Link to={`/book/${book.id}`}>
                        <div className="aspect-[3/4]">
                          {book.cover_url ? <img src={book.cover_url} alt={book.title} className="h-full w-full object-cover" /> : <div className="h-full w-full bg-secondary flex items-center justify-center"><BookOpen className="h-8 w-8 text-muted-foreground/20" /></div>}
                        </div>
                        <CardContent className="p-3">
                          <h3 className="font-semibold text-sm truncate">{book.title}</h3>
                          <p className="text-xs text-muted-foreground">{book.author_name}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-3 w-3 fill-primary text-primary" />
                            <span className="text-xs font-bold">{book.rating?.toFixed(1) || "—"}</span>
                          </div>
                          <span className="text-sm font-bold text-primary">${book.price?.toFixed(2)}</span>
                        </CardContent>
                      </Link>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Downloads */}
            {activeTab === "downloads" && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">{lang === "fr" ? "Vos livres numériques achetés sont disponibles en téléchargement." : "Your purchased e-books are available for download."}</p>
                {orders.flatMap((o: any) => o.order_items || []).filter((item: any) => item.books?.format !== "paperback").length === 0 ? (
                  <p className="text-center py-16 text-muted-foreground">{lang === "fr" ? "Aucun e-book" : "No e-books"}</p>
                ) : orders.flatMap((o: any) => o.order_items || []).filter((item: any) => item.books?.format !== "paperback").map((item: any) => (
                  <Card key={item.id}>
                    <CardContent className="flex items-center gap-3 p-4">
                      {item.books?.cover_url ? <img src={item.books.cover_url} alt="" className="h-12 w-8 rounded object-cover" /> : <div className="h-12 w-8 rounded bg-secondary" />}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{item.books?.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.books?.format === "both" ? "E-book + Broché" : "E-book"}</p>
                      </div>
                      <Button size="sm" className="rounded-full gap-1"><Download className="h-3 w-3" />{lang === "fr" ? "Télécharger" : "Download"}</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Notifications */}
            {activeTab === "notifs" && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{lang === "fr" ? "Vos notifications récentes." : "Your recent notifications."}</p>
                <Card className="bg-secondary"><CardContent className="p-6 text-center text-muted-foreground text-sm">{lang === "fr" ? "Aucune notification pour le moment." : "No notifications yet."}</CardContent></Card>
                <Card>
                  <CardHeader><CardTitle className="text-base">{lang === "fr" ? "Préférences" : "Preferences"}</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <span className="text-sm">{lang === "fr" ? "Nouveaux livres d'auteurs favoris" : "New books from favorite authors"}</span>
                      <Badge variant="secondary">✓</Badge>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <span className="text-sm">{lang === "fr" ? "Promotions et réductions" : "Promotions and discounts"}</span>
                      <Badge variant="secondary">✓</Badge>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm">{lang === "fr" ? "Newsletter hebdomadaire" : "Weekly newsletter"}</span>
                      <Badge variant="secondary">✓</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Bank info */}
            {activeTab === "bank" && (
              <div className="space-y-6 max-w-2xl">
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2 text-base"><CreditCard className="h-4 w-4" />{lang === "fr" ? "Informations bancaires" : "Bank Information"}</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-xs text-muted-foreground">{lang === "fr" ? "Ces informations sont utilisées pour les transactions et les virements." : "This information is used for transactions and transfers."}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2"><Label className="text-xs">{lang === "fr" ? "Nom de la banque" : "Bank Name"}</Label><Input value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="Rawbank, Equity Bank..." className="h-9" /></div>
                      <div className="space-y-2"><Label className="text-xs">{lang === "fr" ? "Nom du titulaire" : "Account Holder"}</Label><Input value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} className="h-9" /></div>
                    </div>
                    <div className="space-y-2"><Label className="text-xs">IBAN / {lang === "fr" ? "Numéro de compte" : "Account Number"}</Label><Input value={iban} onChange={(e) => setIban(e.target.value)} placeholder="CD XX XXXX XXXX XXXX XXXX" className="h-9" /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2"><Label className="text-xs">{lang === "fr" ? "Téléphone" : "Phone"}</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+243..." className="h-9" /></div>
                      <div className="space-y-2"><Label className="text-xs">{lang === "fr" ? "Adresse" : "Address"}</Label><Input value={address} onChange={(e) => setAddress(e.target.value)} className="h-9" /></div>
                    </div>
                    <Button onClick={saveBankInfo} disabled={savingBank} className="rounded-full">
                      {savingBank ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}{t("common.save")}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Settings */}
            {activeTab === "settings" && (
              <div className="space-y-6 max-w-2xl">
                <Card>
                  <CardHeader><CardTitle className="text-base">{lang === "fr" ? "Mon profil" : "My Profile"}</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="text-xl bg-primary/10 text-primary">{user?.name?.charAt(0)?.toUpperCase() || "?"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                    <div className="space-y-2"><Label className="text-xs">{t("auth.name")}</Label><Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="h-9" /></div>
                    <div className="space-y-2"><Label className="text-xs">{t("auth.email")}</Label><Input defaultValue={user?.email || ""} disabled className="h-9" /></div>
                    <Button className="rounded-full" onClick={saveProfile} disabled={savingProfile}>
                      {savingProfile ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}{t("common.save")}
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-base flex items-center gap-2"><Shield className="h-4 w-4" />{lang === "fr" ? "Sécurité" : "Security"}</CardTitle></CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">{lang === "fr" ? "Pour changer votre mot de passe, utilisez la fonctionnalité 'Mot de passe oublié' sur la page de connexion." : "To change your password, use the 'Forgot Password' feature on the login page."}</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ReaderDashboard;
