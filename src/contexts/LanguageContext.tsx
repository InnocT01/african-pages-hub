import React, { createContext, useContext, useState, useCallback } from "react";

type Language = "fr" | "en";

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  "nav.education": { fr: "Éducation", en: "Education" },
  "nav.literature": { fr: "Littérature", en: "Literature" },
  "nav.youth": { fr: "Jeunesse", en: "Youth" },
  "nav.diaspora": { fr: "Diaspora", en: "Diaspora" },
  "nav.national_languages": { fr: "Langues nationales", en: "National Languages" },
  "nav.bd": { fr: "Bandes dessinées", en: "Comics" },
  "nav.manuels": { fr: "Manuels scolaires", en: "Textbooks" },
  "nav.revues": { fr: "Revues scientifiques", en: "Scientific Journals" },
  "nav.articles": { fr: "Articles", en: "Articles" },
  "nav.search": { fr: "Rechercher un livre, un auteur...", en: "Search a book, an author..." },
  "nav.login": { fr: "Connexion", en: "Sign In" },
  "nav.signup": { fr: "Inscription", en: "Sign Up" },
  "nav.cart": { fr: "Panier", en: "Cart" },
  "nav.dashboard": { fr: "Tableau de bord", en: "Dashboard" },
  "nav.logout": { fr: "Déconnexion", en: "Sign Out" },
  "nav.catalog": { fr: "Catalogue", en: "Catalog" },
  "nav.about": { fr: "À propos", en: "About" },

  "hero.featured": { fr: "Livre vedette", en: "Featured Book" },
  "hero.details": { fr: "Voir les détails", en: "View Details" },
  "hero.nobooks": { fr: "Aucun livre vedette pour le moment. Publiez le vôtre !", en: "No featured books yet. Publish yours!" },

  "filter.all": { fr: "Tous", en: "All" },
  "filter.origin": { fr: "Origine", en: "Origin" },
  "filter.genre": { fr: "Genre", en: "Genre" },
  "filter.type": { fr: "Type", en: "Type" },
  "filter.ebook": { fr: "E-book", en: "E-book" },
  "filter.audio": { fr: "Livre audio", en: "Audiobook" },
  "filter.physical": { fr: "Physique", en: "Physical" },
  "filter.bd": { fr: "BD", en: "Comic" },
  "filter.manuel_scolaire": { fr: "Manuel scolaire", en: "Textbook" },
  "filter.revue": { fr: "Revue", en: "Journal" },
  "filter.article": { fr: "Article", en: "Article" },

  "section.new": { fr: "Nouveautés", en: "New Releases" },
  "section.bestsellers": { fr: "Best-sellers", en: "Best Sellers" },
  "section.literature": { fr: "Littérature", en: "Literature" },
  "section.education": { fr: "Éducation", en: "Education" },
  "section.youth": { fr: "Jeunesse", en: "Youth" },
  "section.diaspora": { fr: "Diaspora", en: "Diaspora" },
  "section.national_languages": { fr: "Langues nationales", en: "National Languages" },
  "section.bd": { fr: "Bandes dessinées", en: "Comics" },
  "section.audiobooks": { fr: "Livres audio", en: "Audiobooks" },
  "section.manuels_scolaires": { fr: "Manuels scolaires", en: "Textbooks" },
  "section.revues_scientifiques": { fr: "Revues scientifiques", en: "Scientific Journals" },
  "section.articles": { fr: "Articles", en: "Articles" },
  "section.viewall": { fr: "Voir tout", en: "View All" },
  "section.featured": { fr: "Livres vedettes", en: "Featured Books" },

  "cta.creator.title": { fr: "Vous êtes auteur ou éditeur ?", en: "Are you an author or publisher?" },
  "cta.creator.subtitle": { fr: "Publiez votre œuvre et touchez des millions de lecteurs à travers l'Afrique et sa diaspora.", en: "Publish your work and reach millions of readers across Africa and its diaspora." },
  "cta.creator.button": { fr: "Commencer à publier", en: "Start Publishing" },

  "footer.about": { fr: "À propos", en: "About" },
  "footer.contact": { fr: "Contact", en: "Contact" },
  "footer.terms": { fr: "Conditions d'utilisation", en: "Terms of Use" },
  "footer.privacy": { fr: "Politique de confidentialité", en: "Privacy Policy" },
  "footer.newsletter": { fr: "Newsletter", en: "Newsletter" },
  "footer.newsletter.placeholder": { fr: "Votre adresse email", en: "Your email address" },
  "footer.newsletter.button": { fr: "S'inscrire", en: "Subscribe" },
  "footer.rights": { fr: "Tous droits réservés.", en: "All rights reserved." },
  "footer.tagline": { fr: "La marketplace de la littérature africaine", en: "The African literature marketplace" },
  "footer.description": { fr: "KitabuShop est une marketplace des contenus éducatifs et littéraires d'Afrique subsaharienne et d'Afrique de l'Est.", en: "KitabuShop is a marketplace for educational and literary content from Sub-Saharan and East Africa." },

  "auth.login.title": { fr: "Connexion", en: "Sign In" },
  "auth.signup.title": { fr: "Créer un compte", en: "Create Account" },
  "auth.email": { fr: "Adresse email", en: "Email address" },
  "auth.password": { fr: "Mot de passe", en: "Password" },
  "auth.name": { fr: "Nom complet", en: "Full name" },
  "auth.role": { fr: "Je suis...", en: "I am..." },
  "auth.role.creator": { fr: "Auteur / Éditeur", en: "Author / Publisher" },
  "auth.role.reader": { fr: "Lecteur", en: "Reader" },
  "auth.login.button": { fr: "Se connecter", en: "Sign In" },
  "auth.signup.button": { fr: "Créer mon compte", en: "Create Account" },
  "auth.login.link": { fr: "Déjà un compte ? Connectez-vous", en: "Already have an account? Sign In" },
  "auth.signup.link": { fr: "Pas de compte ? Inscrivez-vous", en: "No account? Sign Up" },
  "auth.forgot": { fr: "Mot de passe oublié ?", en: "Forgot password?" },
  "auth.error": { fr: "Erreur d'authentification", en: "Authentication error" },

  "book.addtocart": { fr: "Ajouter au panier", en: "Add to Cart" },
  "book.buynow": { fr: "Acheter maintenant", en: "Buy Now" },
  "book.preview": { fr: "Aperçu", en: "Preview" },
  "book.read": { fr: "Lire", en: "Read" },
  "book.rate": { fr: "Noter", en: "Rate" },
  "book.delivery": { fr: "Demander la livraison", en: "Request Delivery" },
  "book.format": { fr: "Format", en: "Format" },
  "book.related": { fr: "Livres similaires", en: "Related Books" },
  "book.by": { fr: "par", en: "by" },
  "book.description": { fr: "Description", en: "Description" },
  "book.pages": { fr: "pages", en: "pages" },
  "book.minutes": { fr: "minutes", en: "minutes" },
  "book.reviews": { fr: "Avis", en: "Reviews" },
  "book.noreviews": { fr: "Aucun avis pour le moment", en: "No reviews yet" },
  "book.addreview": { fr: "Laisser un avis", en: "Leave a review" },
  "book.readpreview": { fr: "Lire un extrait", en: "Read excerpt" },
  "book.purchasetocontinue": { fr: "Achetez le livre pour continuer la lecture.", en: "Purchase the book to continue reading." },

  "cart.title": { fr: "Mon panier", en: "My Cart" },
  "cart.empty": { fr: "Votre panier est vide", en: "Your cart is empty" },
  "cart.subtotal": { fr: "Sous-total", en: "Subtotal" },
  "cart.checkout": { fr: "Passer la commande", en: "Proceed to Checkout" },
  "cart.continue": { fr: "Continuer mes achats", en: "Continue Shopping" },
  "cart.remove": { fr: "Retirer", en: "Remove" },

  "checkout.title": { fr: "Paiement", en: "Checkout" },
  "checkout.payment": { fr: "Méthode de paiement", en: "Payment Method" },
  "checkout.mobilemoney": { fr: "Mobile Money", en: "Mobile Money" },
  "checkout.card": { fr: "Carte bancaire", en: "Credit Card" },
  "checkout.confirm": { fr: "Confirmer la commande", en: "Confirm Order" },
  "checkout.success": { fr: "Commande confirmée !", en: "Order Confirmed!" },
  "checkout.success.msg": { fr: "Merci pour votre achat. Vos livres sont disponibles dans votre bibliothèque.", en: "Thank you for your purchase. Your books are available in your library." },

  "creator.overview": { fr: "Vue d'ensemble", en: "Overview" },
  "creator.mybooks": { fr: "Mes livres", en: "My Books" },
  "creator.upload": { fr: "Publier un livre", en: "Publish a Book" },
  "creator.analytics": { fr: "Analytiques", en: "Analytics" },
  "creator.settings": { fr: "Paramètres", en: "Settings" },
  "creator.revenue": { fr: "Revenus", en: "Revenue" },
  "creator.sales": { fr: "Ventes", en: "Sales" },
  "creator.views": { fr: "Vues", en: "Views" },
  "creator.books": { fr: "Livres publiés", en: "Published Books" },
  "creator.welcome": { fr: "Bienvenue sur votre espace créateur", en: "Welcome to your creator space" },

  "kdp.step1": { fr: "Détails du livre", en: "Book Details" },
  "kdp.step2": { fr: "Contenu", en: "Content" },
  "kdp.step3": { fr: "Tarification", en: "Pricing" },
  "kdp.title": { fr: "Titre", en: "Title" },
  "kdp.subtitle": { fr: "Sous-titre (optionnel)", en: "Subtitle (optional)" },
  "kdp.authorname": { fr: "Nom de l'auteur", en: "Author Name" },
  "kdp.descfr": { fr: "Description (Français)", en: "Description (French)" },
  "kdp.descen": { fr: "Description (Anglais)", en: "Description (English)" },
  "kdp.genre": { fr: "Genre", en: "Genre" },
  "kdp.category": { fr: "Catégorie", en: "Category" },
  "kdp.origin": { fr: "Pays d'origine", en: "Country of Origin" },
  "kdp.language": { fr: "Langue du contenu", en: "Content Language" },
  "kdp.keywords": { fr: "Mots-clés (séparés par des virgules)", en: "Keywords (comma-separated)" },
  "kdp.contenttype": { fr: "Type de contenu", en: "Content Type" },
  "kdp.cover": { fr: "Image de couverture", en: "Cover Image" },
  "kdp.coverhelp": { fr: "JPG ou PNG, min 800×1200px, format portrait", en: "JPG or PNG, min 800×1200px, portrait format" },
  "kdp.manuscript": { fr: "Fichier du manuscrit", en: "Manuscript File" },
  "kdp.isbn": { fr: "ISBN (optionnel)", en: "ISBN (optional)" },
  "kdp.pages": { fr: "Nombre de pages", en: "Number of Pages" },
  "kdp.duration": { fr: "Durée (minutes)", en: "Duration (minutes)" },
  "kdp.price": { fr: "Prix de vente (USD)", en: "Selling Price (USD)" },
  "kdp.publish": { fr: "Publier maintenant", en: "Publish Now" },
  "kdp.savedraft": { fr: "Enregistrer comme brouillon", en: "Save as Draft" },
  "kdp.next": { fr: "Suivant", en: "Next" },
  "kdp.prev": { fr: "Précédent", en: "Previous" },
  "kdp.uploading": { fr: "Publication en cours...", en: "Publishing..." },
  "kdp.success": { fr: "Livre publié avec succès !", en: "Book published successfully!" },
  "kdp.error": { fr: "Erreur lors de la publication", en: "Error publishing book" },

  "creator.status.draft": { fr: "Brouillon", en: "Draft" },
  "creator.status.published": { fr: "Publié", en: "Published" },
  "creator.status.archived": { fr: "Archivé", en: "Archived" },

  "reader.library": { fr: "Ma bibliothèque", en: "My Library" },
  "reader.orders": { fr: "Mes commandes", en: "My Orders" },
  "reader.wishlist": { fr: "Liste de souhaits", en: "Wishlist" },
  "reader.settings": { fr: "Paramètres", en: "Settings" },
  "reader.welcome": { fr: "Bienvenue dans votre espace lecteur", en: "Welcome to your reading space" },
  "reader.reading": { fr: "En cours de lecture", en: "Currently Reading" },
  "reader.finished": { fr: "Terminé", en: "Finished" },
  "reader.nobooks": { fr: "Vous n'avez pas encore de livres", en: "You don't have any books yet" },
  "reader.startreading": { fr: "Lire", en: "Read" },
  "reader.download": { fr: "Télécharger", en: "Download" },
  "reader.listen": { fr: "Écouter", en: "Listen" },

  "common.price": { fr: "Prix", en: "Price" },
  "common.currency": { fr: "USD", en: "USD" },
  "common.save": { fr: "Enregistrer", en: "Save" },
  "common.cancel": { fr: "Annuler", en: "Cancel" },
  "common.delete": { fr: "Supprimer", en: "Delete" },
  "common.edit": { fr: "Modifier", en: "Edit" },
  "common.loading": { fr: "Chargement...", en: "Loading..." },
  "common.back": { fr: "Retour", en: "Back" },
  "common.noresults": { fr: "Aucun résultat", en: "No results" },
  "common.language": { fr: "Langue", en: "Language" },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>("fr");

  const t = useCallback(
    (key: string) => translations[key]?.[lang] ?? key,
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
