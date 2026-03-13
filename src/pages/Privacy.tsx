import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const Privacy = () => {
  const { lang } = useLanguage();
  const isFr = lang === "fr";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl prose prose-headings:font-bold">
        <h1>{isFr ? "Politique de confidentialité" : "Privacy Policy"}</h1>
        <p className="text-muted-foreground">{isFr ? "Dernière mise à jour : mars 2026" : "Last updated: March 2026"}</p>

        <h2>{isFr ? "1. Données collectées" : "1. Data Collected"}</h2>
        <p>{isFr
          ? "Nous collectons les données suivantes : nom, adresse email, informations de paiement (numéro Mobile Money ou données de carte bancaire chiffrées), historique d'achats, et données de navigation sur la plateforme."
          : "We collect the following data: name, email address, payment information (Mobile Money number or encrypted card data), purchase history, and platform browsing data."
        }</p>

        <h2>{isFr ? "2. Utilisation des données" : "2. Use of Data"}</h2>
        <p>{isFr
          ? "Vos données sont utilisées pour : fournir et améliorer nos services, traiter vos commandes et paiements, personnaliser votre expérience, vous envoyer des communications relatives à vos achats et, avec votre consentement, des newsletters."
          : "Your data is used to: provide and improve our services, process your orders and payments, personalize your experience, send you purchase-related communications and, with your consent, newsletters."
        }</p>

        <h2>{isFr ? "3. Protection des données" : "3. Data Protection"}</h2>
        <p>{isFr
          ? "Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données personnelles contre l'accès non autorisé, la modification, la divulgation ou la destruction."
          : "We implement appropriate technical and organizational security measures to protect your personal data against unauthorized access, modification, disclosure, or destruction."
        }</p>

        <h2>{isFr ? "4. Partage des données" : "4. Data Sharing"}</h2>
        <p>{isFr
          ? "Nous ne vendons pas vos données personnelles. Nous pouvons partager vos informations avec des prestataires de services de paiement pour traiter vos transactions, et avec les auteurs/éditeurs dans la mesure nécessaire à la fourniture de leurs services."
          : "We do not sell your personal data. We may share your information with payment service providers to process your transactions, and with authors/publishers as necessary to provide their services."
        }</p>

        <h2>{isFr ? "5. Vos droits" : "5. Your Rights"}</h2>
        <p>{isFr
          ? "Vous avez le droit d'accéder, de rectifier, de supprimer vos données personnelles, et de vous opposer à leur traitement. Pour exercer ces droits, contactez-nous à kitabushop5@gmail.com."
          : "You have the right to access, rectify, delete your personal data, and object to their processing. To exercise these rights, contact us at kitabushop5@gmail.com."
        }</p>

        <h2>{isFr ? "6. Cookies" : "6. Cookies"}</h2>
        <p>{isFr
          ? "Nous utilisons des cookies essentiels pour le fonctionnement de la plateforme et des cookies analytiques pour comprendre comment vous utilisez notre service. Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur."
          : "We use essential cookies for platform functionality and analytics cookies to understand how you use our service. You can manage your cookie preferences in your browser settings."
        }</p>

        <h2>{isFr ? "7. Contact" : "7. Contact"}</h2>
        <p>{isFr
          ? "Pour toute question relative à la protection de vos données, contactez-nous à kitabushop5@gmail.com — Q. Office, avenue du Collège, 076, Goma-RDC."
          : "For any questions regarding your data protection, contact us at kitabushop5@gmail.com — Q. Office, avenue du Collège, 076, Goma-RDC."
        }</p>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
