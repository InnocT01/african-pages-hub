import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

type Currency = "USD" | "CDF" | "KES" | "XAF" | "EUR";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  convert: (usd: number) => number;
  format: (usd: number) => string;
  symbol: string;
  detectedCountry: string | null;
}

// Static exchange rates (manually updated)
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

const countryCurrencyMap: Record<string, Currency> = {
  CD: "CDF", // DRC
  KE: "KES",
  CM: "XAF", // Cameroon
  CI: "XAF", // Ivory Coast
  SN: "XAF", // Senegal
  FR: "EUR",
  BE: "EUR",
  RW: "USD",
  UG: "USD",
  TZ: "USD",
  US: "USD",
  GB: "USD",
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null);

  // Auto-detect via timezone
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz.includes("Kinshasa") || tz.includes("Lubumbashi")) {
        setCurrency("CDF");
        setDetectedCountry("CD");
      } else if (tz.includes("Nairobi")) {
        setCurrency("KES");
        setDetectedCountry("KE");
      } else if (tz.includes("Douala") || tz.includes("Lagos")) {
        setCurrency("XAF");
        setDetectedCountry("CM");
      } else if (tz.includes("Paris") || tz.includes("Brussels")) {
        setCurrency("EUR");
        setDetectedCountry("FR");
      } else {
        setDetectedCountry("US");
      }
    } catch {
      // fallback USD
    }
  }, []);

  const convert = useCallback((usd: number) => {
    return usd * rates[currency];
  }, [currency]);

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
