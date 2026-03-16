import { useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const CreatorSettings = () => {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const avatarRef = useRef<HTMLInputElement>(null);

  // Bank info
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [iban, setIban] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [savingBank, setSavingBank] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["my-profile"],
    queryFn: async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) return null;
      const { data } = await supabase.from("profiles").select("*").eq("user_id", u.id).maybeSingle();
      return data;
    },
  });

  useEffect(() => {
    if (profile) {
      setName((profile as any).display_name || "");
      setBio((profile as any).bio || "");
      setBankName((profile as any).bank_name || "");
      setBankAccount((profile as any).bank_account_name || "");
      setIban((profile as any).iban || "");
      setPhone((profile as any).phone || "");
      setAddress((profile as any).address || "");
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("profiles").update({ display_name: name, bio } as any).eq("user_id", user.id);
      if (error) throw error;
      toast.success(lang === "fr" ? "Profil mis à jour" : "Profile updated");
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
    } catch (e: any) { toast.error(e.message); } finally { setSaving(false); }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/avatar.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("book-covers").upload(path, file, { upsert: true });
      if (uploadErr) throw uploadErr;
      const { data: { publicUrl } } = supabase.storage.from("book-covers").getPublicUrl(path);
      await supabase.from("profiles").update({ avatar_url: publicUrl } as any).eq("user_id", user.id);
      toast.success(lang === "fr" ? "Photo mise à jour" : "Photo updated");
    } catch (e: any) { toast.error(e.message); } finally { setUploading(false); }
  };

  const saveBankInfo = async () => {
    if (!user) return;
    setSavingBank(true);
    try {
      const { error } = await supabase.from("profiles").update({
        bank_name: bankName || null, bank_account_name: bankAccount || null,
        iban: iban || null, phone: phone || null, address: address || null,
      } as any).eq("user_id", user.id);
      if (error) throw error;
      toast.success(lang === "fr" ? "Infos bancaires enregistrées" : "Bank info saved");
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
    } catch (e: any) { toast.error(e.message); } finally { setSavingBank(false); }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Profile */}
      <Card>
        <CardHeader><CardTitle className="text-base">{lang === "fr" ? "Profil public" : "Public Profile"}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="text-xl bg-primary/10 text-primary">{user?.name?.charAt(0)?.toUpperCase() || "?"}</AvatarFallback>
            </Avatar>
            <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            <Button variant="outline" size="sm" className="gap-2 rounded-full" onClick={() => avatarRef.current?.click()} disabled={uploading}>
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {lang === "fr" ? "Changer la photo" : "Change photo"}
            </Button>
          </div>
          <div className="space-y-2"><Label className="text-xs">{t("auth.name")}</Label><Input value={name} onChange={(e) => setName(e.target.value)} className="h-9" /></div>
          <div className="space-y-2"><Label className="text-xs">{t("auth.email")}</Label><Input defaultValue={user?.email || ""} disabled className="h-9" /></div>
          <div className="space-y-2"><Label className="text-xs">Bio</Label><Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder={lang === "fr" ? "Votre biographie d'auteur..." : "Your author biography..."} className="min-h-[80px]" /></div>
          <Button className="rounded-full" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}{t("common.save")}
          </Button>
        </CardContent>
      </Card>

      {/* Bank info */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><CreditCard className="h-4 w-4" />{lang === "fr" ? "Informations bancaires" : "Bank Information"}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-muted-foreground">{lang === "fr" ? "Pour recevoir vos versements de royalties." : "To receive your royalty payouts."}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label className="text-xs">{lang === "fr" ? "Nom de la banque" : "Bank Name"}</Label><Input value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="Rawbank..." className="h-9" /></div>
            <div className="space-y-2"><Label className="text-xs">{lang === "fr" ? "Nom du titulaire" : "Account Holder"}</Label><Input value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} className="h-9" /></div>
          </div>
          <div className="space-y-2"><Label className="text-xs">IBAN / {lang === "fr" ? "Numéro de compte" : "Account Number"}</Label><Input value={iban} onChange={(e) => setIban(e.target.value)} placeholder="CD XX XXXX XXXX" className="h-9" /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label className="text-xs">{lang === "fr" ? "Téléphone" : "Phone"}</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+243..." className="h-9" /></div>
            <div className="space-y-2"><Label className="text-xs">{lang === "fr" ? "Adresse" : "Address"}</Label><Input value={address} onChange={(e) => setAddress(e.target.value)} className="h-9" /></div>
          </div>
          <Button className="rounded-full" onClick={saveBankInfo} disabled={savingBank}>
            {savingBank ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}{t("common.save")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatorSettings;
