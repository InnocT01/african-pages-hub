import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import logoImg from "@/assets/logo-kitabushop.png";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <img src={logoImg} alt="KitabuShop" className="h-8 w-auto brightness-0 invert" />
            <p className="text-sm opacity-70">{t("footer.tagline")}</p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h4 className="font-sans text-sm font-semibold uppercase tracking-wider opacity-50">KitabuShop</h4>
            <div className="flex flex-col gap-2 text-sm opacity-70">
              <Link to="/catalog" className="hover:opacity-100 transition-opacity">{t("nav.catalog")}</Link>
              <Link to="/catalog?category=diaspora" className="hover:opacity-100 transition-opacity">{t("nav.diaspora")}</Link>
              <Link to="#" className="hover:opacity-100 transition-opacity">{t("footer.about")}</Link>
              <Link to="#" className="hover:opacity-100 transition-opacity">{t("footer.contact")}</Link>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="font-sans text-sm font-semibold uppercase tracking-wider opacity-50">Legal</h4>
            <div className="flex flex-col gap-2 text-sm opacity-70">
              <Link to="#" className="hover:opacity-100 transition-opacity">{t("footer.terms")}</Link>
              <Link to="#" className="hover:opacity-100 transition-opacity">{t("footer.privacy")}</Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="font-sans text-sm font-semibold uppercase tracking-wider opacity-50">{t("footer.newsletter")}</h4>
            <div className="flex gap-2">
              <Input placeholder={t("footer.newsletter.placeholder")} className="bg-background/10 border-background/20 text-background placeholder:text-background/40 rounded-full" />
              <Button size="sm" className="rounded-full shrink-0">{t("footer.newsletter.button")}</Button>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-background/10 pt-6 text-center text-xs opacity-50">
          © {new Date().getFullYear()} KitabuShop. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
