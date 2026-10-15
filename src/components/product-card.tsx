import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import type { CatalogProduct } from "@/lib/catalog.functions";
import { formatNpr, isOrderable, STATUS_LABEL } from "@/lib/format";

export function lowestPrice(product: CatalogProduct): number | null {
  if (!product.variants.length) return null;
  return Math.min(...product.variants.map((variant) => variant.price_minor));
}

export function ProductCard({ product, priority = false }: { product: CatalogProduct; priority?: boolean }) {
  const price = lowestPrice(product);
  const orderable = isOrderable(product.status);

  return (
    <article className="flex flex-col rounded-lg bg-card p-3 ring-1 ring-foreground/5 transition-transform hover:-translate-y-0.5">
      <Link to="/products/$slug" params={{ slug: product.slug }} className="flex flex-1 flex-col">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
            width={320}
            height={320}
            className="mb-3 aspect-square w-full rounded-md object-cover"
          />
        ) : (
          <div aria-hidden="true" className="mb-3 aspect-square w-full rounded-md bg-secondary" />
        )}
        <div className="flex flex-wrap gap-1">
          <span
            className={`rounded px-2 py-0.5 font-display text-xs uppercase tracking-[0.1em] ${
              orderable ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {STATUS_LABEL[product.status] ?? product.status}
          </span>
          {product.badges.map((badge) => (
            <span key={badge} className="rounded bg-secondary px-2 py-0.5 font-display text-xs uppercase tracking-[0.1em] text-secondary-foreground">
              {badge}
            </span>
          ))}
        </div>
        <h3 className="mt-2 font-display text-[14px] font-medium leading-tight">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{product.summary}</p>
        <p className="mt-1 font-display text-xs uppercase tracking-[0.1em] text-muted-foreground">
          Region: {product.region}
        </p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-display text-xs text-muted-foreground">{price === null ? "" : "From"}</span>
          <span className="font-display text-[15px] font-semibold">
            {price === null ? "Price on request" : formatNpr(price)}
          </span>
        </div>
      </Link>
      <Button asChild className="mt-3 w-full" variant={orderable ? "primary" : "outline"} size="sm">
        <Link to="/products/$slug" params={{ slug: product.slug }}>
          {orderable ? "View options" : "View details"}
        </Link>
      </Button>
    </article>
  );
}
