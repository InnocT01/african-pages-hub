import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FilterBar from "@/components/FilterBar";
import BookGrid from "@/components/BookGrid";
import CreatorCTA from "@/components/CreatorCTA";
import { mockBooks } from "@/data/mockBooks";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { t } = useLanguage();
  const [activeOrigin, setActiveOrigin] = useState("");
  const [activeGenre, setActiveGenre] = useState("");
  const [activeType, setActiveType] = useState("");

  const filteredBooks = useMemo(() => {
    return mockBooks.filter((b) => {
      if (activeOrigin && b.origin !== activeOrigin) return false;
      if (activeGenre && b.genre !== activeGenre) return false;
      if (activeType && b.type !== activeType) return false;
      return true;
    });
  }, [activeOrigin, activeGenre, activeType]);

  const featured = mockBooks.filter((b) => b.featured);
  const newReleases = filteredBooks.slice(0, 5);
  const literature = filteredBooks.filter((b) => b.category === "literature").slice(0, 5);
  const education = filteredBooks.filter((b) => b.category === "education").slice(0, 5);
  const youth = filteredBooks.filter((b) => b.category === "youth").slice(0, 5);
  const diaspora = filteredBooks.filter((b) => b.category === "diaspora").slice(0, 5);
  const nationalLangs = filteredBooks.filter((b) => b.category === "national_languages").slice(0, 5);
  const bds = filteredBooks.filter((b) => b.type === "bd").slice(0, 5);
  const audiobooks = filteredBooks.filter((b) => b.type === "audio").slice(0, 5);

  const hasFilters = activeOrigin || activeGenre || activeType;

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
            <BookGrid title={t("section.new")} books={filteredBooks} />
          ) : (
            <>
              {newReleases.length > 0 && <BookGrid title={t("section.new")} books={newReleases} categoryLink="/catalog" />}
              {literature.length > 0 && <BookGrid title={t("section.literature")} books={literature} categoryLink="/catalog?category=literature" />}
              {bds.length > 0 && <BookGrid title={t("section.bd")} books={bds} categoryLink="/catalog?genre=BD" />}
              {audiobooks.length > 0 && <BookGrid title={t("section.audiobooks")} books={audiobooks} categoryLink="/catalog?type=audio" />}
              {nationalLangs.length > 0 && <BookGrid title={t("section.national_languages")} books={nationalLangs} categoryLink="/catalog?category=national_languages" />}
              {education.length > 0 && <BookGrid title={t("section.education")} books={education} categoryLink="/catalog?category=education" />}
              {youth.length > 0 && <BookGrid title={t("section.youth")} books={youth} categoryLink="/catalog?category=youth" />}
              {diaspora.length > 0 && <BookGrid title={t("section.diaspora")} books={diaspora} categoryLink="/catalog?category=diaspora" />}
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
