import { Link } from "@tanstack/react-router";

import { ProductArt } from "@/components/product-art";
import type { CatalogProduct } from "@/lib/catalog.functions";
import { formatNpr, isOrderable, STATUS_LABEL } from "@/lib/format";
import { bestDeal } from "@/lib/pricing";

export function lowestPrice(product: CatalogProduct): number | null {
  if (!product.variants.length) return null;
  return Math.min(...product.variants.map((variant) => variant.price_minor));
}

const HIDDEN_BADGES = new Set(["sample", "coming soon"]);

/** Short, factual line under the product name. */
export function productMeta(product: CatalogProduct): string {
  return [product.category?.name, product.platform ?? product.region].filter(Boolean).join(" · ");
}

/**
 * Product tile: square art, name, one meta line and the starting price.
 * The whole tile is the link. Items that cannot be ordered show their status instead of a price.
 */
export function ProductTile({ product, priority = false, className = "" }: { product: CatalogProduct; priority?: boolean; className?: string }) {
  const price = lowestPrice(product);
  const orderable = isOrderable(product.status);
  const deal = orderable ? bestDeal(product) : null;
  const badge = orderable ? product.badges.find((b) => !HIDDEN_BADGES.has(b.toLowerCase())) : undefined;

  return (
    <article data-scroll-reveal className={`product-tile group relative ${className}`}>
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        className="flex h-full flex-col rounded-2xl border border-border bg-card p-1.5 transition-colors hover:border-primary/50 focus-visible:border-primary"
      >
        <div className="relative overflow-hidden rounded-xl">
          <ProductArt product={product} priority={priority} />
          <span aria-hidden="true" className="tile-scan pointer-events-none absolute inset-x-0 top-0 h-px bg-primary/80" />
          {!orderable && (
            <span className="absolute left-2 top-2 rounded-full bg-background/85 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-warn backdrop-blur">
              {STATUS_LABEL[product.status] ?? product.status}
            </span>
          )}
          {deal && (
            <span className="absolute left-2 top-2 rounded-md bg-deal px-1.5 py-0.5 font-mono text-[11px] font-bold text-white">
              -{deal.percent}%
            </span>
          )}
          {badge && !deal && (
            <span className="absolute left-2 top-2 rounded-full bg-background/85 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-primary backdrop-blur">
              {badge}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col px-1.5 pb-1.5 pt-2.5">
          <h3 className="line-clamp-1 font-display text-[13px] font-medium leading-snug md:text-sm">{product.name}</h3>
          <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground md:text-xs">{productMeta(product)}</p>
          <p className="mt-auto pt-2 font-mono text-[13px] md:text-sm">
            {orderable && price !== null ? (
              <>
                <span className="text-muted-foreground">From </span>
                <span className="font-bold text-price">{formatNpr(deal ? deal.variant.price_minor : price)}</span>
                {deal && <span className="ml-1.5 text-[11px] text-muted-foreground line-through">{formatNpr(deal.was)}</span>}
              </>
            ) : (
              <span className="text-muted-foreground">Not open for orders yet</span>
            )}
          </p>
        </div>
      </Link>
    </article>
  );
}

/** Kept for existing imports. */
export const ProductCard = ProductTile;

/** Compact row for lists: 48px art, name, meta and price. */
export function ProductRow({ product }: { product: CatalogProduct }) {
  const price = lowestPrice(product);
  const orderable = isOrderable(product.status);
  return (
    <Link
      to="/products/$slug"
      params={{ slug: product.slug }}
      className="flex items-center gap-3 rounded-xl border border-border bg-card p-2 pr-3 transition-colors hover:border-primary/50"
    >
      <div className="size-12 shrink-0 overflow-hidden rounded-lg">
        <ProductArt product={product} sizes="48px" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-[13px] font-medium">{product.name}</p>
        <p className="truncate text-[11px] text-muted-foreground">{productMeta(product)}</p>
      </div>
      <span className="shrink-0 font-mono text-xs">
        {orderable && price !== null ? <span className="font-bold text-price">{formatNpr(price)}</span> : <span className="text-warn">Coming soon</span>}
      </span>
    </Link>
  );
}

/** Responsive grid for tiles: 2 columns on phones, up to 5 on desktop. */
export const TILE_GRID = "grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5";
