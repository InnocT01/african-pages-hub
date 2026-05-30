import { Truck, Smartphone, Globe2, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const TrustStrip = () => {
  const { lang } = useLanguage();

  const items = [
    {
      icon: Truck,
      title: "Kitabu Express",
      desc: lang === "fr" ? "Livraison à Kinshasa, Lagos, Nairobi, Dakar, Abidjan" : "Delivery across Kinshasa, Lagos, Nairobi, Dakar, Abidjan",
    },
    {
      icon: Smartphone,
      title: "Mobile Money",
      desc: lang === "fr" ? "M-Pesa, Orange Money, Airtel Money, MTN MoMo" : "M-Pesa, Orange Money, Airtel Money, MTN MoMo",
    },
    {
      icon: Globe2,
      title: lang === "fr" ? "24 langues africaines" : "24 African languages",
      desc: lang === "fr" ? "Swahili, Lingala, Wolof, Yoruba, Amharique…" : "Swahili, Lingala, Wolof, Yoruba, Amharic…",
    },
    {
      icon: ShieldCheck,
      title: lang === "fr" ? "Paiement vérifié" : "Verified payment",
      desc: lang === "fr" ? "Validation IA des transferts · Royalties 85%" : "AI transfer validation · 85% royalties",
    },
  ];

  return (
    <section className="border-y border-border bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
          {items.map((it) => (
            <div key={it.title} className="flex items-start gap-3 py-5 px-4 first:pl-0 group">
              <div className="shrink-0 h-10 w-10 flex items-center justify-center border border-border group-hover:border-primary group-hover:text-primary transition-colors">
                <it.icon className="h-4 w-4" strokeWidth={1.5} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-foreground leading-tight">{it.title}</p>
                <p className="text-[11px] text-muted-foreground mt-1 leading-snug font-light line-clamp-2">{it.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustStrip;
