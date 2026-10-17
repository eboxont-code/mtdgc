import { supabase } from "@/integrations/supabase/client";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductArt } from "@/components/product-art";
import { ProductCard } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { WishlistButton } from "@/components/wishlist-button";
import { getProductBySlug } from "@/lib/catalog.functions";
import { useCart } from "@/lib/cart";
import { formatNpr, isOrderable, SITE_URL, STATUS_LABEL } from "@/lib/format";
import { productFaqs, requirementHelp } from "@/lib/product-help";

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
    const image = product.image_url ? (product.image_url.startsWith("http") ? product.image_url : `${SITE_URL}${product.image_url}`) : undefined;
    const prices = product.variants.filter((variant) => variant.price_minor > 0 && variant.status !== "archived").map((variant) => variant.price_minor);
    const lowestPrice = prices.length ? Math.min(...prices) : 0;
    return {
      meta: [
        { title: product.seo_title },
        { name: "description", content: product.seo_description },
        { property: "og:title", content: product.seo_title },
        { property: "og:description", content: product.seo_description },
        { property: "og:url", content: url },
        { property: "og:type", content: "product" },
        ...(image ? [
          { property: "og:image", content: image },
          { property: "og:image:alt", content: `${product.name} from MTDGC` },
          { property: "og:image:width", content: "640" },
          { property: "og:image:height", content: "640" },
          { name: "twitter:image", content: image },
          { name: "twitter:image:alt", content: `${product.name} from MTDGC` },
        ] : []),
        { property: "product:price:amount", content: (lowestPrice / 100).toFixed(2) },
        { property: "product:price:currency", content: "NPR" },
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
            image,
            url,
            sku: product.variants[0]?.sku ?? product.slug,
            brand: { "@type": "Brand", name: product.brand },
            category: product.category?.name,
            offers: [
              ...product.variants
              .filter((variant) => variant.price_minor > 0 && variant.status !== "archived")
              .map((variant) => ({
                "@type": "Offer",
                sku: variant.sku,
                name: variant.name,
                price: (variant.price_minor / 100).toFixed(2),
                priceCurrency: variant.currency,
                availability: isOrderable(variant.status)
                  ? variant.status === "low_stock"
                    ? "https://schema.org/LimitedAvailability"
                    : "https://schema.org/InStock"
                  : variant.status === "coming_soon"
                    ? "https://schema.org/PreOrder"
                    : "https://schema.org/OutOfStock",
                url,
              })),
            ],
            seller: { "@type": "Organization", name: "MTDGC", url: `${SITE_URL}/` },
            itemCondition: "https://schema.org/NewCondition",
            hasMerchantReturnPolicy: {
              "@type": "MerchantReturnPolicy",
              applicableCountry: "NP",
              merchantReturnLink: `${SITE_URL}/policies/refunds`,
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org", "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
              { "@type": "ListItem", position: 2, name: "Catalog", item: `${SITE_URL}/catalog` },
              ...(product.category ? [{ "@type": "ListItem", position: 3, name: product.category.name, item: `${SITE_URL}/categories/${product.category.slug}` }] : []),
              { "@type": "ListItem", position: product.category ? 4 : 3, name: product.name, item: url },
            ],
          }),
        },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product, related, explore } = Route.useLoaderData();
  const { add, setDrawerOpen } = useCart();
  const defaultVariant = product!.variants.find((variant) => variant.is_default) ?? product!.variants[0];
  const [selectedSku, setSelectedSku] = useState(defaultVariant?.sku ?? "");
  const [fields, setFields] = useState<Record<string, string>>({});
  useEffect(() => {
    let saved: Record<string, string> = {};
    try { saved = JSON.parse(localStorage.getItem("mtdgc-fields-v1") ?? "{}"); } catch { /* ignore */ }
    const initial: Record<string, string> = {};
    for (const r of product.requirements) if (saved[r]) initial[r] = saved[r];
    setFields((c) => ({ ...initial, ...c }));
    void (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;
      const { data: p } = await supabase.from("profiles").select("delivery_email").eq("id", data.user.id).maybeSingle();
      const mail = p?.delivery_email || data.user.email;
      if (!mail) return;
      setFields((c) => {
        const n = { ...c };
        for (const r of product.requirements) if (/email/i.test(r) && !n[r]) n[r] = mail;
        return n;
      });
    })();
  }, [product.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const [error, setError] = useState<string | null>(null);
  const fieldRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [invalidFields, setInvalidFields] = useState<string[]>([]);

  if (!product) return null;
  const variant = product.variants.find((item) => item.sku === selectedSku) ?? defaultVariant;
  const orderable = isOrderable(product.status) && !!variant && isOrderable(variant.status);

  const addToCart = () => {
    if (!variant) return;
    const missing = product.requirements.filter((requirement) => !(fields[requirement] ?? "").trim());
    if (missing.length) {
      setError(`Please fill in: ${missing.join(", ")}.`);
      setInvalidFields(missing);
      fieldRefs.current[missing[0] ?? ""]?.focus();
      return;
    }
    setError(null);
    setInvalidFields([]);
    add({
      sku: variant.sku,
      productSlug: product.slug,
      productName: product.name,
      variantName: variant.name,
      priceMinor: variant.price_minor,
      image: product.image_url,
      region: product.region,
      categorySlug: product.category?.slug,
      fields,
    });
    setDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="focus:outline-none mx-auto max-w-6xl px-4 pb-16 pt-6">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Catalog", to: "/catalog" },
            ...(product.category ? [{ label: product.category.name, to: "/categories/$slug", params: { slug: product.category.slug } }] : []),
            { label: product.name },
          ]}
        />

        <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
          <div>
            <ProductArt product={product} priority sizes="(max-width: 768px) 100vw, 480px" className="rounded-2xl" />
          </div>

          <div>
            <p className="font-display text-[11px] uppercase tracking-[0.14em] text-primary">{product.brand}</p>
            <h1 className="mt-1 font-display text-[26px] font-medium md:text-4xl">{product.name}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{product.summary}</p>

            <div className="mt-3 flex min-h-6 flex-wrap gap-1">
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
              <fieldset className="mt-6 min-h-32">
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
              <div className="mt-6 min-h-40 space-y-3">
                <h2 className="font-display text-sm font-medium">What we need from you</h2>
                {product.requirements.map((requirement) => {
                  const help = requirementHelp(requirement);
                  const id = `req-${requirement.replace(/\W+/g, "-").toLowerCase()}`;
                  return (
                    <div key={requirement}>
                      <label htmlFor={id} className="font-display text-xs text-muted-foreground">{requirement}</label>
                      <input
                        ref={(node) => { fieldRefs.current[requirement] = node; }}
                        id={id}
                        aria-invalid={invalidFields.includes(requirement)}
                        aria-describedby={`${id}-help${invalidFields.includes(requirement) ? ` ${id}-error` : ""}`}
                        value={fields[requirement] ?? ""}
                        onChange={(event) => { const v = event.target.value; setFields((current) => ({ ...current, [requirement]: v })); try { const all = JSON.parse(localStorage.getItem("mtdgc-fields-v1") ?? "{}"); all[requirement] = v; localStorage.setItem("mtdgc-fields-v1", JSON.stringify(all)); } catch { /* ignore */ } }}
                        className="mt-1 h-10 w-full rounded-md border border-border bg-card px-3 font-display text-sm outline-none focus:border-primary"
                      />
                      {help && <p id={`${id}-help`} className="mt-1 text-xs text-muted-foreground">{help}</p>}
                      {invalidFields.includes(requirement) && <p id={`${id}-error`} className="mt-1 text-xs text-destructive">This detail is required.</p>}
                    </div>
                  );
                })}
                <p className="text-xs text-muted-foreground">
                  MTDGC will never ask for your password, OTP or payment PIN.
                </p>
              </div>
            )}

            {variant?.status === "low_stock" && (
              <p className="mt-3 text-xs text-muted-foreground">Limited supply on this option. We confirm availability before you pay.</p>
            )}
            {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button size="lg" className="min-w-56 tabular-nums" disabled={!orderable} onClick={addToCart}>
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

            <section className="mt-8">
              <h2 className="font-display text-lg font-medium">Questions about this product</h2>
              <div className="mt-2 divide-y divide-border rounded-lg border border-border">
                {productFaqs(product).map((faq) => (
                  <details key={faq.q} className="p-3">
                    <summary className="cursor-pointer font-display text-sm font-medium">{faq.q}</summary>
                    <p className="mt-2 text-sm text-foreground/80">{faq.a}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-12" aria-labelledby="related-heading">
            <h2 id="related-heading" className="mb-4 font-display text-lg font-medium">Related products</h2>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
        {explore.length > 0 && (
          <section className="mt-10" aria-labelledby="explore-heading">
            <h2 id="explore-heading" className="mb-1 font-display text-lg font-medium">Also in the MTDGC catalog</h2>
            <p className="mb-4 text-sm text-muted-foreground">Products from other categories we currently sell.</p>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
              {explore.map((item) => (
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
