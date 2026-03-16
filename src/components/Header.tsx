import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Menu, X, Globe, User, LogOut, Phone, ChevronDown, BookOpen, Headphones, GraduationCap, FileText, Newspaper, Image, PenTool, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
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
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-3">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <img src={logoImg} alt="KitabuShop" className="h-9 w-auto" />
            <div className="hidden sm:block">
              <span className="text-lg font-extrabold tracking-tight text-foreground">KitabuShop</span>
            </div>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-6">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("nav.search")}
                className="pl-11 pr-4 h-11 rounded-full bg-secondary border-0 focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {/* KDP Link */}
            {isAuthenticated && user?.role === "creator" && (
              <Button variant="ghost" size="sm" asChild className="hidden lg:flex items-center gap-1.5 text-primary font-semibold text-xs">
                <Link to="/creator?tab=upload"><PenTool className="h-4 w-4" />KDP</Link>
              </Button>
            )}

            {/* Contact */}
            <a href="tel:+243835377286" className="hidden xl:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mr-1">
              <Phone className="h-3.5 w-3.5" />
              <span className="font-medium">+243 835 377 286</span>
            </a>

            {/* Lang */}
            <Button variant="ghost" size="icon" onClick={() => setLang(lang === "fr" ? "en" : "fr")} className="text-muted-foreground hover:text-foreground">
              <Globe className="h-4 w-4" />
            </Button>

            {/* Auth */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-sm font-medium truncate">{user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <DropdownMenuItem asChild><Link to={dashboardPath}>{t("nav.dashboard")}</Link></DropdownMenuItem>
                  {user?.role === "creator" && (
                    <DropdownMenuItem asChild><Link to="/creator?tab=upload">Kitabu Direct Publishing</Link></DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} className="text-destructive">{t("nav.logout")}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-1">
                <Button variant="ghost" size="sm" asChild className="text-xs font-medium">
                  <Link to="/login">{t("nav.login")}</Link>
                </Button>
                <Button size="sm" asChild className="rounded-full text-xs font-semibold">
                  <Link to="/signup">{t("nav.signup")}</Link>
                </Button>
              </div>
            )}

            {/* Cart */}
            <Button variant="ghost" size="icon" asChild className="relative text-muted-foreground hover:text-foreground">
              <Link to="/cart">
                <ShoppingCart className="h-4 w-4" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[9px] bg-primary text-primary-foreground">{itemCount}</Badge>
                )}
              </Link>
            </Button>

            {/* Mobile */}
            <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Category nav */}
      <div className="border-t border-border bg-background">
        <div className="container mx-auto px-4">
          <nav className="hidden md:flex items-center gap-0.5 py-0 text-sm overflow-x-auto scrollbar-hide">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1.5 font-semibold text-xs h-10 rounded-none border-b-2 border-transparent hover:border-primary hover:bg-transparent text-foreground">
                  <Menu className="h-3.5 w-3.5" />
                  {lang === "fr" ? "Catégories" : "Categories"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {categories.map((cat) => (
                  <DropdownMenuItem key={cat.key} asChild>
                    <Link to={cat.path} className="flex items-center gap-2">
                      <cat.icon className="h-4 w-4" />{t(cat.key)}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {categories.slice(1, 7).map((cat) => (
              <Link key={cat.key} to={cat.path} className="px-3 h-10 flex items-center text-xs text-muted-foreground hover:text-primary border-b-2 border-transparent hover:border-primary transition-colors shrink-0">
                {t(cat.key)}
              </Link>
            ))}
            <Link to="/about" className="px-3 h-10 flex items-center text-xs text-muted-foreground hover:text-primary border-b-2 border-transparent hover:border-primary transition-colors">
              {t("nav.about")}
            </Link>
            {isAuthenticated && user?.role === "creator" && (
              <Link to="/creator?tab=upload" className="ml-auto px-3 h-10 flex items-center gap-1.5 text-xs font-semibold text-primary border-b-2 border-primary">
                <PenTool className="h-3.5 w-3.5" />Kitabu Direct Publishing
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 pb-4 pt-2 shadow-lg animate-in slide-in-from-top-2">
          <form onSubmit={handleSearch} className="mb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t("nav.search")} className="pl-10 rounded-full bg-secondary border-0" />
            </div>
          </form>
          <div className="flex flex-col gap-0.5">
            {categories.map((cat) => (
              <Link key={cat.key} to={cat.path} className="flex items-center gap-2.5 py-2.5 px-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors" onClick={() => setMobileOpen(false)}>
                <cat.icon className="h-4 w-4" />{t(cat.key)}
              </Link>
            ))}
            <hr className="my-2 border-border" />
            <Button variant="ghost" size="sm" onClick={() => setLang(lang === "fr" ? "en" : "fr")} className="justify-start">
              <Globe className="h-4 w-4 mr-2" />{lang === "fr" ? "English" : "Français"}
            </Button>
            {isAuthenticated ? (
              <>
                <Link to={dashboardPath} className="py-2.5 px-2 font-medium text-sm hover:bg-secondary rounded-lg" onClick={() => setMobileOpen(false)}>{t("nav.dashboard")}</Link>
                {user?.role === "creator" && (
                  <Link to="/creator?tab=upload" className="py-2.5 px-2 font-medium text-sm text-primary hover:bg-secondary rounded-lg flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                    <PenTool className="h-4 w-4" />Kitabu Direct Publishing
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={() => { logout(); setMobileOpen(false); }} className="justify-start text-sm text-destructive">{t("nav.logout")}</Button>
              </>
            ) : (
              <>
                <Link to="/login" className="py-2.5 px-2 text-sm hover:bg-secondary rounded-lg" onClick={() => setMobileOpen(false)}>{t("nav.login")}</Link>
                <Link to="/signup" className="py-2.5 px-2 font-semibold text-primary text-sm hover:bg-secondary rounded-lg" onClick={() => setMobileOpen(false)}>{t("nav.signup")}</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
