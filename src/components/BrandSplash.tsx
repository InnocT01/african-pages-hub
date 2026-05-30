import { useEffect, useState } from "react";

const BrandSplash = () => {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem("kitabu_splash_seen");
  });

  useEffect(() => {
    if (!visible) return;
    sessionStorage.setItem("kitabu_splash_seen", "1");
    const t = setTimeout(() => setVisible(false), 1600);
    return () => clearTimeout(t);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background animate-fade-up"
      style={{ animation: "splash-out 1.6s ease forwards" }}
    >
      <style>{`
        @keyframes splash-out {
          0%,70% { opacity: 1; }
          100% { opacity: 0; visibility: hidden; }
        }
        @keyframes splash-stroke {
          to { stroke-dashoffset: 0; }
        }
        @keyframes splash-rise {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {/* Kente weave behind */}
      <div className="absolute inset-0 kente-pattern opacity-40 pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] bg-accent/10 rounded-full blur-3xl" />

      <div className="relative flex flex-col items-center gap-5">
        <svg width="64" height="64" viewBox="0 0 64 64" className="text-primary">
          <path
            d="M12 14 L12 50 L32 44 L52 50 L52 14 L32 20 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="180"
            strokeDashoffset="180"
            style={{ animation: "splash-stroke 1.1s ease-out forwards" }}
          />
          <line x1="32" y1="20" x2="32" y2="44" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        </svg>
        <div
          className="flex items-baseline"
          style={{ animation: "splash-rise 0.8s ease-out 0.4s both" }}
        >
          <span className="font-display text-4xl font-bold text-primary tracking-tight">Kitabu</span>
          <span className="font-display text-4xl font-light text-foreground tracking-tight">Shop</span>
        </div>
        <span
          className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground"
          style={{ animation: "splash-rise 0.8s ease-out 0.7s both" }}
        >
          L'âme de l'Afrique · The soul of Africa
        </span>
      </div>
    </div>
  );
};

export default BrandSplash;
