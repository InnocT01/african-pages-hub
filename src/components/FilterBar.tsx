import { useLanguage } from "@/contexts/LanguageContext";
import { origins, genres, contentTypes } from "@/data/constants";
import { Star, ChevronDown } from "lucide-react";
import { useState } from "react";

interface FilterBarProps {
  activeOrigin: string;
  activeGenre: string;
  activeType: string;
  onOriginChange: (v: string) => void;
  onGenreChange: (v: string) => void;
  onTypeChange: (v: string) => void;
}

const FilterSection = ({ title, items, active, onChange, showAll: initialShow = 5 }: {
  title: string; items: readonly string[] | string[]; active: string; onChange: (v: string) => void; showAll?: number;
}) => {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? items : items.slice(0, initialShow);

  return (
    <div className="pb-4 border-b border-border">
      <h4 className="font-bold text-xs mb-2">{title}</h4>
      <ul className="space-y-1">
        <li>
          <button onClick={() => onChange("")} className={`text-xs py-0.5 hover:text-primary transition-colors ${active === "" ? "text-primary font-bold" : "text-muted-foreground"}`}>
            {active === "" ? "► " : "  "}{title}
          </button>
        </li>
        {shown.map((item) => (
          <li key={item}>
            <button onClick={() => onChange(item)} className={`text-xs py-0.5 ml-3 hover:text-primary transition-colors ${active === item ? "text-primary font-bold" : "text-foreground"}`}>
              {item}
            </button>
          </li>
        ))}
      </ul>
      {items.length > initialShow && (
        <button onClick={() => setExpanded(!expanded)} className="text-[10px] text-primary mt-1 flex items-center gap-0.5">
          <ChevronDown className={`h-3 w-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
          {expanded ? "Voir moins" : "Voir plus"}
        </button>
      )}
    </div>
  );
};

const FilterBar = ({ activeOrigin, activeGenre, activeType, onOriginChange, onGenreChange, onTypeChange }: FilterBarProps) => {
  const { t, lang } = useLanguage();

  const typeLabels = contentTypes.map(ct => ({
    value: ct,
    label: t(`filter.${ct}`),
  }));

  return (
    <aside className="space-y-4">
      <h3 className="font-bold text-sm">{lang === "fr" ? "Département" : "Department"}</h3>

      <FilterSection
        title={lang === "fr" ? "Pays d'origine" : "Country"}
        items={origins.slice(0, 12)}
        active={activeOrigin}
        onChange={onOriginChange}
        showAll={6}
      />

      <FilterSection
        title="Genre"
        items={genres.slice(0, 10)}
        active={activeGenre}
        onChange={onGenreChange}
        showAll={6}
      />

      <div className="pb-4 border-b border-border">
        <h4 className="font-bold text-xs mb-2">{lang === "fr" ? "Format" : "Format"}</h4>
        <ul className="space-y-1">
          <li>
            <button onClick={() => onTypeChange("")} className={`text-xs py-0.5 hover:text-primary ${activeType === "" ? "text-primary font-bold" : "text-muted-foreground"}`}>
              {t("filter.all")}
            </button>
          </li>
          {typeLabels.map((ct) => (
            <li key={ct.value}>
              <label className="flex items-center gap-2 text-xs cursor-pointer py-0.5">
                <input
                  type="checkbox"
                  checked={activeType === ct.value}
                  onChange={() => onTypeChange(activeType === ct.value ? "" : ct.value)}
                  className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary accent-primary"
                />
                {ct.label}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Customer reviews filter */}
      <div className="pb-4 border-b border-border">
        <h4 className="font-bold text-xs mb-2">{lang === "fr" ? "Avis clients" : "Customer Reviews"}</h4>
        {[4, 3, 2, 1].map((stars) => (
          <button key={stars} className="flex items-center gap-1 py-0.5 text-xs hover:text-primary transition-colors">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-3 w-3 ${i < stars ? "star-fill" : "text-border"}`} />
            ))}
            <span className="text-muted-foreground ml-1">{lang === "fr" ? "& plus" : "& Up"}</span>
          </button>
        ))}
      </div>

      {/* New releases */}
      <div className="pb-4">
        <h4 className="font-bold text-xs mb-2">{lang === "fr" ? "Nouveautés" : "New Releases"}</h4>
        <ul className="space-y-1 text-xs">
          <li><button className="text-foreground hover:text-primary">{lang === "fr" ? "30 derniers jours" : "Last 30 days"}</button></li>
          <li><button className="text-foreground hover:text-primary">{lang === "fr" ? "90 derniers jours" : "Last 90 days"}</button></li>
        </ul>
      </div>
    </aside>
  );
};

export default FilterBar;
