import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMyBooks } from "@/hooks/useBooks";
import { Megaphone, Share2, Copy, Globe, Facebook, Twitter } from "lucide-react";
import { toast } from "sonner";

const CreatorMarketing = () => {
  const { lang } = useLanguage();
  const { data: books = [] } = useMyBooks();
  const published = books.filter(b => b.status === "published");

  const copyLink = (bookId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/book/${bookId}`);
    toast.success(lang === "fr" ? "Lien copié !" : "Link copied!");
  };

  const shareToFacebook = (bookId: string, title: string) => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${window.location.origin}/book/${bookId}`)}&quote=${encodeURIComponent(title)}`, "_blank");
  };

  const shareToTwitter = (bookId: string, title: string) => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`📖 ${title} — Disponible sur KitabuShop !`)}&url=${encodeURIComponent(`${window.location.origin}/book/${bookId}`)}`, "_blank");
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">{lang === "fr" ? "Partagez vos livres sur les réseaux sociaux et obtenez plus de lecteurs." : "Share your books on social media and reach more readers."}</p>

      {/* Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="bg-primary/5 border-primary/10">
          <CardContent className="p-4">
            <Megaphone className="h-5 w-5 text-primary mb-2" />
            <h4 className="font-bold text-sm">{lang === "fr" ? "Partagez régulièrement" : "Share Regularly"}</h4>
            <p className="text-xs text-muted-foreground mt-1">{lang === "fr" ? "Publiez au moins 2x/semaine sur les réseaux sociaux." : "Post at least 2x/week on social media."}</p>
          </CardContent>
        </Card>
        <Card className="bg-accent/5 border-accent/10">
          <CardContent className="p-4">
            <Globe className="h-5 w-5 text-accent mb-2" />
            <h4 className="font-bold text-sm">{lang === "fr" ? "Mots-clés" : "Keywords"}</h4>
            <p className="text-xs text-muted-foreground mt-1">{lang === "fr" ? "Ajoutez des mots-clés pertinents à vos livres pour le SEO." : "Add relevant keywords to your books for SEO."}</p>
          </CardContent>
        </Card>
        <Card className="bg-secondary">
          <CardContent className="p-4">
            <Share2 className="h-5 w-5 text-foreground mb-2" />
            <h4 className="font-bold text-sm">{lang === "fr" ? "Promotions" : "Promotions"}</h4>
            <p className="text-xs text-muted-foreground mt-1">{lang === "fr" ? "Activez des promos pour booster vos ventes." : "Enable promos to boost your sales."}</p>
          </CardContent>
        </Card>
      </div>

      {/* Share links */}
      <Card>
        <CardHeader><CardTitle className="text-base">{lang === "fr" ? "Partager vos livres" : "Share Your Books"}</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {published.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">{lang === "fr" ? "Publiez un livre pour le partager." : "Publish a book to share it."}</p>
          ) : published.map(book => (
            <div key={book.id} className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
              {book.cover_url ? <img src={book.cover_url} alt="" className="h-10 w-7 rounded object-cover" /> : <div className="h-10 w-7 rounded bg-secondary" />}
              <span className="flex-1 text-sm font-medium truncate">{book.title}</span>
              <div className="flex gap-1.5 shrink-0">
                <Button size="icon" variant="outline" className="h-7 w-7 rounded-full" onClick={() => copyLink(book.id)}><Copy className="h-3 w-3" /></Button>
                <Button size="icon" variant="outline" className="h-7 w-7 rounded-full" onClick={() => shareToFacebook(book.id, book.title)}><Facebook className="h-3 w-3" /></Button>
                <Button size="icon" variant="outline" className="h-7 w-7 rounded-full" onClick={() => shareToTwitter(book.id, book.title)}><Twitter className="h-3 w-3" /></Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Embed code */}
      <Card>
        <CardHeader><CardTitle className="text-base">{lang === "fr" ? "Code d'intégration" : "Embed Code"}</CardTitle></CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3">{lang === "fr" ? "Intégrez votre page auteur sur votre site web." : "Embed your author page on your website."}</p>
          <div className="bg-secondary rounded-lg p-3 font-mono text-xs text-muted-foreground">
            {`<iframe src="${window.location.origin}/catalog?author=me" width="100%" height="600" />`}
          </div>
          <Button variant="outline" size="sm" className="mt-2 rounded-full text-xs" onClick={() => { navigator.clipboard.writeText(`<iframe src="${window.location.origin}/catalog" width="100%" height="600" />`); toast.success("Copied!"); }}>
            <Copy className="h-3 w-3 mr-1" />{lang === "fr" ? "Copier" : "Copy"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatorMarketing;
