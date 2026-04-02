import { Link } from "react-router-dom";
import { PenTool, ArrowRight, BookOpen, TrendingUp, Shield, Globe, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const CreatorCTA = () => {
  const { t, lang } = useLanguage();

  return (
    <section className="rounded-xl overflow-hidden kente-pattern">
      <div className="bg-gradient-to-r from-[hsl(var(--header-bg))] via-[hsl(var(--earth-brown))] to-[hsl(var(--header-bg))] p-6 md:p-10">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-4 text-white">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-8 bg-gradient-to-r from-primary via-[hsl(var(--kente-gold))] to-accent rounded-full" />
              <span className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--kente-gold))]">Kitabu Direct Publishing</span>
            </div>
            <h2 className="text-2xl font-extrabold md:text-3xl font-display leading-tight">
              {lang === "fr" 
                ? "Publiez votre œuvre. Touchez l'Afrique."
                : "Publish your work. Reach Africa."}
            </h2>
            <p className="text-sm text-white/60 max-w-lg">
              {t("cta.creator.subtitle")}
            </p>
            <div className="flex gap-3 pt-2">
              <Button size="sm" asChild className="rounded-full gap-1.5 font-semibold text-xs bg-primary hover:bg-primary/90">
                <Link to="/signup">{t("cta.creator.button")}<ArrowRight className="h-3.5 w-3.5" /></Link>
              </Button>
              <Button size="sm" asChild variant="outline" className="rounded-full text-xs border-white/20 text-white hover:bg-white/10">
                <Link to="/about">{lang === "fr" ? "En savoir plus" : "Learn More"}</Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-2 gap-3 text-xs text-white/80">
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <BookOpen className="h-5 w-5 text-[hsl(var(--kente-gold))] shrink-0" />
              <span>{lang === "fr" ? "Publication en 3 étapes" : "3-Step Publishing"}</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <TrendingUp className="h-5 w-5 text-primary shrink-0" />
              <span>{lang === "fr" ? "Analytiques temps réel" : "Real-time Analytics"}</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <Shield className="h-5 w-5 text-accent shrink-0" />
              <span>{lang === "fr" ? "Anti-plagiat par IA" : "AI Plagiarism Check"}</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <Globe className="h-5 w-5 text-[hsl(var(--kente-gold))] shrink-0" />
              <span>{lang === "fr" ? "Multi-devises" : "Multi-currency"}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreatorCTA;
