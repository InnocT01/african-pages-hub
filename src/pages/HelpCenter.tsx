import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { ChevronRight, BookOpen, CreditCard, Truck, PenTool, Shield, MessageSquare, Mail, Phone } from "lucide-react";

const HelpCenter = () => {
  const { lang } = useLanguage();

  const categories = [
    {
      icon: BookOpen,
      title: lang === "fr" ? "Acheter des livres" : "Buying Books",
      faqs: [
        {
          q: lang === "fr" ? "Comment acheter un livre ?" : "How do I buy a book?",
          a: lang === "fr"
            ? "Parcourez le catalogue, ajoutez un livre au panier, puis procédez au paiement. Vous pouvez payer par carte bancaire, Mobile Money ou virement bancaire."
            : "Browse the catalog, add a book to your cart, then proceed to checkout. You can pay by credit card, Mobile Money or bank transfer.",
        },
        {
          q: lang === "fr" ? "Comment télécharger un e-book ?" : "How do I download an e-book?",
          a: lang === "fr"
            ? "Après l'achat, rendez-vous dans votre tableau de bord lecteur > Téléchargements. Vos e-books achetés y sont disponibles."
            : "After purchase, go to your reader dashboard > Downloads. Your purchased e-books are available there.",
        },
        {
          q: lang === "fr" ? "Puis-je lire un extrait avant d'acheter ?" : "Can I read an excerpt before buying?",
          a: lang === "fr"
            ? "Oui ! Sur chaque fiche produit, cliquez sur 'Lire' pour consulter un extrait gratuit."
            : "Yes! On each product page, click 'Read' to view a free excerpt.",
        },
      ],
    },
    {
      icon: CreditCard,
      title: lang === "fr" ? "Paiements" : "Payments",
      faqs: [
        {
          q: lang === "fr" ? "Quels modes de paiement acceptez-vous ?" : "What payment methods do you accept?",
          a: lang === "fr"
            ? "Nous acceptons les cartes bancaires (Visa, Mastercard), Mobile Money (M-Pesa, Airtel Money, Orange Money) et les virements bancaires."
            : "We accept credit cards (Visa, Mastercard), Mobile Money (M-Pesa, Airtel Money, Orange Money) and bank transfers.",
        },
        {
          q: lang === "fr" ? "Les prix sont-ils en dollars ?" : "Are prices in dollars?",
          a: lang === "fr"
            ? "Oui, tous les prix sont affichés en dollars américains (USD)."
            : "Yes, all prices are displayed in US dollars (USD).",
        },
      ],
    },
    {
      icon: Truck,
      title: lang === "fr" ? "Livraison (Kitabu Express)" : "Delivery (Kitabu Express)",
      faqs: [
        {
          q: lang === "fr" ? "Comment fonctionne Kitabu Express ?" : "How does Kitabu Express work?",
          a: lang === "fr"
            ? "Kitabu Express livre vos livres brochés partout en RDC et en Afrique de l'Est. Ajoutez un livre broché au panier et choisissez l'option de livraison au checkout. Délai moyen : 3-7 jours ouvrables."
            : "Kitabu Express delivers your paperback books throughout DRC and East Africa. Add a paperback to your cart and choose the delivery option at checkout. Average time: 3-7 business days.",
        },
        {
          q: lang === "fr" ? "Combien coûte la livraison ?" : "How much does delivery cost?",
          a: lang === "fr"
            ? "Les frais de livraison dépendent de votre localisation. Ils sont calculés au moment du checkout."
            : "Delivery fees depend on your location. They are calculated at checkout.",
        },
      ],
    },
    {
      icon: PenTool,
      title: lang === "fr" ? "Publier (KDP)" : "Publishing (KDP)",
      faqs: [
        {
          q: lang === "fr" ? "Comment publier un livre sur KitabuShop ?" : "How do I publish a book on KitabuShop?",
          a: lang === "fr"
            ? "Créez un compte auteur/éditeur, puis accédez à Kitabu Direct Publishing depuis votre tableau de bord. Suivez les 3 étapes : Détails, Contenu, Tarification."
            : "Create an author/publisher account, then access Kitabu Direct Publishing from your dashboard. Follow the 3 steps: Details, Content, Pricing.",
        },
        {
          q: lang === "fr" ? "Quelle est la commission de KitabuShop ?" : "What is KitabuShop's commission?",
          a: lang === "fr"
            ? "KitabuShop prélève une commission de 15% sur chaque vente. Vous recevez 85% du prix de vente."
            : "KitabuShop takes a 15% commission on each sale. You receive 85% of the selling price.",
        },
        {
          q: lang === "fr" ? "Puis-je créer une couverture sur KitabuShop ?" : "Can I create a cover on KitabuShop?",
          a: lang === "fr"
            ? "Oui ! Notre outil Cover Creator vous propose des modèles personnalisables ou vous pouvez uploader votre propre couverture."
            : "Yes! Our Cover Creator tool offers customizable templates or you can upload your own cover.",
        },
      ],
    },
    {
      icon: Shield,
      title: lang === "fr" ? "Sécurité & Compte" : "Security & Account",
      faqs: [
        {
          q: lang === "fr" ? "Comment réinitialiser mon mot de passe ?" : "How do I reset my password?",
          a: lang === "fr"
            ? "Sur la page de connexion, cliquez sur 'Mot de passe oublié ?' et suivez les instructions envoyées par email."
            : "On the login page, click 'Forgot password?' and follow the instructions sent by email.",
        },
        {
          q: lang === "fr" ? "Mes données sont-elles protégées ?" : "Is my data protected?",
          a: lang === "fr"
            ? "Oui. Nous utilisons le chiffrement SSL et respectons les meilleures pratiques de sécurité pour protéger vos données personnelles et bancaires."
            : "Yes. We use SSL encryption and follow security best practices to protect your personal and banking data.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">{lang === "fr" ? "Accueil" : "Home"}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{lang === "fr" ? "Centre d'aide" : "Help Center"}</span>
        </nav>

        <h1 className="text-3xl font-bold mb-2">{lang === "fr" ? "Centre d'aide" : "Help Center"}</h1>
        <p className="text-muted-foreground mb-8">
          {lang === "fr"
            ? "Trouvez des réponses à vos questions les plus fréquentes."
            : "Find answers to your most frequently asked questions."}
        </p>

        <div className="space-y-6">
          {categories.map((cat, idx) => (
            <Card key={idx}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <cat.icon className="h-4 w-4 text-primary" />
                  {cat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  {cat.faqs.map((faq, fi) => (
                    <AccordionItem key={fi} value={`${idx}-${fi}`}>
                      <AccordionTrigger className="text-sm text-left">{faq.q}</AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact section */}
        <Card className="mt-8 bg-primary/5 border-primary/10">
          <CardContent className="p-6 text-center space-y-3">
            <MessageSquare className="h-8 w-8 mx-auto text-primary" />
            <h3 className="font-bold">{lang === "fr" ? "Besoin d'aide supplémentaire ?" : "Need more help?"}</h3>
            <p className="text-sm text-muted-foreground">
              {lang === "fr"
                ? "Contactez notre équipe de support."
                : "Contact our support team."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <a href="tel:+243835377286" className="flex items-center gap-1.5 text-sm text-primary hover:underline">
                <Phone className="h-4 w-4" />+243 835 377 286
              </a>
              <a href="mailto:kitabushop5@gmail.com" className="flex items-center gap-1.5 text-sm text-primary hover:underline">
                <Mail className="h-4 w-4" />kitabushop5@gmail.com
              </a>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default HelpCenter;
