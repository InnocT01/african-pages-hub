import { Link } from "react-router-dom";
import { PenTool, ArrowRight, BookOpen, TrendingUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const CreatorCTA = () => {
  const { t, lang } = useLanguage();

  return (
    <section className="rounded-lg border border-border bg-gradient-to-r from-primary/5 to-accent/5 p-6 md:p-8">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <PenTool className="h-5 w-5 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Kitabu Direct Publishing</span>
          </div>
          <h2 className="text-xl font-extrabold md:text-2xl">{t("cta.creator.title")}</h2>
          <p className="text-sm text-muted-foreground max-w-lg">{t("cta.creator.subtitle")}</p>
          <Button size="sm" asChild className="rounded-sm gap-1.5 font-semibold text-xs">
            <Link to="/signup">{t("cta.creator.button")}<ArrowRight className="h-3.5 w-3.5" /></Link>
          </Button>
        </div>
        <div className="hidden md:flex flex-col gap-2 text-xs">
          <div className="flex items-center gap-2 bg-background rounded-md p-3 border border-border">
            <BookOpen className="h-4 w-4 text-primary" />
            <span>{lang === "fr" ? "Publication en 3 étapes" : "3-Step Publishing"}</span>
          </div>
          <div className="flex items-center gap-2 bg-background rounded-md p-3 border border-border">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span>{lang === "fr" ? "Analytiques en temps réel" : "Real-time Analytics"}</span>
          </div>
          <div className="flex items-center gap-2 bg-background rounded-md p-3 border border-border">
            <Shield className="h-4 w-4 text-primary" />
            <span>{lang === "fr" ? "Anti-plagiat par IA" : "AI Plagiarism Check"}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreatorCTA;
