import { Link } from "@tanstack/react-router";
import { ChevronRight, Gamepad2, Gift, LayoutGrid, MonitorCog, Repeat, Tag, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { ProductTile } from "@/components/product-card";
import type { CatalogCategory, CatalogProduct } from "@/lib/catalog.functions";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "game-top-ups": Gamepad2,
  "gift-cards": Gift,
  subscriptions: Repeat,
  software: MonitorCog,
  deals: Tag,
};

/** Round icon tiles that link to each category. */
export function CategoryRail({ categories, active }: { categories: CatalogCategory[]; active?: string }) {
  const items = [{ slug: "all", name: "All" }, ...categories];
  return (
    <nav aria-label="Categories" className="scrollbar-hidden -mx-4 flex snap-x gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:justify-start md:gap-3 md:px-0">
      {items.map((category) => {
        const Icon = category.slug === "all" ? LayoutGrid : (CATEGORY_ICONS[category.slug] ?? LayoutGrid);
        const isActive = (active ?? "all") === category.slug;
        return (
          <Link
            key={category.slug}
            to="/catalog"
            search={category.slug === "all" ? {} : { category: category.slug }}
            className="group flex w-[72px] shrink-0 snap-start flex-col items-center gap-1.5 text-center md:w-auto md:flex-row md:gap-2 md:rounded-full md:border md:border-border md:bg-card md:py-1.5 md:pl-1.5 md:pr-4"
            aria-current={isActive ? "page" : undefined}
          >
            <span className={`grid size-14 place-items-center rounded-2xl border transition-colors md:size-9 md:rounded-full ${isActive ? "border-primary bg-primary/15 text-primary" : "border-border bg-card text-primary group-hover:border-primary/50"}`}>
              <Icon className="size-6 md:size-[18px]" />
            </span>
            <span className={`text-[11px] leading-tight md:text-sm ${isActive ? "text-primary" : "text-foreground/85"}`}>{category.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string | undefined; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3 md:mb-4">
      <div className="min-w-0">
        <h2 className="flex items-center gap-2 font-display text-[18px] font-semibold md:text-2xl">
          <span aria-hidden="true" className="h-4 w-1 rounded-full bg-primary md:h-5" />
          {title}
        </h2>
        {subtitle && <p className="mt-0.5 line-clamp-1 pl-3 text-xs text-muted-foreground md:line-clamp-none md:text-sm">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function SeeAll({ to, search, label = "See all" }: { to: "/catalog"; search?: { category?: string }; label?: string }) {
  return (
    <Link to={to} search={search ?? {}} className="inline-flex shrink-0 items-center gap-0.5 rounded-full border border-border px-3 py-1 font-display text-xs text-foreground/85 hover:border-primary/50 hover:text-primary">
      {label} <ChevronRight className="size-3.5" />
    </Link>
  );
}

/** Horizontal rail on phones (about 2.3 tiles in view), a grid from md up. */
export function ProductRail({ products, priorityCount = 0 }: { products: CatalogProduct[]; priorityCount?: number }) {
  return (
    <div className="scrollbar-hidden -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-2.5 overflow-x-auto px-4 pb-1 md:mx-0 md:grid md:grid-cols-4 md:gap-3 md:overflow-visible md:px-0 lg:grid-cols-5">
      {products.map((product, i) => (
        <ProductTile key={product.id} product={product} priority={i < priorityCount} className="w-[42%] shrink-0 snap-start sm:w-[30%] md:w-auto" />
      ))}
    </div>
  );
}
