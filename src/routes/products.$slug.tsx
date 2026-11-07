import { supabase } from "@/integrations/supabase/client";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { Check, Clock, Globe, MessageCircle, ShieldCheck, ShoppingBag, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductArt } from "@/components/product-art";
import { ProductRail, SectionHeader } from "@/components/home/rails";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { WishlistButton } from "@/components/wishlist-button";
import { getProductBySlug } from "@/lib/catalog.functions";
import { PRICE_COMING_SOON, pricesHidden } from "@/lib/price-visibility";
import { availabilityLabel, getRegionCompatibilityWarning } from "@/lib/product-availability";
import { useCart } from "@/lib/cart";
import { categoryTypeFromSlug, formatNpr, isOrderable, SITE_URL, SUPPORT_MESSAGE, whatsappLink } from "@/lib/format";
import { enabledProviders } from "@/lib/payments";
import { compareAt } from "@/lib/pricing";
import { GIFT_CARD_PRICE_DISCLOSURE, isGiftCardCategory } from "@/lib/gift-card-pricing";
import { productFaqs, requirementHelp } from "@/lib/product-help";
import { AccordionList } from "@/components/sections/accordion-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/products/$slug")({
  validateSearch: (search: Record<string, unknown>): { plan?: string | undefined } => ({
    plan: typeof search['plan'] === "string" ? search['plan'] : undefined,
  }),
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
    const title = product.seo_title?.trim() || `${product.name} price in Nepal | MTDGC`;
    const image = product.image_url ? (product.image_url.startsWith("http") ? product.image_url : `${SITE_URL}${product.image_url}`) : undefined;
    const hidePrices = pricesHidden(product);
    const prices = hidePrices ? [] : product.variants.filter((variant) => variant.price_minor > 0 && variant.status !== "archived").map((variant) => variant.price_minor);
    const lowestPrice = prices.length ? Math.min(...prices) : 0;
    return {
      meta: [
        { title },
        { name: "description", content: product.seo_description },
        { property: "og:title", content: title },
        { property: "og:description", content: product.seo_description },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: product.seo_description  },
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
        ...(lowestPrice > 0 ? [
          { property: "product:price:amount", content: (lowestPrice / 100).toFixed(2) },
          { property: "product:price:currency", content: "NPR" },
        ] : []),
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
            ...(hidePrices ? {} : { offers: [
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
            ] }),
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
  const defaultVariant = product.variants.find((variant) => variant.is_default) ?? product.variants[0];
  const { plan } = Route.useSearch();
  const selectedSku = product.variants.some((item) => item.sku === plan) ? plan : defaultVariant?.sku ?? "";
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

  const variant = product.variants.find((item) => item.sku === selectedSku) ?? defaultVariant;
  const hidePrices = pricesHidden(product);
  const orderable = !hidePrices && isOrderable(product.status) && !!variant && isOrderable(variant.status) && variant.price_minor > 0;
  const selectedAvailability = variant
    ? availabilityLabel({ ...product, variants: [variant] })
    : availabilityLabel(product);

  const regionText = product.region?.trim() ?? "";
  const regionWarning = getRegionCompatibilityWarning(regionText);
  const needsRegionConfirm = Boolean(regionWarning);
  const regionConfirmationKey = `${product.id}:${regionText}`;
  const [confirmedRegionKey, setConfirmedRegionKey] = useState("");
  const regionConfirmed = confirmedRegionKey === regionConfirmationKey;
  const regionRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const addToCart = (buyNow = false) => {
    if (!variant || !orderable) return;
    if (needsRegionConfirm && !regionConfirmed) {
      setError("Please confirm the listed region before continuing.");
      regionRef.current?.focus();
      return;
    }
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
    if (buyNow) void navigate({ to: "/checkout" });
    else setDrawerOpen(true);
  };

  const hasDetails = product.requirements.length > 0;
  const packStep = hasDetails ? 2 : 1;
  const payStep = packStep + 1;
  const wa = whatsappLink(`${SUPPORT_MESSAGE} with ${product.name}`);
  const providers = enabledProviders();
  const variantWas = variant ? compareAt(variant) : null;
  const productType = categoryTypeFromSlug(product.category?.slug ?? "");
  const isPlan = productType === "software" || productType === "subscription";
  const isGiftCard = isGiftCardCategory(product.category?.slug);
  const deliveryTime = product.delivery_time.trim() === "Confirmed after order review" ? "" : product.delivery_time.trim();
  const deliveryMethod = product.delivery_method.trim() === "Confirmed after order review" ? "" : product.delivery_method.trim();

  const purchaseDetails = [
    { label: "Region", value: product.region?.trim() },
    { label: "Platform", value: product.platform?.trim() },
    { label: "Delivery method", value: deliveryMethod },
    { label: "Required customer details", value: product.requirements.map((item) => item.trim()).filter(Boolean).join(", ") },
  ].filter((item) => item.value);
  const purchaseDetailsBlock = purchaseDetails.length > 0 ? (
    <dl aria-label="Product purchase details" className="grid min-w-0 grid-cols-2 gap-x-3 gap-y-2 border-t border-border pt-3 text-xs">
      {purchaseDetails.map((item) => (
        <div key={item.label} className="min-w-0">
          <dt className="text-muted-foreground">{item.label}</dt>
          <dd className="mt-0.5 leading-snug [overflow-wrap:anywhere]">{item.value}</dd>
        </div>
      ))}
    </dl>
  ) : null;

  const StepTitle = ({ n, children }: { n: number; children: React.ReactNode }) => (
    <h2 className="flex items-center gap-2.5 font-display text-[16px] font-semibold md:text-lg">
      <span className="grid size-7 place-items-center rounded-full border border-primary/50 bg-primary/10 font-mono text-xs font-bold text-primary">{n}</span>
      {children}
    </h2>
  );

  const trust = (
    <ul className="space-y-2 text-[13px] text-foreground/85">
      <li className="flex gap-2"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />We verify your payment and deliver once it is checked.</li>
      <li className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-primary" /><span>Refunds follow our <Link to="/policies/refunds" className="text-primary underline-offset-2 hover:underline">refund policy</Link>.</span></li>
      {wa && <li className="flex gap-2"><MessageCircle className="mt-0.5 size-4 shrink-0 text-primary" /><span>Questions first? <a href={wa} target="_blank" rel="noopener noreferrer" className="text-primary underline-offset-2 hover:underline">Ask on WhatsApp</a>.</span></li>}
    </ul>
  );

  const addLabel = product.category?.slug === "gift-cards" ? "Get gift card" : product.category?.slug === "subscriptions" ? "Get subscription" : "Add to cart";

  const comingSoon = (
    <Button size="lg" variant="outline" className="flex-1" disabled aria-disabled="true">{selectedAvailability}</Button>
  );

  const actions = !orderable ? <div className="flex gap-2">{comingSoon}</div> : (
    <div className="flex gap-2">
      <Button variant="outline" size="lg" className="flex-1" disabled={!orderable} onClick={() => addToCart(false)}>
        <ShoppingBag className="size-4" /> {addLabel}
      </Button>
      <Button size="lg" className="flex-1" disabled={!orderable} onClick={() => addToCart(true)}>
        {orderable ? "Buy now" : "Not open yet"}
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="focus:outline-none mx-auto max-w-6xl px-4 pb-72 pt-3 md:pb-16 md:pt-6">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Catalog", to: "/catalog" },
            ...(product.category ? [{ label: product.category.name, to: "/categories/$slug", params: { slug: product.category.slug } }] : []),
            { label: product.name },
          ]}
        />

        <div className="grid gap-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-10">
          {/* Left: art and, on desktop, the sticky order summary */}
          <div className="md:sticky md:top-32 md:self-start">
            <div className="flex gap-4 md:block">
              <div className="w-[38%] shrink-0 overflow-hidden rounded-2xl border border-border md:w-full">
                <ProductArt product={product} priority sizes="(max-width: 768px) 40vw, 440px" />
              </div>
              <div className="min-w-0 md:hidden">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary">{product.brand}</p>
                <h1 className="mt-1 font-display text-[22px] font-semibold leading-tight">{product.name}</h1>
                <p className="mt-1 line-clamp-3 text-[13px] text-muted-foreground">{product.summary}</p>
              </div>
            </div>

            <div className="mt-5 hidden rounded-2xl border border-border bg-card p-5 md:block">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Order summary</p>
              <div className="mt-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">{isGiftCard ? "Face value / denomination" : "Selected option"}</p>
                  <p className="mt-1 font-display text-sm">{variant?.name ?? "Choose an option"}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">{isGiftCard ? "MTDGC selling price" : "Price"}</p>
                  <p className="font-mono text-xl font-bold text-price">
                    {hidePrices ? PRICE_COMING_SOON : variant ? formatNpr(variant.price_minor) : ""}
                    {!hidePrices && variantWas && <span className="ml-2 text-sm font-normal text-muted-foreground line-through">{formatNpr(variantWas)}</span>}
                  </p>
                </div>
              </div>
              {deliveryTime && <p className="mt-1 text-xs text-muted-foreground">{deliveryTime}</p>}
              {purchaseDetailsBlock && <div className="mt-3">{purchaseDetailsBlock}</div>}
              <div className="mt-4">{actions}</div>
              <div className="mt-4 border-t border-border pt-4">{trust}</div>
            </div>
          </div>

          {/* Right: details and steps */}
          <div className="min-w-0">
            <div className="hidden md:block">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary">{product.brand}</p>
              <h1 className="mt-1 font-display text-4xl font-semibold">{product.name}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{product.summary}</p>
            </div>

            <ul className="mt-1 flex flex-wrap gap-1.5 md:mt-4">
              <li className={`rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] ${orderable ? "border-primary/40 text-primary" : "border-warn/40 text-warn"}`}>{selectedAvailability}</li>
              {!isPlan && deliveryMethod && <li className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px]"><Zap className="size-3.5 text-primary" />{deliveryMethod}</li>}
              {!isPlan && product.region && <li className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px]"><Globe className="size-3.5 text-primary" />{product.region}</li>}
              {!isPlan && deliveryTime && <li className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px]"><Clock className="size-3.5 text-primary" />{deliveryTime}</li>}
              {!isPlan && product.platform && <li className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px]">{product.platform}</li>}
            </ul>
            {regionWarning && (
              <section role="note" aria-label="Regional compatibility warning" className="mt-4 rounded-2xl border border-warn/40 bg-warn/5 p-4">
                <p className="flex gap-2 text-sm">
                  <Globe className="mt-0.5 size-4 shrink-0 text-warn" />
                  <span><strong className="font-semibold">Check regional compatibility before paying.</strong> {regionWarning.message}</span>
                </p>
                {orderable && (
                  <label className="mt-3 flex min-h-11 cursor-pointer items-center gap-3 text-sm">
                    <input
                      ref={regionRef}
                      type="checkbox"
                      required
                      checked={regionConfirmed}
                      onChange={(event) => {
                        setConfirmedRegionKey(event.target.checked ? regionConfirmationKey : "");
                        if (event.target.checked) setError(null);
                      }}
                      className="size-5 shrink-0 accent-primary"
                    />
                    <span>{regionWarning.confirmationLabel}</span>
                  </label>
                )}
              </section>
            )}
            {isPlan && (deliveryMethod || deliveryTime) && (
              <dl className="mt-4 space-y-2 text-sm">
                {deliveryMethod && <div className="grid grid-cols-1 gap-1 sm:grid-cols-2"><dt className="text-muted-foreground">You receive</dt><dd>{deliveryMethod}</dd></div>}
                {deliveryTime && <div className="grid grid-cols-1 gap-1 sm:grid-cols-2"><dt className="text-muted-foreground">Delivery</dt><dd>{deliveryTime}</dd></div>}
              </dl>
            )}

            {hasDetails && (
              <section className="mt-6 rounded-2xl border border-border bg-card p-4 md:p-5">
                <StepTitle n={1}>Your details</StepTitle>
                <div className="mt-4 space-y-3">
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
                          className="mt-1 h-11 w-full rounded-xl border border-border bg-secondary px-3 font-mono text-sm outline-none focus:border-primary aria-[invalid=true]:border-destructive"
                        />
                        {help && <p id={`${id}-help`} className="mt-1 text-xs text-muted-foreground">{help}</p>}
                        {invalidFields.includes(requirement) && <p id={`${id}-error`} className="mt-1 text-xs text-destructive">This detail is required.</p>}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {product.variants.length > 0 && (
              <section className="mt-4 rounded-2xl border border-border bg-card p-4 md:p-5">
                <fieldset>
                  <legend className="contents"><StepTitle n={packStep}>{isGiftCard ? "Choose a denomination" : "Choose an option"}</StepTitle></legend>
                  <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {product.variants.map((item) => {
                      const selected = selectedSku === item.sku;
                      const was = compareAt(item);
                      const itemAvailability = availabilityLabel({ ...product, variants: [item] });
                      return (
                        <label
                          key={item.sku}
                          className={`relative flex cursor-pointer flex-col gap-1 rounded-xl border p-3 transition-colors ${selected ? "border-primary bg-primary/10" : "border-border bg-secondary/60 hover:border-primary/40"}`}
                        >
                          <input type="radio" name="variant" value={item.sku} checked={selected} onChange={() => void navigate({ to: "/products/$slug", params: { slug: product.slug }, search: (previous) => ({ ...previous, plan: item.sku }), replace: true })} className="sr-only" />
                          {selected && <Check className="absolute right-2 top-2 size-4 text-primary" aria-hidden="true" />}
                          <span className="pr-5 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">{isGiftCard ? "Face value" : "Option"}</span>
                          <span className="pr-5 font-mono text-[13px] font-medium leading-tight">{item.name}</span>
                          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">{isGiftCard ? "MTDGC selling price" : "Price"}</span>
                          <span className="font-mono text-sm font-bold text-price">{hidePrices ? PRICE_COMING_SOON : formatNpr(item.price_minor)}</span>
                          {!hidePrices && was && <span className="font-mono text-[11px] text-muted-foreground line-through">{formatNpr(was)}</span>}
                          {item.status === "low_stock" && <span className="font-mono text-[10px] uppercase text-warn">Limited</span>}
                          <span className="font-mono text-[10px] text-muted-foreground">{itemAvailability}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
                {isGiftCard && <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{GIFT_CARD_PRICE_DISCLOSURE}</p>}
                {variant?.status === "low_stock" && (
                  <p className="mt-3 text-xs text-muted-foreground">Limited supply on this option. If it runs out after you order, we tell you and refund your payment.</p>
                )}
              </section>
            )}

            <section className="mt-4 rounded-2xl border border-border bg-card p-4 md:p-5">
              <StepTitle n={payStep}>How you pay</StepTitle>
              <ul className="mt-3 space-y-2">
                {providers.map((provider) => (
                  <li key={provider.id} className="rounded-xl border border-border bg-secondary/60 p-3">
                    <p className="font-display text-sm font-medium">{provider.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{provider.description}</p>
                  </li>
                ))}
              </ul>
              <ol aria-label="How manual payment works" className="mt-3 space-y-1.5 text-xs text-foreground/85">
                <li className="flex gap-2"><span className="font-mono text-primary">1.</span><span>Place your order. Checkout then shows our QR code or bank details.</span></li>
                <li className="flex gap-2"><span className="font-mono text-primary">2.</span><span>Pay the exact total in NPR, then upload your payment screenshot or transaction reference.</span></li>
                <li className="flex gap-2"><span className="font-mono text-primary">3.</span><span>We check the payment by hand and deliver your order once it is verified.</span></li>
              </ol>
            </section>

            {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}

            <div className="mt-5 hidden items-center gap-3 md:flex">
              <WishlistButton productId={product.id} />
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-card p-4 md:hidden">{trust}</div>

            <Tabs defaultValue="about" className="mt-6 rounded-2xl border border-border bg-card p-3 md:p-4">
              <TabsList className="grid h-auto w-full grid-cols-3 gap-1 bg-secondary/60 p-1">
                <TabsTrigger value="about" className="min-h-10 px-1 text-xs data-[state=active]:text-primary sm:text-sm">About</TabsTrigger>
                <TabsTrigger value="redeem" className="min-h-10 px-1 text-xs data-[state=active]:text-primary sm:text-sm">How to redeem</TabsTrigger>
                <TabsTrigger value="refund" className="min-h-10 px-1 text-xs data-[state=active]:text-primary sm:text-sm">Refunds</TabsTrigger>
              </TabsList>
              <TabsContent value="about" className="px-1 pt-2">
                <h2 className="sr-only">About this product</h2>
                <p className="text-sm text-foreground/80">{product.description}</p>
              </TabsContent>
              <TabsContent value="redeem" className="px-1 pt-2">
                <h2 className="sr-only">How to redeem</h2>
                {(product.redemption_instructions || deliveryMethod) && <p className="text-sm text-foreground/80">{product.redemption_instructions || deliveryMethod}</p>}
              </TabsContent>
              <TabsContent value="refund" className="px-1 pt-2">
                <h2 className="sr-only">Refund eligibility</h2>
                <p className="text-sm text-foreground/80">{product.refund_eligibility}</p>
                <Link to="/policies/refunds" className="mt-2 inline-block text-xs text-primary underline-offset-2 hover:underline">Read the full refund policy</Link>
              </TabsContent>
            </Tabs>

            <section className="mt-6" aria-labelledby="product-questions">
              <h2 id="product-questions" className="font-display text-base font-semibold">Questions about this product</h2>
              <AccordionList
                className="mt-2"
                items={productFaqs(product).map((faq) => ({ id: faq.q, title: faq.q, content: <p>{faq.a}</p> }))}
              />
              <p className="mt-3 text-xs text-muted-foreground">
                Payment, delivery and refund basics are the same for every product. See{" "}
                <Link to="/how-it-works" className="text-primary underline-offset-2 hover:underline">how it works</Link>.
              </p>
            </section>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-12" aria-labelledby="related-heading">
            <h2 id="related-heading" className="sr-only">More like this</h2>
            <SectionHeader title="More like this" />
            <ProductRail products={related} />
          </section>
        )}
        {explore.length > 0 && (
          <section className="mt-10" aria-labelledby="explore-heading">
            <h2 id="explore-heading" className="sr-only">Also on MTDGC</h2>
            <SectionHeader title="Also on MTDGC" subtitle="Products from other categories." />
            <ProductRail products={explore} />
          </section>
        )}
      </main>

      {/* Sticky buy bar on phones */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-3 pb-[calc(0.6rem+env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-xl md:hidden">
        {purchaseDetailsBlock && <div className="mb-3 max-h-[25vh] overflow-y-auto">{purchaseDetailsBlock}</div>}
        <div className="flex items-center gap-2.5">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] text-muted-foreground">{isGiftCard ? "Face value: " + (variant?.name ?? "Choose a denomination") : variant?.name ?? "Choose an option"}</p>
            <p className={`font-mono font-bold leading-tight text-price ${hidePrices ? "text-[13px]" : "text-[15px]"}`}>{hidePrices ? PRICE_COMING_SOON : variant ? (isGiftCard ? "MTDGC price " : "") + formatNpr(variant.price_minor) : ""}</p>
          </div>
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp support (opens in a new tab)" className="grid size-11 shrink-0 place-items-center rounded-xl border border-border text-primary">
              <MessageCircle className="size-5" />
            </a>
          )}
          {!orderable ? (
            <Button variant="outline" className="h-11 shrink-0 px-5" disabled aria-disabled="true">{selectedAvailability}</Button>
          ) : (<>
          <Button variant="outline" className="h-11 shrink-0 px-3" disabled={!orderable} onClick={() => addToCart(false)} aria-label={addLabel}>
            <ShoppingBag className="size-4" />
          </Button>
          <Button className="h-11 shrink-0 px-5" disabled={!orderable} onClick={() => addToCart(true)}>
            {orderable ? "Buy now" : "Not open yet"}
          </Button>
          </>)}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
