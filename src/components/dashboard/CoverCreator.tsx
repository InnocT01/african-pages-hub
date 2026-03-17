import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Palette, Upload, Check, Type, Image } from "lucide-react";

const coverTemplates = [
  { id: "classic", name: "Classique", bg: "bg-gradient-to-b from-amber-800 to-amber-950", text: "text-amber-50" },
  { id: "modern", name: "Moderne", bg: "bg-gradient-to-br from-slate-900 to-slate-700", text: "text-white" },
  { id: "nature", name: "Nature", bg: "bg-gradient-to-b from-emerald-700 to-emerald-900", text: "text-emerald-50" },
  { id: "bold", name: "Audacieux", bg: "bg-gradient-to-br from-red-700 to-orange-600", text: "text-white" },
  { id: "elegant", name: "Élégant", bg: "bg-gradient-to-b from-indigo-900 to-purple-900", text: "text-purple-100" },
  { id: "warm", name: "Chaleureux", bg: "bg-gradient-to-b from-orange-400 to-red-600", text: "text-white" },
  { id: "minimal", name: "Minimaliste", bg: "bg-white border-2 border-gray-200", text: "text-gray-900" },
  { id: "african", name: "Africain", bg: "bg-gradient-to-b from-yellow-600 via-orange-700 to-red-900", text: "text-yellow-50" },
  { id: "ocean", name: "Océan", bg: "bg-gradient-to-br from-cyan-600 to-blue-900", text: "text-cyan-50" },
  { id: "sunset", name: "Coucher de soleil", bg: "bg-gradient-to-b from-pink-500 via-orange-400 to-yellow-300", text: "text-white" },
  { id: "earth", name: "Terre", bg: "bg-gradient-to-b from-stone-600 to-stone-800", text: "text-stone-100" },
  { id: "royal", name: "Royal", bg: "bg-gradient-to-b from-yellow-400 via-amber-500 to-yellow-700", text: "text-amber-950" },
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

  const template = coverTemplates.find(t => t.id === selectedTemplate) || coverTemplates[0];

  const handleGenerate = () => {
    // Create canvas to generate cover image
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 1200;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background gradient
    const gradients: Record<string, [string, string]> = {
      classic: ["#92400e", "#451a03"],
      modern: ["#0f172a", "#334155"],
      nature: ["#047857", "#064e3b"],
      bold: ["#b91c1c", "#ea580c"],
      elegant: ["#312e81", "#581c87"],
      warm: ["#fb923c", "#dc2626"],
      minimal: ["#ffffff", "#f5f5f5"],
      african: ["#ca8a04", "#7c2d12"],
      ocean: ["#0891b2", "#1e3a5f"],
      sunset: ["#ec4899", "#fde047"],
      earth: ["#57534e", "#292524"],
      royal: ["#facc15", "#b45309"],
    };

    const [c1, c2] = gradients[selectedTemplate] || gradients.classic;
    const grad = ctx.createLinearGradient(0, 0, 0, 1200);
    grad.addColorStop(0, c1);
    grad.addColorStop(1, c2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 1200);

    // Decorative elements
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, 720, 1120);
    ctx.strokeRect(60, 60, 680, 1080);

    // Text color
    const isLight = selectedTemplate === "minimal";
    ctx.fillStyle = isLight ? "#111827" : "#ffffff";

    // Title
    ctx.font = "bold 56px Inter, sans-serif";
    ctx.textAlign = "center";
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

    const titleY = 400;
    lines.forEach((line, i) => {
      ctx.fillText(line, 400, titleY + i * 70);
    });

    // Subtitle
    if (customSubtitle) {
      ctx.font = "300 28px Inter, sans-serif";
      ctx.fillStyle = isLight ? "#6b7280" : "rgba(255,255,255,0.7)";
      ctx.fillText(customSubtitle, 400, titleY + lines.length * 70 + 40);
    }

    // Decorative line
    ctx.fillStyle = isLight ? "#f59e0b" : "rgba(255,255,255,0.3)";
    ctx.fillRect(300, titleY + lines.length * 70 + 70, 200, 3);

    // Author
    ctx.font = "500 32px Inter, sans-serif";
    ctx.fillStyle = isLight ? "#374151" : "rgba(255,255,255,0.9)";
    ctx.fillText(customAuthor, 400, 1050);

    // KitabuShop logo text
    ctx.font = "300 16px Inter, sans-serif";
    ctx.fillStyle = isLight ? "#9ca3af" : "rgba(255,255,255,0.4)";
    ctx.fillText("KitabuShop", 400, 1140);

    const dataUrl = canvas.toDataURL("image/png");
    onSelect(dataUrl);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            {lang === "fr" ? "Créateur de couverture" : "Cover Creator"}
          </DialogTitle>
          <DialogDescription>
            {lang === "fr" ? "Choisissez un modèle et personnalisez votre couverture" : "Choose a template and customize your cover"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: templates + form */}
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-bold mb-2 block">{lang === "fr" ? "Modèles" : "Templates"}</Label>
              <div className="grid grid-cols-4 gap-2">
                {coverTemplates.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => setSelectedTemplate(tmpl.id)}
                    className={`aspect-[2/3] rounded-md ${tmpl.bg} flex items-center justify-center text-[8px] font-bold ${tmpl.text} border-2 transition-all ${selectedTemplate === tmpl.id ? "border-primary ring-2 ring-primary/30 scale-105" : "border-transparent hover:border-border"}`}
                  >
                    <span className="px-1 text-center leading-tight">{tmpl.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">{lang === "fr" ? "Titre" : "Title"}</Label>
                <Input value={customTitle} onChange={(e) => setCustomTitle(e.target.value)} className="h-8 text-sm rounded-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{lang === "fr" ? "Sous-titre" : "Subtitle"}</Label>
                <Input value={customSubtitle} onChange={(e) => setCustomSubtitle(e.target.value)} className="h-8 text-sm rounded-sm" placeholder={lang === "fr" ? "Optionnel" : "Optional"} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{lang === "fr" ? "Auteur" : "Author"}</Label>
                <Input value={customAuthor} onChange={(e) => setCustomAuthor(e.target.value)} className="h-8 text-sm rounded-sm" />
              </div>
            </div>

            <Button onClick={handleGenerate} className="w-full rounded-sm font-semibold gap-2">
              <Check className="h-4 w-4" />
              {lang === "fr" ? "Générer la couverture" : "Generate Cover"}
            </Button>
          </div>

          {/* Right: preview */}
          <div className="flex items-center justify-center">
            <div className={`w-56 aspect-[2/3] rounded-md shadow-xl ${template.bg} ${template.text} flex flex-col items-center justify-center p-6 relative overflow-hidden`}>
              <div className="absolute inset-3 border border-current/10 rounded-sm" />
              <div className="absolute inset-5 border border-current/5 rounded-sm" />
              <div className="relative z-10 text-center space-y-3">
                <h3 className="text-lg font-bold leading-tight">{customTitle || "Titre"}</h3>
                {customSubtitle && <p className="text-[10px] opacity-70">{customSubtitle}</p>}
                <div className="w-12 h-0.5 bg-current/30 mx-auto" />
                <p className="text-xs font-medium opacity-80">{customAuthor || "Auteur"}</p>
              </div>
              <p className="absolute bottom-3 text-[7px] opacity-30">KitabuShop</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CoverCreator;
