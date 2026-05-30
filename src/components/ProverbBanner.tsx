import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const PROVERBS = [
  { fr: "« Tant que les lions n'auront pas leurs propres historiens, l'histoire de la chasse glorifiera toujours le chasseur. »", en: "« Until the lion has his own historian, the hunt will always glorify the hunter. »", source: "Proverbe africain" },
  { fr: "« Un vieillard qui meurt, c'est une bibliothèque qui brûle. »", en: "« When an old man dies, a library burns to the ground. »", source: "Amadou Hampâté Bâ" },
  { fr: "« Seul on va plus vite, ensemble on va plus loin. »", en: "« If you want to go fast, go alone. If you want to go far, go together. »", source: "Proverbe africain" },
  { fr: "« La sagesse est comme un baobab, nul ne peut l'embrasser seul. »", en: "« Wisdom is like a baobab tree; no one can embrace it alone. »", source: "Proverbe Akan" },
];

const ProverbBanner = () => {
  const { lang } = useLanguage();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % PROVERBS.length), 7000);
    return () => clearInterval(t);
  }, []);

  const p = PROVERBS[idx];

  return (
    <section className="relative overflow-hidden bg-foreground text-background">
      <div className="absolute inset-0 kente-pattern opacity-[0.07] pointer-events-none" />
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-accent" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold">
              {lang === "fr" ? "Sagesse" : "Wisdom"}
            </span>
            <span className="h-px w-10 bg-accent" />
          </div>
          <blockquote
            key={idx}
            className="font-display text-2xl md:text-4xl leading-snug text-balance italic animate-fade-up"
          >
            {lang === "fr" ? p.fr : p.en}
          </blockquote>
          <p className="text-[11px] uppercase tracking-[0.25em] text-background/60 font-bold">— {p.source}</p>
          <div className="flex justify-center gap-1.5 pt-2">
            {PROVERBS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Proverbe ${i + 1}`}
                className={`h-px transition-all ${i === idx ? "w-8 bg-accent" : "w-4 bg-background/30 hover:bg-background/50"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProverbBanner;
