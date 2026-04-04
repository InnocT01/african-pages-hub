import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Menu, X, Globe, ChevronDown, PenTool, DollarSign, Sparkles, User, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency, currencies } from "@/contexts/CurrencyContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import logoImg from "@/assets/logo-kitabushop.png";

const Header = () => {
  const { t, lang, setLang } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const { itemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
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
      {/* Main bar — glass morphism */}
      <div className="bg-card/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center gap-3">
            {/* Logo */}
            <Link to="/" className="flex shrink-0 items-center gap-2.5 mr-2 group">
              <div className="relative">
                <img src={logoImg} alt="KitabuShop" className="h-8 w-auto" />
                <div className="absolute -inset-1 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-extrabold tracking-tight gradient-text">Kitabu</span>
                <span className="text-lg font-light text-foreground/60">Shop</span>
              </div>
            </Link>

            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-4">
              <div className={`flex w-full rounded-2xl transition-all duration-300 ${searchFocused ? "ring-2 ring-primary/30 shadow-glow" : "ring-1 ring-border"}`}>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder={lang === "fr" ? "Rechercher un livre, un auteur..." : "Search books, authors..."}
                  className="flex-1 h-10 px-4 text-sm bg-transparent outline-none rounded-l-2xl placeholder:text-muted-foreground/50"
                />
                <button type="submit" className="px-4 rounded-r-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>

            {/* Right actions */}
            <div className="flex items-center gap-1 ml-auto">
              {/* Language */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl hover:bg-secondary transition-colors">
                    <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{lang.toUpperCase()}</span>
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  {([["fr","Français"],["en","English"],["sw","Kiswahili"],["ln","Lingála"]] as const).map(([code, label]) => (
                    <DropdownMenuItem key={code} onClick={() => setLang(code as any)} className={`rounded-lg ${lang === code ? "bg-primary/10 text-primary font-semibold" : ""}`}>
                      {label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Currency */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hidden sm:flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-xl hover:bg-secondary transition-colors">
                    <span className="text-muted-foreground">{currency}</span>
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  {currencies.map((c) => (
                    <DropdownMenuItem key={c} onClick={() => setCurrency(c)} className={`rounded-lg ${currency === c ? "bg-primary/10 text-primary font-semibold" : ""}`}>
                      {c}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* KDP shortcut */}
              {isAuthenticated && user?.role === "creator" && (
                <Link
                  to="/creator?tab=upload"
                  className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <PenTool className="h-3.5 w-3.5" />
                  <span>KDP</span>
                </Link>
              )}

              {/* Wishlist */}
              <Link to={isAuthenticated ? "/reader" : "/login"} className="hidden sm:flex items-center p-2 rounded-xl hover:bg-secondary transition-colors">
                <Heart className="h-4.5 w-4.5 text-muted-foreground" />
              </Link>

              {/* Account */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-secondary transition-colors">
                      <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">{user?.name?.charAt(0)?.toUpperCase() || "?"}</span>
                      </div>
                      <div className="hidden lg:block text-left">
                        <p className="text-xs font-semibold leading-tight">{user?.name?.split(" ")[0]}</p>
                        <p className="text-[10px] text-muted-foreground leading-tight">{user?.role === "creator" ? "Créateur" : "Lecteur"}</p>
                      </div>
                      <ChevronDown className="h-3 w-3 text-muted-foreground hidden lg:block" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-xl p-1">
                    <div className="px-3 py-2.5">
                      <p className="text-sm font-semibold">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="rounded-lg"><Link to={dashboardPath}>{t("nav.dashboard")}</Link></DropdownMenuItem>
                    {user?.role === "creator" && (
                      <DropdownMenuItem asChild className="rounded-lg">
                        <Link to="/creator?tab=upload" className="flex items-center gap-2">
                          <PenTool className="h-3.5 w-3.5" />Kitabu Direct Publishing
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout()} className="rounded-lg text-destructive">{t("nav.logout")}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Button variant="ghost" size="sm" onClick={() => navigate("/login")} className="rounded-xl text-xs font-medium">
                    {t("nav.login")}
                  </Button>
                  <Button size="sm" onClick={() => navigate("/signup")} className="rounded-xl text-xs font-semibold">
                    {t("nav.signup")}
                  </Button>
                </div>
              )}

              {/* Cart */}
              <Link to="/cart" className="relative flex items-center p-2 rounded-xl hover:bg-secondary transition-colors ml-1">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4.5 min-w-[18px] px-1 flex items-center justify-center text-[10px] font-bold bg-accent text-accent-foreground rounded-full">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Mobile menu */}
              <button className="md:hidden p-2 rounded-xl hover:bg-secondary transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category nav — subtle */}
      <div className="bg-card/60 backdrop-blur-lg border-b border-border/30 hidden md:block">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-0.5 h-10 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <Link
                key={cat.path}
                to={cat.path}
                className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all whitespace-nowrap"
              >
                {cat.label}
              </Link>
            ))}
            <Link to="/catalog" className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all whitespace-nowrap ml-auto">
              {lang === "fr" ? "Tout explorer →" : "Explore all →"}
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-card/95 backdrop-blur-xl border-b border-border px-4 pb-4 pt-2 animate-fade-up">
          <form onSubmit={handleSearch} className="mb-3">
            <div className="flex rounded-xl ring-1 ring-border">
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t("nav.search")} className="flex-1 h-10 px-4 text-sm bg-transparent rounded-l-xl outline-none" />
              <button type="submit" className="px-4 rounded-r-xl bg-primary text-primary-foreground"><Search className="h-4 w-4" /></button>
            </div>
          </form>
          <div className="flex flex-col gap-0.5">
            {categories.map((cat) => (
              <Link key={cat.path} to={cat.path} className="py-2.5 px-3 text-sm hover:bg-secondary rounded-xl transition-colors" onClick={() => setMobileOpen(false)}>
                {cat.label}
              </Link>
            ))}
            <hr className="my-2 border-border" />
            <div className="flex items-center gap-2 py-2 px-3">
              <button onClick={() => setLang(lang === "fr" ? "en" : "fr")} className="flex items-center gap-2 text-sm hover:bg-secondary rounded-xl px-3 py-1.5">
                <Globe className="h-4 w-4" />{lang === "fr" ? "English" : "Français"}
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 text-sm hover:bg-secondary rounded-xl px-3 py-1.5">
                    <DollarSign className="h-4 w-4" />{currency}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="rounded-xl">
                  {currencies.map((c) => (
                    <DropdownMenuItem key={c} onClick={() => setCurrency(c)} className="rounded-lg">{c}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {isAuthenticated ? (
              <>
                <Link to={dashboardPath} className="py-2.5 px-3 font-medium text-sm hover:bg-secondary rounded-xl" onClick={() => setMobileOpen(false)}>{t("nav.dashboard")}</Link>
                <button onClick={() => { logout(); setMobileOpen(false); }} className="text-left py-2.5 px-3 text-sm text-destructive hover:bg-secondary rounded-xl">{t("nav.logout")}</button>
              </>
            ) : (
              <>
                <Link to="/login" className="py-2.5 px-3 text-sm hover:bg-secondary rounded-xl" onClick={() => setMobileOpen(false)}>{t("nav.login")}</Link>
                <Link to="/signup" className="py-2.5 px-3 font-semibold text-primary text-sm hover:bg-secondary rounded-xl" onClick={() => setMobileOpen(false)}>{t("nav.signup")}</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
