import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Loader2, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";

interface Result {
  id: string;
  title: string;
  author_name: string | null;
  cover_url: string | null;
  price: number;
}

const SearchAutocomplete = () => {
  const { lang } = useLanguage();
  const { format } = useCurrency();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (q.trim().length < 2) { setResults([]); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      const { data } = await supabase
        .from("books")
        .select("id,title,author_name,cover_url,price")
        .eq("status", "published")
        .or(`title.ilike.%${q}%,author_name.ilike.%${q}%`)
        .limit(6);
      setResults((data || []) as Result[]);
      setLoading(false);
    }, 200);
    return () => clearTimeout(t);
  }, [q]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) { navigate(`/catalog?search=${encodeURIComponent(q)}`); setOpen(false); }
  };

  return (
    <div ref={wrapRef} className="relative hidden md:block flex-1 max-w-lg mx-4">
      <form onSubmit={submit}>
        <div className="flex w-full items-center bg-secondary/60 px-5 h-11 transition-all focus-within:ring-1 focus-within:ring-primary focus-within:bg-secondary">
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder={lang === "fr" ? "Rechercher un chef-d'œuvre…" : "Search a masterpiece…"}
            className="flex-1 h-full text-sm bg-transparent outline-none placeholder:text-muted-foreground/60"
          />
          <button type="submit" aria-label="Search" className="text-muted-foreground hover:text-primary">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </button>
        </div>
      </form>

      {open && q.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-card border border-border shadow-xl z-50 max-h-96 overflow-auto">
          {results.length === 0 && !loading && (
            <p className="p-4 text-sm text-muted-foreground text-center">
              {lang === "fr" ? "Aucun résultat" : "No results"}
            </p>
          )}
          {results.map((b) => (
            <Link
              key={b.id}
              to={`/book/${b.id}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 p-3 hover:bg-secondary transition-colors border-b border-border last:border-b-0"
            >
              {b.cover_url ? (
                <img src={b.cover_url} alt="" className="h-12 w-9 object-cover rounded-sm" />
              ) : (
                <div className="h-12 w-9 bg-secondary flex items-center justify-center"><BookOpen className="h-4 w-4 text-muted-foreground/40" /></div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{b.title}</p>
                <p className="text-xs text-muted-foreground truncate">{b.author_name}</p>
              </div>
              <span className="text-sm font-bold text-primary tabular-nums">{format(b.price)}</span>
            </Link>
          ))}
          {results.length > 0 && (
            <button
              onClick={submit}
              className="w-full p-2.5 text-xs font-bold text-primary hover:bg-secondary border-t border-border"
            >
              {lang === "fr" ? `Voir tous les résultats pour "${q}"` : `See all results for "${q}"`} →
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;
