import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { origins, genres, contentTypes } from "@/data/constants";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface FilterBarProps {
  activeOrigin: string;
  activeGenre: string;
  activeType: string;
  onOriginChange: (v: string) => void;
  onGenreChange: (v: string) => void;
  onTypeChange: (v: string) => void;
}

const FilterBar = ({ activeOrigin, activeGenre, activeType, onOriginChange, onGenreChange, onTypeChange }: FilterBarProps) => {
  const { t } = useLanguage();

  const PillGroup = ({ label, items, active, onChange }: { label: string; items: readonly string[] | string[]; active: string; onChange: (v: string) => void }) => (
    <div className="space-y-2">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex gap-1.5 flex-wrap">
        <button onClick={() => onChange("")} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${active === "" ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"}`}>
          {t("filter.all")}
        </button>
        {items.map((item) => (
          <button key={item} onClick={() => onChange(item)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${active === item ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"}`}>
            {contentTypes.includes(item as any) ? t(`filter.${item}`) : item}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <PillGroup label={t("filter.origin")} items={origins.slice(0, 8)} active={activeOrigin} onChange={onOriginChange} />
        <PillGroup label={t("filter.genre")} items={genres.slice(0, 8)} active={activeGenre} onChange={onGenreChange} />
        <PillGroup label={t("filter.type")} items={[...contentTypes]} active={activeType} onChange={onTypeChange} />
      </div>
    </div>
  );
};

export default FilterBar;
