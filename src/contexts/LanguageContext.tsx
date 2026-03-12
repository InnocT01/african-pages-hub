import React, { createContext, useContext, useState, useCallback } from "react";

type Language = "fr" | "en";

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Header
  "nav.education": { fr: "Éducation", en: "Education" },
  "nav.literature": { fr: "Littérature", en: "Literature" },
  "nav.youth": { fr: "Jeunesse", en: "Youth" },
  "nav.diaspora": { fr: "Diaspora", en: "Diaspora" },
  "nav.search": { fr: "Rechercher un livre, un auteur...", en: "Search a book, an author..." },
  "nav.login": { fr: "Connexion", en: "Sign In" },
  "nav.signup": { fr: "Inscription", en: "Sign Up" },
  "nav.cart": { fr: "Panier", en: "Cart" },
  "nav.dashboard": { fr: "Tableau de bord", en: "Dashboard" },
  "nav.logout": { fr: "Déconnexion", en: "Sign Out" },
  "nav.catalog": { fr: "Catalogue", en: "Catalog" },

  // Hero
  "hero.title": { fr: "La Bibliothèque du Futur Africain", en: "The Library of Africa's Future" },
  "hero.subtitle": { fr: "Découvrez, publiez et partagez les plus belles œuvres littéraires d'Afrique.", en: "Discover, publish and share Africa's finest literary works." },
  "hero.cta.browse": { fr: "Explorer le catalogue", en: "Browse Catalog" },
  "hero.cta.publish": { fr: "Publier mon œuvre", en: "Publish My Work" },

  // Filters
  "filter.all": { fr: "Tous", en: "All" },
  "filter.origin": { fr: "Origine", en: "Origin" },
  "filter.genre": { fr: "Genre", en: "Genre" },
  "filter.type": { fr: "Type", en: "Type" },
  "filter.ebook": { fr: "E-book", en: "E-book" },
  "filter.audio": { fr: "Audio", en: "Audio" },
  "filter.physical": { fr: "Physique", en: "Physical" },

  // Sections
  "section.new": { fr: "Nouveautés", en: "New Releases" },
  "section.bestsellers": { fr: "Best-sellers", en: "Best Sellers" },
  "section.literature": { fr: "Littérature", en: "Literature" },
  "section.education": { fr: "Éducation", en: "Education" },
  "section.youth": { fr: "Jeunesse", en: "Youth" },
  "section.diaspora": { fr: "Diaspora", en: "Diaspora" },
  "section.viewall": { fr: "Voir tout", en: "View All" },

  // Creator CTA
  "cta.creator.title": { fr: "Vous êtes auteur ou éditeur ?", en: "Are you an author or publisher?" },
  "cta.creator.subtitle": { fr: "Publiez votre œuvre et touchez des millions de lecteurs à travers l'Afrique et sa diaspora.", en: "Publish your work and reach millions of readers across Africa and its diaspora." },
  "cta.creator.button": { fr: "Commencer à publier", en: "Start Publishing" },

  // Footer
  "footer.about": { fr: "À propos", en: "About" },
  "footer.contact": { fr: "Contact", en: "Contact" },
  "footer.terms": { fr: "Conditions d'utilisation", en: "Terms of Use" },
  "footer.privacy": { fr: "Politique de confidentialité", en: "Privacy Policy" },
  "footer.newsletter": { fr: "Inscrivez-vous à notre newsletter", en: "Subscribe to our newsletter" },
  "footer.newsletter.placeholder": { fr: "Votre adresse email", en: "Your email address" },
  "footer.newsletter.button": { fr: "S'inscrire", en: "Subscribe" },
  "footer.rights": { fr: "Tous droits réservés.", en: "All rights reserved." },
  "footer.tagline": { fr: "L'OS de la littérature africaine", en: "The OS of African Literature" },

  // Auth
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

  // Book Detail
  "book.addtocart": { fr: "Ajouter au panier", en: "Add to Cart" },
  "book.buynow": { fr: "Acheter maintenant", en: "Buy Now" },
  "book.preview": { fr: "Aperçu", en: "Preview" },
  "book.format": { fr: "Format", en: "Format" },
  "book.related": { fr: "Livres similaires", en: "Related Books" },
  "book.by": { fr: "par", en: "by" },
  "book.description": { fr: "Description", en: "Description" },

  // Cart
  "cart.title": { fr: "Mon panier", en: "My Cart" },
  "cart.empty": { fr: "Votre panier est vide", en: "Your cart is empty" },
  "cart.subtotal": { fr: "Sous-total", en: "Subtotal" },
  "cart.checkout": { fr: "Passer la commande", en: "Proceed to Checkout" },
  "cart.continue": { fr: "Continuer mes achats", en: "Continue Shopping" },
  "cart.remove": { fr: "Retirer", en: "Remove" },

  // Checkout
  "checkout.title": { fr: "Paiement", en: "Checkout" },
  "checkout.payment": { fr: "Méthode de paiement", en: "Payment Method" },
  "checkout.mobilemoney": { fr: "Mobile Money", en: "Mobile Money" },
  "checkout.card": { fr: "Carte bancaire", en: "Credit Card" },
  "checkout.confirm": { fr: "Confirmer la commande", en: "Confirm Order" },
  "checkout.success": { fr: "Commande confirmée !", en: "Order Confirmed!" },
  "checkout.success.msg": { fr: "Merci pour votre achat. Vos livres sont disponibles dans votre bibliothèque.", en: "Thank you for your purchase. Your books are available in your library." },

  // Creator Dashboard
  "creator.overview": { fr: "Vue d'ensemble", en: "Overview" },
  "creator.mybooks": { fr: "Mes livres", en: "My Books" },
  "creator.upload": { fr: "Publier un livre", en: "Publish a Book" },
  "creator.analytics": { fr: "Analytiques", en: "Analytics" },
  "creator.settings": { fr: "Paramètres", en: "Settings" },
  "creator.revenue": { fr: "Revenus", en: "Revenue" },
  "creator.sales": { fr: "Ventes", en: "Sales" },
  "creator.views": { fr: "Vues", en: "Views" },
  "creator.books": { fr: "Livres publiés", en: "Published Books" },

  // Reader Dashboard
  "reader.library": { fr: "Ma bibliothèque", en: "My Library" },
  "reader.orders": { fr: "Mes commandes", en: "My Orders" },
  "reader.wishlist": { fr: "Liste de souhaits", en: "Wishlist" },
  "reader.settings": { fr: "Paramètres", en: "Settings" },

  // Common
  "common.price": { fr: "Prix", en: "Price" },
  "common.currency": { fr: "USD", en: "USD" },
  "common.save": { fr: "Enregistrer", en: "Save" },
  "common.cancel": { fr: "Annuler", en: "Cancel" },
  "common.delete": { fr: "Supprimer", en: "Delete" },
  "common.edit": { fr: "Modifier", en: "Edit" },
  "common.loading": { fr: "Chargement...", en: "Loading..." },
  "common.back": { fr: "Retour", en: "Back" },
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
