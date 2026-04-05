import { useState, useRef, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette, Check, Upload, Type, RotateCcw, ZoomIn, ZoomOut, Move, Bold, Italic } from "lucide-react";

const coverTemplates = [
  { id: "classic", name: "Classique", bg: "bg-gradient-to-b from-amber-800 to-amber-950", text: "text-amber-50", colors: ["#92400e", "#451a03"] },
  { id: "modern", name: "Moderne", bg: "bg-gradient-to-br from-slate-900 to-slate-700", text: "text-white", colors: ["#0f172a", "#334155"] },
  { id: "nature", name: "Nature", bg: "bg-gradient-to-b from-emerald-700 to-emerald-900", text: "text-emerald-50", colors: ["#047857", "#064e3b"] },
  { id: "bold", name: "Audacieux", bg: "bg-gradient-to-br from-red-700 to-orange-600", text: "text-white", colors: ["#b91c1c", "#ea580c"] },
  { id: "elegant", name: "Élégant", bg: "bg-gradient-to-b from-indigo-900 to-purple-900", text: "text-purple-100", colors: ["#312e81", "#581c87"] },
  { id: "warm", name: "Chaleureux", bg: "bg-gradient-to-b from-orange-400 to-red-600", text: "text-white", colors: ["#fb923c", "#dc2626"] },
  { id: "minimal", name: "Minimaliste", bg: "bg-white border-2 border-gray-200", text: "text-gray-900", colors: ["#ffffff", "#f5f5f5"] },
  { id: "african", name: "Africain", bg: "bg-gradient-to-b from-yellow-600 via-orange-700 to-red-900", text: "text-yellow-50", colors: ["#ca8a04", "#7c2d12"] },
  { id: "ocean", name: "Océan", bg: "bg-gradient-to-br from-cyan-600 to-blue-900", text: "text-cyan-50", colors: ["#0891b2", "#1e3a5f"] },
  { id: "sunset", name: "Coucher de soleil", bg: "bg-gradient-to-b from-pink-500 via-orange-400 to-yellow-300", text: "text-white", colors: ["#ec4899", "#fde047"] },
  { id: "earth", name: "Terre", bg: "bg-gradient-to-b from-stone-600 to-stone-800", text: "text-stone-100", colors: ["#57534e", "#292524"] },
  { id: "royal", name: "Royal", bg: "bg-gradient-to-b from-yellow-400 via-amber-500 to-yellow-700", text: "text-amber-950", colors: ["#facc15", "#b45309"] },
  { id: "midnight", name: "Minuit", bg: "bg-gradient-to-b from-gray-900 to-black", text: "text-gray-100", colors: ["#111827", "#000000"] },
  { id: "kente", name: "Kente", bg: "bg-gradient-to-br from-yellow-500 via-green-600 to-red-600", text: "text-white", colors: ["#eab308", "#dc2626"] },
  { id: "sahara", name: "Sahara", bg: "bg-gradient-to-b from-amber-300 to-orange-800", text: "text-amber-950", colors: ["#fcd34d", "#9a3412"] },
  { id: "congo", name: "Congo", bg: "bg-gradient-to-b from-blue-800 via-yellow-400 to-red-600", text: "text-white", colors: ["#1e40af", "#dc2626"] },
];

const fontOptions = [
  { id: "serif", name: "Serif", css: "Georgia, serif" },
  { id: "sans", name: "Sans-serif", css: "Inter, sans-serif" },
  { id: "display", name: "Display", css: "'Playfair Display', serif" },
  { id: "mono", name: "Monospace", css: "'Courier New', monospace" },
];

const layoutOptions = [
  { id: "centered", name_fr: "Centré", name_en: "Centered" },
  { id: "top", name_fr: "Titre en haut", name_en: "Title Top" },
  { id: "bottom", name_fr: "Titre en bas", name_en: "Title Bottom" },
  { id: "split", name_fr: "Divisé", name_en: "Split" },
];

interface CoverCreatorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (dataUrl: string) => void;
  bookTitle: string;
  authorName: string;
}

