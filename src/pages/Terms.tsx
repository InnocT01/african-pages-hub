import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const Terms = () => {
  const { lang } = useLanguage();
  const isFr = lang === "fr";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl prose prose-headings:font-bold">
        <h1>{isFr ? "Conditions d'utilisation" : "Terms of Use"}</h1>
        <p className="text-muted-foreground">{isFr ? "Dernière mise à jour : mars 2026" : "Last updated: March 2026"}</p>

        <h2>{isFr ? "1. Acceptation des conditions" : "1. Acceptance of Terms"}</h2>
        <p>{isFr
          ? "En accédant à KitabuShop, vous acceptez d'être lié par les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser la plateforme."
          : "By accessing KitabuShop, you agree to be bound by these terms of use. If you do not accept these terms, please do not use the platform."
        }</p>

        <h2>{isFr ? "2. Description du service" : "2. Service Description"}</h2>
        <p>{isFr
          ? "KitabuShop est une plateforme de marketplace permettant aux auteurs et éditeurs de publier et vendre des œuvres littéraires et éducatives, et aux lecteurs d'acheter et accéder à ces contenus. La plateforme prend en charge les e-books, livres audio, bandes dessinées, manuels scolaires, revues scientifiques et articles."
          : "KitabuShop is a marketplace platform enabling authors and publishers to publish and sell literary and educational works, and readers to purchase and access these contents. The platform supports e-books, audiobooks, comics, textbooks, scientific journals, and articles."
        }</p>

        <h2>{isFr ? "3. Inscription et comptes" : "3. Registration and Accounts"}</h2>
        <p>{isFr
          ? "Pour utiliser certaines fonctionnalités, vous devez créer un compte. Vous êtes responsable de maintenir la confidentialité de vos identifiants. Vous vous engagez à fournir des informations exactes lors de l'inscription."
          : "To use certain features, you must create an account. You are responsible for maintaining the confidentiality of your credentials. You agree to provide accurate information during registration."
        }</p>

        <h2>{isFr ? "4. Propriété intellectuelle" : "4. Intellectual Property"}</h2>
        <p>{isFr
          ? "Les auteurs conservent tous les droits sur leurs œuvres. En publiant sur KitabuShop, vous accordez à la plateforme une licence non exclusive pour distribuer votre contenu. Il est interdit de publier du contenu dont vous ne détenez pas les droits."
          : "Authors retain all rights to their works. By publishing on KitabuShop, you grant the platform a non-exclusive license to distribute your content. Publishing content you don't own the rights to is prohibited."
        }</p>

        <h2>{isFr ? "5. Paiements et remboursements" : "5. Payments and Refunds"}</h2>
        <p>{isFr
          ? "Les prix sont affichés en dollars américains (USD). Les paiements sont traités de manière sécurisée via Mobile Money ou carte bancaire. Les remboursements pour les contenus numériques ne sont possibles que dans les 24 heures suivant l'achat si le contenu n'a pas été téléchargé ou consulté."
          : "Prices are displayed in US dollars (USD). Payments are securely processed via Mobile Money or credit card. Refunds for digital content are only possible within 24 hours of purchase if the content has not been downloaded or accessed."
        }</p>

        <h2>{isFr ? "6. Responsabilité" : "6. Liability"}</h2>
        <p>{isFr
          ? "KitabuShop agit en tant qu'intermédiaire et n'est pas responsable du contenu publié par les auteurs. La plateforme se réserve le droit de retirer tout contenu jugé inapproprié ou en violation des présentes conditions."
          : "KitabuShop acts as an intermediary and is not responsible for content published by authors. The platform reserves the right to remove any content deemed inappropriate or in violation of these terms."
        }</p>

        <h2>{isFr ? "7. Contact" : "7. Contact"}</h2>
        <p>{isFr
          ? "Pour toute question, contactez-nous à kitabushop5@gmail.com ou à notre adresse : Q. Office, avenue du Collège, 076, Goma-RDC."
          : "For any questions, contact us at kitabushop5@gmail.com or at our address: Q. Office, avenue du Collège, 076, Goma-RDC."
        }</p>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
