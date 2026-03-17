import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FilterBar from "@/components/FilterBar";
import BookGrid from "@/components/BookGrid";
import CreatorCTA from "@/components/CreatorCTA";
import { useBooks } from "@/hooks/useBooks";
import { useLanguage } from "@/contexts/LanguageContext";
import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Index = () => {
  const { t, lang } = useLanguage();
  const [activeOrigin, setActiveOrigin] = useState("");
  const [activeGenre, setActiveGenre] = useState("");
  const [activeType, setActiveType] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [sortBy, setSortBy] = useState("featured");

  const hasFilters = activeOrigin || activeGenre || activeType;

  const filterOpts = {
    ...(activeOrigin ? { origin: activeOrigin } : {}),
    ...(activeGenre ? { genre: activeGenre } : {}),
    ...(activeType ? { content_type: activeType } : {}),
  };

  const { data: allBooks = [], isLoading: loadingAll } = useBooks({ ...filterOpts, limit: hasFilters ? 50 : undefined });
  const { data: newReleases = [], isLoading: loadingNew } = useBooks({ limit: 10 });
  const { data: bestsellers = [], isLoading: loadingBest } = useBooks({ limit: 10, sortBy: "sales" });
  const { data: topRated = [] } = useBooks({ limit: 10, sortBy: "rating" });
  const { data: literature = [] } = useBooks({ category: "literature", limit: 8 });
  const { data: education = [] } = useBooks({ category: "education", limit: 8 });
  const { data: youth = [] } = useBooks({ category: "youth", limit: 8 });
  const { data: diaspora = [] } = useBooks({ category: "diaspora", limit: 8 });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <HeroSection />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <div className="flex gap-6">
            {/* Left sidebar filters - Amazon style */}
            <div className="hidden lg:block w-56 shrink-0">
              <FilterBar
                activeOrigin={activeOrigin}
                activeGenre={activeGenre}
                activeType={activeType}
                onOriginChange={setActiveOrigin}
                onGenreChange={setActiveGenre}
                onTypeChange={setActiveType}
              />
            </div>

            {/* Main content */}
            <div className="flex-1 min-w-0 space-y-8">
              {/* Results header - Amazon style */}
              {hasFilters && (
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <p className="text-sm text-muted-foreground">
                    {allBooks.length} {lang === "fr" ? "résultats" : "results"}
                  </p>
                  <div className="flex items-center gap-2">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="h-8 w-40 text-xs rounded-sm">
                        <SelectValue placeholder={lang === "fr" ? "Trier par" : "Sort by"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="featured">{lang === "fr" ? "En vedette" : "Featured"}</SelectItem>
                        <SelectItem value="price-low">{lang === "fr" ? "Prix croissant" : "Price: Low to High"}</SelectItem>
                        <SelectItem value="price-high">{lang === "fr" ? "Prix décroissant" : "Price: High to Low"}</SelectItem>
                        <SelectItem value="rating">{lang === "fr" ? "Meilleures notes" : "Avg. Customer Review"}</SelectItem>
                        <SelectItem value="new">{lang === "fr" ? "Date de publication" : "Publication Date"}</SelectItem>
                        <SelectItem value="sales">Best Sellers</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex border border-border rounded-sm overflow-hidden">
                      <button onClick={() => setViewMode("grid")} className={`p-1.5 ${viewMode === "grid" ? "bg-secondary" : ""}`}><LayoutGrid className="h-3.5 w-3.5" /></button>
                      <button onClick={() => setViewMode("list")} className={`p-1.5 ${viewMode === "list" ? "bg-secondary" : ""}`}><List className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                </div>
              )}

              {hasFilters ? (
                <BookGrid
                  title={lang === "fr" ? "Résultats" : "Results"}
                  books={allBooks}
                  loading={loadingAll}
                  horizontal={false}
                  viewMode={viewMode}
                />
              ) : (
                <>
                  <BookGrid title={`🔥 ${t("section.bestsellers")}`} books={bestsellers} categoryLink="/catalog" loading={loadingBest} />
                  <BookGrid title={`⭐ ${lang === "fr" ? "Coups de cœur" : "Editor's Picks"}`} books={topRated} categoryLink="/catalog" />
                  <BookGrid title={`🆕 ${t("section.new")}`} books={newReleases} categoryLink="/catalog" loading={loadingNew} />

                  <CreatorCTA />

                  <BookGrid title={t("section.literature")} books={literature} categoryLink="/catalog?category=literature" />
                  <BookGrid title={t("section.education")} books={education} categoryLink="/catalog?category=education" />
                  <BookGrid title={t("section.youth")} books={youth} categoryLink="/catalog?category=youth" />
                  <BookGrid title={t("section.diaspora")} books={diaspora} categoryLink="/catalog?category=diaspora" />
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
