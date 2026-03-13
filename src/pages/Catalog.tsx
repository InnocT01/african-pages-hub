import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookCard from "@/components/BookCard";
import FilterBar from "@/components/FilterBar";
import { useBooks } from "@/hooks/useBooks";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, LayoutGrid, List, BookOpen } from "lucide-react";

const Catalog = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "";
  const searchParam = searchParams.get("search") || "";
  const typeParam = searchParams.get("type") || "";
  const genreParam = searchParams.get("genre") || "";

  const [search, setSearch] = useState(searchParam);
  const [activeOrigin, setActiveOrigin] = useState("");
  const [activeGenre, setActiveGenre] = useState(genreParam);
  const [activeType, setActiveType] = useState(typeParam);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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
  const categoryTitle = categoryParam ? categoryTitleMap[categoryParam] || t("nav.catalog") : t("nav.catalog");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl font-bold md:text-4xl">{categoryTitle}</h1>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("nav.search")} className="pl-10 rounded-full" />
        </div>

        <FilterBar activeOrigin={activeOrigin} activeGenre={activeGenre} activeType={activeType} onOriginChange={setActiveOrigin} onGenreChange={setActiveGenre} onTypeChange={setActiveType} />

        <div className="flex justify-end gap-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="icon" onClick={() => setViewMode("grid")} className="rounded-lg">
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="icon" onClick={() => setViewMode("list")} className="rounded-lg">
            <List className="h-4 w-4" />
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[2/3] rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/20 mb-4" />
            <p className="text-muted-foreground">{t("common.noresults")}</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {books.map((book) => <BookCard key={book.id} book={book} />)}
          </div>
        ) : (
          <div className="space-y-3">
            {books.map((book) => (
              <Link key={book.id} to={`/book/${book.id}`} className="flex gap-4 p-4 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
                {book.cover_url ? (
                  <img src={book.cover_url} alt={book.title} className="h-24 w-16 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="h-24 w-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <BookOpen className="h-6 w-6 text-muted-foreground/30" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{book.title}</h3>
                  <p className="text-sm text-muted-foreground">{book.author_name} · {book.origin}</p>
                  <p className="text-primary font-bold mt-1">${book.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Catalog;
