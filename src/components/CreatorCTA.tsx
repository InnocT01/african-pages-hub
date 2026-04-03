import { Link } from "react-router-dom";
import { PenTool, ArrowRight, BookOpen, TrendingUp, Shield, Globe, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const CreatorCTA = () => {
  const { t, lang } = useLanguage();

  const features = [
    { icon: Zap, label: lang === "fr" ? "Publication en 3 min" : "Publish in 3 min" },
    { icon: TrendingUp, label: lang === "fr" ? "Analytiques en temps réel" : "Real-time Analytics" },
    { icon: Shield, label: lang === "fr" ? "Anti-plagiat IA" : "AI Plagiarism Check" },
    { icon: Globe, label: lang === "fr" ? "Multi-devises & langues" : "Multi-currency & Languages" },
  ];

  return (
    <section className="rounded-3xl overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground/95 to-foreground/90" />
      <div className="absolute inset-0 kente-pattern opacity-20" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-gold to-accent" />
      
      <div className="relative z-10 p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              <span className="text-xs font-bold uppercase tracking-wider text-gold">Kitabu Direct Publishing</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-extrabold text-background leading-tight font-display">
              {lang === "fr" 
                ? "Publiez. Partagez. Inspirez."
                : "Publish. Share. Inspire."}
            </h2>
            
            <p className="text-sm text-background/50 max-w-lg leading-relaxed">
              {t("cta.creator.subtitle")}
            </p>
            
            <div className="flex gap-3 pt-2">
              <Button size="lg" asChild className="rounded-2xl gap-2 font-bold bg-primary hover:bg-primary/90 shadow-glow">
                <Link to="/signup">{t("cta.creator.button")}<ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button size="lg" asChild variant="outline" className="rounded-2xl border-background/20 text-background hover:bg-background/10 hover:text-background">
                <Link to="/about">{lang === "fr" ? "En savoir plus" : "Learn More"}</Link>
              </Button>
            </div>
          </div>
          
          <div className="hidden md:grid grid-cols-2 gap-3 w-[360px] shrink-0">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3 bg-background/5 backdrop-blur-sm rounded-2xl p-4 border border-background/10 hover:bg-background/10 transition-colors">
                <div className="h-9 w-9 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                  <f.icon className="h-4 w-4 text-gold" />
                </div>
                <span className="text-xs text-background/70 font-medium leading-tight">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreatorCTA;
