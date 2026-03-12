import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PenTool, BookOpen } from "lucide-react";
import { toast } from "sonner";

const Signup = () => {
  const { t } = useLanguage();
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("reader");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(email, password, name, role);
      navigate(role === "creator" ? "/creator" : "/");
    } catch (err: any) {
      toast.error(t("auth.error"), { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{t("auth.signup.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("auth.name")}</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="rounded-lg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("auth.email")}</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="rounded-lg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("auth.password")}</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="rounded-lg" />
              </div>

              <div className="space-y-3">
                <Label>{t("auth.role")}</Label>
                <RadioGroup value={role} onValueChange={(v) => setRole(v as UserRole)} className="grid grid-cols-2 gap-3">
                  <Label htmlFor="role-creator" className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 cursor-pointer transition-all ${role === "creator" ? "border-primary bg-primary/5" : "border-border"}`}>
                    <RadioGroupItem value="creator" id="role-creator" className="sr-only" />
                    <PenTool className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium">{t("auth.role.creator")}</span>
                  </Label>
                  <Label htmlFor="role-reader" className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 cursor-pointer transition-all ${role === "reader" ? "border-primary bg-primary/5" : "border-border"}`}>
                    <RadioGroupItem value="reader" id="role-reader" className="sr-only" />
                    <BookOpen className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium">{t("auth.role.reader")}</span>
                  </Label>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full rounded-full" disabled={loading}>
                {loading ? t("common.loading") : t("auth.signup.button")}
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-4">
              <Link to="/login" className="text-primary hover:underline">{t("auth.login.link")}</Link>
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Signup;
