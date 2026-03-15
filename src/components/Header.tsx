import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Menu, X, Globe, User, LogOut, Phone, ChevronDown, BookOpen, Headphones, GraduationCap, FileText, Newspaper, Image, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import logoImg from "@/assets/logo-kitabushop.png";

const Header = () => {
  const { t, lang, setLang } = useLanguage();
  const { itemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const categories = [
    { key: "nav.catalog", path: "/catalog", icon: BookOpen },
    { key: "nav.education", path: "/catalog?category=education", icon: GraduationCap },
    { key: "nav.literature", path: "/catalog?category=literature", icon: BookOpen },
    { key: "nav.youth", path: "/catalog?category=youth", icon: BookOpen },
    { key: "nav.bd", path: "/catalog?type=bd", icon: Image },
    { key: "nav.manuels", path: "/catalog?category=manuels_scolaires", icon: GraduationCap },
    { key: "nav.revues", path: "/catalog?category=revues_scientifiques", icon: FileText },
    { key: "nav.national_languages", path: "/catalog?category=national_languages", icon: BookOpen },
    { key: "nav.diaspora", path: "/catalog?category=diaspora", icon: BookOpen },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
  };

  const dashboardPath = user?.role === "creator" ? "/creator" : "/reader";

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar - warm terracotta/amber African palette */}
      <div className="bg-[hsl(20,45%,22%)] text-[hsl(30,25%,97%)]">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex shrink-0 items-center gap-2">
              <img src={logoImg} alt="KitabuShop" className="h-10 w-auto brightness-0 invert" />
              <div className="hidden sm:block">
                <span className="text-lg font-bold tracking-tight font-sans">KitabuShop</span>
                <p className="text-[10px] opacity-60 font-sans -mt-1">{lang === "fr" ? "Lisez · Publiez · Grandissez" : "Read · Publish · Grow"}</p>
              </div>
            </Link>

            {/* Search - dominant */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-4">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("nav.search")}
                  className="pl-11 pr-4 h-11 rounded-full bg-[hsl(30,25%,97%)] text-foreground border-0 shadow-inner focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
            </form>

            {/* Right actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Service client */}
              <a href="tel:+243998881102" className="hidden lg:flex items-center gap-2 text-xs opacity-80 hover:opacity-100 transition-opacity mr-2">
                <Phone className="h-4 w-4" />
                <div className="text-left">
                  <p className="text-[10px] opacity-70">{lang === "fr" ? "Service Client" : "Support"}</p>
                  <p className="font-semibold font-sans">+243 998 881 102</p>
                </div>
              </a>

              {/* Lang */}
              <Button variant="ghost" size="sm" onClick={() => setLang(lang === "fr" ? "en" : "fr")} className="text-[hsl(30,25%,97%)] hover:bg-white/10 hidden sm:flex items-center gap-1 text-xs">
                <Globe className="h-4 w-4" />{lang === "fr" ? "EN" : "FR"}
              </Button>

              {/* Auth */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-[hsl(30,25%,97%)] hover:bg-white/10 gap-1">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline text-xs">{t("nav.dashboard")}</span>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild><Link to={dashboardPath}>{t("nav.dashboard")}</Link></DropdownMenuItem>
                    <DropdownMenuItem onClick={() => logout()}>{t("nav.logout")}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden sm:flex items-center gap-1">
                  <Button variant="ghost" size="sm" asChild className="text-[hsl(30,25%,97%)] hover:bg-white/10 text-xs">
                    <Link to="/login">{t("nav.login")}</Link>
                  </Button>
                  <Button size="sm" asChild className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs">
                    <Link to="/signup">{t("nav.signup")}</Link>
                  </Button>
                </div>
              )}

              {/* Cart */}
              <Button variant="ghost" size="icon" asChild className="relative text-[hsl(30,25%,97%)] hover:bg-white/10">
                <Link to="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground">{itemCount}</Badge>
                  )}
                </Link>
              </Button>

              {/* Mobile toggle */}
              <Button variant="ghost" size="icon" className="md:hidden text-[hsl(30,25%,97%)] hover:bg-white/10" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Category nav bar */}
      <div className="bg-[hsl(25,35%,30%)] text-[hsl(30,25%,97%)] border-b border-[hsl(25,35%,25%)]">
        <div className="container mx-auto px-4">
          <nav className="hidden md:flex items-center gap-1 py-1.5 text-sm overflow-x-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-[hsl(30,25%,97%)] hover:bg-white/10 gap-1 font-semibold text-xs">
                  <Menu className="h-4 w-4" />
                  {lang === "fr" ? "NOS CATÉGORIES" : "CATEGORIES"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {categories.map((cat) => (
                  <DropdownMenuItem key={cat.key} asChild>
                    <Link to={cat.path} className="flex items-center gap-2">
                      <cat.icon className="h-4 w-4" />
                      {t(cat.key)}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/about" className="px-3 py-1.5 text-xs opacity-80 hover:opacity-100 transition-opacity">{t("nav.about")}</Link>
            <Link to="/terms" className="px-3 py-1.5 text-xs opacity-80 hover:opacity-100 transition-opacity">{t("footer.terms")}</Link>
            <Link to="/privacy" className="px-3 py-1.5 text-xs opacity-80 hover:opacity-100 transition-opacity">{t("footer.privacy")}</Link>
            {categories.slice(1, 6).map((cat) => (
              <Link key={cat.key} to={cat.path} className="px-3 py-1.5 text-xs opacity-80 hover:opacity-100 transition-opacity shrink-0">{t(cat.key)}</Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 pb-4 pt-2 shadow-lg">
          <form onSubmit={handleSearch} className="mb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t("nav.search")} className="pl-10 rounded-full" />
            </div>
          </form>
          <div className="flex flex-col gap-1">
            {categories.map((cat) => (
              <Link key={cat.key} to={cat.path} className="flex items-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>
                <cat.icon className="h-4 w-4" />
                {t(cat.key)}
              </Link>
            ))}
            <hr className="my-2 border-border" />
            <Button variant="ghost" size="sm" onClick={() => setLang(lang === "fr" ? "en" : "fr")} className="justify-start">
              <Globe className="h-4 w-4 mr-2" />{lang === "fr" ? "English" : "Français"}
            </Button>
            {isAuthenticated ? (
              <>
                <Link to={dashboardPath} className="py-2 font-medium text-sm" onClick={() => setMobileOpen(false)}>{t("nav.dashboard")}</Link>
                <Button variant="ghost" size="sm" onClick={() => { logout(); setMobileOpen(false); }} className="justify-start text-sm">{t("nav.logout")}</Button>
              </>
            ) : (
              <>
                <Link to="/login" className="py-2 text-sm" onClick={() => setMobileOpen(false)}>{t("nav.login")}</Link>
                <Link to="/signup" className="py-2 font-medium text-primary text-sm" onClick={() => setMobileOpen(false)}>{t("nav.signup")}</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