const CoverCreator = ({ open, onClose, onSelect, bookTitle, authorName }: CoverCreatorProps) => {
  const { lang } = useLanguage();
  const [selectedTemplate, setSelectedTemplate] = useState("classic");
  const [customTitle, setCustomTitle] = useState(bookTitle);
  const [customAuthor, setCustomAuthor] = useState(authorName);
  const [customSubtitle, setCustomSubtitle] = useState("");
  const [selectedFont, setSelectedFont] = useState("sans");
  const [titleSize, setTitleSize] = useState([56]);
  const [authorSize, setAuthorSize] = useState([32]);
  const [layout, setLayout] = useState("centered");
  const [customColor1, setCustomColor1] = useState("");
  const [customColor2, setCustomColor2] = useState("");
  const [customTextColor, setCustomTextColor] = useState("");
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [bgOpacity, setBgOpacity] = useState([40]);
  const [showBorder, setShowBorder] = useState(true);
  const [titleBold, setTitleBold] = useState(true);
  const [titleItalic, setTitleItalic] = useState(false);
  const bgImgRef = useRef<HTMLInputElement>(null);

  const template = coverTemplates.find(t => t.id === selectedTemplate) || coverTemplates[0];
  const font = fontOptions.find(f => f.id === selectedFont) || fontOptions[1];
  const c1 = customColor1 || template.colors[0];
  const c2 = customColor2 || template.colors[1];

  const handleBgImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setBgImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = useCallback(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 1200;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, selectedTemplate === "modern" ? 800 : 0, 1200);
    grad.addColorStop(0, c1);
    grad.addColorStop(1, c2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 1200);

    const drawText = () => {
      const isLight = selectedTemplate === "minimal" || selectedTemplate === "sahara" || selectedTemplate === "royal";
      const textCol = customTextColor || (isLight ? "#111827" : "#ffffff");
      
      // Border
      if (showBorder) {
        ctx.strokeStyle = `${textCol}15`;
        ctx.lineWidth = 2;
        ctx.strokeRect(40, 40, 720, 1120);
        ctx.strokeRect(60, 60, 680, 1080);
      }

      ctx.fillStyle = textCol;
      ctx.textAlign = "center";

      // Title position based on layout
      let titleY = layout === "top" ? 250 : layout === "bottom" ? 700 : layout === "split" ? 200 : 400;
      let authorY = layout === "bottom" ? 1050 : 1050;

      // Title
      const fontWeight = titleBold ? "bold " : "";
      const fontStyle = titleItalic ? "italic " : "";
      ctx.font = `${fontStyle}${fontWeight}${titleSize[0]}px ${font.css}`;
      
      const words = customTitle.split(" ");
      let lines: string[] = [];
      let currentLine = "";
      words.forEach(word => {
        const testLine = currentLine ? currentLine + " " + word : word;
        if (ctx.measureText(testLine).width > 640) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });
      if (currentLine) lines.push(currentLine);

      lines.forEach((line, i) => {
        ctx.fillText(line, 400, titleY + i * (titleSize[0] + 14));
      });

      // Subtitle
      if (customSubtitle) {
        ctx.font = `300 ${Math.round(titleSize[0] * 0.5)}px ${font.css}`;
        ctx.fillStyle = customTextColor ? `${customTextColor}b3` : (isLight ? "#6b7280" : "rgba(255,255,255,0.7)");
        ctx.fillText(customSubtitle, 400, titleY + lines.length * (titleSize[0] + 14) + 30);
      }

      // Decorative line
      const lineY = titleY + lines.length * (titleSize[0] + 14) + (customSubtitle ? 60 : 40);
      ctx.fillStyle = isLight ? "#f59e0b" : `${textCol}4d`;
      ctx.fillRect(300, lineY, 200, 3);

      // Author
      ctx.font = `500 ${authorSize[0]}px ${font.css}`;
      ctx.fillStyle = customTextColor ? `${customTextColor}e6` : (isLight ? "#374151" : "rgba(255,255,255,0.9)");
      ctx.fillText(customAuthor, 400, authorY);

      // KitabuShop branding
      ctx.font = `300 16px ${font.css}`;
      ctx.fillStyle = customTextColor ? `${customTextColor}66` : (isLight ? "#9ca3af" : "rgba(255,255,255,0.4)");
      ctx.fillText("KitabuShop", 400, 1140);
    };

    if (bgImage) {
      const img = new window.Image();
      img.onload = () => {
        ctx.globalAlpha = bgOpacity[0] / 100;
        ctx.drawImage(img, 0, 0, 800, 1200);
        ctx.globalAlpha = 1;
        // Overlay
        ctx.fillStyle = `${c1}${Math.round((1 - bgOpacity[0] / 100) * 255).toString(16).padStart(2, "0")}`;
        ctx.fillRect(0, 0, 800, 1200);
        drawText();
        const dataUrl = canvas.toDataURL("image/png");
        onSelect(dataUrl);
        onClose();
      };
      img.src = bgImage;
    } else {
      drawText();
      const dataUrl = canvas.toDataURL("image/png");
      onSelect(dataUrl);
      onClose();
    }
  }, [selectedTemplate, customTitle, customAuthor, customSubtitle, selectedFont, titleSize, authorSize, layout, c1, c2, customTextColor, bgImage, bgOpacity, showBorder, titleBold, titleItalic, font, onSelect, onClose]);

  const handleReset = () => {
    setCustomTitle(bookTitle);
    setCustomAuthor(authorName);
    setCustomSubtitle("");
    setSelectedFont("sans");
    setTitleSize([56]);
    setAuthorSize([32]);
    setLayout("centered");
    setCustomColor1("");
    setCustomColor2("");
    setCustomTextColor("");
    setBgImage(null);
    setBgOpacity([40]);
    setShowBorder(true);
    setTitleBold(true);
    setTitleItalic(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            {lang === "fr" ? "Créateur de couverture avancé" : "Advanced Cover Creator"}
          </DialogTitle>
          <DialogDescription>
            {lang === "fr" ? "16 modèles, polices personnalisées, image de fond, mise en page flexible" : "16 templates, custom fonts, background image, flexible layout"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Left: Controls (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            {/* Templates */}
            <div>
              <Label className="text-xs font-bold mb-2 block">{lang === "fr" ? "Modèles" : "Templates"} ({coverTemplates.length})</Label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                {coverTemplates.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => { setSelectedTemplate(tmpl.id); setCustomColor1(""); setCustomColor2(""); }}
                    className={`aspect-[2/3] rounded-md ${tmpl.bg} flex items-center justify-center text-[7px] font-bold ${tmpl.text} border-2 transition-all ${selectedTemplate === tmpl.id ? "border-primary ring-2 ring-primary/30 scale-110" : "border-transparent hover:border-border"}`}
                  >
                    <span className="px-0.5 text-center leading-tight">{tmpl.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Text inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1"><Label className="text-xs">{lang === "fr" ? "Titre" : "Title"}</Label><Input value={customTitle} onChange={(e) => setCustomTitle(e.target.value)} className="h-8 text-sm" /></div>
              <div className="space-y-1"><Label className="text-xs">{lang === "fr" ? "Sous-titre" : "Subtitle"}</Label><Input value={customSubtitle} onChange={(e) => setCustomSubtitle(e.target.value)} className="h-8 text-sm" placeholder={lang === "fr" ? "Optionnel" : "Optional"} /></div>
              <div className="space-y-1"><Label className="text-xs">{lang === "fr" ? "Auteur" : "Author"}</Label><Input value={customAuthor} onChange={(e) => setCustomAuthor(e.target.value)} className="h-8 text-sm" /></div>
              <div className="space-y-1">
                <Label className="text-xs">{lang === "fr" ? "Police" : "Font"}</Label>
                <Select value={selectedFont} onValueChange={setSelectedFont}>
                  <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {fontOptions.map(f => <SelectItem key={f.id} value={f.id}><span style={{ fontFamily: f.css }}>{f.name}</span></SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Typography controls */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs flex items-center gap-1"><Type className="h-3 w-3" /> {lang === "fr" ? "Taille titre" : "Title size"}: {titleSize[0]}px</Label>
                <Slider value={titleSize} onValueChange={setTitleSize} min={28} max={80} step={2} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs flex items-center gap-1"><Type className="h-3 w-3" /> {lang === "fr" ? "Taille auteur" : "Author size"}: {authorSize[0]}px</Label>
                <Slider value={authorSize} onValueChange={setAuthorSize} min={16} max={48} step={2} />
              </div>
            </div>

            {/* Style toggles */}
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant={titleBold ? "default" : "outline"} onClick={() => setTitleBold(!titleBold)} className="h-7 px-2"><Bold className="h-3.5 w-3.5" /></Button>
              <Button size="sm" variant={titleItalic ? "default" : "outline"} onClick={() => setTitleItalic(!titleItalic)} className="h-7 px-2"><Italic className="h-3.5 w-3.5" /></Button>
              <Button size="sm" variant={showBorder ? "default" : "outline"} onClick={() => setShowBorder(!showBorder)} className="h-7 text-xs">{lang === "fr" ? "Bordure" : "Border"}</Button>
              
              <Select value={layout} onValueChange={setLayout}>
                <SelectTrigger className="h-7 w-32 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {layoutOptions.map(l => <SelectItem key={l.id} value={l.id}>{lang === "fr" ? l.name_fr : l.name_en}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Color customization */}
            <div className="flex items-center gap-3">
              <div className="space-y-1">
                <Label className="text-[10px]">{lang === "fr" ? "Couleur 1" : "Color 1"}</Label>
                <input type="color" value={customColor1 || c1} onChange={(e) => setCustomColor1(e.target.value)} className="w-8 h-8 rounded cursor-pointer border" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px]">{lang === "fr" ? "Couleur 2" : "Color 2"}</Label>
                <input type="color" value={customColor2 || c2} onChange={(e) => setCustomColor2(e.target.value)} className="w-8 h-8 rounded cursor-pointer border" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px]">{lang === "fr" ? "Texte" : "Text"}</Label>
                <input type="color" value={customTextColor || "#ffffff"} onChange={(e) => setCustomTextColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border" />
              </div>
            </div>

            {/* Background image */}
            <div className="space-y-2">
              <Label className="text-xs">{lang === "fr" ? "Image de fond (optionnel)" : "Background image (optional)"}</Label>
              <input ref={bgImgRef} type="file" accept="image/*" className="hidden" onChange={handleBgImage} />
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => bgImgRef.current?.click()} className="h-7 text-xs gap-1">
                  <Upload className="h-3 w-3" /> {lang === "fr" ? "Charger" : "Upload"}
                </Button>
                {bgImage && (
                  <>
                    <span className="text-xs text-accent">✅</span>
                    <Button size="sm" variant="ghost" onClick={() => setBgImage(null)} className="h-7 text-xs text-destructive">✕</Button>
                  </>
                )}
              </div>
              {bgImage && (
                <div className="space-y-1">
                  <Label className="text-[10px]">{lang === "fr" ? "Opacité image" : "Image opacity"}: {bgOpacity[0]}%</Label>
                  <Slider value={bgOpacity} onValueChange={setBgOpacity} min={10} max={100} step={5} />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button onClick={handleGenerate} className="flex-1 rounded-sm font-semibold gap-2">
                <Check className="h-4 w-4" />
                {lang === "fr" ? "Générer la couverture" : "Generate Cover"}
              </Button>
              <Button variant="outline" onClick={handleReset} className="rounded-sm gap-1">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Right: Preview (2 cols) */}
          <div className="md:col-span-2 flex items-start justify-center pt-4">
            <div className={`w-52 aspect-[2/3] rounded-md shadow-xl ${!customColor1 ? template.bg : ""} ${template.text} flex flex-col items-center justify-center p-5 relative overflow-hidden`}
              style={customColor1 ? { background: `linear-gradient(to bottom, ${c1}, ${c2})` } : undefined}
            >
              {bgImage && (
                <div className="absolute inset-0" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center", opacity: bgOpacity[0] / 100 }} />
              )}
              {showBorder && (
                <>
                  <div className="absolute inset-2 border border-current/10 rounded-sm" />
                  <div className="absolute inset-4 border border-current/5 rounded-sm" />
                </>
              )}
              <div className="relative z-10 text-center space-y-2" style={{ color: customTextColor || undefined }}>
                {layout === "top" && <div className="absolute -top-12" />}
                <h3 className="leading-tight" style={{
                  fontSize: `${Math.round(titleSize[0] * 0.3)}px`,
                  fontFamily: font.css,
                  fontWeight: titleBold ? "bold" : "normal",
                  fontStyle: titleItalic ? "italic" : "normal",
                }}>{customTitle || "Titre"}</h3>
                {customSubtitle && <p className="opacity-70" style={{ fontSize: `${Math.round(titleSize[0] * 0.15)}px`, fontFamily: font.css }}>{customSubtitle}</p>}
                <div className="w-10 h-0.5 bg-current/30 mx-auto" />
                <p className="font-medium opacity-80" style={{ fontSize: `${Math.round(authorSize[0] * 0.3)}px`, fontFamily: font.css }}>{customAuthor || "Auteur"}</p>
              </div>
              <p className="absolute bottom-2 text-[6px] opacity-30">KitabuShop</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CoverCreator;
