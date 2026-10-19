import { createFileRoute, Link } from "@tanstack/react-router";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { MAX_QTY, useCart } from "@/lib/cart";
import { requirementHelp } from "@/lib/product-help";
import { formatNpr, SITE_URL } from "@/lib/format";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your cart | MTDGC" },
      { name: "description", content: "Review the products in your MTDGC cart before sending your order for confirmation." },
      { property: "og:title", content: "Your MTDGC cart" },
      { property: "og:description", content: "Review your MTDGC order before confirmation." },
      { name: "twitter:title", content: "Your MTDGC cart"  },
      { name: "twitter:description", content: "Review your MTDGC order before confirmation."  },
      { property: "og:url", content: `${SITE_URL}/cart` },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/cart` }],
  }),
  component: CartPage,
});

function CartPage() {
  const { lines, count, subtotalMinor, setQuantity, remove, updateFields, clear, hydrated } = useCart();

  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="focus:outline-none mx-auto max-w-4xl px-4 pb-16 pt-6">
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
                <li key={line.sku} className="grid gap-3 py-4 sm:grid-cols-[auto_1fr_auto] sm:items-start">
                  {line.image ? (
                    <Link to="/products/$slug" params={{ slug: line.productSlug }}>
                      <img src={line.image} alt={line.productName} width={64} height={64} className="size-16 rounded-md object-cover" />
                    </Link>
                  ) : (
                    <span aria-hidden="true" className="size-16 rounded-md bg-secondary" />
                  )}
                  <div className="min-w-0 flex-1">
                    <Link to="/products/$slug" params={{ slug: line.productSlug }} className="font-display text-sm font-medium hover:text-primary">
                      {line.productName}
                    </Link>
                    <p className="text-xs text-muted-foreground">{line.variantName} · Region: {line.region ?? "See product"}</p>
                    <p className="mt-1 font-display text-sm">{formatNpr(line.priceMinor * line.quantity)}</p>
                    {line.fields && Object.keys(line.fields).length > 0 && (
                      <details className="mt-3">
                        <summary className="cursor-pointer font-display text-xs font-medium">Edit order details</summary>
                        <div className="mt-2 grid gap-2 sm:grid-cols-2">
                          {Object.entries(line.fields).map(([key, value]) => {
                            const id = `cart-${line.sku}-${key.replace(/\W+/g, "-")}`;
                            return <label key={key} htmlFor={id} className="block font-display text-xs text-muted-foreground">
                              {key}
                              <input id={id} value={value} aria-describedby={`${id}-help`} onChange={(event) => updateFields(line.sku, { ...line.fields, [key]: event.target.value })} className="mt-1 h-9 w-full rounded-md border border-border bg-card px-2 text-sm text-foreground focus:border-primary focus:outline-none" />
                              <span id={`${id}-help`} className="mt-1 block font-body text-xs">{requirementHelp(key)}</span>
                            </label>;
                          })}
                        </div>
                      </details>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" disabled={line.quantity <= 1} aria-label={`Reduce quantity of ${line.productName}`} onClick={() => setQuantity(line.sku, line.quantity - 1)}>−</Button>
                    <span className="w-6 text-center font-display text-sm">{line.quantity}</span>
                    <Button variant="outline" size="icon" disabled={line.quantity >= MAX_QTY} aria-label={`Increase quantity of ${line.productName}`} onClick={() => setQuantity(line.sku, line.quantity + 1)}>+</Button>
                    <Button variant="ghost" size="sm" onClick={() => remove(line.sku)}>Remove</Button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-2xl border border-border bg-card p-4">
              <div className="mb-2 flex items-center justify-between text-sm"><span>Items</span><span>{count}</span></div>
              <div className="flex items-center justify-between font-display">
                <span>Estimated total</span>
                <strong className="font-mono text-lg text-price">{formatNpr(subtotalMinor)}</strong>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Nothing is charged on this site. After you place the order you pay by QR code or bank transfer, then upload
                your payment screenshot.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild size="lg"><Link to="/checkout">Continue to checkout</Link></Button>
                <Button asChild variant="outline"><Link to="/catalog">Continue shopping</Link></Button>
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
