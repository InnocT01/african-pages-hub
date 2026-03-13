import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, MapPin, Facebook, BookOpen, Users, Globe } from "lucide-react";

const About = () => {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold md:text-5xl">{lang === "fr" ? "À propos de KitabuShop" : "About KitabuShop"}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {lang === "fr"
              ? "KitabuShop est une marketplace des contenus éducatifs, littéraires d'Afrique subsaharienne et d'Afrique de l'Est. Elle offre un espace de création littéraire pour les auteurs et éditeurs africains au profit des lecteurs du continent et de la diaspora."
              : "KitabuShop is a marketplace for educational and literary content from Sub-Saharan and East Africa. It provides a space for literary creation for African authors and publishers, serving readers across the continent and the diaspora."
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-3">
            <BookOpen className="h-10 w-10 mx-auto text-primary" />
            <h3 className="font-bold text-lg">{lang === "fr" ? "Pour les auteurs" : "For Authors"}</h3>
            <p className="text-sm text-muted-foreground">
              {lang === "fr"
                ? "Les éditeurs et auteurs peuvent publier leurs œuvres, toucher un large public et être rémunérés."
                : "Publishers and authors can publish their works, reach a wide audience, and get compensated."
              }
            </p>
          </div>
          <div className="text-center space-y-3">
            <Users className="h-10 w-10 mx-auto text-primary" />
            <h3 className="font-bold text-lg">{lang === "fr" ? "Pour les lecteurs" : "For Readers"}</h3>
            <p className="text-sm text-muted-foreground">
              {lang === "fr"
                ? "Les lecteurs découvrent des récits ancrés dans les réalités africaines, en plusieurs langues et formats."
                : "Readers discover stories rooted in African realities, in multiple languages and formats."
              }
            </p>
          </div>
          <div className="text-center space-y-3">
            <Globe className="h-10 w-10 mx-auto text-primary" />
            <h3 className="font-bold text-lg">{lang === "fr" ? "Pour la diaspora" : "For the Diaspora"}</h3>
            <p className="text-sm text-muted-foreground">
              {lang === "fr"
                ? "Accès instantané aux contenus numériques pour la diaspora africaine partout dans le monde."
                : "Instant access to digital content for the African diaspora worldwide."
              }
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 space-y-4">
          <h2 className="text-2xl font-bold">{lang === "fr" ? "Nous contacter" : "Contact Us"}</h2>
          <div className="space-y-3">
            <a href="mailto:kitabushop5@gmail.com" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
              <Mail className="h-5 w-5 text-primary" />kitabushop5@gmail.com
            </a>
            <div className="flex items-start gap-3 text-muted-foreground">
              <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span>Q. Office, avenue du Collège, 076, Goma-RDC</span>
            </div>
            <a href="https://web.facebook.com/profile.php?id=61579692684157" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
              <Facebook className="h-5 w-5 text-primary" />Facebook
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
