import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import coverImg from "@/assets/cover-hero.png";

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-foreground text-background">
      {/* Background image with parallax */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed opacity-25"
        style={{ backgroundImage: `url(${coverImg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/60" />

      <div className="container relative mx-auto px-4 py-20 md:py-32">
        <div className="max-w-2xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h1 className="text-4xl font-bold leading-tight md:text-6xl lg:text-7xl">
              {t("hero.title")}
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg opacity-80 md:text-xl max-w-lg font-sans"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap gap-3 pt-2"
          >
            <Button size="lg" asChild className="rounded-full text-base gap-2">
              <Link to="/catalog">
                {t("hero.cta.browse")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="rounded-full text-base gap-2 border-background/30 text-background hover:bg-background/10 hover:text-background">
              <Link to="/signup">
                <PenTool className="h-4 w-4" />
                {t("hero.cta.publish")}
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
