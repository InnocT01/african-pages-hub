import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FilterBar from "@/components/FilterBar";
import BookGrid from "@/components/BookGrid";
import CreatorCTA from "@/components/CreatorCTA";
import { useBooks } from "@/hooks/useBooks";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { t, lang } = useLanguage();
  const [activeOrigin, setActiveOrigin] = useState("");
  const [activeGenre, setActiveGenre] = useState("");
  const [activeType, setActiveType] = useState("");

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
      <main className="flex-1">
        <HeroSection />
        <div className="container mx-auto px-4 py-10 space-y-10">
          <FilterBar activeOrigin={activeOrigin} activeGenre={activeGenre} activeType={activeType} onOriginChange={setActiveOrigin} onGenreChange={setActiveGenre} onTypeChange={setActiveType} />

          {hasFilters ? (
            <BookGrid title={lang === "fr" ? "Résultats" : "Results"} books={allBooks} loading={loadingAll} horizontal={false} />
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
      </main>
      <Footer />
    </div>
  );
};

export default Index;
