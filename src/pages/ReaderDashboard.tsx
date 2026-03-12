import { useState } from "react";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockBooks } from "@/data/mockBooks";
import { BookOpen, ShoppingBag, Heart, Settings, Download, Headphones, Play, Upload, Star, Clock, CheckCircle } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

const sidebarItems = [
  { key: "reader.library", icon: BookOpen, tab: "library" },
  { key: "reader.orders", icon: ShoppingBag, tab: "orders" },
  { key: "reader.wishlist", icon: Heart, tab: "wishlist" },
  { key: "reader.settings", icon: Settings, tab: "settings" },
];

const ReaderDashboard = () => {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("library");

  const purchasedBooks = mockBooks.slice(0, 5);
  const wishlistBooks = mockBooks.slice(5, 10);

  // Mock reading progress
  const readingProgress: Record<string, number> = {
    "1": 72,
    "2": 35,
    "3": 100,
    "4": 10,
    "5": 0,
  };

  const actionForType = (type: string) => {
    if (type === "audio") return { icon: Headphones, label: t("reader.listen") };
    if (type === "ebook" || type === "bd") return { icon: Play, label: t("reader.startreading") };
    return { icon: Download, label: t("reader.download") };
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar collapsible="icon">
            <SidebarContent className="pt-4">
              <SidebarGroup>
                <SidebarGroupLabel>{t("nav.dashboard")}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {sidebarItems.map((item) => (
                      <SidebarMenuItem key={item.tab}>
                        <SidebarMenuButton
                          isActive={activeTab === item.tab}
                          onClick={() => setActiveTab(item.tab)}
                          className="cursor-pointer"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{t(item.key)}</span>
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
              <h1 className="text-2xl font-bold md:text-3xl">
                {t(sidebarItems.find((i) => i.tab === activeTab)?.key || "")}
              </h1>
            </div>

            {/* Library */}
            {activeTab === "library" && (
              <div className="space-y-6">
                <p className="text-muted-foreground">{t("reader.welcome")}</p>

                <Tabs defaultValue="reading" className="w-full">
                  <TabsList>
                    <TabsTrigger value="reading">{t("reader.reading")}</TabsTrigger>
                    <TabsTrigger value="finished">{t("reader.finished")}</TabsTrigger>
                  </TabsList>

                  <TabsContent value="reading" className="space-y-4 mt-4">
                    {purchasedBooks.filter(b => (readingProgress[b.id] || 0) < 100 && (readingProgress[b.id] || 0) > 0).map((book) => {
                      const progress = readingProgress[book.id] || 0;
                      const action = actionForType(book.type);
                      return (
                        <Card key={book.id} className="overflow-hidden">
                          <CardContent className="flex gap-4 p-4">
                            <img src={book.cover} alt={book.title} className="h-28 w-20 rounded-lg object-cover shrink-0" />
                            <div className="flex-1 min-w-0 space-y-2">
                              <h3 className="font-semibold">{book.title}</h3>
                              <p className="text-sm text-muted-foreground">{book.author}</p>
                              <Badge variant="secondary" className="text-[10px]">{t(`filter.${book.type}`)}</Badge>
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                              </div>
                            </div>
                            <Button size="sm" className="rounded-full gap-1 shrink-0 self-center">
                              <action.icon className="h-3 w-3" />
                              {action.label}
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </TabsContent>

                  <TabsContent value="finished" className="space-y-4 mt-4">
                    {purchasedBooks.filter(b => (readingProgress[b.id] || 0) >= 100).map((book) => (
                      <Card key={book.id} className="overflow-hidden">
                        <CardContent className="flex gap-4 p-4">
                          <img src={book.cover} alt={book.title} className="h-20 w-14 rounded-lg object-cover shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold">{book.title}</h3>
                            <p className="text-sm text-muted-foreground">{book.author}</p>
                            <div className="flex items-center gap-1 mt-1 text-savanna">
                              <CheckCircle className="h-3 w-3" />
                              <span className="text-xs font-medium">{t("reader.finished")}</span>
                            </div>
                          </div>
                          <div className="flex gap-1 shrink-0 self-center">
                            {[1,2,3,4,5].map((s) => (
                              <Star key={s} className="h-4 w-4 text-primary/30 hover:text-primary cursor-pointer transition-colors" />
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                </Tabs>

                {/* Not started */}
                <div>
                  <h3 className="font-semibold mb-3 text-muted-foreground text-sm uppercase tracking-wider">Non commencés</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {purchasedBooks.filter(b => (readingProgress[b.id] || 0) === 0).map((book) => (
                      <Card key={book.id} className="overflow-hidden">
                        <div className="aspect-[2/3]">
                          <img src={book.cover} alt={book.title} className="h-full w-full object-cover" />
                        </div>
                        <CardContent className="p-3">
                          <h3 className="font-semibold text-sm truncate">{book.title}</h3>
                          <p className="text-xs text-muted-foreground">{book.author}</p>
                          <Button size="sm" variant="outline" className="w-full mt-2 rounded-full text-xs">
                            {t("reader.startreading")}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Orders */}
            {activeTab === "orders" && (
              <div className="space-y-4">
                {[
                  { id: "KS-2024-001", books: 3, total: 39.97, date: "15 mars 2024", status: "delivered" },
                  { id: "KS-2024-002", books: 1, total: 14.99, date: "20 mars 2024", status: "processing" },
                  { id: "KS-2024-003", books: 2, total: 27.98, date: "5 avril 2024", status: "delivered" },
                  { id: "KS-2024-004", books: 4, total: 52.96, date: "12 avril 2024", status: "pending" },
                ].map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">Commande #{order.id}</span>
                        <Badge className={
                          order.status === "delivered" ? "bg-savanna/10 text-savanna" :
                          order.status === "processing" ? "bg-primary/10 text-primary" :
                          "bg-muted text-muted-foreground"
                        }>
                          {order.status === "delivered" ? "Livré" : order.status === "processing" ? "En cours" : "En attente"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.books} {order.books > 1 ? "livres" : "livre"} · ${order.total.toFixed(2)} · {order.date}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm" className="rounded-full text-xs">Voir détails</Button>
                        {order.status === "delivered" && (
                          <Button variant="ghost" size="sm" className="rounded-full text-xs gap-1">
                            <Download className="h-3 w-3" /> Facture
                          </Button>
                        )}
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
                    <p className="text-muted-foreground">Votre liste de souhaits est vide</p>
                    <Button asChild className="mt-4 rounded-full">
                      <Link to="/catalog">{t("cart.continue")}</Link>
                    </Button>
                  </div>
                ) : (
                  wishlistBooks.map((book) => (
                    <Card key={book.id}>
                      <CardContent className="flex gap-4 p-4">
                        <img src={book.cover} alt={book.title} className="h-20 w-14 rounded-lg object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold">{book.title}</h3>
                          <p className="text-sm text-muted-foreground">{book.author}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-primary font-bold">${book.price.toFixed(2)}</span>
                            <Badge variant="secondary" className="text-[10px]">{t(`filter.${book.type}`)}</Badge>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          <Button size="sm" className="rounded-full">{t("book.addtocart")}</Button>
                          <Button size="sm" variant="ghost" className="text-destructive">{t("common.delete")}</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}

            {/* Settings */}
            {activeTab === "settings" && (
              <div className="space-y-6 max-w-2xl">
                <Card>
                  <CardHeader><CardTitle>Mon profil</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="text-xl bg-primary/10 text-primary">
                          {user?.name?.charAt(0)?.toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <Button variant="outline" size="sm" className="gap-2 rounded-full">
                        <Upload className="h-4 w-4" />
                        Changer la photo
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label>{t("auth.name")}</Label>
                      <Input defaultValue={user?.name || ""} className="rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("auth.email")}</Label>
                      <Input defaultValue={user?.email || ""} disabled className="rounded-lg" />
                    </div>
                    <Button className="rounded-full">{t("common.save")}</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle>Préférences de lecture</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Personnalisez votre expérience de lecture.
                    </p>
                    <div className="space-y-2">
                      <Label>Langue préférée</Label>
                      <Input defaultValue="Français" className="rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label>Genres favoris</Label>
                      <Input defaultValue="Roman, Conte, BD" className="rounded-lg" />
                    </div>
                    <Button className="rounded-full">{t("common.save")}</Button>
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
