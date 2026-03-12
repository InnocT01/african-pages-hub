import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { BarChart3, BookOpen, Upload, Settings, TrendingUp, Eye, DollarSign } from "lucide-react";
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

            {activeTab === "overview" && <CreatorOverview />}
            {activeTab === "books" && <CreatorBooks />}
            {activeTab === "upload" && <CreatorUpload />}
            {activeTab === "analytics" && <CreatorAnalytics />}
            {activeTab === "settings" && <CreatorSettings />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CreatorDashboard;
