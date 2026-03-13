import { useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateBook, uploadFile } from "@/hooks/useBooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { origins, genres, categories, bookLanguages, contentTypes } from "@/data/constants";
import { Upload, Check, ChevronRight, ChevronLeft, BookOpen, Image, Headphones, GraduationCap, FileText, Newspaper, Loader2 } from "lucide-react";
import { toast } from "sonner";

const typeConfig: Record<string, { icon: React.ElementType; label_fr: string; label_en: string; fileFormats: string }> = {
  ebook: { icon: BookOpen, label_fr: "📖 Roman / Essai / E-book", label_en: "📖 Novel / Essay / E-book", fileFormats: "PDF, EPUB" },
  bd: { icon: Image, label_fr: "🎨 Bande dessinée", label_en: "🎨 Comic Book", fileFormats: "PDF, CBR, CBZ" },
  audio: { icon: Headphones, label_fr: "🎧 Livre audio", label_en: "🎧 Audiobook", fileFormats: "MP3, M4A, WAV" },
  manuel_scolaire: { icon: GraduationCap, label_fr: "📚 Manuel scolaire", label_en: "📚 Textbook", fileFormats: "PDF" },
  physical: { icon: BookOpen, label_fr: "📦 Livre physique", label_en: "📦 Physical Book", fileFormats: "PDF" },
  revue: { icon: FileText, label_fr: "📄 Revue scientifique", label_en: "📄 Scientific Journal", fileFormats: "PDF" },
  article: { icon: Newspaper, label_fr: "📰 Article", label_en: "📰 Article", fileFormats: "PDF, DOCX" },
};

const steps = ["details", "content", "pricing"] as const;

