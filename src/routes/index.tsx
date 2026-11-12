import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, MessageCircle } from "lucide-react";
import { useMemo } from "react";

import { BuyerProtection } from "@/components/buyer-protection";
import { HeroCarousel, buildSlides } from "@/components/home/hero-carousel";
import { CategoryRail, ProductRail, SectionHeader, SeeAll } from "@/components/home/rails";
import { ProductArt } from "@/components/product-art";
import { TrustBand } from "@/components/trust-band";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { BRAND_DESCRIPTION, BRAND_FULL_NAME, BRAND_NAME, BRAND_TAGLINE, LOGO_ALT } from "@/lib/brand";
import { listCatalog } from "@/lib/catalog.functions";
import type { CatalogCategory, CatalogProduct } from "@/lib/catalog.functions";
import { SITE_URL, isOrderable, whatsappLink } from "@/lib/format";
import { LANDINGS } from "@/lib/landings";
import { bestDeal } from "@/lib/pricing";
import { canonicalLinks, faqLd } from "@/lib/seo";

const FAQS: [string, string][] = [
  [
    "How do I pay?",
    "Place the order on this site. Your order page shows the QR code or bank details for the NPR total. Pay that amount, then upload your payment confirmation. Delivery follows verification.",
  ],
  [
    "How fast is delivery?",
    "The listing states the delivery time to expect. Delivery follows payment verification. If an order passes that time, contact support with your order number.",
  ],
  [
    "Where do my key or account details appear?",
    "After delivery, check your order page and delivery email for your key, code or account details. Follow the activation instructions on the listing.",
  ],
  [
    "Do subscriptions renew on their own?",
    "Check the plan details on the listing for its duration and renewal terms. If those terms are not shown, ask support before ordering.",
  ],
  [
    "What if my key does not activate?",
    "Check the activation instructions and region on the listing. If it still does not work, contact support with your order number and the error message. Never send your password.",
  ],
];

export const Route = createFileRoute("/")({
  head: ({ loaderData }) => ({
    meta: [
      { title: `${BRAND_NAME} | ${BRAND_FULL_NAME}` },
      { name: "description", content: BRAND_DESCRIPTION },
      { property: "og:title", content: `${BRAND_NAME} | ${BRAND_FULL_NAME}` },
      { property: "og:description", content: BRAND_DESCRIPTION },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: `${SITE_URL}/og/mtdgc.png` },
      { property: "og:image:alt", content: LOGO_ALT },
      { name: "twitter:image", content: `${SITE_URL}/og/mtdgc.png` },
      { name: "twitter:title", content: `${BRAND_NAME} | ${BRAND_FULL_NAME}` },
      { name: "twitter:description", content: BRAND_DESCRIPTION },
    ],
    links: canonicalLinks(`${SITE_URL}/`),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Featured products from MTDGC",
          itemListElement: [...(loaderData?.products ?? [])]
            .filter((p) => p.featured_rank != null)
            .sort((a, b) => (a.featured_rank ?? 0) - (b.featured_rank ?? 0))
            .map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: p.name,
              url: `${SITE_URL}/products/${p.slug}`,
            })),
        }),
      },
      faqLd(FAQS.map(([q, a]) => ({ q, a }))),
    ],
  }),
  loader: async () => {
    try {
      return await listCatalog();
    } catch {
      return { products: [] as CatalogProduct[], categories: [] as CatalogCategory[] };
    }
  },
  component: Index,
});

function byRank(a: CatalogProduct, b: CatalogProduct) {
  const live = Number(isOrderable(b.status)) - Number(isOrderable(a.status));
  return live || (a.featured_rank ?? 999) - (b.featured_rank ?? 999) || a.name.localeCompare(b.name);
}

function PromoTile({ title, body, products, category }: { title: string; body: string; products: CatalogProduct[]; category: string }) {
  return (
    <Link
      to="/catalog"
      search={{ category }}
      className="group relative flex flex-1 items-center justify-between gap-3 overflow-hidden rounded-2xl border border-border bg-card px-5 py-4 hover:border-primary/50"
    >
      <div className="matrix-grid absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="relative min-w-0">
        <p className="font-display text-lg font-semibold">{title}</p>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{body}</p>
        <span className="mt-3 inline-block font-mono text-[11px] uppercase tracking-[0.14em] text-primary">Browse</span>
      </div>
      <div aria-hidden="true" className="relative h-[92px] w-[110px] shrink-0">
        {products.slice(0, 3).map((product, i) => (
          <div key={product.id} className={`absolute w-[72px] overflow-hidden rounded-lg border border-white/15 shadow-xl shadow-black/50 ${["-rotate-6", "rotate-3", "rotate-12"][i]}`} style={{ left: `${i * 16}px`, top: `${i * 6}px`, zIndex: 3 - i }}>
            <ProductArt product={product} sizes="72px" />
          </div>
        ))}
      </div>
    </Link>
  );
}

