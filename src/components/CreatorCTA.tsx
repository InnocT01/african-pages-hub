import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PenTool, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const CreatorCTA = () => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80 p-8 md:p-14 text-primary-foreground">
      <div className="absolute top-0 right-0 w-64 h-64 bg-background/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-background/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative space-y-4 max-w-xl"
      >
        <PenTool className="h-10 w-10" />
        <h2 className="text-3xl font-bold md:text-4xl">{t("cta.creator.title")}</h2>
        <p className="text-base opacity-80 font-sans">{t("cta.creator.subtitle")}</p>
        <Button size="lg" variant="secondary" asChild className="rounded-full gap-2 mt-2">
          <Link to="/signup">{t("cta.creator.button")}<ArrowRight className="h-4 w-4" /></Link>
        </Button>
      </motion.div>
    </section>
  );
};

export default CreatorCTA;
