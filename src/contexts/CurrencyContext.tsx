import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

type Currency = "USD" | "CDF" | "KES" | "XAF" | "EUR";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  convert: (usd: number) => number;
  format: (usd: number) => string;
  symbol: string;
  detectedCountry: string | null;
}

const rates: Record<Currency, number> = {
  USD: 1,
  CDF: 2800,
  KES: 155,
  XAF: 610,
  EUR: 0.92,
};

const symbols: Record<Currency, string> = {
  USD: "$",
  CDF: "FC",
  KES: "KSh",
  XAF: "FCFA",
  EUR: "€",
};

const currencyNames: Record<Currency, string> = {
  USD: "Dollar US",
  CDF: "Franc Congolais",
  KES: "Shilling Kenyan",
  XAF: "Franc CFA",
  EUR: "Euro",
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem("kitabu-currency");
    return (saved as Currency) || "USD";
  });
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null);
  const [prompted, setPrompted] = useState(() => localStorage.getItem("kitabu-currency-prompted") === "true");

  // Persist choice
  useEffect(() => {
    localStorage.setItem("kitabu-currency", currency);
  }, [currency]);

  // Auto-detect via timezone, ask user consent
  useEffect(() => {
    if (prompted) return;
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      let detected: Currency | null = null;
      let country = "US";

      if (tz.includes("Kinshasa") || tz.includes("Lubumbashi")) { detected = "CDF"; country = "CD"; }
      else if (tz.includes("Nairobi")) { detected = "KES"; country = "KE"; }
      else if (tz.includes("Douala") || tz.includes("Lagos")) { detected = "XAF"; country = "CM"; }
      else if (tz.includes("Paris") || tz.includes("Brussels")) { detected = "EUR"; country = "FR"; }
      else if (tz.includes("Kigali")) { detected = "USD"; country = "RW"; }

      setDetectedCountry(country);

      if (detected && detected !== currency) {
        // Ask user consent before switching
        const detName = currencyNames[detected];
        toast(
          `Devise détectée : ${detName} (${detected})`,
          {
            description: "Voulez-vous utiliser cette devise ?",
            action: {
              label: `Utiliser ${detected}`,
              onClick: () => {
                setCurrency(detected!);
                localStorage.setItem("kitabu-currency-prompted", "true");
                setPrompted(true);
              },
            },
            duration: 10000,
            onDismiss: () => {
              localStorage.setItem("kitabu-currency-prompted", "true");
              setPrompted(true);
            },
          }
        );
      } else {
        localStorage.setItem("kitabu-currency-prompted", "true");
        setPrompted(true);
      }
    } catch {
      // fallback USD
    }
  }, [prompted, currency]);

  const convert = useCallback((usd: number) => usd * rates[currency], [currency]);

  const format = useCallback((usd: number) => {
    const converted = usd * rates[currency];
    if (currency === "USD") return `$${converted.toFixed(2)}`;
    if (currency === "EUR") return `€${converted.toFixed(2)}`;
    if (currency === "CDF") return `${Math.round(converted).toLocaleString()} FC`;
    if (currency === "KES") return `KSh ${converted.toFixed(0)}`;
    return `${Math.round(converted).toLocaleString()} FCFA`;
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convert, format, symbol: symbols[currency], detectedCountry }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
};

export const currencies: Currency[] = ["USD", "CDF", "KES", "XAF", "EUR"];