const CreatorUpload = () => {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const createBook = useCreateBook();
  const [step, setStep] = useState(0);
  const [publishing, setPublishing] = useState(false);

  const [contentType, setContentType] = useState("ebook");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [authorName, setAuthorName] = useState(user?.name || "");
  const [descFr, setDescFr] = useState("");
  const [descEn, setDescEn] = useState("");
  const [genre, setGenre] = useState("");
  const [category, setCategory] = useState("");
  const [origin, setOrigin] = useState("");
  const [language, setLanguage] = useState("fr");
  const [keywords, setKeywords] = useState("");
  const [isbn, setIsbn] = useState("");
  const [pageCount, setPageCount] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [manuscriptFile, setManuscriptFile] = useState<File | null>(null);

  const coverRef = useRef<HTMLInputElement>(null);
  const manuscriptRef = useRef<HTMLInputElement>(null);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setCoverPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleManuscriptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setManuscriptFile(file);
  };

  const handlePublish = async (status: "published" | "draft") => {
    if (!user) { toast.error("Connectez-vous"); return; }
    if (!title.trim()) { toast.error(lang === "fr" ? "Le titre est requis" : "Title is required"); return; }
    if (!genre) { toast.error(lang === "fr" ? "Le genre est requis" : "Genre is required"); return; }
    if (!price || parseFloat(price) <= 0) { toast.error(lang === "fr" ? "Le prix est requis" : "Price is required"); return; }

    setPublishing(true);
    try {
      let coverUrl: string | null = null;
      let fileUrl: string | null = null;

      if (coverFile) {
        const ext = coverFile.name.split(".").pop();
        const path = `${user.id}/${Date.now()}-cover.${ext}`;
        coverUrl = await uploadFile("book-covers", path, coverFile);
      }

      if (manuscriptFile) {
        const ext = manuscriptFile.name.split(".").pop();
        const path = `${user.id}/${Date.now()}-manuscript.${ext}`;
        fileUrl = await uploadFile("manuscripts", path, manuscriptFile);
      }

      await createBook.mutateAsync({
        title,
        subtitle: subtitle || null,
        author_id: user.id,
        author_name: authorName || user.name,
        description_fr: descFr || null,
        description_en: descEn || null,
        genre: genre || "Roman",
        category: category || "literature",
        origin: origin || "RDC",
        content_type: contentType,
        language: language || "fr",
        isbn: isbn || null,
        page_count: pageCount ? parseInt(pageCount) : null,
        duration_minutes: duration ? parseInt(duration) : null,
        price: parseFloat(price) || 0,
        cover_url: coverUrl,
        file_url: fileUrl,
        keywords: keywords ? keywords.split(",").map(k => k.trim()) : null,
        status,
      });

      toast.success(t("kdp.success"));
      // Reset form
      setTitle(""); setSubtitle(""); setDescFr(""); setDescEn("");
      setGenre(""); setCategory(""); setOrigin(""); setKeywords("");
      setIsbn(""); setPageCount(""); setDuration(""); setPrice("");
      setCoverFile(null); setCoverPreview(null); setManuscriptFile(null);
      setStep(0);
    } catch (e: any) {
      toast.error(e.message || t("kdp.error"));
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Progress */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <button
              onClick={() => setStep(i)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                step === i ? "bg-primary text-primary-foreground" : step > i ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
              }`}
            >
              {step > i ? <Check className="h-4 w-4" /> : <span>{i + 1}</span>}
              {t(`kdp.step${i + 1}`)}
            </button>
            {i < steps.length - 1 && <div className="flex-1 h-px bg-border" />}
          </div>
        ))}
      </div>

      {/* Step 1: Details */}
      {step === 0 && (
        <Card>
          <CardHeader><CardTitle>{t("kdp.step1")}</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            {/* Content Type */}
            <div className="space-y-2">
              <Label>{t("kdp.contenttype")}</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(typeConfig).map(([key, cfg]) => {
                  const Icon = cfg.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => setContentType(key)}
                      className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all text-sm ${
                        contentType === key ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs font-medium text-center">{lang === "fr" ? cfg.label_fr : cfg.label_en}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("kdp.title")} *</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={lang === "fr" ? "Titre de votre œuvre" : "Title of your work"} />
              </div>
              <div className="space-y-2">
                <Label>{t("kdp.subtitle")}</Label>
                <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t("kdp.authorname")} *</Label>
              <Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>{t("kdp.descfr")}</Label>
              <Textarea value={descFr} onChange={(e) => setDescFr(e.target.value)} className="min-h-[100px]" />
            </div>
            <div className="space-y-2">
              <Label>{t("kdp.descen")}</Label>
              <Textarea value={descEn} onChange={(e) => setDescEn(e.target.value)} className="min-h-[100px]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>{t("kdp.genre")} *</Label>
                <Select value={genre} onValueChange={setGenre}>
                  <SelectTrigger><SelectValue placeholder="Genre" /></SelectTrigger>
                  <SelectContent>{genres.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("kdp.category")}</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue placeholder="Catégorie" /></SelectTrigger>
                  <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{t(`section.${c}`)}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("kdp.origin")}</Label>
                <Select value={origin} onValueChange={setOrigin}>
                  <SelectTrigger><SelectValue placeholder="Pays" /></SelectTrigger>
                  <SelectContent>{origins.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("kdp.language")}</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{bookLanguages.map((l) => <SelectItem key={l.code} value={l.code}>{lang === "fr" ? l.label_fr : l.label_en}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("kdp.keywords")}</Label>
                <Input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="roman, afrique, aventure" />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setStep(1)} className="rounded-full gap-2">
                {t("kdp.next")}<ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Content */}
      {step === 1 && (
        <Card>
          <CardHeader><CardTitle>{t("kdp.step2")}</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cover */}
              <div className="space-y-2">
                <Label>{t("kdp.cover")}</Label>
                <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
                <div
                  onClick={() => coverRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary transition-colors min-h-[200px] flex flex-col items-center justify-center"
                >
                  {coverPreview ? (
                    <img src={coverPreview} alt="Cover preview" className="max-h-48 rounded-lg object-contain" />
                  ) : (
                    <>
                      <Upload className="h-10 w-10 mb-2 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">{t("kdp.coverhelp")}</p>
                    </>
                  )}
                </div>
                {coverFile && <p className="text-xs text-muted-foreground">{coverFile.name}</p>}
              </div>

              {/* Manuscript */}
              <div className="space-y-2">
                <Label>{t("kdp.manuscript")}</Label>
                <input ref={manuscriptRef} type="file" accept=".pdf,.epub,.mp3,.m4a,.wav,.docx,.cbr,.cbz" className="hidden" onChange={handleManuscriptChange} />
                <div
                  onClick={() => manuscriptRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary transition-colors min-h-[200px] flex flex-col items-center justify-center"
                >
                  <Upload className="h-10 w-10 mb-2 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">{typeConfig[contentType]?.fileFormats || "PDF"}</p>
                </div>
                {manuscriptFile && <p className="text-xs text-muted-foreground">{manuscriptFile.name} ({(manuscriptFile.size / 1024 / 1024).toFixed(1)} MB)</p>}
              </div>
            </div>

            {(contentType === "ebook" || contentType === "physical" || contentType === "manuel_scolaire" || contentType === "bd") && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("kdp.isbn")}</Label>
                  <Input value={isbn} onChange={(e) => setIsbn(e.target.value)} placeholder="978-X-XXXXX-XXX-X" />
                </div>
                <div className="space-y-2">
                  <Label>{t("kdp.pages")}</Label>
                  <Input type="number" value={pageCount} onChange={(e) => setPageCount(e.target.value)} placeholder="256" />
                </div>
              </div>
            )}

            {contentType === "audio" && (
              <div className="space-y-2">
                <Label>{t("kdp.duration")}</Label>
                <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="180" />
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(0)} className="rounded-full gap-2">
                <ChevronLeft className="h-4 w-4" />{t("kdp.prev")}
              </Button>
              <Button onClick={() => setStep(2)} className="rounded-full gap-2">
                {t("kdp.next")}<ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Pricing */}
      {step === 2 && (
        <Card>
          <CardHeader><CardTitle>{t("kdp.step3")}</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div className="max-w-sm space-y-2">
              <Label>{t("kdp.price")} *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
                <Input type="number" step="0.01" min="0.99" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="12.99" className="pl-8" />
              </div>
              <p className="text-xs text-muted-foreground">{lang === "fr" ? "Prix minimum : $0.99" : "Minimum price: $0.99"}</p>
            </div>

            {/* Summary */}
            <div className="bg-muted/50 rounded-xl p-4 space-y-2">
              <h4 className="font-semibold">{lang === "fr" ? "Résumé" : "Summary"}</h4>
              <div className="text-sm space-y-1 text-muted-foreground">
                <p><strong>{t("kdp.title")}:</strong> {title || "—"}</p>
                <p><strong>{t("kdp.authorname")}:</strong> {authorName || "—"}</p>
                <p><strong>{t("kdp.genre")}:</strong> {genre || "—"}</p>
                <p><strong>{t("kdp.contenttype")}:</strong> {t(`filter.${contentType}`)}</p>
                <p><strong>{t("kdp.price")}:</strong> ${price || "0.00"}</p>
                <p><strong>{t("kdp.cover")}:</strong> {coverFile ? "✅ " + coverFile.name : "❌"}</p>
                <p><strong>{t("kdp.manuscript")}:</strong> {manuscriptFile ? "✅ " + manuscriptFile.name : "❌"}</p>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)} className="rounded-full gap-2">
                <ChevronLeft className="h-4 w-4" />{t("kdp.prev")}
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => handlePublish("draft")} disabled={publishing} className="rounded-full">
                  {t("kdp.savedraft")}
                </Button>
                <Button onClick={() => handlePublish("published")} disabled={publishing} className="rounded-full gap-2">
                  {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {publishing ? t("kdp.uploading") : t("kdp.publish")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CreatorUpload;
