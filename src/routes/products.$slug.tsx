import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductCard } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { WishlistButton } from "@/components/wishlist-button";
import { getProductBySlug } from "@/lib/catalog.functions";
import { useCart } from "@/lib/cart";
import { formatNpr, isOrderable, SITE_URL, STATUS_LABEL } from "@/lib/format";

export const Route = createFileRoute("/products/$slug")({
  loader: async ({ params }) => {
    const result = await getProductBySlug({ data: { slug: params.slug } });
    if (!result.product) throw notFound();
    return result;
  },
  head: ({ loaderData }) => {
    if (!loaderData?.product) {
      return { meta: [{ title: "Product not found | MTDGC" }, { name: "robots", content: "noindex" }] };
    }
    const product = loaderData.product;
    const url = `${SITE_URL}/products/${product.slug}`;
    return {
      meta: [
        { title: product.seo_title },
        { name: "description", content: product.seo_description },
        { property: "og:title", content: product.seo_title },
        { property: "og:description", content: product.seo_description },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.summary,
            brand: { "@type": "Brand", name: product.brand },
            category: product.category?.name,
            offers: product.variants.map((variant) => ({
              "@type": "Offer",
              sku: variant.sku,
              name: variant.name,
              price: (variant.price_minor / 100).toFixed(2),
              priceCurrency: variant.currency,
              availability: isOrderable(variant.status)
                ? "https://schema.org/InStock"
                : "https://schema.org/PreOrder",
              url,
            })),
          }),
        },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product, related } = Route.useLoaderData();
  const { add, setDrawerOpen } = useCart();
  const defaultVariant = product!.variants.find((variant) => variant.is_default) ?? product!.variants[0];
  const [selectedSku, setSelectedSku] = useState(defaultVariant?.sku ?? "");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  if (!product) return null;
  const variant = product.variants.find((item) => item.sku === selectedSku) ?? defaultVariant;
  const orderable = isOrderable(product.status) && !!variant && isOrderable(variant.status);

  const addToCart = () => {
    if (!variant) return;
    const missing = product.requirements.filter((requirement) => !(fields[requirement] ?? "").trim());
    if (missing.length) {
      setError(`Please fill in: ${missing.join(", ")}.`);
      return;
    }
    setError(null);
    add({
      sku: variant.sku,
      productSlug: product.slug,
      productName: product.name,
      variantName: variant.name,
      priceMinor: variant.price_minor,
      image: product.image_url,
      fields,
    });
    setDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-6">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Catalog", to: "/catalog" },
            { label: product.name },
          ]}
        />

        <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
          <div>
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                width={640}
                height={640}
                className="w-full rounded-lg object-cover"
              />
            ) : (
              <div aria-hidden="true" className="aspect-square w-full rounded-lg bg-secondary" />
            )}
          </div>

          <div>
            <p className="font-display text-[11px] uppercase tracking-[0.14em] text-primary">{product.brand}</p>
            <h1 className="mt-1 font-display text-[26px] font-medium md:text-4xl">{product.name}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{product.summary}</p>

            <div className="mt-3 flex flex-wrap gap-1">
              <span className="rounded bg-accent px-2 py-0.5 font-display text-[10px] uppercase tracking-[0.1em] text-accent-foreground">
                {STATUS_LABEL[product.status] ?? product.status}
              </span>
              {product.badges.map((badge) => (
                <span key={badge} className="rounded bg-secondary px-2 py-0.5 font-display text-[10px] uppercase tracking-[0.1em]">
                  {badge}
                </span>
              ))}
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-3 rounded-lg bg-panel p-4 text-xs">
              <div><dt className="text-muted-foreground">Region</dt><dd className="font-display font-medium">{product.region}</dd></div>
              <div><dt className="text-muted-foreground">Platform</dt><dd className="font-display font-medium">{product.platform ?? "Not applicable"}</dd></div>
              <div><dt className="text-muted-foreground">Delivery method</dt><dd className="font-display font-medium">{product.delivery_method}</dd></div>
              <div><dt className="text-muted-foreground">Delivery time</dt><dd className="font-display font-medium">{product.delivery_time}</dd></div>
            </dl>

            {product.variants.length > 0 && (
              <fieldset className="mt-6">
                <legend className="font-display text-sm font-medium">Choose an option</legend>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {product.variants.map((item) => (
                    <label
                      key={item.sku}
                      className={`flex cursor-pointer items-center justify-between rounded-md border p-3 ${
                        selectedSku === item.sku ? "border-primary bg-card" : "border-border"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="variant"
                          value={item.sku}
                          checked={selectedSku === item.sku}
                          onChange={() => setSelectedSku(item.sku)}
                        />
                        <span className="font-display text-sm">{item.name}</span>
                      </span>
                      <span className="font-display text-sm font-semibold">{formatNpr(item.price_minor)}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            {product.requirements.length > 0 && (
              <div className="mt-6 space-y-3">
                <h2 className="font-display text-sm font-medium">What we need from you</h2>
                {product.requirements.map((requirement) => (
                  <label key={requirement} className="block">
                    <span className="font-display text-xs text-muted-foreground">{requirement}</span>
                    <input
                      value={fields[requirement] ?? ""}
                      onChange={(event) => setFields((current) => ({ ...current, [requirement]: event.target.value }))}
                      className="mt-1 h-10 w-full rounded-md border border-border bg-card px-3 font-display text-sm outline-none focus:border-primary"
                    />
                  </label>
                ))}
                <p className="text-xs text-muted-foreground">
                  MTDGC will never ask for your password, OTP or payment PIN.
                </p>
              </div>
            )}

            {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button size="lg" disabled={!orderable} onClick={addToCart}>
                {orderable ? `Add to cart · ${variant ? formatNpr(variant.price_minor) : ""}` : "Not available yet"}
              </Button>
              <Button asChild variant="outline" size="lg"><Link to="/catalog">Keep browsing</Link></Button>
              <WishlistButton productId={product.id} />
            </div>

            <section className="mt-8">
              <h2 className="font-display text-lg font-medium">About this product</h2>
              <p className="mt-2 text-sm text-foreground/80">{product.description}</p>
              {product.redemption_instructions && (
                <>
                  <h3 className="mt-5 font-display text-sm font-medium">How to redeem</h3>
                  <p className="mt-1 text-sm text-foreground/80">{product.redemption_instructions}</p>
                </>
              )}
              <h3 className="mt-5 font-display text-sm font-medium">Refund eligibility</h3>
              <p className="mt-1 text-sm text-foreground/80">{product.refund_eligibility}</p>
            </section>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 font-display text-lg font-medium">Related products</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
