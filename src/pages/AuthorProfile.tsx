import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookCard from "@/components/BookCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Star, MapPin, ChevronRight } from "lucide-react";
import type { Book } from "@/types/book";

const AuthorProfile = () => {
  const { id } = useParams();
  const { lang } = useLanguage();

  const { data: profile, isLoading: loadingProfile } = useQuery({
    queryKey: ["author-profile", id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await supabase.from("profiles").select("*").eq("user_id", id).maybeSingle();
      return data;
    },
    enabled: !!id,
  });

  const { data: books = [], isLoading: loadingBooks } = useQuery({
    queryKey: ["author-books", id],
    queryFn: async () => {
      if (!id) return [];
      const { data } = await supabase
        .from("books")
        .select("*")
        .eq("author_id", id)
        .eq("status", "published")
        .order("created_at", { ascending: false });
      return (data || []) as unknown as Book[];
    },
    enabled: !!id,
  });

  const totalSales = books.reduce((s, b) => s + (b.sales_count || 0), 0);
  const avgRating = books.length > 0 ? books.reduce((s, b) => s + (b.rating || 0), 0) / books.length : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">{lang === "fr" ? "Accueil" : "Home"}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{profile?.display_name || (lang === "fr" ? "Auteur" : "Author")}</span>
        </nav>

        {loadingProfile ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="h-6 w-48" />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8 mb-10">
            <div className="flex flex-col items-center md:items-start gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={(profile as any)?.avatar_url} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {(profile as any)?.display_name?.charAt(0)?.toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1 space-y-3">
              <h1 className="text-2xl font-bold md:text-3xl">{(profile as any)?.display_name || "Auteur"}</h1>
              {(profile as any)?.bio && (
                <p className="text-muted-foreground max-w-2xl">{(profile as any).bio}</p>
              )}
              {(profile as any)?.address && (
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />{(profile as any).address}
                </p>
              )}
              <div className="flex gap-4 pt-2">
                <div className="text-center">
                  <p className="text-xl font-bold">{books.length}</p>
                  <p className="text-xs text-muted-foreground">{lang === "fr" ? "Œuvres" : "Works"}</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold">{totalSales}</p>
                  <p className="text-xs text-muted-foreground">{lang === "fr" ? "Ventes" : "Sales"}</p>
                </div>
                <div className="text-center flex flex-col items-center">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="text-xl font-bold">{avgRating.toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{lang === "fr" ? "Note moy." : "Avg Rating"}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <h2 className="text-lg font-bold mb-4">
          {lang === "fr" ? `Œuvres publiées (${books.length})` : `Published Works (${books.length})`}
        </h2>

        {loadingBooks ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-[2/3] rounded-sm" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/20 mb-4" />
            <p className="text-muted-foreground">{lang === "fr" ? "Aucun livre publié" : "No published books"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AuthorProfile;
