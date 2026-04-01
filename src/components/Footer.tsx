import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react";
import logoImg from "@/assets/logo-kitabushop.png";

const Footer = () => {
  const { t, lang } = useLanguage();

  return (
    <footer>
      {/* Back to top */}
      <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="w-full py-3 text-xs font-medium text-center header-bg hover:opacity-90 transition-opacity">
        {lang === "fr" ? "Retour en haut" : "Back to top"}
      </button>

      {/* Main footer */}
      <div className="nav-bg">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <h4 className="font-bold text-sm">{lang === "fr" ? "Mieux nous connaître" : "Get to Know Us"}</h4>
              <div className="flex flex-col gap-2 text-xs opacity-70">
                <Link to="/about" className="hover:underline">{t("nav.about")}</Link>
                <Link to="/help" className="hover:underline">{lang === "fr" ? "Centre d'aide" : "Help Center"}</Link>
                <a href="https://web.facebook.com/profile.php?id=61579692684157" target="_blank" rel="noopener noreferrer" className="hover:underline">Blog</a>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-sm">{lang === "fr" ? "Gagnez de l'argent" : "Make Money"}</h4>
              <div className="flex flex-col gap-2 text-xs opacity-70">
                <Link to="/signup" className="hover:underline">Kitabu Direct Publishing</Link>
                <Link to="/signup" className="hover:underline">{lang === "fr" ? "Devenir auteur" : "Become an Author"}</Link>
                <Link to="/signup" className="hover:underline">{lang === "fr" ? "Programme d'affiliation" : "Affiliate Program"}</Link>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-sm">{lang === "fr" ? "Informations légales" : "Legal"}</h4>
              <div className="flex flex-col gap-2 text-xs opacity-70">
                <Link to="/terms" className="hover:underline">{t("footer.terms")}</Link>
                <Link to="/privacy" className="hover:underline">{t("footer.privacy")}</Link>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-sm">{lang === "fr" ? "Service client" : "Customer Service"}</h4>
              <div className="flex flex-col gap-2 text-xs opacity-70">
                <a href="tel:+243835377286" className="flex items-center gap-1.5 hover:underline"><Phone className="h-3 w-3" />+243 835 377 286</a>
                <a href="mailto:kitabushop5@gmail.com" className="flex items-center gap-1.5 hover:underline"><Mail className="h-3 w-3" />kitabushop5@gmail.com</a>
                <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" />Goma, RDC</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src={logoImg} alt="KitabuShop" className="h-6 w-auto brightness-0 invert" />
              <span className="text-sm font-extrabold">{lang === "fr" ? "Newsletter" : "Newsletter"}</span>
            </div>
            <div className="flex gap-2 max-w-sm w-full">
              <Input placeholder={t("footer.newsletter.placeholder")} className="h-8 text-xs bg-white/10 border-white/10 text-white placeholder:text-white/30 rounded-sm" />
              <Button size="sm" className="rounded-sm text-xs shrink-0">{t("footer.newsletter.button")}</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="header-bg">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <img src={logoImg} alt="KitabuShop" className="h-5 w-auto brightness-0 invert" />
            <span className="text-xs font-bold">KitabuShop</span>
          </div>
          <div className="flex items-center gap-4 text-[10px] opacity-50">
            <Link to="/terms" className="hover:underline">{t("footer.terms")}</Link>
            <Link to="/privacy" className="hover:underline">{t("footer.privacy")}</Link>
            <span>© {new Date().getFullYear()} KitabuShop</span>
          </div>
          <div className="flex gap-2">
            <a href="https://web.facebook.com/profile.php?id=61579692684157" target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100"><Facebook className="h-4 w-4" /></a>
            <a href="#" className="opacity-50 hover:opacity-100"><Twitter className="h-4 w-4" /></a>
            <a href="#" className="opacity-50 hover:opacity-100"><Instagram className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
