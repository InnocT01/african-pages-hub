import { useState } from "react";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, ShoppingBag, Heart, Settings, Download, Upload } from "lucide-react";
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
                        <SidebarMenuButton isActive={activeTab === item.tab} onClick={() => setActiveTab(item.tab)} className="cursor-pointer">
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
              <h1 className="text-2xl font-bold md:text-3xl">{t(sidebarItems.find((i) => i.tab === activeTab)?.key || "")}</h1>
            </div>

            {activeTab === "library" && (
              <div className="space-y-6">
                <p className="text-muted-foreground">{t("reader.welcome")}</p>
                {orders.length === 0 ? (
                  <div className="text-center py-16">
                    <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/20 mb-4" />
                    <p className="text-muted-foreground">{t("reader.nobooks")}</p>
                    <Button asChild className="mt-4 rounded-full"><Link to="/catalog">{t("cart.continue")}</Link></Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {orders.flatMap((o: any) => o.order_items || []).map((item: any) => (
                      <Card key={item.id} className="overflow-hidden">
                        <div className="aspect-[2/3]">
                          {item.books?.cover_url ? (
                            <img src={item.books.cover_url} alt={item.books?.title} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full bg-muted flex items-center justify-center"><BookOpen className="h-8 w-8 text-muted-foreground/20" /></div>
                          )}
                        </div>
                        <CardContent className="p-3">
                          <h3 className="font-semibold text-sm truncate">{item.books?.title}</h3>
                          <Button size="sm" variant="outline" className="w-full mt-2 rounded-full text-xs">{t("reader.startreading")}</Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "orders" && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <p className="text-center py-16 text-muted-foreground">{lang === "fr" ? "Aucune commande" : "No orders"}</p>
                ) : orders.map((order: any) => (
                  <Card key={order.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-sm">#{order.id.slice(0, 8)}</span>
                        <Badge className={order.status === "completed" ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {(order.order_items || []).length} {lang === "fr" ? "articles" : "items"} · ${order.total.toFixed(2)} · {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === "wishlist" && (
              <div className="space-y-3">
                {wishlistBooks.length === 0 ? (
                  <div className="text-center py-16">
                    <Heart className="h-16 w-16 mx-auto text-muted-foreground/20 mb-4" />
                    <p className="text-muted-foreground">{lang === "fr" ? "Votre liste de souhaits est vide" : "Your wishlist is empty"}</p>
                    <Button asChild className="mt-4 rounded-full"><Link to="/catalog">{t("cart.continue")}</Link></Button>
                  </div>
                ) : wishlistBooks.map((item: any) => (
                  <Card key={item.id}>
                    <CardContent className="flex gap-4 p-4">
                      {item.books?.cover_url ? (
                        <img src={item.books.cover_url} alt={item.books?.title} className="h-20 w-14 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="h-20 w-14 rounded-lg bg-muted shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold">{item.books?.title}</h3>
                        <span className="text-primary font-bold">${item.books?.price?.toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6 max-w-2xl">
                <Card>
                  <CardHeader><CardTitle>{lang === "fr" ? "Mon profil" : "My Profile"}</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="text-xl bg-primary/10 text-primary">{user?.name?.charAt(0)?.toUpperCase() || "?"}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="space-y-2">
                      <Label>{t("auth.name")}</Label>
                      <Input defaultValue={user?.name || ""} />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("auth.email")}</Label>
                      <Input defaultValue={user?.email || ""} disabled />
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
