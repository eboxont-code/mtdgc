import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  title: string;
  intro?: ReactNode;
  eyebrow?: string;
  icon?: LucideIcon;
  /** centered: text-only gradient panel. split: text beside an icon panel. icon: compact icon badge row. */
  variant?: "centered" | "split" | "icon";
  children?: ReactNode;
};

export function PageHero({ title, intro, eyebrow, icon: Icon, variant = "centered", children }: Props) {
  if (variant === "split") {
    return (
      <header className="relative mt-2 overflow-hidden rounded-2xl border border-primary/25 bg-card p-5 md:grid md:grid-cols-[1fr_auto] md:items-center md:gap-8 md:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative">
          {eyebrow && <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">{eyebrow}</p>}
          <h1 className="mt-1 font-display text-[26px] font-medium leading-tight md:text-4xl">{title}</h1>
          {intro && <p className="mt-2 max-w-[60ch] text-sm text-muted-foreground">{intro}</p>}
          {children}
        </div>
        {Icon && (
          <div aria-hidden="true" className="relative mt-5 hidden size-28 place-items-center rounded-2xl border border-primary/40 bg-primary/10 shadow-[0_0_40px_-10px_var(--color-primary)] sm:grid md:mt-0">
            <Icon className="size-12 text-primary" />
          </div>
        )}
      </header>
    );
  }
  if (variant === "icon") {
    return (
      <header className="mt-2 flex items-start gap-4 border-l-2 border-primary pl-4">
        {Icon && (
          <span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-xl border border-primary/40 bg-primary/10">
            <Icon className="size-6 text-primary" />
          </span>
        )}
        <div>
          {eyebrow && <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">{eyebrow}</p>}
          <h1 className="font-display text-[26px] font-medium leading-tight md:text-4xl">{title}</h1>
          {intro && <p className="mt-2 max-w-[62ch] text-sm text-muted-foreground">{intro}</p>}
          {children}
        </div>
      </header>
    );
  }
  return (
    <header className="relative mt-2 overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-primary/15 via-card to-background px-5 py-8 text-center md:py-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      {eyebrow && <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">{eyebrow}</p>}
      <h1 className="mt-1 font-display text-[26px] font-medium leading-tight md:text-4xl">{title}</h1>
      {intro && <p className="mx-auto mt-2 max-w-[56ch] text-sm text-muted-foreground">{intro}</p>}
      {children}
    </header>
  );
}
