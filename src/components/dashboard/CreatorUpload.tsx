import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { origins, genres, categories, bookLanguages } from "@/data/mockBooks";
import { Upload, BookOpen, Image, Headphones, GraduationCap, Save, Send } from "lucide-react";

type BookType = "roman" | "bd" | "audio" | "manual";

const bookTypeConfig: Record<BookType, { icon: React.ElementType; color: string }> = {
  roman: { icon: BookOpen, color: "border-primary bg-primary/5" },
  bd: { icon: Image, color: "border-kente bg-kente/5" },
  audio: { icon: Headphones, color: "border-accent bg-accent/5" },
  manual: { icon: GraduationCap, color: "border-savanna bg-savanna/5" },
};

const CreatorUpload = () => {
  const { t, lang } = useLanguage();
  const [bookType, setBookType] = useState<BookType>("roman");

  const typeKeys: BookType[] = ["roman", "bd", "audio", "manual"];

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Step 1: Choose type */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("creator.booktype")}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={bookType}
            onValueChange={(v) => setBookType(v as BookType)}
            className="grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            {typeKeys.map((type) => {
              const cfg = bookTypeConfig[type];
              const Icon = cfg.icon;
              return (
                <Label
                  key={type}
                  htmlFor={`type-${type}`}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 cursor-pointer transition-all ${
                    bookType === type ? cfg.color : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <RadioGroupItem value={type} id={`type-${type}`} className="sr-only" />
                  <Icon className="h-6 w-6" />
                  <span className="text-xs font-medium text-center">{t(`creator.booktype.${type}`)}</span>
                </Label>
              );
            })}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Step 2: Form */}
      <Card>
        <CardContent className="p-6 space-y-5">
          {/* Common fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("creator.form.title")}</Label>
              <Input placeholder={t("creator.form.title")} className="rounded-lg" />
            </div>
            <div className="space-y-2">
              <Label>{t("common.price")} (USD)</Label>
              <Input type="number" placeholder="12.99" step="0.01" className="rounded-lg" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description (FR)</Label>
            <Textarea placeholder="Description en français..." className="min-h-[80px] rounded-lg" />
          </div>
          <div className="space-y-2">
            <Label>Description (EN)</Label>
            <Textarea placeholder="Description in English..." className="min-h-[80px] rounded-lg" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>{t("filter.genre")}</Label>
              <Select>
                <SelectTrigger className="rounded-lg"><SelectValue placeholder="Genre" /></SelectTrigger>
                <SelectContent>{genres.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("filter.origin")}</Label>
              <Select>
                <SelectTrigger className="rounded-lg"><SelectValue placeholder="Origine" /></SelectTrigger>
                <SelectContent>{origins.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("common.language")}</Label>
              <Select>
                <SelectTrigger className="rounded-lg"><SelectValue placeholder="Langue" /></SelectTrigger>
                <SelectContent>
                  {bookLanguages.map((l) => (
                    <SelectItem key={l.code} value={l.code}>
                      {lang === "fr" ? l.label_fr : l.label_en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Catégorie</Label>
            <Select>
              <SelectTrigger className="rounded-lg"><SelectValue placeholder="Catégorie" /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>{t(`section.${c}`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type-specific fields */}
          {(bookType === "roman" || bookType === "manual") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("creator.form.isbn")}</Label>
                <Input placeholder="978-X-XXXXX-XXX-X" className="rounded-lg" />
              </div>
              <div className="space-y-2">
                <Label>{t("creator.form.pages")}</Label>
                <Input type="number" placeholder="256" className="rounded-lg" />
              </div>
            </div>
          )}

          {bookType === "audio" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("creator.form.duration")}</Label>
                <Input type="number" placeholder="180" className="rounded-lg" />
              </div>
              <div className="space-y-2">
                <Label>{t("creator.form.narrator")}</Label>
                <Input placeholder="Nom du narrateur" className="rounded-lg" />
              </div>
            </div>
          )}

          {bookType === "bd" && (
            <div className="space-y-2">
              <Label>{t("creator.form.pages")}</Label>
              <Input type="number" placeholder="48" className="rounded-lg" />
            </div>
          )}

          {/* File uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("creator.form.cover")}</Label>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center text-muted-foreground cursor-pointer hover:border-primary transition-colors">
                <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">JPG, PNG (min 800×1200px)</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>
                {bookType === "audio" ? t("creator.form.audiofile") :
                 bookType === "bd" ? t("creator.form.bdpages") :
                 t("creator.form.manuscript")}
              </Label>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center text-muted-foreground cursor-pointer hover:border-primary transition-colors">
                <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  {bookType === "audio" ? "MP3, M4A, WAV" :
                   bookType === "bd" ? "PDF, CBR, CBZ" :
                   "PDF, EPUB"}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="rounded-full gap-2">
              <Save className="h-4 w-4" />
              {t("creator.form.savedraft")}
            </Button>
            <Button className="rounded-full gap-2">
              <Send className="h-4 w-4" />
              {t("creator.form.publish")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatorUpload;
