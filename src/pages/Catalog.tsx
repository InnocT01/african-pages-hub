import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookCard from "@/components/BookCard";
import FilterBar from "@/components/FilterBar";
import { useBooks } from "@/hooks/useBooks";
import { useLanguage } from "@/contexts/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, LayoutGrid, List, BookOpen } from "lucide-react";

const Catalog = () => {
  const { t, lang } = useLanguage();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "";
  const searchParam = searchParams.get("search") || "";
  const typeParam = searchParams.get("type") || "";
  const genreParam = searchParams.get("genre") || "";

  const [search, setSearch] = useState(searchParam);
  const [activeOrigin, setActiveOrigin] = useState("");
  const [activeGenre, setActiveGenre] = useState(genreParam);
  const [activeType, setActiveType] = useState(typeParam);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [sortBy, setSortBy] = useState("featured");

  const { data: books = [], isLoading } = useBooks({
    category: categoryParam || undefined,
    genre: activeGenre || undefined,
    content_type: activeType || undefined,
    origin: activeOrigin || undefined,
    search: search || undefined,
  });

  const categoryTitleMap: Record<string, string> = {
    literature: t("section.literature"),
    education: t("section.education"),
    youth: t("section.youth"),
    diaspora: t("section.diaspora"),
    national_languages: t("section.national_languages"),
    manuels_scolaires: t("section.manuels_scolaires"),
    revues_scientifiques: t("section.revues_scientifiques"),
    articles: t("section.articles"),
  };
  const pageTitle = categoryParam ? categoryTitleMap[categoryParam] || t("nav.catalog") : t("nav.catalog");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <div className="flex gap-6">
            {/* Left sidebar */}
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

            {/* Results */}
            <div className="flex-1 min-w-0">
              {/* Results header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                <div>
                  <h1 className="text-lg font-bold">{pageTitle}</h1>
                  {!isLoading && <p className="text-xs text-muted-foreground">{books.length} {lang === "fr" ? "résultats" : "results"}</p>}
                </div>
                <div className="flex items-center gap-2">
                  {/* Search */}
                  <div className="relative hidden sm:block">
                    <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("nav.search")} className="h-8 pl-8 pr-3 text-xs bg-secondary border border-border rounded-sm outline-none focus:ring-1 focus:ring-primary w-48" />
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-8 w-36 text-xs rounded-sm">
                      <SelectValue placeholder={lang === "fr" ? "Trier par" : "Sort by"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">{lang === "fr" ? "En vedette" : "Featured"}</SelectItem>
                      <SelectItem value="price-low">{lang === "fr" ? "Prix ↑" : "Price: Low to High"}</SelectItem>
                      <SelectItem value="price-high">{lang === "fr" ? "Prix ↓" : "Price: High to Low"}</SelectItem>
                      <SelectItem value="rating">{lang === "fr" ? "Meilleures notes" : "Avg. Review"}</SelectItem>
                      <SelectItem value="new">{lang === "fr" ? "Récents" : "Newest"}</SelectItem>
                      <SelectItem value="sales">Best Sellers</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex border border-border rounded-sm overflow-hidden">
                    <button onClick={() => setViewMode("grid")} className={`p-1.5 ${viewMode === "grid" ? "bg-secondary" : ""}`}><LayoutGrid className="h-3.5 w-3.5" /></button>
                    <button onClick={() => setViewMode("list")} className={`p-1.5 ${viewMode === "list" ? "bg-secondary" : ""}`}><List className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-4">{lang === "fr" ? "Consultez chaque page produit pour d'autres options d'achat." : "Check each product page for other buying options."}</p>

              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex gap-4 py-4">
                      <Skeleton className="h-36 w-24 rounded-sm" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-3 w-1/3" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : books.length === 0 ? (
                <div className="text-center py-16">
                  <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/20 mb-4" />
                  <p className="text-muted-foreground">{t("common.noresults")}</p>
                </div>
              ) : viewMode === "list" ? (
                <div className="divide-y divide-border">
                  {books.map((book) => <BookCard key={book.id} book={book} viewMode="list" />)}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {books.map((book) => <BookCard key={book.id} book={book} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Catalog;
