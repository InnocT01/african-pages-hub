import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const REGIONS = [
  { code: "RDC", label: "Congo", flag: "🇨🇩", quote: { fr: "Du fleuve Congo aux mille collines", en: "From the Congo river to the thousand hills" } },
  { code: "Nigeria", label: "Nigeria", flag: "🇳🇬", quote: { fr: "Berceau d'Achebe et Adichie", en: "Home of Achebe and Adichie" } },
  { code: "Sénégal", label: "Sénégal", flag: "🇸🇳", quote: { fr: "L'héritage de Senghor et Mariama Bâ", en: "Heritage of Senghor and Mariama Bâ" } },
  { code: "Kenya", label: "Kenya", flag: "🇰🇪", quote: { fr: "La voix de Ngũgĩ wa Thiong'o", en: "Voice of Ngũgĩ wa Thiong'o" } },
  { code: "Côte d'Ivoire", label: "Côte d'Ivoire", flag: "🇨🇮", quote: { fr: "Le souffle d'Ahmadou Kourouma", en: "Breath of Ahmadou Kourouma" } },
  { code: "Maroc", label: "Maroc", flag: "🇲🇦", quote: { fr: "Entre médinas et désert", en: "Between medinas and desert" } },
  { code: "Éthiopie", label: "Éthiopie", flag: "🇪🇹", quote: { fr: "Berceau de l'humanité", en: "Cradle of humanity" } },
  { code: "Diaspora", label: "Diaspora", flag: "🌍", quote: { fr: "Voix d'Afrique à travers le monde", en: "African voices around the world" } },
];

const AfricaShowcase = () => {
  const { lang } = useLanguage();

  const { data: counts = {} } = useQuery({
    queryKey: ["africa-counts"],
    queryFn: async () => {
      const out: Record<string, number> = {};
      await Promise.all(
        REGIONS.map(async (r) => {
          const { count } = await supabase
            .from("books")
            .select("*", { count: "exact", head: true })
            .eq("status", "published")
            .eq("origin", r.code);
          out[r.code] = count || 0;
        }),
      );
      return out;
    },
  });

  return (
    <section className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border">
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.25em] text-primary font-bold">
            {lang === "fr" ? "Cartographie littéraire" : "Literary cartography"}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight text-foreground">
            {lang === "fr" ? "Voyage à travers l'Afrique" : "A journey across Africa"}
          </h2>
          <div className="editorial-rule" />
        </div>
        <Link to="/catalog" className="text-[11px] uppercase tracking-[0.2em] font-bold text-primary hover:text-foreground transition-colors">
          {lang === "fr" ? "Explorer toutes les régions →" : "Explore all regions →"}
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
        {REGIONS.map((r) => (
          <Link
            key={r.code}
            to={`/catalog?origin=${encodeURIComponent(r.code)}`}
            className="group relative bg-card hover:bg-secondary transition-all duration-500 p-6 min-h-[160px] flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 kente-pattern pointer-events-none" />
            <div className="relative flex items-start justify-between">
              <span className="text-4xl leading-none">{r.flag}</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
                {counts[r.code] ?? 0} {lang === "fr" ? "livres" : "books"}
              </span>
            </div>
            <div className="relative space-y-1">
              <h3 className="font-display text-2xl font-medium leading-tight group-hover:text-primary transition-colors">
                {r.label}
              </h3>
              <p className="text-xs text-muted-foreground italic font-display line-clamp-2">
                {lang === "fr" ? r.quote.fr : r.quote.en}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default AfricaShowcase;
