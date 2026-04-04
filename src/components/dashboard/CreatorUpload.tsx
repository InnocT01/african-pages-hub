import { useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateBook, uploadFile } from "@/hooks/useBooks";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { origins, genres, categories, bookLanguages } from "@/data/constants";
import {
  Upload, Check, ChevronRight, ChevronLeft, BookOpen, Image, Headphones,
  GraduationCap, FileText, Newspaper, Loader2, Package, Shield, AlertTriangle,
  Palette, CheckCircle, XCircle, AlertCircle, BarChart3, Eye
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import CoverCreator from "./CoverCreator";

const typeConfig: Record<string, { icon: React.ElementType; label_fr: string; label_en: string; fileFormats: string }> = {
  ebook: { icon: BookOpen, label_fr: "📖 Roman / Essai / E-book", label_en: "📖 Novel / Essay / E-book", fileFormats: "PDF, EPUB" },
  bd: { icon: Image, label_fr: "🎨 Bande dessinée", label_en: "🎨 Comic Book", fileFormats: "PDF, CBR, CBZ" },
  audio: { icon: Headphones, label_fr: "🎧 Livre audio", label_en: "🎧 Audiobook", fileFormats: "MP3, M4A, WAV" },
  manuel_scolaire: { icon: GraduationCap, label_fr: "📚 Manuel scolaire", label_en: "📚 Textbook", fileFormats: "PDF" },
  revue: { icon: FileText, label_fr: "📄 Revue scientifique", label_en: "📄 Scientific Journal", fileFormats: "PDF" },
  article: { icon: Newspaper, label_fr: "📰 Article", label_en: "📰 Article", fileFormats: "PDF, DOCX" },
};

const steps = ["details", "content", "pricing", "review"] as const;

const CreatorUpload = () => {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const createBook = useCreateBook();
  const [step, setStep] = useState(0);
  const [publishing, setPublishing] = useState(false);
  const [checkingPlagiarism, setCheckingPlagiarism] = useState(false);
  const [plagiarismResult, setPlagiarismResult] = useState<any>(null);

  const [contentType, setContentType] = useState("ebook");
  const [format, setFormat] = useState("ebook");
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
  const [stockCount, setStockCount] = useState("");
  const [onSale, setOnSale] = useState(false);
  const [salePrice, setSalePrice] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [manuscriptFile, setManuscriptFile] = useState<File | null>(null);
  const [showCoverCreator, setShowCoverCreator] = useState(false);

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

  const handleCheckPlagiarism = async () => {
    const textToCheck = (descFr + " " + descEn).trim();
    if (!textToCheck || textToCheck.length < 50) {
      toast.error(lang === "fr" ? "Ajoutez au moins 50 caractères de description." : "Add at least 50 characters of description.");
      return;
    }
    setCheckingPlagiarism(true);
    setPlagiarismResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("check-plagiarism", {
        body: { text: textToCheck, title },
      });
      if (error) throw error;
      setPlagiarismResult(data);
    } catch (e: any) {
      toast.error(e.message || "Plagiarism check failed");
    } finally {
      setCheckingPlagiarism(false);
    }
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
        format,
        language: language || "fr",
        isbn: isbn || null,
        page_count: pageCount ? parseInt(pageCount) : null,
        duration_minutes: duration ? parseInt(duration) : null,
        price: parseFloat(price) || 0,
        cover_url: coverUrl,
        file_url: fileUrl,
        keywords: keywords ? keywords.split(",").map(k => k.trim()) : null,
        stock_count: (format === "paperback" || format === "both") && stockCount ? parseInt(stockCount) : null,
        on_sale: onSale,
        sale_price: onSale && salePrice ? parseFloat(salePrice) : null,
        featured: isFeatured,
        status,
      });

      toast.success(t("kdp.success"));
      // Reset
      setTitle(""); setSubtitle(""); setDescFr(""); setDescEn("");
      setGenre(""); setCategory(""); setOrigin(""); setKeywords("");
      setIsbn(""); setPageCount(""); setDuration(""); setPrice("");
      setCoverFile(null); setCoverPreview(null); setManuscriptFile(null);
      setStockCount(""); setOnSale(false); setSalePrice("");
      setPlagiarismResult(null); setIsFeatured(false);
      setStep(0);
    } catch (e: any) {
      toast.error(e.message || t("kdp.error"));
    } finally {
      setPublishing(false);
    }
  };

  const showPhysicalFields = format === "paperback" || format === "both";
  const completionScore = [title, genre, price, coverFile, manuscriptFile, descFr || descEn].filter(Boolean).length;
  const completionPct = Math.round((completionScore / 6) * 100);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* KDP Header Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 rounded-2xl p-6 border border-primary/10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold">{lang === "fr" ? "Créez. Gérez. Publiez." : "Create. Manage. Publish."}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {lang === "fr"
                ? "Adressez-vous aux lecteurs en leur proposant le format qu'ils apprécient le plus."
                : "Reach readers by offering the format they appreciate most."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{lang === "fr" ? "Complétude" : "Completion"}</p>
              <p className="text-lg font-bold text-primary">{completionPct}%</p>
            </div>
            <Progress value={completionPct} className="w-24 h-2" />
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-1">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-1 flex-1">
            <button onClick={() => setStep(i)} className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all ${step === i ? "bg-primary text-primary-foreground shadow-md" : step > i ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
              {step > i ? <Check className="h-4 w-4" /> : <span className="h-5 w-5 rounded-full border-2 border-current flex items-center justify-center text-xs">{i + 1}</span>}
              <span className="hidden sm:inline">{i === 3 ? (lang === "fr" ? "Révision" : "Review") : t(`kdp.step${i + 1}`)}</span>
            </button>
            {i < steps.length - 1 && <div className="flex-1 h-px bg-border" />}
          </div>
        ))}
      </div>

      {/* Step 1: Details */}
      {step === 0 && (
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">{t("kdp.step1")}</CardTitle>
            <CardDescription>{lang === "fr" ? "Renseignez les informations essentielles de votre œuvre" : "Fill in the essential information about your work"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Content Type */}
            <div className="space-y-3">
              <Label className="font-semibold">{t("kdp.contenttype")}</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(typeConfig).map(([key, cfg]) => {
                  const Icon = cfg.icon;
                  return (
                    <button key={key} onClick={() => setContentType(key)} className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all text-sm ${contentType === key ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/30"}`}>
                      <Icon className="h-5 w-5" />
                      <span className="text-xs font-medium text-center">{lang === "fr" ? cfg.label_fr : cfg.label_en}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Format */}
            <div className="space-y-3">
              <Label className="font-semibold flex items-center gap-2"><Package className="h-4 w-4" />{lang === "fr" ? "Format de publication" : "Publishing Format"}</Label>
              <RadioGroup value={format} onValueChange={setFormat} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { val: "ebook", icon: "📱", fr: "E-book", en: "E-book", sub_fr: "Version numérique uniquement", sub_en: "Digital only" },
                  { val: "paperback", icon: "📦", fr: "Broché", en: "Paperback", sub_fr: "Livre physique uniquement", sub_en: "Physical book only" },
                  { val: "both", icon: "📱+📦", fr: "Les deux", en: "Both", sub_fr: "E-book et broché", sub_en: "E-book and paperback" },
                ].map(f => (
                  <Label key={f.val} htmlFor={`fmt-${f.val}`} className={`flex items-center gap-3 rounded-xl border-2 p-4 cursor-pointer transition-all ${format === f.val ? "border-primary bg-primary/5" : "border-border"}`}>
                    <RadioGroupItem value={f.val} id={`fmt-${f.val}`} />
                    <div>
                      <p className="font-medium text-sm">{f.icon} {lang === "fr" ? f.fr : f.en}</p>
                      <p className="text-xs text-muted-foreground">{lang === "fr" ? f.sub_fr : f.sub_en}</p>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </div>

            {/* Stock for physical */}
            {showPhysicalFields && (
              <div className="p-4 rounded-xl bg-muted/50 border border-border space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2"><Package className="h-4 w-4" />{lang === "fr" ? "Gestion du stock (broché)" : "Stock Management (paperback)"}</h4>
                <div className="space-y-2">
                  <Label>{lang === "fr" ? "Quantité en stock" : "Stock Quantity"}</Label>
                  <Input type="number" min="0" value={stockCount} onChange={(e) => setStockCount(e.target.value)} placeholder="100" className="max-w-xs" />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="font-semibold">{t("kdp.title")} *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={lang === "fr" ? "Titre de votre œuvre" : "Title of your work"} /></div>
              <div className="space-y-2"><Label>{t("kdp.subtitle")}</Label><Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} /></div>
            </div>

            <div className="space-y-2"><Label className="font-semibold">{t("kdp.authorname")} *</Label><Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} /></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>{t("kdp.descfr")}</Label><Textarea value={descFr} onChange={(e) => setDescFr(e.target.value)} className="min-h-[120px]" placeholder={lang === "fr" ? "Décrivez votre œuvre en français..." : "Describe your work in French..."} /></div>
              <div className="space-y-2"><Label>{t("kdp.descen")}</Label><Textarea value={descEn} onChange={(e) => setDescEn(e.target.value)} className="min-h-[120px]" placeholder={lang === "fr" ? "Décrivez votre œuvre en anglais..." : "Describe your work in English..."} /></div>
            </div>

            {/* AI Plagiarism Check */}
            <Card className="border-accent/20 bg-accent/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-3">
                    <div>
                      <h4 className="font-bold text-sm">{lang === "fr" ? "🔍 Anti-plagiat IA avancé" : "🔍 Advanced AI Plagiarism Check"}</h4>
                      <p className="text-xs text-muted-foreground">{lang === "fr" ? "Analyse stylistique, détection de patterns, vérification d'originalité par intelligence artificielle" : "Stylistic analysis, pattern detection, originality verification by AI"}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={handleCheckPlagiarism} disabled={checkingPlagiarism} className="rounded-full">
                      {checkingPlagiarism ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Shield className="h-4 w-4 mr-1" />}
                      {lang === "fr" ? "Analyser l'originalité" : "Analyze Originality"}
                    </Button>
                  </div>
                </div>

                {/* Plagiarism Results */}
                {plagiarismResult && (
                  <div className="mt-4 space-y-3">
                    {/* Score & Verdict */}
                    {typeof plagiarismResult.score === "number" && plagiarismResult.score >= 0 && (
                      <div className="flex items-center gap-4 p-3 rounded-lg bg-background">
                        <div className={`text-3xl font-black ${plagiarismResult.score >= 70 ? "text-accent" : plagiarismResult.score >= 40 ? "text-amber-500" : "text-destructive"}`}>
                          {plagiarismResult.score}/100
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-sm">{plagiarismResult.verdict}</p>
                          {plagiarismResult.summary && <p className="text-xs text-muted-foreground mt-0.5">{plagiarismResult.summary}</p>}
                        </div>
                        {plagiarismResult.score >= 70 ? <CheckCircle className="h-6 w-6 text-accent" /> : plagiarismResult.score >= 40 ? <AlertCircle className="h-6 w-6 text-amber-500" /> : <XCircle className="h-6 w-6 text-destructive" />}
                      </div>
                    )}

                    {/* Detailed checks */}
                    {plagiarismResult.details?.length > 0 && (
                      <div className="space-y-1.5">
                        {plagiarismResult.details.map((d: any, i: number) => (
                          <div key={i} className="flex items-center gap-2 text-xs p-2 rounded bg-background">
                            {d.status === "pass" ? <CheckCircle className="h-3.5 w-3.5 text-accent shrink-0" /> : d.status === "warning" ? <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" /> : <XCircle className="h-3.5 w-3.5 text-destructive shrink-0" />}
                            <span className="font-medium">{d.check}:</span>
                            <span className="text-muted-foreground">{d.note}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Suggestions */}
                    {plagiarismResult.suggestions?.length > 0 && (
                      <div className="p-2 rounded bg-background text-xs space-y-1">
                        <p className="font-semibold">{lang === "fr" ? "💡 Suggestions :" : "💡 Suggestions:"}</p>
                        {plagiarismResult.suggestions.map((s: string, i: number) => <p key={i} className="text-muted-foreground">• {s}</p>)}
                      </div>
                    )}

                    {/* Fallback text result */}
                    {plagiarismResult.result && !plagiarismResult.verdict && (
                      <div className="p-3 rounded-lg text-sm bg-background">{plagiarismResult.result}</div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="font-semibold">{t("kdp.genre")} *</Label>
                <Select value={genre} onValueChange={setGenre}><SelectTrigger><SelectValue placeholder="Genre" /></SelectTrigger><SelectContent>{genres.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent></Select>
              </div>
              <div className="space-y-2">
                <Label>{t("kdp.category")}</Label>
                <Select value={category} onValueChange={setCategory}><SelectTrigger><SelectValue placeholder="Catégorie" /></SelectTrigger><SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{t(`section.${c}`)}</SelectItem>)}</SelectContent></Select>
              </div>
              <div className="space-y-2">
                <Label>{t("kdp.origin")}</Label>
                <Select value={origin} onValueChange={setOrigin}><SelectTrigger><SelectValue placeholder="Pays" /></SelectTrigger><SelectContent>{origins.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("kdp.language")}</Label>
                <Select value={language} onValueChange={setLanguage}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{bookLanguages.map(l => <SelectItem key={l.code} value={l.code}>{lang === "fr" ? l.label_fr : l.label_en}</SelectItem>)}</SelectContent></Select>
              </div>
              <div className="space-y-2">
                <Label>{t("kdp.keywords")}</Label>
                <Input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="roman, afrique, aventure" />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setStep(1)} className="rounded-full gap-2">{t("kdp.next")}<ChevronRight className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Content (Cover + Manuscript) */}
      {step === 1 && (
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">{t("kdp.step2")}</CardTitle>
            <CardDescription>{lang === "fr" ? "Ajoutez votre couverture et votre manuscrit" : "Add your cover and manuscript"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Cover */}
              <div className="space-y-4">
                <Label className="font-semibold text-base">{t("kdp.cover")}</Label>
                <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
                <div onClick={() => coverRef.current?.click()} className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary transition-colors min-h-[250px] flex flex-col items-center justify-center bg-muted/20">
                  {coverPreview ? (
                    <img src={coverPreview} alt="Cover preview" className="max-h-56 rounded-lg object-contain shadow-lg" />
                  ) : (
                    <>
                      <Upload className="h-12 w-12 mb-3 text-muted-foreground/30" />
                      <p className="text-sm font-medium">{lang === "fr" ? "Cliquez pour uploader" : "Click to upload"}</p>
                      <p className="text-xs text-muted-foreground mt-1">{t("kdp.coverhelp")}</p>
                    </>
                  )}
                </div>
                {coverFile && <p className="text-xs text-accent">✅ {coverFile.name}</p>}

                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                  <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-muted-foreground">{lang === "fr" ? "ou créez votre couverture" : "or create your cover"}</span></div>
                </div>

                <Button type="button" variant="outline" className="w-full rounded-xl gap-2" onClick={() => setShowCoverCreator(true)}>
                  <Palette className="h-4 w-4" />
                  {lang === "fr" ? "Ouvrir le Cover Creator (12 modèles)" : "Open Cover Creator (12 templates)"}
                </Button>

                <CoverCreator
                  open={showCoverCreator}
                  onClose={() => setShowCoverCreator(false)}
                  onSelect={(dataUrl) => {
                    setCoverPreview(dataUrl);
                    fetch(dataUrl).then(r => r.blob()).then(blob => {
                      const file = new File([blob], "cover-generated.png", { type: "image/png" });
                      setCoverFile(file);
                    });
                  }}
                  bookTitle={title}
                  authorName={authorName}
                />
              </div>

              {/* Manuscript */}
              <div className="space-y-4">
                <Label className="font-semibold text-base">{t("kdp.manuscript")}</Label>
                <input ref={manuscriptRef} type="file" accept=".pdf,.epub,.mp3,.m4a,.wav,.docx,.cbr,.cbz" className="hidden" onChange={handleManuscriptChange} />
                <div onClick={() => manuscriptRef.current?.click()} className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary transition-colors min-h-[250px] flex flex-col items-center justify-center bg-muted/20">
                  <Upload className="h-12 w-12 mb-3 text-muted-foreground/30" />
                  <p className="text-sm font-medium">{lang === "fr" ? "Cliquez pour uploader" : "Click to upload"}</p>
                  <p className="text-xs text-muted-foreground mt-1">{typeConfig[contentType]?.fileFormats || "PDF"}</p>
                </div>
                {manuscriptFile && <p className="text-xs text-accent">✅ {manuscriptFile.name} ({(manuscriptFile.size / 1024 / 1024).toFixed(1)} MB)</p>}

                {/* Additional fields */}
                <div className="space-y-4 pt-4">
                  {contentType !== "audio" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label className="text-xs">{t("kdp.isbn")}</Label><Input value={isbn} onChange={(e) => setIsbn(e.target.value)} placeholder="978-X-XXXXX-XXX-X" /></div>
                      <div className="space-y-2"><Label className="text-xs">{t("kdp.pages")}</Label><Input type="number" value={pageCount} onChange={(e) => setPageCount(e.target.value)} placeholder="256" /></div>
                    </div>
                  )}
                  {contentType === "audio" && (
                    <div className="space-y-2"><Label className="text-xs">{t("kdp.duration")}</Label><Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="180" /></div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(0)} className="rounded-full gap-2"><ChevronLeft className="h-4 w-4" />{t("kdp.prev")}</Button>
              <Button onClick={() => setStep(2)} className="rounded-full gap-2">{t("kdp.next")}<ChevronRight className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Pricing */}
      {step === 2 && (
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">{t("kdp.step3")}</CardTitle>
            <CardDescription>{lang === "fr" ? "Définissez le prix et les options de vente" : "Set the price and sale options"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="max-w-md space-y-2">
              <Label className="font-semibold">{t("kdp.price")} *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
                <Input type="number" step="0.01" min="0.99" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="12.99" className="pl-8 text-lg h-12" />
              </div>
              <p className="text-xs text-muted-foreground">{lang === "fr" ? "Prix minimum : $0.99 · Commission KitabuShop : 15%" : "Minimum price: $0.99 · KitabuShop commission: 15%"}</p>
              {price && parseFloat(price) > 0 && (
                <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
                  <p className="text-sm"><span className="text-muted-foreground">{lang === "fr" ? "Vous recevrez :" : "You'll receive:"}</span> <strong className="text-primary text-lg">${(parseFloat(price) * 0.85).toFixed(2)}</strong> <span className="text-xs text-muted-foreground">{lang === "fr" ? "par vente" : "per sale"}</span></p>
                </div>
              )}
            </div>

            {/* Sale toggle */}
            <div className="flex items-center gap-4 p-4 rounded-xl border border-border">
              <Switch checked={onSale} onCheckedChange={setOnSale} />
              <div className="flex-1">
                <p className="font-medium text-sm">{lang === "fr" ? "Mettre en promotion" : "Put on Sale"}</p>
                <p className="text-xs text-muted-foreground">{lang === "fr" ? "Afficher un prix réduit temporaire" : "Display a temporary reduced price"}</p>
              </div>
              {onSale && (
                <div className="relative w-32">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">$</span>
                  <Input type="number" step="0.01" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} placeholder="9.99" className="pl-7 h-9 text-sm" />
                </div>
              )}
            </div>

            {/* Featured toggle */}
            <div className="flex items-center gap-4 p-4 rounded-xl border border-border">
              <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
              <div className="flex-1">
                <p className="font-medium text-sm">{lang === "fr" ? "Mettre en vedette" : "Feature this book"}</p>
                <p className="text-xs text-muted-foreground">{lang === "fr" ? "Apparaître dans le carrousel de la page d'accueil" : "Appear in the homepage carousel"}</p>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)} className="rounded-full gap-2"><ChevronLeft className="h-4 w-4" />{t("kdp.prev")}</Button>
              <Button onClick={() => setStep(3)} className="rounded-full gap-2">{lang === "fr" ? "Réviser" : "Review"}<ChevronRight className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Review & Publish */}
      {step === 3 && (
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Eye className="h-5 w-5" />{lang === "fr" ? "Révision finale" : "Final Review"}</CardTitle>
            <CardDescription>{lang === "fr" ? "Vérifiez toutes les informations avant de publier" : "Check all information before publishing"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Cover preview */}
              <div className="flex justify-center">
                {coverPreview ? (
                  <img src={coverPreview} alt="Cover" className="h-64 rounded-lg object-contain shadow-xl" />
                ) : (
                  <div className="h-64 w-44 rounded-lg bg-muted flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground/20" />
                  </div>
                )}
              </div>
              {/* Details */}
              <div className="md:col-span-2 space-y-3">
                <div className="bg-muted/50 rounded-xl p-5 space-y-2.5">
                  <h3 className="text-xl font-bold">{title || "—"}</h3>
                  {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p><span className="text-muted-foreground">{t("kdp.authorname")}:</span> <strong>{authorName || "—"}</strong></p>
                    <p><span className="text-muted-foreground">{t("kdp.genre")}:</span> <strong>{genre || "—"}</strong></p>
                    <p><span className="text-muted-foreground">Format:</span> <strong>{format === "both" ? "E-book + Broché" : format === "paperback" ? "Broché" : "E-book"}</strong></p>
                    <p><span className="text-muted-foreground">{t("kdp.language")}:</span> <strong>{bookLanguages.find(l => l.code === language)?.label_fr || language}</strong></p>
                    <p><span className="text-muted-foreground">{t("kdp.origin")}:</span> <strong>{origin || "—"}</strong></p>
                    <p><span className="text-muted-foreground">{t("kdp.contenttype")}:</span> <strong>{contentType}</strong></p>
                  </div>
                  <hr className="border-border/50" />
                  <div className="flex items-center gap-4">
                    <p className="text-2xl font-black text-primary">${price || "0.00"}</p>
                    {onSale && salePrice && <p className="text-lg text-muted-foreground line-through">${price}</p>}
                    {onSale && salePrice && <p className="text-xl font-bold text-accent">${salePrice}</p>}
                  </div>
                  {showPhysicalFields && stockCount && <p className="text-sm">📦 Stock: {stockCount} {lang === "fr" ? "unités" : "units"}</p>}
                  <div className="flex gap-2">
                    <p className="text-xs">{t("kdp.cover")}: {coverFile ? "✅" : "❌"}</p>
                    <p className="text-xs">{t("kdp.manuscript")}: {manuscriptFile ? "✅" : "❌"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)} className="rounded-full gap-2"><ChevronLeft className="h-4 w-4" />{t("kdp.prev")}</Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => handlePublish("draft")} disabled={publishing} className="rounded-full">{t("kdp.savedraft")}</Button>
                <Button onClick={() => handlePublish("published")} disabled={publishing} className="rounded-full gap-2 px-8">
                  {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
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
