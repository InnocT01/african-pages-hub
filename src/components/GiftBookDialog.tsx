import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Gift, Loader2, Copy, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface Props {
  bookId: string;
  bookTitle: string;
}

const GiftBookDialog = ({ bookId, bookTitle }: Props) => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState<string | null>(null);

  const handleSend = async () => {
    if (!user) { toast.error(lang === "fr" ? "Connectez-vous" : "Sign in first"); return; }
    if (!email.includes("@")) { toast.error(lang === "fr" ? "Email invalide" : "Invalid email"); return; }
    setLoading(true);
    const redemptionCode = `KS-GIFT-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
    const { error } = await supabase.from("gifts").insert({
      sender_id: user.id,
      recipient_email: email,
      book_id: bookId,
      message: message || null,
      redemption_code: redemptionCode,
    } as any);
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setCode(redemptionCode);
    toast.success(lang === "fr" ? "Cadeau créé !" : "Gift created!");
  };

  const copyCode = () => {
    if (code) { navigator.clipboard.writeText(code); toast.success(lang === "fr" ? "Code copié" : "Code copied"); }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setCode(null); setEmail(""); setMessage(""); } }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full gap-2">
          <Gift className="h-4 w-4" />{lang === "fr" ? "Offrir" : "Gift"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            {lang === "fr" ? `Offrir « ${bookTitle} »` : `Gift "${bookTitle}"`}
          </DialogTitle>
        </DialogHeader>

        {code ? (
          <div className="space-y-4 py-4 text-center">
            <CheckCircle className="h-12 w-12 text-accent mx-auto" />
            <p className="font-semibold">{lang === "fr" ? "Cadeau envoyé !" : "Gift sent!"}</p>
            <p className="text-sm text-muted-foreground">
              {lang === "fr" ? "Partagez ce code avec le destinataire :" : "Share this code with the recipient:"}
            </p>
            <div className="flex items-center gap-2 justify-center">
              <code className="px-4 py-2 bg-secondary rounded-md font-mono font-bold text-primary">{code}</code>
              <Button size="icon" variant="outline" onClick={copyCode}><Copy className="h-4 w-4" /></Button>
            </div>
            <Button className="w-full" onClick={() => setOpen(false)}>{lang === "fr" ? "Fermer" : "Close"}</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{lang === "fr" ? "Email du destinataire" : "Recipient email"}</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ami@example.com" />
            </div>
            <div className="space-y-2">
              <Label>{lang === "fr" ? "Message personnalisé (optionnel)" : "Personal message (optional)"}</Label>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder={lang === "fr" ? "Bonne lecture !" : "Enjoy this book!"} />
            </div>
            <Button onClick={handleSend} disabled={loading} className="w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Gift className="h-4 w-4 mr-2" />}
              {lang === "fr" ? "Envoyer le cadeau" : "Send Gift"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GiftBookDialog;
