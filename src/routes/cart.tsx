import { createFileRoute, Link } from "@tanstack/react-router";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { formatNpr, SITE_URL } from "@/lib/format";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your cart | MTDGC" },
      { name: "description", content: "Review the products in your MTDGC cart before sending your order for confirmation." },
      { property: "og:title", content: "Your MTDGC cart" },
      { property: "og:description", content: "Review your MTDGC order before confirmation." },
      { property: "og:url", content: `${SITE_URL}/cart` },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/cart` }],
  }),
  component: CartPage,
});

function CartPage() {
  const { lines, subtotalMinor, setQuantity, remove, clear, hydrated } = useCart();

  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 pb-16 pt-6">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Cart" }]} />
        <h1 className="font-display text-[26px] font-medium md:text-4xl">Your cart</h1>

        {!hydrated ? (
          <p className="mt-6 text-sm text-muted-foreground">Loading your cart.</p>
        ) : lines.length === 0 ? (
          <div className="mt-8 rounded-lg border border-border py-14 text-center">
            <p className="font-display font-medium">Your MTDGC cart is empty</p>
            <p className="mt-1 text-sm text-muted-foreground">Browse the catalog to start an order.</p>
            <Button asChild className="mt-4"><Link to="/catalog">Browse the catalog</Link></Button>
          </div>
        ) : (
          <>
            <ul className="mt-6 divide-y divide-border">
              {lines.map((line) => (
                <li key={line.sku} className="flex items-center gap-3 py-4">
                  {line.image ? (
                    <img src={line.image} alt="" className="size-16 rounded-md object-cover" />
                  ) : (
                    <span aria-hidden="true" className="size-16 rounded-md bg-secondary" />
                  )}
                  <div className="min-w-0 flex-1">
                    <Link to="/products/$slug" params={{ slug: line.productSlug }} className="font-display text-sm font-medium hover:text-primary">
                      {line.productName}
                    </Link>
                    <p className="text-xs text-muted-foreground">{line.variantName} · {formatNpr(line.priceMinor)}</p>
                    {line.fields &&
                      Object.entries(line.fields)
                        .filter(([, value]) => value)
                        .map(([key, value]) => (
                          <p key={key} className="text-xs text-muted-foreground">{key}: {value}</p>
                        ))}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" aria-label={`Reduce quantity of ${line.productName}`} onClick={() => setQuantity(line.sku, line.quantity - 1)}>−</Button>
                    <span className="w-6 text-center font-display text-sm">{line.quantity}</span>
                    <Button variant="outline" size="icon" aria-label={`Increase quantity of ${line.productName}`} onClick={() => setQuantity(line.sku, line.quantity + 1)}>+</Button>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => remove(line.sku)}>Remove</Button>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-lg bg-panel p-4">
              <div className="flex items-center justify-between font-display">
                <span>Estimated total</span>
                <strong>{formatNpr(subtotalMinor)}</strong>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                No payment is taken on this site. MTDGC confirms availability and sends payment instructions before you
                pay.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild size="lg"><Link to="/checkout">Continue to checkout</Link></Button>
                <Button variant="outline" onClick={clear}>Clear cart</Button>
              </div>
            </div>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
