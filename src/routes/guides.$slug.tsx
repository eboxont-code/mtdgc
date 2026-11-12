import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { BuyerProtection } from "@/components/buyer-protection";
import { ProductCard } from "@/components/product-card";
import { ResellerNotice } from "@/components/reseller-notice";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { BRAND_FULL_NAME, BRAND_NAME } from "@/lib/brand";
import { listCatalog } from "@/lib/catalog.functions";
import type { CatalogProduct } from "@/lib/catalog.functions";
import { SITE_URL } from "@/lib/format";
import { getLanding, LANDINGS, landingPath, type Landing } from "@/lib/landings";
import { breadcrumbLd, faqLd, pageLd, canonicalLinks } from "@/lib/seo";

function matchingProducts(landing: Landing, products: CatalogProduct[]) {
  if (landing.productSlugs.length) {
    const wanted = new Set(landing.productSlugs);
    const matched = products.filter((product) => wanted.has(product.slug));
    if (matched.length) return matched;
  }
  if (landing.categorySlug) return products.filter((product) => product.category?.slug === landing.categorySlug);
  return [];
}

export const Route = createFileRoute("/guides/$slug")({
  loader: async ({ params }) => {
    const landing = getLanding(params.slug);
    if (!landing) throw notFound();
    let products: CatalogProduct[] = [];
    try {
      const catalog = await listCatalog();
      products = matchingProducts(landing, catalog.products);
    } catch {
      products = [];
    }
    return { landing, products };
  },
  head: ({ params, loaderData }) => {
    const landing = loaderData?.landing ?? getLanding(params.slug);
    if (!landing) return { meta: [{ title: "Page not found | MTDGC" }, { name: "robots", content: "noindex" }] };
    const path = landingPath(landing.slug);
    const url = `${SITE_URL}${path}`;
    const products = loaderData?.products ?? [];
    return {
      meta: [
        { title: landing.title },
        { name: "description", content: landing.description },
        { property: "og:title", content: landing.title },
        { property: "og:description", content: landing.description },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        { property: "og:image", content: `${SITE_URL}/og/mtdgc.png` },
        { property: "og:image:alt", content: `${BRAND_NAME}, ${BRAND_FULL_NAME}` },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: landing.title },
        { name: "twitter:description", content: landing.description },
        { name: "twitter:image", content: `${SITE_URL}/og/mtdgc.png` },
        { name: "twitter:image:alt", content: `${BRAND_NAME}, ${BRAND_FULL_NAME}` },
      ],
      links: canonicalLinks(url ),
      scripts: [
        pageLd("WebPage", landing.h1, path, landing.description, {
          about: { "@type": "Organization", name: BRAND_NAME, legalName: BRAND_FULL_NAME },
        }),
        faqLd(landing.faqs),
        breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Guides", path: landingPath(LANDINGS[0]?.slug ?? landing.slug) },
          { name: landing.h1, path },
        ]),
        ...(products.length
          ? [{
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ItemList",
                name: landing.h1,
                itemListElement: products.map((product, index) => ({
                  "@type": "ListItem",
                  position: index + 1,
                  name: product.name,
                  url: `${SITE_URL}/products/${product.slug}`,
                })),
              }),
            }]
          : []),
      ],
    };
  },
  component: GuidePage,
});

function GuidePage() {
  const { landing, products } = Route.useLoaderData();
  const others = LANDINGS.filter((item) => item.slug !== landing.slug);
  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="focus:outline-none mx-auto max-w-3xl px-4 pb-16 pt-6">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: landing.h1 }]} />
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary">{BRAND_NAME} · {BRAND_FULL_NAME}</p>
        <h1 className="mt-1 font-display text-[26px] font-semibold leading-tight md:text-4xl">{landing.h1}</h1>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/85">
          {landing.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <ResellerNotice className="mt-4" />

        <section className="mt-8" aria-labelledby="guide-steps">
          <h2 id="guide-steps" className="font-display text-lg font-medium">How to order</h2>
          <ol className="mt-3 grid gap-3">
            {landing.steps.map((step, index) => (
              <li key={step.title} className="rounded-2xl border border-border bg-card p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary">Step {index + 1}</p>
                <h3 className="mt-1 font-display text-sm font-medium">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-8" aria-labelledby="guide-products">
          <h2 id="guide-products" className="font-display text-lg font-medium">On the MTDGC catalog</h2>
          {products.length ? (
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {products.map((product, index) => <ProductCard key={product.id} product={product} priority={index < 2} />)}
            </div>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {(landing.productSlugs.length ? landing.productSlugs : [landing.categorySlug === "gift-cards" ? "steam-wallet-code" : "free-fire-diamonds"]).map((slug) => (
                <li key={slug}>
                  <Link to="/products/$slug" params={{ slug }} className="text-primary underline underline-offset-4">Open the {slug.replace(/-/g, " ")} listing</Link>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-sm text-muted-foreground">Current packs, regions and delivery times are on each listing.</p>
        </section>

        <section className="mt-8" aria-labelledby="guide-faq">
          <h2 id="guide-faq" className="font-display text-lg font-medium">Questions</h2>
          <div className="mt-2 divide-y divide-border">
            {landing.faqs.map((faq) => (
              <details key={faq.q} className="group py-1" open>
                <summary className="min-h-11 cursor-pointer py-3 font-display text-sm font-medium">{faq.q}</summary>
                <p className="pb-3 text-sm text-muted-foreground">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        <nav aria-label="More guides" className="mt-8">
          <h2 className="font-display text-lg font-medium">More from MTDGC</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {others.map((item) => (
              <li key={item.slug}>
                <Link to="/guides/$slug" params={{ slug: item.slug }} className="text-primary underline underline-offset-4">{item.h1}</Link>
              </li>
            ))}
            <li><Link to="/policies/refunds" className="text-primary underline underline-offset-4">Refund policy</Link></li>
            <li><Link to="/support" className="text-primary underline underline-offset-4">Contact support</Link></li>
          </ul>
        </nav>
      </main>
      <BuyerProtection />
      <SiteFooter />
    </div>
  );
}
