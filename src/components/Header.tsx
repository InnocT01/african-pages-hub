import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Menu, X, Globe, ChevronDown, PenTool, DollarSign } from "lucide-react";
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
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
  };

  const dashboardPath = user?.role === "creator" ? "/creator" : "/reader";

  const navLinks = [
    { label: lang === "fr" ? "Catalogue" : "Catalog", path: "/catalog" },
    { label: lang === "fr" ? "Nouveautés" : "New & Trending", path: "/catalog?sort=new" },
    { label: "Best Sellers", path: "/catalog?sort=sales" },
    { label: lang === "fr" ? "Littérature" : "Literature", path: "/catalog?category=literature" },
    { label: lang === "fr" ? "Éducation" : "Education", path: "/catalog?category=education" },
    { label: lang === "fr" ? "Jeunesse" : "Youth", path: "/catalog?category=youth" },
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="header-bg">
        <div className="container mx-auto px-4">
          <div className="flex h-14 items-center gap-4">
            {/* Logo */}
            <Link to="/" className="flex shrink-0 items-center gap-2 mr-4">
              <img src={logoImg} alt="KitabuShop" className="h-8 w-auto brightness-0 invert" />
              <div className="hidden sm:block">
                <span className="text-base font-extrabold tracking-tight" style={{ color: "hsl(var(--header-accent))" }}>KitabuShop</span>
                <span className="text-[9px] block -mt-1 opacity-60">.com</span>
              </div>
            </Link>

            {/* Deliver to */}
            <div className="hidden lg:flex flex-col text-[10px] leading-tight opacity-70 mr-2">
              <span>{lang === "fr" ? "Livrer à" : "Deliver to"}</span>
              <span className="font-bold text-xs" style={{ color: "hsl(var(--header-fg))" }}>🇨🇩 Goma, RDC</span>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-3xl">
              <div className="flex w-full">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 px-3 text-xs font-medium rounded-l-lg bg-secondary text-secondary-foreground border-r border-border whitespace-nowrap">
                      {lang === "fr" ? "Tous" : "All"} <ChevronDown className="h-3 w-3" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => navigate("/catalog")}>{lang === "fr" ? "Tous les livres" : "All Books"}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/catalog?category=literature")}>{lang === "fr" ? "Littérature" : "Literature"}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/catalog?category=education")}>{lang === "fr" ? "Éducation" : "Education"}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/catalog?category=youth")}>{lang === "fr" ? "Jeunesse" : "Youth"}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("nav.search")}
                  className="flex-1 h-10 px-4 text-sm bg-background text-foreground outline-none border-0"
                />
                <button type="submit" className="px-4 rounded-r-lg" style={{ backgroundColor: "hsl(var(--header-accent))" }}>
                  <Search className="h-4 w-4 text-white" />
                </button>
              </div>
            </form>

            {/* Right */}
            <div className="flex items-center gap-1 ml-auto">
              {/* Language */}
              <button onClick={() => setLang(lang === "fr" ? "en" : "fr")} className="hidden sm:flex flex-col items-center px-2 py-1 text-[10px] hover:outline hover:outline-1 hover:outline-white/30 rounded-sm transition-all" style={{ color: "hsl(var(--header-fg))" }}>
                <Globe className="h-4 w-4 mb-0.5" />
                <span className="font-bold">{lang === "fr" ? "FR" : "EN"}</span>
              </button>

              {/* Currency */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hidden sm:flex flex-col items-center px-2 py-1 text-[10px] hover:outline hover:outline-1 hover:outline-white/30 rounded-sm transition-all" style={{ color: "hsl(var(--header-fg))" }}>
                    <DollarSign className="h-4 w-4 mb-0.5" />
                    <span className="font-bold">{currency}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {currencies.map((c) => (
                    <DropdownMenuItem key={c} onClick={() => setCurrency(c)} className={currency === c ? "bg-secondary font-semibold" : ""}>
                      {c}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Account */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex flex-col items-start px-2 py-1 text-[10px] hover:outline hover:outline-1 hover:outline-white/30 rounded-sm transition-all" style={{ color: "hsl(var(--header-fg))" }}>
                      <span className="opacity-60">{lang === "fr" ? "Bonjour," : "Hello,"} {user?.name?.split(" ")[0]}</span>
                      <span className="font-bold text-xs flex items-center gap-0.5">{lang === "fr" ? "Compte & Listes" : "Account & Lists"} <ChevronDown className="h-2.5 w-2.5" /></span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
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
                <button onClick={() => navigate("/login")} className="flex flex-col items-start px-2 py-1 text-[10px] hover:outline hover:outline-1 hover:outline-white/30 rounded-sm transition-all" style={{ color: "hsl(var(--header-fg))" }}>
                  <span className="opacity-60">{lang === "fr" ? "Bonjour, identifiez-vous" : "Hello, Sign in"}</span>
                  <span className="font-bold text-xs flex items-center gap-0.5">{lang === "fr" ? "Compte & Listes" : "Account & Lists"} <ChevronDown className="h-2.5 w-2.5" /></span>
                </button>
              )}

              {/* Orders */}
              <Link to={isAuthenticated ? (user?.role === "creator" ? "/creator?tab=books" : "/reader") : "/login"} className="hidden sm:flex flex-col items-start px-2 py-1 text-[10px] hover:outline hover:outline-1 hover:outline-white/30 rounded-sm transition-all" style={{ color: "hsl(var(--header-fg))" }}>
                <span className="opacity-60">{lang === "fr" ? "Retours" : "Returns"}</span>
                <span className="font-bold text-xs">{lang === "fr" ? "& Commandes" : "& Orders"}</span>
              </Link>

              {/* Cart */}
              <Link to="/cart" className="flex items-end gap-0.5 px-2 py-1 hover:outline hover:outline-1 hover:outline-white/30 rounded-sm transition-all relative" style={{ color: "hsl(var(--header-fg))" }}>
                <div className="relative">
                  <ShoppingCart className="h-6 w-6" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1.5 -right-1 text-[10px] font-extrabold" style={{ color: "hsl(var(--header-accent))" }}>{itemCount}</span>
                  )}
                </div>
                <span className="text-xs font-bold hidden sm:inline">{lang === "fr" ? "Panier" : "Cart"}</span>
              </Link>

              <button className="md:hidden p-2" style={{ color: "hsl(var(--header-fg))" }} onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary nav */}
      <div className="nav-bg border-b border-border/20">
        <div className="container mx-auto px-4">
          <nav className="hidden md:flex items-center gap-0 text-sm overflow-x-auto scrollbar-hide">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 px-3 h-9 font-bold text-xs whitespace-nowrap hover:outline hover:outline-1 hover:outline-white/20 rounded-sm transition-all">
                  <Menu className="h-3.5 w-3.5" />{lang === "fr" ? "Toutes les catégories" : "All Categories"}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem asChild><Link to="/catalog?category=literature">{t("nav.literature")}</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/catalog?category=education">{t("nav.education")}</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/catalog?category=youth">{t("nav.youth")}</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/catalog?category=diaspora">{t("nav.diaspora")}</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/catalog?type=bd">{t("nav.bd")}</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/catalog?category=manuels_scolaires">{t("nav.manuels")}</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/catalog?category=national_languages">{t("nav.national_languages")}</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className="px-3 h-9 flex items-center text-xs whitespace-nowrap hover:outline hover:outline-1 hover:outline-white/20 rounded-sm transition-all">
                {link.label}
              </Link>
            ))}
            <Link to="/about" className="px-3 h-9 flex items-center text-xs whitespace-nowrap hover:outline hover:outline-1 hover:outline-white/20 rounded-sm transition-all">
              {t("nav.about")}
            </Link>
            <Link to="/help" className="px-3 h-9 flex items-center text-xs whitespace-nowrap hover:outline hover:outline-1 hover:outline-white/20 rounded-sm transition-all">
              {lang === "fr" ? "Aide" : "Help"}
            </Link>
            {isAuthenticated && user?.role === "creator" && (
              <Link to="/creator?tab=upload" className="ml-auto px-3 h-9 flex items-center gap-1.5 text-xs font-bold whitespace-nowrap" style={{ color: "hsl(var(--header-accent))" }}>
                <PenTool className="h-3.5 w-3.5" />Kitabu Direct Publishing
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-4 pt-2 shadow-lg">
          <form onSubmit={handleSearch} className="mb-3">
            <div className="flex">
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t("nav.search")} className="flex-1 h-10 px-4 text-sm bg-secondary rounded-l-lg outline-none" />
              <button type="submit" className="px-4 rounded-r-lg bg-primary text-primary-foreground"><Search className="h-4 w-4" /></button>
            </div>
          </form>
          <div className="flex flex-col gap-0.5">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className="py-2.5 px-2 text-sm hover:bg-secondary rounded-md" onClick={() => setMobileOpen(false)}>{link.label}</Link>
            ))}
            <hr className="my-2 border-border" />
            <div className="flex items-center gap-3 py-2 px-2">
              <button onClick={() => setLang(lang === "fr" ? "en" : "fr")} className="flex items-center gap-2 text-sm hover:bg-secondary rounded-md px-2 py-1">
                <Globe className="h-4 w-4" />{lang === "fr" ? "English" : "Français"}
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 text-sm hover:bg-secondary rounded-md px-2 py-1">
                    <DollarSign className="h-4 w-4" />{currency}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {currencies.map((c) => (
                    <DropdownMenuItem key={c} onClick={() => setCurrency(c)}>{c}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {isAuthenticated ? (
              <>
                <Link to={dashboardPath} className="py-2.5 px-2 font-medium text-sm hover:bg-secondary rounded-md" onClick={() => setMobileOpen(false)}>{t("nav.dashboard")}</Link>
                {user?.role === "creator" && (
                  <Link to="/creator?tab=upload" className="py-2.5 px-2 font-medium text-sm text-primary hover:bg-secondary rounded-md flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                    <PenTool className="h-4 w-4" />Kitabu Direct Publishing
                  </Link>
                )}
                <button onClick={() => { logout(); setMobileOpen(false); }} className="text-left py-2.5 px-2 text-sm text-destructive hover:bg-secondary rounded-md">{t("nav.logout")}</button>
              </>
            ) : (
              <>
                <Link to="/login" className="py-2.5 px-2 text-sm hover:bg-secondary rounded-md" onClick={() => setMobileOpen(false)}>{t("nav.login")}</Link>
                <Link to="/signup" className="py-2.5 px-2 font-semibold text-primary text-sm hover:bg-secondary rounded-md" onClick={() => setMobileOpen(false)}>{t("nav.signup")}</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
