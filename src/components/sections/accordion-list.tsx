import { ChevronDown } from "lucide-react";
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export type AccordionItem = { id?: string; title: ReactNode; content: ReactNode };

type Props = {
  items: AccordionItem[];
  /** Heading level wrapping each trigger button. */
  headingLevel?: 2 | 3;
  defaultOpen?: number[];
  className?: string;
};

/**
 * Accessible accordion following the WAI-ARIA pattern: each header is a button
 * with aria-expanded/aria-controls, each panel a labelled region. Arrow keys,
 * Home and End move focus between headers.
 */
export function AccordionList({ items, headingLevel = 3, defaultOpen = [], className }: Props) {
  const base = useId();
  const [open, setOpen] = useState<Set<number>>(() => new Set(defaultOpen));
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const Heading = headingLevel === 2 ? "h2" : "h3";

  const toggle = (index: number) =>
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = items.length - 1;
    let target: number | null = null;
    if (event.key === "ArrowDown") target = index === last ? 0 : index + 1;
    else if (event.key === "ArrowUp") target = index === 0 ? last : index - 1;
    else if (event.key === "Home") target = 0;
    else if (event.key === "End") target = last;
    if (target === null) return;
    event.preventDefault();
    buttons.current[target]?.focus();
  };

  return (
    <div className={`divide-y divide-border rounded-2xl border border-border bg-card/40 ${className ?? ""}`}>
      {items.map((item, index) => {
        const isOpen = open.has(index);
        const buttonId = `${base}-h${index}`;
        const panelId = `${base}-p${index}`;
        return (
          <div key={item.id ?? index}>
            <Heading className="m-0">
              <button
                ref={(node) => { buttons.current[index] = node; }}
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(index)}
                onKeyDown={(event) => onKeyDown(event, index)}
                className="flex min-h-12 w-full items-center justify-between gap-3 px-4 py-3 text-left font-display text-sm font-medium outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
              >
                <span>{item.title}</span>
                <ChevronDown aria-hidden="true" className={`size-4 shrink-0 text-primary transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
            </Heading>
            <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen} className="px-4 pb-4 text-sm text-foreground/80">
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
