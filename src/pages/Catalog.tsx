import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookCard from "@/components/BookCard";
import FilterBar from "@/components/FilterBar";
import { useBooks } from "@/hooks/useBooks";
import { useLanguage } from "@/contexts/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Search, LayoutGrid, List, BookOpen, ChevronRight, ChevronLeft } from "lucide-react";

const ITEMS_PER_PAGE = 20;

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
  const [sortBy, setSortBy] = useState<string>("featured");
  const [page, setPage] = useState(1);

  const sortByMap: Record<string, "sales" | "rating" | "created_at" | undefined> = {
    featured: undefined,
    "price-low": undefined,
    "price-high": undefined,
    rating: "rating",
    new: "created_at",
    sales: "sales",
  };

  const { data: books = [], isLoading } = useBooks({
    category: categoryParam || undefined,
    genre: activeGenre || undefined,
    content_type: activeType || undefined,
    origin: activeOrigin || undefined,
    search: search || undefined,
    sortBy: sortByMap[sortBy],
  });

  // Client-side sort for price (not supported server-side)
  const sortedBooks = [...books].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedBooks.length / ITEMS_PER_PAGE);
  const paginatedBooks = sortedBooks.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

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
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4 flex-wrap">
            <Link to="/" className="hover:text-primary">{lang === "fr" ? "Accueil" : "Home"}</Link>
            <ChevronRight className="h-3 w-3" />
            {categoryParam ? (
              <>
                <Link to="/catalog" className="hover:text-primary">{lang === "fr" ? "Catalogue" : "Catalog"}</Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground">{categoryTitleMap[categoryParam] || categoryParam}</span>
              </>
            ) : (
              <span className="text-foreground">{lang === "fr" ? "Catalogue" : "Catalog"}</span>
            )}
          </nav>

          <div className="flex gap-6">
            {/* Left sidebar */}
            <div className="hidden lg:block w-56 shrink-0">
              <FilterBar
                activeOrigin={activeOrigin}
                activeGenre={activeGenre}
                activeType={activeType}
                onOriginChange={(v) => { setActiveOrigin(v); setPage(1); }}
                onGenreChange={(v) => { setActiveGenre(v); setPage(1); }}
                onTypeChange={(v) => { setActiveType(v); setPage(1); }}
              />
            </div>

            {/* Results */}
            <div className="flex-1 min-w-0">
              {/* Results header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                <div>
                  <h1 className="text-lg font-bold">{pageTitle}</h1>
                  {!isLoading && (
                    <p className="text-xs text-muted-foreground">
                      {sortedBooks.length} {lang === "fr" ? "résultats" : "results"}
                      {totalPages > 1 && ` — ${lang === "fr" ? "page" : "page"} ${page}/${totalPages}`}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative hidden sm:block">
                    <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={search}
                      onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                      placeholder={t("nav.search")}
                      className="h-8 pl-8 pr-3 text-xs bg-secondary border border-border rounded-sm outline-none focus:ring-1 focus:ring-primary w-48"
                    />
                  </div>
                  <Select value={sortBy} onValueChange={(v) => { setSortBy(v); setPage(1); }}>
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

              {/* Mobile search */}
              <div className="sm:hidden mb-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    placeholder={t("nav.search")}
                    className="w-full h-9 pl-8 pr-3 text-sm bg-secondary border border-border rounded-sm outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

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
              ) : paginatedBooks.length === 0 ? (
                <div className="text-center py-16">
                  <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/20 mb-4" />
                  <p className="text-muted-foreground">{t("common.noresults")}</p>
                </div>
              ) : viewMode === "list" ? (
                <div className="divide-y divide-border">
                  {paginatedBooks.map((book) => <BookCard key={book.id} book={book} viewMode="list" />)}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {paginatedBooks.map((book) => <BookCard key={book.id} book={book} />)}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage(p => p - 1)}
                    className="gap-1 rounded-sm"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    {lang === "fr" ? "Précédent" : "Previous"}
                  </Button>
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      const p = i + 1;
                      return (
                        <Button
                          key={p}
                          variant={page === p ? "default" : "outline"}
                          size="sm"
                          className="w-8 h-8 rounded-sm text-xs"
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="gap-1 rounded-sm"
                  >
                    {lang === "fr" ? "Suivant" : "Next"}
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
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
