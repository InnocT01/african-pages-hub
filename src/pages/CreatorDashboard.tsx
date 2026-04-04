import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  BarChart3, BookOpen, Settings, TrendingUp, Star, MessageSquare,
  Tag, Calculator, Megaphone, PenTool, Library, LayoutDashboard
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
} from "@/components/ui/sidebar";
import Header from "@/components/Header";
import CreatorOverview from "@/components/dashboard/CreatorOverview";
import CreatorBooks from "@/components/dashboard/CreatorBooks";
import CreatorUpload from "@/components/dashboard/CreatorUpload";
import CreatorAnalytics from "@/components/dashboard/CreatorAnalytics";
import CreatorSettings from "@/components/dashboard/CreatorSettings";
import CreatorReviews from "@/components/dashboard/CreatorReviews";
import CreatorPromos from "@/components/dashboard/CreatorPromos";
import CreatorRoyalties from "@/components/dashboard/CreatorRoyalties";
import CreatorMarketing from "@/components/dashboard/CreatorMarketing";

const sidebarItems = [
  { key: "creator.overview", icon: LayoutDashboard, tab: "overview" },
  { key: "creator.mybooks", icon: Library, tab: "books", label_fr: "Bibliothèque", label_en: "Bookshelf" },
  { key: "creator.upload", icon: PenTool, tab: "upload", label_fr: "Kitabu Direct Publishing", label_en: "Kitabu Direct Publishing" },
  { key: "creator.analytics", icon: TrendingUp, tab: "analytics" },
  { key: "creator.reviews_mgmt", icon: MessageSquare, tab: "reviews" },
  { key: "creator.promos", icon: Tag, tab: "promos" },
  { key: "creator.royalties", icon: Calculator, tab: "royalties" },
  { key: "creator.marketing", icon: Megaphone, tab: "marketing" },
  { key: "creator.settings", icon: Settings, tab: "settings" },
];

const CreatorDashboard = () => {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && sidebarItems.some(i => i.tab === tab)) setActiveTab(tab);
  }, [searchParams]);

  const getLabel = (item: typeof sidebarItems[0]) => {
    if (item.label_fr) return lang === "fr" ? item.label_fr : item.label_en;
    return t(item.key);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full flex-col bg-muted/30">
        <Header />
        <div className="flex flex-1">
          <Sidebar collapsible="icon" className="border-r border-border/50">
            <SidebarContent className="pt-6 bg-card">
              {/* KDP Branding */}
              <div className="px-4 pb-4 border-b border-border/50 mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="group-data-[collapsible=icon]:hidden">
                    <p className="text-sm font-bold leading-none">KDP</p>
                    <p className="text-[10px] text-muted-foreground">Kitabu Direct Publishing</p>
                  </div>
                </div>
              </div>
              <SidebarGroup>
                <SidebarGroupLabel className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/60 px-4">
                  {lang === "fr" ? "Navigation" : "Navigation"}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {sidebarItems.map((item) => (
                      <SidebarMenuItem key={item.tab}>
                        <SidebarMenuButton
                          isActive={activeTab === item.tab}
                          onClick={() => setActiveTab(item.tab)}
                          className={`cursor-pointer transition-all ${
                            activeTab === item.tab 
                              ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary" 
                              : "hover:bg-muted/50"
                          } ${item.tab === "upload" ? "text-primary font-medium" : ""}`}
                        >
                          <item.icon className="h-4 w-4" />
                          <span className="text-sm">{getLabel(item)}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>

          <main className="flex-1 p-4 md:p-8 max-w-7xl">
            <div className="flex items-center gap-3 mb-8">
              <SidebarTrigger />
              <div>
                <h1 className="text-2xl font-bold md:text-3xl">{getLabel(sidebarItems.find(i => i.tab === activeTab)!)}</h1>
                {activeTab === "overview" && (
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {lang === "fr" ? `Bienvenue, ${user?.name || "Créateur"}` : `Welcome, ${user?.name || "Creator"}`}
                  </p>
                )}
              </div>
            </div>

            {activeTab === "overview" && <CreatorOverview />}
            {activeTab === "books" && <CreatorBooks />}
            {activeTab === "upload" && <CreatorUpload />}
            {activeTab === "analytics" && <CreatorAnalytics />}
            {activeTab === "reviews" && <CreatorReviews />}
            {activeTab === "promos" && <CreatorPromos />}
            {activeTab === "royalties" && <CreatorRoyalties />}
            {activeTab === "marketing" && <CreatorMarketing />}
            {activeTab === "settings" && <CreatorSettings />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CreatorDashboard;
