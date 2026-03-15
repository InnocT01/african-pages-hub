import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, MapPin, Facebook, Phone } from "lucide-react";
import logoImg from "@/assets/logo-kitabushop.png";

const Footer = () => {
  const { t, lang } = useLanguage();

  return (
    <footer className="border-t border-border bg-[hsl(20,45%,22%)] text-[hsl(30,25%,97%)]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <img src={logoImg} alt="KitabuShop" className="h-8 w-auto brightness-0 invert" />
            <p className="text-sm opacity-70">{t("footer.description")}</p>
            <div className="flex items-center gap-3">
              <a href="https://web.facebook.com/profile.php?id=61579692684157" target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 transition-opacity">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-sans text-sm font-semibold uppercase tracking-wider opacity-50">Contact</h4>
            <div className="flex flex-col gap-3 text-sm opacity-70">
              <a href="mailto:kitabushop5@gmail.com" className="flex items-center gap-2 hover:opacity-100 transition-opacity">
                <Mail className="h-4 w-4 shrink-0" />kitabushop5@gmail.com
              </a>
              <a href="tel:+243998881102" className="flex items-center gap-2 hover:opacity-100 transition-opacity">
                <Phone className="h-4 w-4 shrink-0" />+243 998 881 102
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span>Q. Office, avenue du Collège, 076, Goma-RDC</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-sans text-sm font-semibold uppercase tracking-wider opacity-50">KitabuShop</h4>
            <div className="flex flex-col gap-2 text-sm opacity-70">
              <Link to="/catalog" className="hover:opacity-100 transition-opacity">{t("nav.catalog")}</Link>
              <Link to="/about" className="hover:opacity-100 transition-opacity">{t("footer.about")}</Link>
              <Link to="/terms" className="hover:opacity-100 transition-opacity">{t("footer.terms")}</Link>
              <Link to="/privacy" className="hover:opacity-100 transition-opacity">{t("footer.privacy")}</Link>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-sans text-sm font-semibold uppercase tracking-wider opacity-50">{t("footer.newsletter")}</h4>
            <div className="flex gap-2">
              <Input placeholder={t("footer.newsletter.placeholder")} className="bg-white/10 border-white/20 text-[hsl(30,25%,97%)] placeholder:text-white/40 rounded-full" />
              <Button size="sm" className="rounded-full shrink-0">{t("footer.newsletter.button")}</Button>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs opacity-50">
          © {new Date().getFullYear()} KitabuShop. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
