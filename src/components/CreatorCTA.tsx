import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Shield, Globe, Zap, Sparkles, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const CreatorCTA = () => {
  const { t, lang } = useLanguage();

  const features = [
    { icon: Zap, label: lang === "fr" ? "Vitesse Éclair" : "Lightning Speed", desc: lang === "fr" ? "Publication en moins de 5 minutes sur notre réseau mondial." : "Publish in under 5 minutes to our global network." },
    { icon: Shield, label: lang === "fr" ? "Protection IA" : "AI Protection", desc: lang === "fr" ? "Algorithmes avancés pour protéger vos droits et contrer le plagiat." : "Advanced algorithms protect your rights and detect plagiarism." },
    { icon: TrendingUp, label: lang === "fr" ? "Tableau de bord" : "Live Dashboard", desc: lang === "fr" ? "Suivez vos ventes et l'engagement de vos lecteurs en temps réel." : "Track sales and reader engagement in real time." },
    { icon: Globe, label: lang === "fr" ? "Multi-langues" : "Multi-language", desc: lang === "fr" ? "Publiez en Français, Anglais, Swahili, Lingala et plus encore." : "Publish in French, English, Swahili, Lingala and more." },
  ];

  return (
    <section className="relative bg-foreground text-background overflow-hidden">
      {/* Subtle paper texture */}
      <div className="absolute inset-0 paper-texture opacity-30 pointer-events-none" />

      <div className="relative z-10 grid lg:grid-cols-2">
        {/* Left — CTA */}
        <div className="p-10 md:p-16 lg:p-20 space-y-8">
          <div className="inline-flex items-center gap-2 bg-accent px-4 py-1.5 text-[10px] font-black tracking-[0.25em] uppercase text-foreground">
            <Sparkles className="h-3 w-3" />
            Kitabu Direct Publishing
          </div>

          <h2 className="font-display text-5xl md:text-6xl leading-[1.05] text-background font-medium">
            {lang === "fr" ? (
              <>Publiez. Partagez. <br /><span className="italic text-accent">Inspirez le monde.</span></>
            ) : (
              <>Publish. Share. <br /><span className="italic text-accent">Inspire the world.</span></>
            )}
          </h2>

          <p className="text-background/60 max-w-md leading-relaxed font-light text-base">
            {t("cta.creator.subtitle")}
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Button asChild size="lg" className="rounded-none px-10 h-12 text-xs uppercase tracking-[0.2em] font-bold bg-accent text-foreground hover:bg-background hover:text-foreground transition-all hover:-translate-y-0.5">
              <Link to="/signup">{t("cta.creator.button")}<ArrowRight className="h-4 w-4 ml-2" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-none px-10 h-12 text-xs uppercase tracking-[0.2em] font-bold border-background/30 text-background hover:bg-background/5 hover:text-background bg-transparent">
              <Link to="/about">{lang === "fr" ? "Comment ça marche ?" : "How does it work?"}</Link>
            </Button>
          </div>
        </div>

        {/* Right — feature grid */}
        <div className="bg-background/[0.03] backdrop-blur-sm p-10 md:p-16 lg:p-20 border-l border-background/10">
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-10">
            {features.map((f, i) => (
              <div key={i} className="space-y-4">
                <div className="w-12 h-12 bg-accent/10 border border-accent/30 flex items-center justify-center">
                  <f.icon className="w-5 h-5 text-accent" />
                </div>
                <h4 className="font-display text-2xl text-background leading-tight">{f.label}</h4>
                <p className="text-sm text-background/55 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreatorCTA;
