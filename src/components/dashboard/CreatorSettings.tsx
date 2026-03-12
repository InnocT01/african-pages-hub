import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";

const CreatorSettings = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader><CardTitle>Profil public</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="text-xl bg-primary/10 text-primary">
                {user?.name?.charAt(0)?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" className="gap-2 rounded-full">
              <Upload className="h-4 w-4" />
              Changer la photo
            </Button>
          </div>
          <div className="space-y-2">
            <Label>{t("auth.name")}</Label>
            <Input defaultValue={user?.name || ""} className="rounded-lg" />
          </div>
          <div className="space-y-2">
            <Label>{t("auth.email")}</Label>
            <Input defaultValue={user?.email || ""} disabled className="rounded-lg" />
          </div>
          <div className="space-y-2">
            <Label>Bio</Label>
            <Textarea placeholder="Votre biographie d'auteur..." className="min-h-[100px] rounded-lg" />
          </div>
          <Button className="rounded-full">{t("common.save")}</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Informations de paiement</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Configurez vos informations de paiement pour recevoir vos revenus.
          </p>
          <div className="space-y-2">
            <Label>Numéro Mobile Money</Label>
            <Input placeholder="+243 XXX XXX XXX" className="rounded-lg" />
          </div>
          <div className="space-y-2">
            <Label>Nom du titulaire</Label>
            <Input placeholder="Nom complet" className="rounded-lg" />
          </div>
          <Button className="rounded-full">{t("common.save")}</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatorSettings;
