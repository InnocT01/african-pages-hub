import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockBooks, origins, genres, contentTypes } from "@/data/mockBooks";
import { BarChart3, BookOpen, Upload, Settings, TrendingUp, Eye, DollarSign, Menu } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import Header from "@/components/Header";

const sidebarItems = [
  { key: "creator.overview", icon: BarChart3, tab: "overview" },
  { key: "creator.mybooks", icon: BookOpen, tab: "books" },
  { key: "creator.upload", icon: Upload, tab: "upload" },
  { key: "creator.analytics", icon: TrendingUp, tab: "analytics" },
  { key: "creator.settings", icon: Settings, tab: "settings" },
];

const CreatorDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const myBooks = mockBooks.slice(0, 4);

  // Mock stats
  const stats = [
    { key: "creator.revenue", value: "$2,847", icon: DollarSign, change: "+12%" },
    { key: "creator.sales", value: "142", icon: TrendingUp, change: "+8%" },
    { key: "creator.views", value: "3,284", icon: Eye, change: "+23%" },
    { key: "creator.books", value: "4", icon: BookOpen, change: "" },
  ];

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
                {sidebarItems.find((i) => i.tab === activeTab)?.key ? t(sidebarItems.find((i) => i.tab === activeTab)!.key) : ""}
              </h1>
            </div>

            {/* Overview */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stats.map((s) => (
                    <Card key={s.key}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <s.icon className="h-5 w-5 text-muted-foreground" />
                          {s.change && <span className="text-xs text-savanna font-medium">{s.change}</span>}
                        </div>
                        <p className="text-2xl font-bold tabular-nums">{s.value}</p>
                        <p className="text-xs text-muted-foreground">{t(s.key)}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Card>
                  <CardHeader><CardTitle>{t("creator.analytics")}</CardTitle></CardHeader>
                  <CardContent>
                    <div className="h-48 flex items-center justify-center text-muted-foreground rounded-lg bg-muted/50">
                      <BarChart3 className="h-10 w-10 mr-2 opacity-30" />
                      <span className="text-sm">Graphique des ventes (données simulées)</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* My Books */}
            {activeTab === "books" && (
              <div className="space-y-4">
                {myBooks.map((book) => (
                  <Card key={book.id}>
                    <CardContent className="flex gap-4 p-4">
                      <img src={book.cover} alt={book.title} className="h-20 w-14 rounded-lg object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold">{book.title}</h3>
                        <p className="text-sm text-muted-foreground">{book.genre} · {book.origin}</p>
                        <p className="text-primary font-bold mt-1">${book.price.toFixed(2)}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button variant="outline" size="sm">{t("common.edit")}</Button>
                        <Button variant="ghost" size="sm" className="text-destructive">{t("common.delete")}</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Upload */}
            {activeTab === "upload" && (
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Titre</Label>
                      <Input placeholder="Titre du livre" className="rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("common.price")} (USD)</Label>
                      <Input type="number" placeholder="12.99" className="rounded-lg" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea placeholder="Description du livre..." className="min-h-[100px] rounded-lg" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>{t("filter.genre")}</Label>
                      <Select>
                        <SelectTrigger className="rounded-lg"><SelectValue placeholder="Genre" /></SelectTrigger>
                        <SelectContent>{genres.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{t("filter.origin")}</Label>
                      <Select>
                        <SelectTrigger className="rounded-lg"><SelectValue placeholder="Origine" /></SelectTrigger>
                        <SelectContent>{origins.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{t("filter.type")}</Label>
                      <Select>
                        <SelectTrigger className="rounded-lg"><SelectValue placeholder="Type" /></SelectTrigger>
                        <SelectContent>
                          {contentTypes.map((ct) => <SelectItem key={ct} value={ct}>{t(`filter.${ct}`)}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Couverture</Label>
                      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center text-muted-foreground cursor-pointer hover:border-primary transition-colors">
                        <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Glissez votre image ici</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Manuscrit</Label>
                      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center text-muted-foreground cursor-pointer hover:border-primary transition-colors">
                        <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">PDF, EPUB, ou fichier audio</p>
                      </div>
                    </div>
                  </div>
                  <Button className="rounded-full">{t("creator.upload")}</Button>
                </CardContent>
              </Card>
            )}

            {/* Analytics */}
            {activeTab === "analytics" && (
              <div className="space-y-4">
                <Card>
                  <CardHeader><CardTitle>Ventes mensuelles</CardTitle></CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground rounded-lg bg-muted/50">
                      <TrendingUp className="h-10 w-10 mr-2 opacity-30" />
                      <span className="text-sm">Graphique des ventes (données simulées)</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Top livres</CardTitle></CardHeader>
                  <CardContent>
                    {myBooks.slice(0, 3).map((book, i) => (
                      <div key={book.id} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
                        <span className="text-lg font-bold text-muted-foreground w-6">#{i + 1}</span>
                        <img src={book.cover} alt={book.title} className="h-10 w-7 rounded object-cover" />
                        <span className="flex-1 font-medium truncate">{book.title}</span>
                        <span className="text-primary font-bold tabular-nums">${(book.price * (30 - i * 8)).toFixed(0)}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
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
                    <Label>Bio</Label>
                    <Textarea placeholder="Votre biographie..." className="min-h-[100px] rounded-lg" />
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

export default CreatorDashboard;
