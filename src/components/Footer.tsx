import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react";
import logoImg from "@/assets/logo-kitabushop.png";

const Footer = () => {
  const { t, lang } = useLanguage();

  return (
    <footer className="bg-foreground text-primary-foreground/80">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={logoImg} alt="KitabuShop" className="h-8 w-auto brightness-0 invert" />
              <span className="text-lg font-extrabold text-primary-foreground">KitabuShop</span>
            </div>
            <p className="text-sm leading-relaxed text-primary-foreground/50">{t("footer.description")}</p>
            <div className="flex gap-3">
              <a href="https://web.facebook.com/profile.php?id=61579692684157" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"><Facebook className="h-4 w-4" /></a>
              <a href="#" className="h-9 w-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"><Twitter className="h-4 w-4" /></a>
              <a href="#" className="h-9 w-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"><Instagram className="h-4 w-4" /></a>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-primary-foreground text-sm uppercase tracking-wider">{lang === "fr" ? "Explorer" : "Explore"}</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/catalog" className="text-sm hover:text-primary transition-colors">{t("nav.catalog")}</Link>
              <Link to="/catalog?category=literature" className="text-sm hover:text-primary transition-colors">{t("nav.literature")}</Link>
              <Link to="/catalog?category=education" className="text-sm hover:text-primary transition-colors">{t("nav.education")}</Link>
              <Link to="/catalog?category=youth" className="text-sm hover:text-primary transition-colors">{t("nav.youth")}</Link>
              <Link to="/about" className="text-sm hover:text-primary transition-colors">{t("nav.about")}</Link>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-primary-foreground text-sm uppercase tracking-wider">{lang === "fr" ? "Légal" : "Legal"}</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/terms" className="text-sm hover:text-primary transition-colors">{t("footer.terms")}</Link>
              <Link to="/privacy" className="text-sm hover:text-primary transition-colors">{t("footer.privacy")}</Link>
              <Link to="/signup" className="text-sm hover:text-primary transition-colors">{t("cta.creator.button")}</Link>
            </div>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold text-primary-foreground text-sm uppercase tracking-wider">{t("footer.contact")}</h4>
            <div className="flex flex-col gap-2.5">
              <a href="tel:+243835377286" className="text-sm flex items-center gap-2 hover:text-primary transition-colors"><Phone className="h-3.5 w-3.5" />+243 835 377 286</a>
              <a href="mailto:kitabushop5@gmail.com" className="text-sm flex items-center gap-2 hover:text-primary transition-colors"><Mail className="h-3.5 w-3.5" />kitabushop5@gmail.com</a>
              <span className="text-sm flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />Goma, RDC</span>
            </div>
            <div className="pt-2">
              <p className="text-xs font-semibold text-primary-foreground mb-2">{t("footer.newsletter")}</p>
              <div className="flex gap-2">
                <Input placeholder={t("footer.newsletter.placeholder")} className="h-9 text-xs bg-primary-foreground/10 border-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/30 rounded-full" />
                <Button size="sm" className="rounded-full text-xs shrink-0">{t("footer.newsletter.button")}</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-primary-foreground/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-primary-foreground/40">© {new Date().getFullYear()} KitabuShop. {t("footer.rights")}</p>
          <p className="text-xs text-primary-foreground/40">{t("footer.tagline")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
