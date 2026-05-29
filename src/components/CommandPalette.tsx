import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Command } from "cmdk";
import { Search, BookOpen, Home, User, ShoppingCart, Heart, Library, PenTool, HelpCircle, Sun, Moon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

interface BookHit { id: string; title: string; author_name: string | null; cover_url: string | null; }

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BookHit[]>([]);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if ((e.target as HTMLElement)?.tagName === "INPUT" || (e.target as HTMLElement)?.tagName === "TEXTAREA") return;
        e.preventDefault();
        setOpen(o => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (!query || query.length < 2) { setResults([]); return; }
    const t = setTimeout(async () => {
      const { data } = await supabase
        .from("books")
        .select("id,title,author_name,cover_url")
        .eq("status", "published")
        .or(`title.ilike.%${query}%,author_name.ilike.%${query}%`)
        .limit(6);
      setResults((data as BookHit[]) || []);
    }, 200);
    return () => clearTimeout(t);
  }, [query]);

  const go = (path: string) => { setOpen(false); navigate(path); };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4 bg-foreground/40 backdrop-blur-sm animate-in fade-in" onClick={() => setOpen(false)}>
      <div className="w-full max-w-xl bg-card border border-border rounded-lg shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <Command label="Command Palette" shouldFilter={false}>
          <div className="flex items-center border-b border-border px-4">
            <Search className="w-4 h-4 text-muted-foreground mr-3" />
            <Command.Input
              autoFocus
              value={query}
              onValueChange={setQuery}
              placeholder="Rechercher des livres, auteurs, pages…"
              className="flex-1 h-12 bg-transparent outline-none text-sm font-body placeholder:text-muted-foreground"
            />
            <kbd className="text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">ESC</kbd>
          </div>
          <Command.List className="max-h-[60vh] overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-sm text-muted-foreground">
              {query.length < 2 ? "Tapez pour rechercher…" : "Aucun résultat"}
            </Command.Empty>

            {results.length > 0 && (
              <Command.Group heading="Livres" className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 py-1">
                {results.map(b => (
                  <Command.Item key={b.id} value={`book-${b.id}`} onSelect={() => go(`/book/${b.id}`)}
                    className="flex items-center gap-3 px-3 py-2 rounded cursor-pointer aria-selected:bg-primary/10">
                    {b.cover_url ? <img src={b.cover_url} alt="" className="w-8 h-10 object-cover rounded-sm" /> : <BookOpen className="w-8 h-10 p-2 text-primary" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{b.title}</p>
                      {b.author_name && <p className="text-xs text-muted-foreground truncate">{b.author_name}</p>}
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            <Command.Group heading="Navigation" className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 py-1 mt-2">
              <Cmd icon={Home} label="Accueil" onSelect={() => go("/")} />
              <Cmd icon={Library} label="Catalogue" onSelect={() => go("/catalog")} />
              <Cmd icon={ShoppingCart} label="Panier" onSelect={() => go("/cart")} />
              <Cmd icon={Heart} label="Ma bibliothèque" onSelect={() => go("/reader")} />
              {user && <Cmd icon={PenTool} label="Kitabu Direct Publishing" onSelect={() => go("/creator")} />}
              <Cmd icon={HelpCircle} label="Centre d'aide" onSelect={() => go("/help")} />
              <Cmd icon={User} label="Connexion" onSelect={() => go("/login")} />
            </Command.Group>

            <Command.Group heading="Préférences" className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 py-1 mt-2">
              <Cmd icon={theme === "dark" ? Sun : Moon} label={theme === "dark" ? "Mode clair" : "Mode sombre"} onSelect={() => { toggleTheme(); setOpen(false); }} />
            </Command.Group>
          </Command.List>
          <div className="border-t border-border px-3 py-2 flex items-center justify-between text-[10px] text-muted-foreground bg-muted/30">
            <span>Naviguez avec ↑ ↓ — Entrée pour sélectionner</span>
            <span>⌘K pour rouvrir</span>
          </div>
        </Command>
      </div>
    </div>
  );
};

const Cmd = ({ icon: Icon, label, onSelect }: { icon: any; label: string; onSelect: () => void }) => (
  <Command.Item value={label} onSelect={onSelect} className="flex items-center gap-3 px-3 py-2 rounded cursor-pointer aria-selected:bg-primary/10">
    <Icon className="w-4 h-4 text-muted-foreground" />
    <span className="text-sm">{label}</span>
  </Command.Item>
);

export default CommandPalette;
