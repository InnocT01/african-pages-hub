import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Menu, X, Globe, ChevronDown, PenTool, DollarSign, Heart, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency, currencies } from "@/contexts/CurrencyContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import NotificationBell from "@/components/NotificationBell";
import SearchAutocomplete from "@/components/SearchAutocomplete";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

const Header = () => {
  const { t, lang, setLang } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const { itemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
  };

  const dashboardPath = user?.role === "creator" ? "/creator" : "/reader";

  const categories = [
    { label: lang === "fr" ? "Littérature" : "Literature", path: "/catalog?category=literature" },
    { label: lang === "fr" ? "Éducation" : "Education", path: "/catalog?category=education" },
    { label: lang === "fr" ? "Jeunesse" : "Youth", path: "/catalog?category=youth" },
    { label: lang === "fr" ? "Diaspora" : "Diaspora", path: "/catalog?category=diaspora" },
    { label: "BD", path: "/catalog?type=bd" },
    { label: lang === "fr" ? "Best-sellers" : "Best Sellers", path: "/catalog?sort=sales" },
    { label: lang === "fr" ? "Nouveautés" : "New", path: "/catalog?sort=new" },
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* Main bar */}
      <div className="bg-card/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-20 items-center gap-4">
            {/* Logo */}
            <Link to="/" className="flex shrink-0 items-baseline gap-0 mr-3 group">
              <span className="font-display text-3xl font-bold text-primary tracking-tight">Kitabu</span>
              <span className="font-display text-3xl font-light text-foreground tracking-tight">Shop</span>
            </Link>

            {/* Search with live autocomplete */}
            <SearchAutocomplete />

            {/* Right actions */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Language */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hidden sm:flex items-center gap-1.5 px-2 py-2 text-xs font-semibold hover:text-primary transition-colors">
                    <Globe className="h-3.5 w-3.5" />
                    <span>{lang.toUpperCase()}</span>
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-none">
                  {([["fr","Français"],["en","English"],["sw","Kiswahili"],["ln","Lingála"]] as const).map(([code, label]) => (
                    <DropdownMenuItem key={code} onClick={() => setLang(code as any)} className={`rounded-none ${lang === code ? "bg-primary/10 text-primary font-semibold" : ""}`}>
                      {label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Currency */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hidden sm:flex items-center gap-1 px-2 py-2 text-xs font-semibold hover:text-primary transition-colors">
                    <span>{currency}</span>
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-none">
                  {currencies.map((c) => (
                    <DropdownMenuItem key={c} onClick={() => setCurrency(c)} className={`rounded-none ${currency === c ? "bg-primary/10 text-primary font-semibold" : ""}`}>
                      {c}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* KDP shortcut */}
              {isAuthenticated && user?.role === "creator" && (
                <Link
                  to="/creator?tab=upload"
                  className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-primary border border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <PenTool className="h-3.5 w-3.5" />
                  <span>KDP</span>
                </Link>
              )}

              {/* Theme toggle */}
              <button onClick={toggleTheme} aria-label="Toggle theme" className="hidden sm:flex items-center p-2 hover:text-primary transition-colors">
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              {/* Notifications */}
              <NotificationBell />

              {/* Wishlist */}
              <Link to={isAuthenticated ? "/reader" : "/login"} aria-label="Wishlist" className="hidden sm:flex items-center p-2 hover:text-primary transition-colors">
                <Heart className="h-4 w-4" />
              </Link>

              {/* Account */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-2 py-2 hover:text-primary transition-colors">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <span className="text-xs font-bold text-primary">{user?.name?.charAt(0)?.toUpperCase() || "?"}</span>
                      </div>
                      <div className="hidden lg:block text-left">
                        <p className="text-xs font-bold leading-tight">{user?.name?.split(" ")[0]}</p>
                        <p className="text-[10px] text-muted-foreground leading-tight italic font-display">{user?.role === "creator" ? "Créateur" : "Lecteur"}</p>
                      </div>
                      <ChevronDown className="h-3 w-3 opacity-60 hidden lg:block" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-none p-1">
                    <div className="px-3 py-2.5">
                      <p className="text-sm font-bold">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="rounded-none"><Link to={dashboardPath}>{t("nav.dashboard")}</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-none"><Link to="/orders">{lang === "fr" ? "Mes commandes" : "My orders"}</Link></DropdownMenuItem>
                    {user?.role === "creator" && (
                      <DropdownMenuItem asChild className="rounded-none">
                        <Link to="/creator?tab=upload" className="flex items-center gap-2">
                          <PenTool className="h-3.5 w-3.5" />Kitabu Direct Publishing
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout()} className="rounded-none text-destructive">{t("nav.logout")}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => navigate("/login")} className="rounded-none text-xs font-bold uppercase tracking-widest hover:bg-transparent hover:text-primary">
                    {t("nav.login")}
                  </Button>
                  <Button size="sm" onClick={() => navigate("/signup")} className="rounded-none text-xs font-bold uppercase tracking-widest px-5 h-10">
                    {t("nav.signup")}
                  </Button>
                </div>
              )}

              {/* Cart */}
              <Link to="/cart" aria-label="Cart" className="relative flex items-center p-2 hover:text-primary transition-colors ml-1">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4.5 min-w-[18px] px-1 flex items-center justify-center text-[10px] font-bold bg-accent text-accent-foreground rounded-full">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Mobile menu */}
              <button aria-label="Menu" className="md:hidden p-2 hover:text-primary transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category nav */}
      <div className="bg-card/90 backdrop-blur-md border-b border-border hidden md:block">
        <div className="container mx-auto px-4 lg:px-8">
          <nav className="flex items-center gap-0.5 h-11 overflow-x-auto scrollbar-hide text-[11px] uppercase tracking-[0.2em]">
            {categories.map((cat) => (
              <Link
                key={cat.path}
                to={cat.path}
                className="px-4 py-2 font-bold text-muted-foreground hover:text-primary transition-all whitespace-nowrap"
              >
                {cat.label}
              </Link>
            ))}
            <Link to="/catalog" className="px-4 py-2 font-bold text-primary hover:text-foreground transition-all whitespace-nowrap ml-auto">
              {lang === "fr" ? "Tout explorer →" : "Explore all →"}
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-card border-b border-border px-4 pb-4 pt-2 animate-fade-up">
          <form onSubmit={handleSearch} className="mb-3">
            <div className="flex items-center bg-secondary px-4 h-11">
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t("nav.search")} className="flex-1 h-full text-sm bg-transparent outline-none" />
              <button type="submit" aria-label="Search"><Search className="h-4 w-4" /></button>
            </div>
          </form>
          <div className="flex flex-col gap-0.5">
            {categories.map((cat) => (
              <Link key={cat.path} to={cat.path} className="py-2.5 px-3 text-sm font-medium hover:bg-secondary transition-colors" onClick={() => setMobileOpen(false)}>
                {cat.label}
              </Link>
            ))}
            <hr className="my-2 border-border" />
            <div className="flex items-center gap-2 py-2 px-3">
              <button onClick={() => setLang(lang === "fr" ? "en" : "fr")} className="flex items-center gap-2 text-sm hover:bg-secondary px-3 py-1.5">
                <Globe className="h-4 w-4" />{lang === "fr" ? "English" : "Français"}
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 text-sm hover:bg-secondary px-3 py-1.5">
                    <DollarSign className="h-4 w-4" />{currency}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="rounded-none">
                  {currencies.map((c) => (
                    <DropdownMenuItem key={c} onClick={() => setCurrency(c)} className="rounded-none">{c}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {isAuthenticated ? (
              <>
                <Link to={dashboardPath} className="py-2.5 px-3 font-medium text-sm hover:bg-secondary" onClick={() => setMobileOpen(false)}>{t("nav.dashboard")}</Link>
                <button onClick={() => { logout(); setMobileOpen(false); }} className="text-left py-2.5 px-3 text-sm text-destructive hover:bg-secondary">{t("nav.logout")}</button>
              </>
            ) : (
              <>
                <Link to="/login" className="py-2.5 px-3 text-sm hover:bg-secondary" onClick={() => setMobileOpen(false)}>{t("nav.login")}</Link>
                <Link to="/signup" className="py-2.5 px-3 font-semibold text-primary text-sm hover:bg-secondary" onClick={() => setMobileOpen(false)}>{t("nav.signup")}</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
