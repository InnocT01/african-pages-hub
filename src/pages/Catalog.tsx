import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookCard from "@/components/BookCard";
import FilterBar from "@/components/FilterBar";
import { mockBooks } from "@/data/mockBooks";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, LayoutGrid, List } from "lucide-react";

const Catalog = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "";
  const searchParam = searchParams.get("search") || "";

  const [search, setSearch] = useState(searchParam);
  const [activeOrigin, setActiveOrigin] = useState("");
  const [activeGenre, setActiveGenre] = useState("");
  const [activeType, setActiveType] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const perPage = 12;

  const filtered = useMemo(() => {
    return mockBooks.filter((b) => {
      if (categoryParam && b.category !== categoryParam) return false;
      if (activeOrigin && b.origin !== activeOrigin) return false;
      if (activeGenre && b.genre !== activeGenre) return false;
      if (activeType && b.type !== activeType) return false;
      if (search && !b.title.toLowerCase().includes(search.toLowerCase()) && !b.author.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [categoryParam, activeOrigin, activeGenre, activeType, search]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const categoryTitle = categoryParam ? t(`section.${categoryParam === "literature" ? "literature" : categoryParam}`) : t("nav.catalog");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl font-bold md:text-4xl">{categoryTitle}</h1>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder={t("nav.search")} className="pl-10 rounded-full" />
        </div>

        <FilterBar activeOrigin={activeOrigin} activeGenre={activeGenre} activeType={activeType} onOriginChange={(v) => { setActiveOrigin(v); setPage(1); }} onGenreChange={(v) => { setActiveGenre(v); setPage(1); }} onTypeChange={(v) => { setActiveType(v); setPage(1); }} />

        {/* View toggle */}
        <div className="flex justify-end gap-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="icon" onClick={() => setViewMode("grid")} className="rounded-lg">
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="icon" onClick={() => setViewMode("list")} className="rounded-lg">
            <List className="h-4 w-4" />
          </Button>
        </div>

        {/* Results */}
        {paged.length === 0 ? (
          <p className="text-center py-16 text-muted-foreground">{t("cart.empty")}</p>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {paged.map((book) => <BookCard key={book.id} book={book} />)}
          </div>
        ) : (
          <div className="space-y-3">
            {paged.map((book) => (
              <Link key={book.id} to={`/book/${book.id}`} className="flex gap-4 p-4 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
                <img src={book.cover} alt={book.title} className="h-24 w-16 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{book.title}</h3>
                  <p className="text-sm text-muted-foreground">{book.author} · {book.origin}</p>
                  <p className="text-primary font-bold mt-1">${book.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-4">
            {Array.from({ length: totalPages }, (_, i) => (
              <Button key={i} variant={page === i + 1 ? "default" : "outline"} size="sm" onClick={() => setPage(i + 1)} className="rounded-full w-9 h-9 p-0">
                {i + 1}
              </Button>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Catalog;
