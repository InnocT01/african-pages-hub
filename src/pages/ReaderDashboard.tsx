import { useState } from "react";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockBooks } from "@/data/mockBooks";
import { BookOpen, ShoppingBag, Heart, Settings } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
} from "@/components/ui/sidebar";

const sidebarItems = [
  { key: "reader.library", icon: BookOpen, tab: "library" },
  { key: "reader.orders", icon: ShoppingBag, tab: "orders" },
  { key: "reader.wishlist", icon: Heart, tab: "wishlist" },
  { key: "reader.settings", icon: Settings, tab: "settings" },
];

const ReaderDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("library");

  const purchasedBooks = mockBooks.slice(0, 3);
  const wishlistBooks = mockBooks.slice(5, 8);

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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {purchasedBooks.map((book) => (
                  <Card key={book.id} className="overflow-hidden">
                    <div className="aspect-[2/3]">
                      <img src={book.cover} alt={book.title} className="h-full w-full object-cover" />
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-semibold text-sm truncate">{book.title}</h3>
                      <p className="text-xs text-muted-foreground">{book.author}</p>
                      <Button size="sm" variant="outline" className="w-full mt-2 rounded-full text-xs">Lire</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Orders */}
            {activeTab === "orders" && (
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Commande #KS-2024-001</span>
                      <span className="text-xs text-savanna font-medium bg-savanna/10 px-2 py-1 rounded-full">Livré</span>
                    </div>
                    <p className="text-sm text-muted-foreground">3 livres · $39.97 · 15 mars 2024</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Commande #KS-2024-002</span>
                      <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">En cours</span>
                    </div>
                    <p className="text-sm text-muted-foreground">1 livre · $14.99 · 20 mars 2024</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Wishlist */}
            {activeTab === "wishlist" && (
              <div className="space-y-3">
                {wishlistBooks.map((book) => (
                  <Card key={book.id}>
                    <CardContent className="flex gap-4 p-4">
                      <img src={book.cover} alt={book.title} className="h-20 w-14 rounded-lg object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold">{book.title}</h3>
                        <p className="text-sm text-muted-foreground">{book.author}</p>
                        <p className="text-primary font-bold mt-1">${book.price.toFixed(2)}</p>
                      </div>
                      <Button size="sm" className="rounded-full shrink-0">{t("book.addtocart")}</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Settings */}
            {activeTab === "settings" && (
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label>{t("auth.name")}</Label>
                    <Input defaultValue={user?.name || ""} className="rounded-lg" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("auth.email")}</Label>
                    <Input defaultValue={user?.email || ""} className="rounded-lg" />
                  </div>
                  <Button className="rounded-full">{t("common.save")}</Button>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ReaderDashboard;
