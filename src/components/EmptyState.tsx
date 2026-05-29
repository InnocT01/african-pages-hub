import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface Props {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  children?: ReactNode;
}

const EmptyState = ({ icon: Icon, title, description, action, children }: Props) => (
  <div className="flex flex-col items-center justify-center text-center py-16 px-6 animate-fade-up">
    <div className="relative mb-6">
      <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl" />
      <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/20">
        <Icon className="w-9 h-9 text-primary" strokeWidth={1.5} />
      </div>
    </div>
    <h3 className="font-display text-2xl mb-2 text-foreground">{title}</h3>
    {description && <p className="text-muted-foreground max-w-sm mb-6 font-body">{description}</p>}
    {action && (
      <Button onClick={action.onClick} className="bg-primary hover:bg-primary/90">
        {action.label}
      </Button>
    )}
    {children}
  </div>
);
export default EmptyState;
