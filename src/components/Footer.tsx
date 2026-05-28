import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, ArrowUp, Heart } from "lucide-react";

const Footer = () => {
  const { t, lang } = useLanguage();

  return (
    <footer className="mt-24">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="w-full py-3 text-[11px] font-bold uppercase tracking-[0.25em] text-center bg-secondary hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
      >
        <ArrowUp className="h-3.5 w-3.5" />
        {lang === "fr" ? "Retour en haut" : "Back to top"}
      </button>

      <div className="bg-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0 paper-texture opacity-20 pointer-events-none" />

        <div className="container mx-auto px-4 lg:px-8 py-16 relative z-10">
          <div className="flex flex-col md:flex-row items-start justify-between gap-10 pb-12 border-b border-background/15">
            <div className="space-y-4 max-w-md">
              <div className="flex items-baseline">
                <span className="font-display text-3xl font-bold text-accent">Kitabu</span>
                <span className="font-display text-3xl font-light text-background">Shop</span>
              </div>
              <p className="text-sm text-background/55 leading-relaxed font-light max-w-sm">
                {lang === "fr"
                  ? "La plateforme de référence pour la littérature africaine authentique. Nous connectons les voix d'hier et de demain."
                  : "The reference platform for authentic African literature. We connect the voices of yesterday and tomorrow."}
              </p>
            </div>
            <div className="w-full max-w-sm space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-background/50">Newsletter</p>
              <div className="flex border-b border-background/20 pb-1">
                <Input
                  placeholder={t("footer.newsletter.placeholder")}
                  className="h-10 text-sm bg-transparent border-0 text-background placeholder:text-background/30 rounded-none focus-visible:ring-0 px-0"
                />
                <Button className="rounded-none shrink-0 h-10 px-5 bg-transparent hover:bg-transparent text-accent hover:text-background font-bold text-xs uppercase tracking-widest">OK</Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-12">
            <div className="space-y-5">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-background/50">{lang === "fr" ? "Découvrir" : "Discover"}</h4>
              <div className="flex flex-col gap-3 text-sm text-background/65">
                <Link to="/catalog" className="hover:text-accent transition-colors">{lang === "fr" ? "Catalogue complet" : "Full catalog"}</Link>
                <Link to="/catalog?sort=sales" className="hover:text-accent transition-colors">Best Sellers</Link>
                <Link to="/catalog?sort=new" className="hover:text-accent transition-colors">{lang === "fr" ? "Nouveautés" : "New releases"}</Link>
                <Link to="/catalog?category=education" className="hover:text-accent transition-colors">{lang === "fr" ? "Éducation" : "Education"}</Link>
              </div>
            </div>
            <div className="space-y-5">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-background/50">{lang === "fr" ? "Publier" : "Publish"}</h4>
              <div className="flex flex-col gap-3 text-sm text-background/65">
                <Link to="/signup" className="hover:text-accent transition-colors">Kitabu Direct Publishing</Link>
                <Link to="/signup" className="hover:text-accent transition-colors">{lang === "fr" ? "Devenir auteur" : "Become an author"}</Link>
                <Link to="/about" className="hover:text-accent transition-colors">{lang === "fr" ? "Programme d'affiliation" : "Affiliate program"}</Link>
              </div>
            </div>
            <div className="space-y-5">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-background/50">{lang === "fr" ? "À propos" : "About"}</h4>
              <div className="flex flex-col gap-3 text-sm text-background/65">
                <Link to="/about" className="hover:text-accent transition-colors">{t("nav.about")}</Link>
                <Link to="/help" className="hover:text-accent transition-colors">{lang === "fr" ? "Centre d'aide" : "Help center"}</Link>
                <Link to="/terms" className="hover:text-accent transition-colors">{t("footer.terms")}</Link>
                <Link to="/privacy" className="hover:text-accent transition-colors">{t("footer.privacy")}</Link>
              </div>
            </div>
            <div className="space-y-5">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-background/50">{lang === "fr" ? "Contact" : "Contact"}</h4>
              <div className="flex flex-col gap-3 text-sm text-background/65">
                <a href="tel:+243835377286" className="flex items-start gap-2.5 hover:text-accent transition-colors"><Phone className="h-3.5 w-3.5 shrink-0 mt-0.5" />+243 835 377 286</a>
                <a href="mailto:kitabushop5@gmail.com" className="flex items-start gap-2.5 hover:text-accent transition-colors"><Mail className="h-3.5 w-3.5 shrink-0 mt-0.5" />kitabushop5@gmail.com</a>
                <span className="flex items-start gap-2.5"><MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />Q. Office, av. du Collège, 076, Goma, RDC</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-background/15 relative z-10">
          <div className="container mx-auto px-4 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[11px] text-background/40 uppercase tracking-[0.2em] font-semibold">© {new Date().getFullYear()} KitabuShop · {lang === "fr" ? "L'esprit de l'Afrique" : "The spirit of Africa"} <Heart className="h-3 w-3 inline fill-accent text-accent ml-1" /></span>
            <div className="flex gap-3">
              <a href="https://web.facebook.com/profile.php?id=61579692684157" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="h-9 w-9 flex items-center justify-center border border-background/15 hover:bg-accent hover:border-accent hover:text-foreground transition-all">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Twitter" className="h-9 w-9 flex items-center justify-center border border-background/15 hover:bg-accent hover:border-accent hover:text-foreground transition-all">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Instagram" className="h-9 w-9 flex items-center justify-center border border-background/15 hover:bg-accent hover:border-accent hover:text-foreground transition-all">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