function Index() {
  const initial = Route.useLoaderData();
  const { data } = useQuery({
    queryKey: ["catalog"],
    queryFn: () => listCatalog(),
    initialData: initial,
    staleTime: 60_000,
  });

  const products = data?.products ?? [];
  const categories = data?.categories ?? [];
  const sorted = useMemo(() => [...products].sort(byRank), [products]);
  const popular = useMemo(() => sorted.slice(0, 10), [sorted]);
  const slides = useMemo(() => buildSlides(sorted), [sorted]);
  const deals = useMemo(() => sorted.filter((p) => isOrderable(p.status) && bestDeal(p)), [sorted]);
  const shelves = useMemo(
    () => categories.map((category) => ({ category, items: sorted.filter((p) => p.category?.slug === category.slug) })).filter((s) => s.items.length > 0),
    [categories, sorted],
  );
  const inCategory = (slug: string) => sorted.filter((p) => p.category?.slug === slug);
  const promoA = categories.find((c) => c.slug === "subscriptions");
  const promoB = categories.find((c) => c.slug === "gift-cards") ?? categories.find((c) => c.slug === "software");

  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <SiteHeader />

      <main id="main-content" tabIndex={-1} className="focus:outline-none pb-16">
        <div className="mx-auto max-w-6xl px-4 pt-3 md:pt-6">
          <header>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">{BRAND_FULL_NAME}</p>
            <h1 className="mt-1 font-display text-[1.75rem] font-semibold leading-none tracking-tight md:text-4xl">{BRAND_NAME}</h1>
            <p className="mt-2 max-w-[40ch] text-sm leading-snug text-foreground/85">{BRAND_TAGLINE} Prices in NPR, with an Australian dollar guide.</p>
          </header>
          <nav aria-label="Popular guides" className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {LANDINGS.map((landing) => (
              <Link key={landing.slug} to="/guides/$slug" params={{ slug: landing.slug }} className="shrink-0 rounded-full border border-border bg-card px-3 py-1.5 font-display text-xs text-foreground/85">
                {landing.h1}
              </Link>
            ))}
          </nav>

          <div className="mt-3 grid gap-3 md:mt-4 md:grid-cols-[2fr_1fr]">
            {slides.length > 0 && <HeroCarousel slides={slides} />}
            <div className="hidden flex-col gap-3 pb-6 md:flex">
              {promoA && <PromoTile title={promoA.name} body={promoA.description || `Browse ${promoA.name.toLowerCase()} priced in NPR.`} products={inCategory(promoA.slug)} category={promoA.slug} />}
              {promoB && <PromoTile title={promoB.name} body={promoB.description || `Browse ${promoB.name.toLowerCase()} priced in NPR.`} products={inCategory(promoB.slug)} category={promoB.slug} />}
            </div>
          </div>

          <div className="mt-4 md:mt-2">
            <CategoryRail categories={categories} />
          </div>
        </div>

        {popular.length > 0 && (
          <section aria-labelledby="popular-heading" className="mx-auto max-w-6xl px-4 pt-5 md:pt-10">
            <SectionHeader title="Popular right now" action={<SeeAll to="/catalog" />} />
            <h2 id="popular-heading" className="sr-only">Popular right now</h2>
            <ProductRail products={popular} priorityCount={3} />
          </section>
        )}

        {deals.length > 0 && (
          <section className="mx-auto max-w-6xl px-4 pt-8 md:pt-12">
            <SectionHeader title="Deals" subtitle="Real price drops on items you can order today." />
            <ProductRail products={deals} />
          </section>
        )}

        {shelves.map(({ category, items }) => (
          <section key={category.slug} className="mx-auto max-w-6xl px-4 pt-8 md:pt-12">
            <SectionHeader
              title={category.name}
              subtitle={category.description || undefined}
              action={<SeeAll to="/catalog" search={{ category: category.slug }} label={`See all ${items.length}`} />}
            />
            <ProductRail products={items.slice(0, 12)} />
          </section>
        ))}

        <TrustBand />

        <section className="mx-auto max-w-6xl px-4 py-7">
          <h2 className="mb-5 font-display text-[17px] font-medium md:text-2xl">How it works</h2>
          <ol className="grid gap-4 md:grid-cols-3">
            {[
              ["1", "Choose a product", "Pick a game top-up, subscription or gift card and select the option you want."],
              ["2", "Enter your details", "Add the player ID or delivery email the product needs."],
              ["3", "Pay and receive", "Pay by QR code or bank transfer, upload your screenshot, and we deliver after checking it."],
            ].map(([number, title, text]) => (
              <li key={number} className="flex gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-foreground font-display text-xs text-background">
                  {number}
                </span>
                <div>
                  <h3 className="font-display text-sm font-medium">{title}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-4 py-7">
            <h2 className="mb-2 font-display text-[17px] font-medium md:text-2xl">Frequently asked</h2>
            {FAQS.map(([question, answer]) => (
              <details key={question} className="group border-b border-border" open>
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between py-4 text-left font-display text-sm font-medium [&::-webkit-details-marker]:hidden">
                  {question}
                  <ChevronDown className="size-4 shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="pb-4 pr-6 text-sm text-muted-foreground">{answer}</p>
              </details>
            ))}
            <Link to="/faq" className="mt-4 inline-block font-display text-xs text-primary hover:underline">
              Read the full FAQ
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pt-6">
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-6">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
              <MessageCircle className="size-5" />
            </span>
            <div className="min-w-0">
              <h2 className="font-display text-[15px] font-medium">Questions before you order?</h2>
              <p className="text-xs text-muted-foreground">Our support team can help before you place an order.</p>
            </div>
            <Button asChild variant="primary" size="sm" className="ml-auto">
              {whatsappLink() ? (
                <a href={whatsappLink()!} target="_blank" rel="noreferrer">Message</a>
              ) : (
                <Link to="/support">Get help</Link>
              )}
            </Button>
          </div>
          </div>
        </section>
      </main>

      <BuyerProtection />
      <SiteFooter />
    </div>
  );
}
