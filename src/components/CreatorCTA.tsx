import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PenTool, ArrowRight, BookOpen, TrendingUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const CreatorCTA = () => {
  const { t, lang } = useLanguage();

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-accent p-8 md:p-14 text-primary-foreground">
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary-foreground/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-foreground/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <PenTool className="h-8 w-8" />
              <span className="text-sm font-semibold uppercase tracking-wider opacity-70">Kitabu Direct Publishing</span>
            </div>
            <h2 className="text-3xl font-extrabold md:text-4xl">{t("cta.creator.title")}</h2>
            <p className="text-base opacity-70 max-w-lg">{t("cta.creator.subtitle")}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button size="lg" variant="secondary" asChild className="rounded-full gap-2 font-semibold">
                <Link to="/signup">{t("cta.creator.button")}<ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:flex flex-col gap-4">
            <div className="flex items-center gap-3 bg-primary-foreground/10 rounded-xl p-4">
              <BookOpen className="h-6 w-6" />
              <div><p className="font-semibold text-sm">{lang === "fr" ? "Publication en 3 étapes" : "3-Step Publishing"}</p><p className="text-xs opacity-60">{lang === "fr" ? "Simple et rapide" : "Simple and fast"}</p></div>
            </div>
            <div className="flex items-center gap-3 bg-primary-foreground/10 rounded-xl p-4">
              <TrendingUp className="h-6 w-6" />
              <div><p className="font-semibold text-sm">{lang === "fr" ? "Analytiques en temps réel" : "Real-time Analytics"}</p><p className="text-xs opacity-60">{lang === "fr" ? "Suivez vos ventes" : "Track your sales"}</p></div>
            </div>
            <div className="flex items-center gap-3 bg-primary-foreground/10 rounded-xl p-4">
              <Shield className="h-6 w-6" />
              <div><p className="font-semibold text-sm">{lang === "fr" ? "Anti-plagiat par IA" : "AI Plagiarism Check"}</p><p className="text-xs opacity-60">{lang === "fr" ? "Protection de vos œuvres" : "Protect your works"}</p></div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CreatorCTA;
