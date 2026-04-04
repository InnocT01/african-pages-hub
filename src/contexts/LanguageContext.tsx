import React, { createContext, useContext, useState, useCallback } from "react";

type Language = "fr" | "en" | "sw" | "ln";

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<string, string>> = {
  "nav.education": { fr: "Éducation", en: "Education", sw: "Elimu", ln: "Boyekoli" },
  "nav.literature": { fr: "Littérature", en: "Literature", sw: "Fasihi", ln: "Mikanda" },
  "nav.youth": { fr: "Jeunesse", en: "Youth", sw: "Vijana", ln: "Bilenge" },
  "nav.diaspora": { fr: "Diaspora", en: "Diaspora", sw: "Diaspora", ln: "Diaspora" },
  "nav.national_languages": { fr: "Langues nationales", en: "National Languages", sw: "Lugha za Taifa", ln: "Minɔkɔ ya mbóka" },
  "nav.bd": { fr: "Bandes dessinées", en: "Comics", sw: "Katuni", ln: "BD" },
  "nav.manuels": { fr: "Manuels scolaires", en: "Textbooks", sw: "Vitabu vya shule", ln: "Mikanda ya kelasi" },
  "nav.revues": { fr: "Revues scientifiques", en: "Scientific Journals", sw: "Majarida ya kisayansi", ln: "Ba revue ya siansi" },
  "nav.articles": { fr: "Articles", en: "Articles", sw: "Makala", ln: "Masolo" },
  "nav.search": { fr: "Rechercher un livre, un auteur...", en: "Search a book, an author...", sw: "Tafuta kitabu, mwandishi...", ln: "Luka mokanda, mokomi..." },
  "nav.login": { fr: "Connexion", en: "Sign In", sw: "Ingia", ln: "Kɔta" },
  "nav.signup": { fr: "Inscription", en: "Sign Up", sw: "Jisajili", ln: "Komisa nkombo" },
  "nav.cart": { fr: "Panier", en: "Cart", sw: "Kikapu", ln: "Kitunga" },
  "nav.dashboard": { fr: "Mon compte", en: "My Account", sw: "Akaunti yangu", ln: "Kɔnti na ngai" },
  "nav.logout": { fr: "Déconnexion", en: "Sign Out", sw: "Ondoka", ln: "Kobima" },
  "nav.catalog": { fr: "Catalogue", en: "Catalog", sw: "Orodha", ln: "Katalogi" },
  "nav.about": { fr: "À propos", en: "About", sw: "Kuhusu", ln: "Ndimbola" },
  "nav.help": { fr: "Centre d'aide", en: "Help Center", sw: "Kituo cha msaada", ln: "Esika ya lisalisi" },

  "hero.featured": { fr: "Livre vedette", en: "Featured Book", sw: "Kitabu maalum", ln: "Mokanda ya lokumu" },
  "hero.details": { fr: "Voir les détails", en: "View Details", sw: "Angalia maelezo", ln: "Talá makambo" },
  "hero.nobooks": { fr: "Aucun livre vedette pour le moment.", en: "No featured books yet.", sw: "Hakuna vitabu maalum bado.", ln: "Mikanda ya lokumu ezali naino te." },

  "filter.all": { fr: "Tous", en: "All", sw: "Zote", ln: "Nyonso" },
  "filter.origin": { fr: "Origine", en: "Origin", sw: "Asili", ln: "Ebandeli" },
  "filter.genre": { fr: "Genre", en: "Genre", sw: "Aina", ln: "Lolenge" },
  "filter.type": { fr: "Type", en: "Type", sw: "Aina", ln: "Motindo" },
  "filter.ebook": { fr: "E-book", en: "E-book", sw: "E-kitabu", ln: "E-mokanda" },
  "filter.audio": { fr: "Livre audio", en: "Audiobook", sw: "Kitabu cha sauti", ln: "Mokanda ya loyóko" },
  "filter.physical": { fr: "Physique", en: "Physical", sw: "Karatasi", ln: "Ya kosimba" },
  "filter.bd": { fr: "BD", en: "Comic", sw: "Katuni", ln: "BD" },
  "filter.manuel_scolaire": { fr: "Manuel scolaire", en: "Textbook", sw: "Kitabu cha shule", ln: "Mokanda ya kelasi" },
  "filter.revue": { fr: "Revue", en: "Journal", sw: "Jarida", ln: "Zurnale" },
  "filter.article": { fr: "Article", en: "Article", sw: "Makala", ln: "Lisolo" },

  "section.new": { fr: "Nouveautés", en: "New Releases", sw: "Vipya", ln: "Ya sika" },
  "section.bestsellers": { fr: "Best-sellers", en: "Best Sellers", sw: "Vilivyouzwa zaidi", ln: "Oyo etékamá mingi" },
  "section.literature": { fr: "Littérature", en: "Literature", sw: "Fasihi", ln: "Mikanda" },
  "section.education": { fr: "Éducation", en: "Education", sw: "Elimu", ln: "Boyekoli" },
  "section.youth": { fr: "Jeunesse", en: "Youth", sw: "Vijana", ln: "Bilenge" },
  "section.diaspora": { fr: "Diaspora", en: "Diaspora", sw: "Diaspora", ln: "Diaspora" },
  "section.national_languages": { fr: "Langues nationales", en: "National Languages", sw: "Lugha za Taifa", ln: "Minɔkɔ ya mbóka" },
  "section.bd": { fr: "Bandes dessinées", en: "Comics", sw: "Katuni", ln: "BD" },
  "section.audiobooks": { fr: "Livres audio", en: "Audiobooks", sw: "Vitabu vya sauti", ln: "Mikanda ya loyóko" },
  "section.manuels_scolaires": { fr: "Manuels scolaires", en: "Textbooks", sw: "Vitabu vya shule", ln: "Mikanda ya kelasi" },
  "section.revues_scientifiques": { fr: "Revues scientifiques", en: "Scientific Journals", sw: "Majarida ya kisayansi", ln: "Ba revue ya siansi" },
  "section.articles": { fr: "Articles", en: "Articles", sw: "Makala", ln: "Masolo" },
  "section.viewall": { fr: "Voir tout", en: "View All", sw: "Ona yote", ln: "Talá nyonso" },
  "section.featured": { fr: "Livres vedettes", en: "Featured Books", sw: "Vitabu maalum", ln: "Mikanda ya lokumu" },

  "cta.creator.title": { fr: "Vous êtes auteur ou éditeur ?", en: "Are you an author or publisher?", sw: "Wewe ni mwandishi?", ln: "Ozali mokomi?" },
  "cta.creator.subtitle": { fr: "Publiez votre œuvre et touchez des millions de lecteurs.", en: "Publish your work and reach millions of readers.", sw: "Chapisha kazi yako.", ln: "Bimisá mosala na yo." },
  "cta.creator.button": { fr: "Commencer à publier", en: "Start Publishing", sw: "Anza kuchapisha", ln: "Bandá kobimisa" },

  "footer.about": { fr: "À propos", en: "About", sw: "Kuhusu", ln: "Ndimbola" },
  "footer.contact": { fr: "Contact", en: "Contact", sw: "Wasiliana", ln: "Kosolola" },
  "footer.terms": { fr: "Conditions d'utilisation", en: "Terms of Use", sw: "Masharti", ln: "Mibeko" },
  "footer.privacy": { fr: "Politique de confidentialité", en: "Privacy Policy", sw: "Faragha", ln: "Politiki ya sekele" },
  "footer.newsletter": { fr: "Newsletter", en: "Newsletter", sw: "Jarida", ln: "Sango" },
  "footer.newsletter.placeholder": { fr: "Votre adresse email", en: "Your email address", sw: "Barua pepe yako", ln: "Adrɛsi ya email" },
  "footer.newsletter.button": { fr: "S'inscrire", en: "Subscribe", sw: "Jisajili", ln: "Komisa nkombo" },
  "footer.rights": { fr: "Tous droits réservés.", en: "All rights reserved.", sw: "Haki zote zimehifadhiwa.", ln: "Ndingisa nyonso ebombami." },
  "footer.tagline": { fr: "La marketplace de la littérature africaine", en: "The African literature marketplace", sw: "Soko la fasihi ya Kiafrika", ln: "Zando ya mikanda ya Afrika" },
  "footer.description": { fr: "KitabuShop est une marketplace des contenus éducatifs et littéraires d'Afrique.", en: "KitabuShop is a marketplace for educational and literary content from Africa.", sw: "KitabuShop ni soko la maudhui ya elimu na fasihi kutoka Afrika.", ln: "KitabuShop ezali zando ya mikanda ya boyekoli mpe ya literatiré ya Afrika." },

  "auth.login.title": { fr: "Connexion", en: "Sign In", sw: "Ingia", ln: "Kɔta" },
  "auth.signup.title": { fr: "Créer un compte", en: "Create Account", sw: "Fungua akaunti", ln: "Fungolá kɔnti" },
  "auth.email": { fr: "Adresse email", en: "Email address", sw: "Barua pepe", ln: "Adrɛsi ya email" },
  "auth.password": { fr: "Mot de passe", en: "Password", sw: "Nywila", ln: "Mot de passe" },
  "auth.name": { fr: "Nom complet", en: "Full name", sw: "Jina kamili", ln: "Nkombo mobimba" },
  "auth.role": { fr: "Je suis...", en: "I am...", sw: "Mimi ni...", ln: "Nazali..." },
  "auth.role.creator": { fr: "Auteur / Éditeur", en: "Author / Publisher", sw: "Mwandishi / Mchapishaji", ln: "Mokomi / Mobimisi" },
  "auth.role.reader": { fr: "Lecteur", en: "Reader", sw: "Msomaji", ln: "Motángi" },
  "auth.login.button": { fr: "Se connecter", en: "Sign In", sw: "Ingia", ln: "Kɔta" },
  "auth.signup.button": { fr: "Créer mon compte", en: "Create Account", sw: "Fungua akaunti", ln: "Fungolá kɔnti" },
  "auth.login.link": { fr: "Déjà un compte ? Connectez-vous", en: "Already have an account? Sign In", sw: "Una akaunti? Ingia", ln: "Ozali na kɔnti? Kɔta" },
  "auth.signup.link": { fr: "Pas de compte ? Inscrivez-vous", en: "No account? Sign Up", sw: "Huna akaunti? Jisajili", ln: "Ozali na kɔnti te? Komisa nkombo" },
  "auth.forgot": { fr: "Mot de passe oublié ?", en: "Forgot password?", sw: "Umesahau nywila?", ln: "Obosani mot de passe?" },
  "auth.error": { fr: "Erreur d'authentification", en: "Authentication error", sw: "Hitilafu ya uthibitisho", ln: "Foti ya bokɔti" },

  "book.addtocart": { fr: "Ajouter au panier", en: "Add to Cart", sw: "Ongeza kwenye kikapu", ln: "Bakisá na kitunga" },
  "book.buynow": { fr: "Acheter maintenant", en: "Buy Now", sw: "Nunua sasa", ln: "Sómba sikoyo" },
  "book.preview": { fr: "Aperçu", en: "Preview", sw: "Hakiki", ln: "Kotala liboso" },
  "book.read": { fr: "Lire", en: "Read", sw: "Soma", ln: "Tángá" },
  "book.rate": { fr: "Noter", en: "Rate", sw: "Kadiria", ln: "Pesá bapwɛ" },
  "book.delivery": { fr: "Demander la livraison", en: "Request Delivery", sw: "Omba uwasilishaji", ln: "Sɛngá kokabola" },
  "book.format": { fr: "Format", en: "Format", sw: "Umbizo", ln: "Motindo" },
  "book.related": { fr: "Livres similaires", en: "Related Books", sw: "Vitabu vinavyofanana", ln: "Mikanda ya ndenge moko" },
  "book.by": { fr: "par", en: "by", sw: "na", ln: "na" },
  "book.description": { fr: "Description", en: "Description", sw: "Maelezo", ln: "Ndimbola" },
  "book.pages": { fr: "pages", en: "pages", sw: "kurasa", ln: "nkasa" },
  "book.minutes": { fr: "minutes", en: "minutes", sw: "dakika", ln: "miniti" },
  "book.reviews": { fr: "Avis", en: "Reviews", sw: "Maoni", ln: "Makanisi" },
  "book.noreviews": { fr: "Aucun avis pour le moment", en: "No reviews yet", sw: "Hakuna maoni bado", ln: "Makanisi ezali naino te" },
  "book.addreview": { fr: "Laisser un avis", en: "Leave a review", sw: "Acha maoni", ln: "Tiká likanisi" },
  "book.readpreview": { fr: "Lire un extrait", en: "Read excerpt", sw: "Soma dondoo", ln: "Tángá mwa ndambo" },
  "book.purchasetocontinue": { fr: "Achetez le livre pour continuer.", en: "Purchase to continue reading.", sw: "Nunua kitabu kuendelea.", ln: "Sómbá mokanda po na kokoba." },

  "cart.title": { fr: "Mon panier", en: "My Cart", sw: "Kikapu changu", ln: "Kitunga na ngai" },
  "cart.empty": { fr: "Votre panier est vide", en: "Your cart is empty", sw: "Kikapu chako ni tupu", ln: "Kitunga na yo ezali mpamba" },
  "cart.subtotal": { fr: "Sous-total", en: "Subtotal", sw: "Jumla ndogo", ln: "Sous-total" },
  "cart.checkout": { fr: "Passer la commande", en: "Proceed to Checkout", sw: "Endelea na malipo", ln: "Kokende na kofuta" },
  "cart.continue": { fr: "Continuer mes achats", en: "Continue Shopping", sw: "Endelea kununua", ln: "Kokoba kosómba" },
  "cart.remove": { fr: "Retirer", en: "Remove", sw: "Ondoa", ln: "Longola" },

  "checkout.title": { fr: "Paiement", en: "Checkout", sw: "Malipo", ln: "Kofuta" },
  "checkout.payment": { fr: "Méthode de paiement", en: "Payment Method", sw: "Njia ya malipo", ln: "Lolenge ya kofuta" },
  "checkout.mobilemoney": { fr: "Mobile Money", en: "Mobile Money", sw: "Mobile Money", ln: "Mobile Money" },
  "checkout.card": { fr: "Carte bancaire", en: "Credit Card", sw: "Kadi ya benki", ln: "Karte ya banki" },
  "checkout.bank": { fr: "Virement bancaire", en: "Bank Transfer", sw: "Uhamisho wa benki", ln: "Transfere ya banki" },
  "checkout.confirm": { fr: "Confirmer la commande", en: "Confirm Order", sw: "Thibitisha agizo", ln: "Kondima komande" },
  "checkout.success": { fr: "Commande confirmée !", en: "Order Confirmed!", sw: "Agizo limethibitishwa!", ln: "Komande endimami!" },
  "checkout.success.msg": { fr: "Merci pour votre achat.", en: "Thank you for your purchase.", sw: "Asante kwa ununuzi wako.", ln: "Matɔndi po na kosómba na yo." },

  "creator.overview": { fr: "Vue d'ensemble", en: "Overview", sw: "Muhtasari", ln: "Botáli mobimba" },
  "creator.mybooks": { fr: "Mes livres", en: "My Books", sw: "Vitabu vyangu", ln: "Mikanda na ngai" },
  "creator.upload": { fr: "Publier un livre", en: "Publish a Book", sw: "Chapisha kitabu", ln: "Bimisá mokanda" },
  "creator.analytics": { fr: "Analytiques", en: "Analytics", sw: "Takwimu", ln: "Ba statistiki" },
  "creator.settings": { fr: "Paramètres", en: "Settings", sw: "Mipangilio", ln: "Ba paramɛtrɛ" },
  "creator.revenue": { fr: "Revenus", en: "Revenue", sw: "Mapato", ln: "Mbongo" },
  "creator.sales": { fr: "Ventes", en: "Sales", sw: "Mauzo", ln: "Bitékami" },
  "creator.views": { fr: "Vues", en: "Views", sw: "Mitazamo", ln: "Botaleli" },
  "creator.books": { fr: "Livres publiés", en: "Published Books", sw: "Vitabu vilivyochapishwa", ln: "Mikanda ebimá" },
  "creator.welcome": { fr: "Bienvenue sur votre espace créateur", en: "Welcome to your creator space", sw: "Karibu kwenye nafasi yako", ln: "Boyéi malamu na esika na yo" },
  "creator.reviews_mgmt": { fr: "Avis lecteurs", en: "Reader Reviews", sw: "Maoni ya wasomaji", ln: "Makanisi ya batángi" },
  "creator.promos": { fr: "Promotions", en: "Promotions", sw: "Matangazo", ln: "Ba promo" },
  "creator.royalties": { fr: "Royalties", en: "Royalties", sw: "Mrabaha", ln: "Royalties" },
  "creator.marketing": { fr: "Marketing", en: "Marketing", sw: "Masoko", ln: "Marketing" },

  "kdp.step1": { fr: "Détails du livre", en: "Book Details", sw: "Maelezo ya kitabu", ln: "Makambo ya mokanda" },
  "kdp.step2": { fr: "Contenu", en: "Content", sw: "Yaliyomo", ln: "Oyo ezali kati" },
  "kdp.step3": { fr: "Tarification", en: "Pricing", sw: "Bei", ln: "Ntalo" },
  "kdp.title": { fr: "Titre", en: "Title", sw: "Kichwa", ln: "Nkombo" },
  "kdp.subtitle": { fr: "Sous-titre (optionnel)", en: "Subtitle (optional)", sw: "Kichwa kidogo", ln: "Nkombo ya moke" },
  "kdp.authorname": { fr: "Nom de l'auteur", en: "Author Name", sw: "Jina la mwandishi", ln: "Nkombo ya mokomi" },
  "kdp.descfr": { fr: "Description (Français)", en: "Description (French)", sw: "Maelezo (Kifaransa)", ln: "Ndimbola (Falansé)" },
  "kdp.descen": { fr: "Description (Anglais)", en: "Description (English)", sw: "Maelezo (Kiingereza)", ln: "Ndimbola (Anglɛ)" },
  "kdp.genre": { fr: "Genre", en: "Genre", sw: "Aina", ln: "Lolenge" },
  "kdp.category": { fr: "Catégorie", en: "Category", sw: "Kategoria", ln: "Katégori" },
  "kdp.origin": { fr: "Pays d'origine", en: "Country of Origin", sw: "Nchi ya asili", ln: "Mbóka ya ebandeli" },
  "kdp.language": { fr: "Langue du contenu", en: "Content Language", sw: "Lugha ya yaliyomo", ln: "Monɔkɔ ya kati" },
  "kdp.keywords": { fr: "Mots-clés (séparés par des virgules)", en: "Keywords (comma-separated)", sw: "Maneno muhimu", ln: "Maloba ya ntina" },
  "kdp.contenttype": { fr: "Type de contenu", en: "Content Type", sw: "Aina ya yaliyomo", ln: "Motindo ya kati" },
  "kdp.cover": { fr: "Image de couverture", en: "Cover Image", sw: "Picha ya jalada", ln: "Foto ya libóso" },
  "kdp.coverhelp": { fr: "JPG ou PNG, min 800×1200px, portrait", en: "JPG or PNG, min 800×1200px, portrait", sw: "JPG au PNG, 800×1200px", ln: "JPG to PNG, 800×1200px" },
  "kdp.manuscript": { fr: "Fichier du manuscrit", en: "Manuscript File", sw: "Faili ya muswada", ln: "Fisié ya maniskri" },
  "kdp.isbn": { fr: "ISBN (optionnel)", en: "ISBN (optional)", sw: "ISBN (hiari)", ln: "ISBN (si obligé)" },
  "kdp.pages": { fr: "Nombre de pages", en: "Number of Pages", sw: "Idadi ya kurasa", ln: "Motángo ya nkasa" },
  "kdp.duration": { fr: "Durée (minutes)", en: "Duration (minutes)", sw: "Muda (dakika)", ln: "Ntángo (miniti)" },
  "kdp.price": { fr: "Prix de vente (USD)", en: "Selling Price (USD)", sw: "Bei ya kuuza (USD)", ln: "Ntalo ya kotéka (USD)" },
  "kdp.publish": { fr: "Publier maintenant", en: "Publish Now", sw: "Chapisha sasa", ln: "Bimisá sikoyo" },
  "kdp.savedraft": { fr: "Enregistrer comme brouillon", en: "Save as Draft", sw: "Hifadhi rasimu", ln: "Bómba brouillon" },
  "kdp.next": { fr: "Suivant", en: "Next", sw: "Ifuatayo", ln: "Oyo elandi" },
  "kdp.prev": { fr: "Précédent", en: "Previous", sw: "Iliyotangulia", ln: "Oyo elɛki" },
  "kdp.uploading": { fr: "Publication en cours...", en: "Publishing...", sw: "Inachapishwa...", ln: "Ezali kobima..." },
  "kdp.success": { fr: "Livre publié avec succès !", en: "Book published successfully!", sw: "Kitabu kimechapishwa!", ln: "Mokanda ebimí malamu!" },
  "kdp.error": { fr: "Erreur lors de la publication", en: "Error publishing book", sw: "Hitilafu ya kuchapisha", ln: "Foti ya kobimisa" },

  "creator.status.draft": { fr: "Brouillon", en: "Draft", sw: "Rasimu", ln: "Brouillon" },
  "creator.status.published": { fr: "Publié", en: "Published", sw: "Imechapishwa", ln: "Ebimá" },
  "creator.status.archived": { fr: "Archivé", en: "Archived", sw: "Imehifadhiwa", ln: "Ebombami" },

  "reader.library": { fr: "Ma bibliothèque", en: "My Library", sw: "Maktaba yangu", ln: "Libréri na ngai" },
  "reader.orders": { fr: "Mes commandes", en: "My Orders", sw: "Agizo zangu", ln: "Ba komande na ngai" },
  "reader.wishlist": { fr: "Liste de souhaits", en: "Wishlist", sw: "Orodha ya matakwa", ln: "Liste ya bamposa" },
  "reader.settings": { fr: "Paramètres", en: "Settings", sw: "Mipangilio", ln: "Ba paramɛtrɛ" },
  "reader.welcome": { fr: "Bienvenue dans votre espace lecteur", en: "Welcome to your reading space", sw: "Karibu kwenye nafasi yako ya kusoma", ln: "Boyéi malamu na esika na yo ya kotánga" },
  "reader.reading": { fr: "En cours de lecture", en: "Currently Reading", sw: "Inasomwa", ln: "Ezali kotángama" },
  "reader.finished": { fr: "Terminé", en: "Finished", sw: "Imekamilika", ln: "Esili" },
  "reader.nobooks": { fr: "Vous n'avez pas encore de livres", en: "You don't have any books yet", sw: "Huna vitabu bado", ln: "Ozali naino na mikanda te" },
  "reader.startreading": { fr: "Lire", en: "Read", sw: "Soma", ln: "Tángá" },
  "reader.download": { fr: "Télécharger", en: "Download", sw: "Pakua", ln: "Kokitisa" },
  "reader.listen": { fr: "Écouter", en: "Listen", sw: "Sikiliza", ln: "Yoká" },
  "reader.reviews_mine": { fr: "Mes avis", en: "My Reviews", sw: "Maoni yangu", ln: "Makanisi na ngai" },
  "reader.stats": { fr: "Statistiques", en: "Statistics", sw: "Takwimu", ln: "Ba statistiki" },
  "reader.recommendations": { fr: "Recommandations", en: "Recommendations", sw: "Mapendekezo", ln: "Ba recommandation" },
  "reader.downloads": { fr: "Téléchargements", en: "Downloads", sw: "Vipakuliwa", ln: "Bitélemeli" },
  "reader.notifications": { fr: "Notifications", en: "Notifications", sw: "Arifa", ln: "Ba notification" },

  "common.price": { fr: "Prix", en: "Price", sw: "Bei", ln: "Ntalo" },
  "common.currency": { fr: "USD", en: "USD", sw: "USD", ln: "USD" },
  "common.save": { fr: "Enregistrer", en: "Save", sw: "Hifadhi", ln: "Bómba" },
  "common.cancel": { fr: "Annuler", en: "Cancel", sw: "Ghairi", ln: "Koboya" },
  "common.delete": { fr: "Supprimer", en: "Delete", sw: "Futa", ln: "Kolongola" },
  "common.edit": { fr: "Modifier", en: "Edit", sw: "Hariri", ln: "Kobongola" },
  "common.loading": { fr: "Chargement...", en: "Loading...", sw: "Inapakia...", ln: "Ezali kokɔta..." },
  "common.back": { fr: "Retour", en: "Back", sw: "Rudi", ln: "Kozónga" },
  "common.noresults": { fr: "Aucun résultat", en: "No results", sw: "Hakuna matokeo", ln: "Mbuma ezali te" },
  "common.language": { fr: "Langue", en: "Language", sw: "Lugha", ln: "Monɔkɔ" },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>("fr");

  const t = useCallback(
    (key: string) => translations[key]?.[lang] ?? translations[key]?.["fr"] ?? key,
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
