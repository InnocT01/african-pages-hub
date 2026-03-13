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
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-2">
          <Button size="sm" variant={active === "" ? "default" : "outline"} className="rounded-full text-xs shrink-0" onClick={() => onChange("")}>
            {t("filter.all")}
          </Button>
          {items.map((item) => (
            <Button key={item} size="sm" variant={active === item ? "default" : "outline"} className="rounded-full text-xs shrink-0" onClick={() => onChange(item)}>
              {contentTypes.includes(item as any) ? t(`filter.${item}`) : item}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-4 md:p-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <PillGroup label={t("filter.origin")} items={origins.slice(0, 8)} active={activeOrigin} onChange={onOriginChange} />
        <PillGroup label={t("filter.genre")} items={genres.slice(0, 8)} active={activeGenre} onChange={onGenreChange} />
        <PillGroup label={t("filter.type")} items={[...contentTypes]} active={activeType} onChange={onTypeChange} />
      </div>
    </div>
  );
};

export default FilterBar;
