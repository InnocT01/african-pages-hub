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
  const { t } = useLanguage();
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
  const { data: newReleases = [], isLoading: loadingNew } = useBooks({ limit: 5 });
  const { data: literature = [], isLoading: loadingLit } = useBooks({ category: "literature", limit: 5 });
  const { data: education = [], isLoading: loadingEdu } = useBooks({ category: "education", limit: 5 });
  const { data: youth = [] } = useBooks({ category: "youth", limit: 5 });
  const { data: diaspora = [] } = useBooks({ category: "diaspora", limit: 5 });
  const { data: nationalLangs = [] } = useBooks({ category: "national_languages", limit: 5 });
  const { data: manuels = [] } = useBooks({ category: "manuels_scolaires", limit: 5 });
  const { data: revues = [] } = useBooks({ category: "revues_scientifiques", limit: 5 });
  const { data: articles = [] } = useBooks({ category: "articles", limit: 5 });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <div className="container mx-auto px-4 py-10 space-y-12">
          <FilterBar
            activeOrigin={activeOrigin}
            activeGenre={activeGenre}
            activeType={activeType}
            onOriginChange={setActiveOrigin}
            onGenreChange={setActiveGenre}
            onTypeChange={setActiveType}
          />

          {hasFilters ? (
            <BookGrid title={t("common.noresults") === "Aucun résultat" ? "Résultats" : "Results"} books={allBooks} loading={loadingAll} />
          ) : (
            <>
              <BookGrid title={t("section.new")} books={newReleases} categoryLink="/catalog" loading={loadingNew} />
              <BookGrid title={t("section.literature")} books={literature} categoryLink="/catalog?category=literature" loading={loadingLit} />
              <BookGrid title={t("section.education")} books={education} categoryLink="/catalog?category=education" loading={loadingEdu} />
              <BookGrid title={t("section.manuels_scolaires")} books={manuels} categoryLink="/catalog?category=manuels_scolaires" />
              <BookGrid title={t("section.revues_scientifiques")} books={revues} categoryLink="/catalog?category=revues_scientifiques" />
              <BookGrid title={t("section.articles")} books={articles} categoryLink="/catalog?category=articles" />
              <BookGrid title={t("section.bd")} books={allBooks.filter(b => b.content_type === "bd")} categoryLink="/catalog?type=bd" />
              <BookGrid title={t("section.audiobooks")} books={allBooks.filter(b => b.content_type === "audio")} categoryLink="/catalog?type=audio" />
              <BookGrid title={t("section.national_languages")} books={nationalLangs} categoryLink="/catalog?category=national_languages" />
              <BookGrid title={t("section.youth")} books={youth} categoryLink="/catalog?category=youth" />
              <BookGrid title={t("section.diaspora")} books={diaspora} categoryLink="/catalog?category=diaspora" />
            </>
          )}

          <CreatorCTA />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
