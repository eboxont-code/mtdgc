import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export function EmptyState({ icon: Icon, title, text, action }: { icon: LucideIcon; title: string; text: string; action: ReactNode }) {
  return (
    <div className="mt-8 rounded-lg border border-glass-border bg-glass-bg px-4 py-14 text-center">
      <Icon className="mx-auto mb-3 size-6 text-muted-foreground" aria-hidden="true" />
      <h2 className="font-display font-medium">{title}</h2>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">{text}</p>
      <div className="mt-4">{action}</div>
    </div>
  );
}