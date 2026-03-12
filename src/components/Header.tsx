import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Menu, X, Globe, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import logoImg from "@/assets/logo-kitabushop.png";

const Header = () => {
  const { t, lang, setLang } = useLanguage();
  const { itemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const categories = [
    { key: "nav.education", path: "/catalog?category=education" },
    { key: "nav.literature", path: "/catalog?category=literature" },
    { key: "nav.youth", path: "/catalog?category=youth" },
    { key: "nav.diaspora", path: "/catalog?category=diaspora" },
    { key: "nav.national_languages", path: "/catalog?category=national_languages" },
    { key: "nav.bd", path: "/catalog?genre=BD" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
  };

  const dashboardPath = user?.role === "creator" ? "/creator" : "/reader";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <img src={logoImg} alt="KitabuShop" className="h-9 w-auto" />
          </Link>

          <form onSubmit={handleSearch} className="hidden flex-1 max-w-xl md:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("nav.search")}
                className="pl-10 rounded-full border-border bg-muted/50 focus-visible:ring-primary"
              />
            </div>
          </form>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLang(lang === "fr" ? "en" : "fr")}
              className="hidden sm:flex items-center gap-1 text-xs font-medium"
            >
              <Globe className="h-4 w-4" />
              {lang === "fr" ? "EN" : "FR"}
            </Button>

            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                  <Link to={dashboardPath}>
                    <User className="h-4 w-4 mr-1" />
                    {t("nav.dashboard")}
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => logout()} className="hidden sm:flex">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                  <Link to="/login">{t("nav.login")}</Link>
                </Button>
                <Button size="sm" asChild className="hidden sm:flex rounded-full">
                  <Link to="/signup">{t("nav.signup")}</Link>
                </Button>
              </>
            )}

            <Button variant="ghost" size="icon" asChild className="relative">
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground">
                    {itemCount}
                  </Badge>
                )}
              </Link>
            </Button>

            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 pb-2 text-sm">
          <Link to="/catalog" className="font-medium text-foreground hover:text-primary transition-colors">
            {t("nav.catalog")}
          </Link>
          {categories.map((cat) => (
            <Link key={cat.key} to={cat.path} className="text-muted-foreground hover:text-foreground transition-colors">
              {t(cat.key)}
            </Link>
          ))}
        </nav>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 pb-4 pt-2">
          <form onSubmit={handleSearch} className="mb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t("nav.search")} className="pl-10" />
            </div>
          </form>
          <div className="flex flex-col gap-2">
            <Link to="/catalog" className="py-2 font-medium" onClick={() => setMobileOpen(false)}>{t("nav.catalog")}</Link>
            {categories.map((cat) => (
              <Link key={cat.key} to={cat.path} className="py-2 text-muted-foreground" onClick={() => setMobileOpen(false)}>
                {t(cat.key)}
              </Link>
            ))}
            <hr className="my-2 border-border" />
            <Button variant="ghost" size="sm" onClick={() => setLang(lang === "fr" ? "en" : "fr")} className="justify-start">
              <Globe className="h-4 w-4 mr-2" />{lang === "fr" ? "English" : "Français"}
            </Button>
            {isAuthenticated ? (
              <>
                <Link to={dashboardPath} className="py-2 font-medium" onClick={() => setMobileOpen(false)}>{t("nav.dashboard")}</Link>
                <Button variant="ghost" onClick={() => { logout(); setMobileOpen(false); }} className="justify-start">{t("nav.logout")}</Button>
              </>
            ) : (
              <>
                <Link to="/login" className="py-2" onClick={() => setMobileOpen(false)}>{t("nav.login")}</Link>
                <Link to="/signup" className="py-2 font-medium text-primary" onClick={() => setMobileOpen(false)}>{t("nav.signup")}</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
