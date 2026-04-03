import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, ArrowUp, BookOpen, Heart } from "lucide-react";
import logoImg from "@/assets/logo-kitabushop.png";

const Footer = () => {
  const { t, lang } = useLanguage();

  return (
    <footer className="mt-16">
      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="w-full py-3 text-xs font-medium text-center bg-secondary hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
      >
        <ArrowUp className="h-3.5 w-3.5" />
        {lang === "fr" ? "Retour en haut" : "Back to top"}
      </button>

      {/* Main footer */}
      <div className="bg-foreground text-background">
        <div className="container mx-auto px-4 py-12">
          {/* Brand + Newsletter top section */}
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 pb-10 border-b border-background/10">
            <div className="space-y-3 max-w-md">
              <div className="flex items-center gap-2.5">
                <img src={logoImg} alt="KitabuShop" className="h-8 w-auto brightness-0 invert" />
                <div>
                  <span className="text-lg font-extrabold">Kitabu</span>
                  <span className="text-lg font-light opacity-60">Shop</span>
                </div>
              </div>
              <p className="text-xs text-background/40 leading-relaxed">
                {lang === "fr"
                  ? "La première plateforme e-commerce dédiée à la littérature africaine. Un espace où les auteurs et éditeurs peuvent publier leurs œuvres, toucher un large public et être rémunérés."
                  : "The first e-commerce platform dedicated to African literature. A space where authors and publishers can share their works, reach a wide audience and earn revenue."}
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-background/50">Newsletter</p>
              <div className="flex gap-2">
                <Input
                  placeholder={t("footer.newsletter.placeholder")}
                  className="h-10 text-xs bg-background/5 border-background/10 text-background placeholder:text-background/25 rounded-xl focus:ring-primary"
                />
                <Button className="rounded-xl shrink-0 h-10 px-5">{t("footer.newsletter.button")}</Button>
              </div>
            </div>
          </div>

          {/* Links grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10">
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-background/50">{lang === "fr" ? "Explorer" : "Explore"}</h4>
              <div className="flex flex-col gap-2.5 text-sm text-background/60">
                <Link to="/catalog" className="hover:text-background transition-colors">{lang === "fr" ? "Catalogue" : "Catalog"}</Link>
                <Link to="/catalog?sort=sales" className="hover:text-background transition-colors">Best Sellers</Link>
                <Link to="/catalog?sort=new" className="hover:text-background transition-colors">{lang === "fr" ? "Nouveautés" : "New Releases"}</Link>
                <Link to="/catalog?category=education" className="hover:text-background transition-colors">{lang === "fr" ? "Éducation" : "Education"}</Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-background/50">{lang === "fr" ? "Publier" : "Publish"}</h4>
              <div className="flex flex-col gap-2.5 text-sm text-background/60">
                <Link to="/signup" className="hover:text-background transition-colors">Kitabu Direct Publishing</Link>
                <Link to="/signup" className="hover:text-background transition-colors">{lang === "fr" ? "Devenir auteur" : "Become an Author"}</Link>
                <Link to="/about" className="hover:text-background transition-colors">{lang === "fr" ? "Programme d'affiliation" : "Affiliate Program"}</Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-background/50">{lang === "fr" ? "À propos" : "About"}</h4>
              <div className="flex flex-col gap-2.5 text-sm text-background/60">
                <Link to="/about" className="hover:text-background transition-colors">{t("nav.about")}</Link>
                <Link to="/help" className="hover:text-background transition-colors">{lang === "fr" ? "Centre d'aide" : "Help Center"}</Link>
                <Link to="/terms" className="hover:text-background transition-colors">{t("footer.terms")}</Link>
                <Link to="/privacy" className="hover:text-background transition-colors">{t("footer.privacy")}</Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-background/50">{lang === "fr" ? "Contact" : "Contact"}</h4>
              <div className="flex flex-col gap-2.5 text-sm text-background/60">
                <a href="tel:+243835377286" className="flex items-center gap-2 hover:text-background transition-colors"><Phone className="h-3.5 w-3.5 shrink-0" />+243 835 377 286</a>
                <a href="mailto:kitabushop5@gmail.com" className="flex items-center gap-2 hover:text-background transition-colors"><Mail className="h-3.5 w-3.5 shrink-0" />kitabushop5@gmail.com</a>
                <span className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 shrink-0" />Q. Office, av. du Collège, 076, Goma, RDC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-background/10">
          <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-background/30">© {new Date().getFullYear()} KitabuShop · {lang === "fr" ? "Fait avec" : "Made with"} <Heart className="h-3 w-3 inline fill-accent text-accent" /> {lang === "fr" ? "en RDC" : "in DRC"}</span>
            <div className="flex gap-3">
              <a href="https://web.facebook.com/profile.php?id=61579692684157" target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-xl flex items-center justify-center bg-background/5 hover:bg-background/10 transition-colors">
                <Facebook className="h-4 w-4 text-background/50" />
              </a>
              <a href="#" className="h-8 w-8 rounded-xl flex items-center justify-center bg-background/5 hover:bg-background/10 transition-colors">
                <Twitter className="h-4 w-4 text-background/50" />
              </a>
              <a href="#" className="h-8 w-8 rounded-xl flex items-center justify-center bg-background/5 hover:bg-background/10 transition-colors">
                <Instagram className="h-4 w-4 text-background/50" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
