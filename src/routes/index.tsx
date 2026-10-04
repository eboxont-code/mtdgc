import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, MessageCircle } from "lucide-react";
import { useMemo, useState } from "react";

import { ProductCard, lowestPrice } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { listCatalog, type CatalogProduct } from "@/lib/catalog.functions";
import { formatNpr, SITE_URL, whatsappLink } from "@/lib/format";

const FAQS = [
  [
    "How quickly will I receive my order?",
    "Delivery time depends on the product. Each product page shows its delivery method and the time we can commit to. Our team confirms your order before anything is charged.",
  ],
  [
    "What details do I need to give?",
    "Game top-ups usually need your player ID and in-game name. Subscriptions and gift cards need a delivery email. The product page lists exactly what we ask for.",
  ],
  [
    "How do I pay?",
    "There is no card checkout on this site. You send your order for confirmation, we check availability, then we send payment instructions on WhatsApp.",
  ],
  [
    "Can I get help with an order?",
    "Yes. Message us on WhatsApp with your order number, or open a request from the support page.",
  ],
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MTDGC | Nepal's Digital Marketplace" },
      {
        name: "description",
        content:
          "MTDGC, Modern Tech Digital Goods & Commerce. Game top-ups, gift cards and subscriptions delivered digitally across Nepal, priced in NPR.",
      },
      { property: "og:title", content: "MTDGC | Nepal's Digital Marketplace" },
      {
        property: "og:description",
        content: "Modern Tech Digital Goods & Commerce. Game top-ups, gift cards and subscriptions for Nepal.",
      },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
  }),
  loader: () => listCatalog(),
  component: Index,
});

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
  const [activeCategory, setActiveCategory] = useState("all");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const visible = useMemo(() => {
    const sorted = [...products].sort(
      (a, b) => (a.featured_rank ?? 999) - (b.featured_rank ?? 999) || a.name.localeCompare(b.name),
    );
    return activeCategory === "all" ? sorted : sorted.filter((p) => p.category?.slug === activeCategory);
  }, [products, activeCategory]);

  const feature: CatalogProduct | undefined =
    products.find((p) => p.slug === "pubg-mobile-uc") ?? visible[0] ?? products[0];
  const featurePrice = feature ? lowestPrice(feature) : null;

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MTDGC",
    alternateName: "Modern Tech Digital Goods & Commerce",
    url: `${SITE_URL}/`,
    description: "Digital commerce company in Nepal selling game top-ups, gift cards and subscriptions.",
    logo: `${SITE_URL}/og/mtdgc.png`,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: `${SITE_URL}/support`,
      availableLanguage: ["English", "Nepali"],
    },
  };
  const siteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "MTDGC",
    url: `${SITE_URL}/`,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/catalog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }} />
      <SiteHeader />

      <main id="main-content" tabIndex={-1} className="focus:outline-none pb-16">
        <section className="border-b border-border bg-panel">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-7 md:grid-cols-[1fr_0.8fr] md:items-center md:py-14">
            <div>
              <p className="mb-2 font-display text-[11px] uppercase tracking-[0.16em] text-primary">
                Nepal&apos;s Digital Marketplace
              </p>
              <h1 className="max-w-xl font-display text-[34px] font-medium leading-tight md:text-6xl">
                Digital goods, delivered after a quick check.
              </h1>
              <p className="mt-2 max-w-[46ch] text-[15px] text-foreground/70 md:text-lg">
                MTDGC is a digital commerce company serving Nepal. We start with game top-ups, gift cards and
                subscriptions, and we keep adding product lines.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button asChild size="lg">
                  <Link to="/catalog">Browse the catalog</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/how-it-works">How ordering works</Link>
                </Button>
                <span className="font-display text-xs text-muted-foreground">
                  {products.length} {products.length === 1 ? "product" : "products"} live
                </span>
              </div>
            </div>

            {feature ? (
              <div className="rounded-lg bg-background p-3 ring-1 ring-foreground/5">
                <div className="flex gap-3">
                  {feature.image_url ? (
                    <img
                      src={feature.image_url}
                      alt={feature.name}
                      width={96}
                      height={96}
                      className="size-16 shrink-0 rounded-md object-cover md:size-24"
                    />
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-[10px] uppercase tracking-[0.12em] text-primary">Popular choice</p>
                    <div className="mt-1 flex items-baseline justify-between gap-2">
                      <h2 className="font-display text-[15px] font-medium md:text-xl">{feature.name}</h2>
                      {featurePrice !== null ? (
                        <span className="shrink-0 font-display text-[15px] font-semibold">
                          From {formatNpr(featurePrice)}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{feature.summary}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button asChild variant="ink" className="flex-1" size="sm">
                    <Link to="/products/$slug" params={{ slug: feature.slug }}>
                      View options
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/catalog">All products</Link>
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <section id="catalog" className="mx-auto max-w-6xl bg-background pt-5">
          <div className="scrollbar-hidden flex gap-2.5 overflow-x-auto px-4 pb-1">
            <Button
              variant={activeCategory === "all" ? "ink" : "outline"}
              size="sm"
              className="shrink-0"
              onClick={() => setActiveCategory("all")}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category.slug}
                variant={activeCategory === category.slug ? "ink" : "outline"}
                size="sm"
                className="shrink-0"
                onClick={() => setActiveCategory(category.slug)}
              >
                {category.name}
              </Button>
            ))}
          </div>
          <div className="px-4 py-6">
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="font-display text-[17px] font-medium md:text-2xl">Popular right now</h2>
              <Link to="/catalog" className="font-display text-xs text-primary hover:underline">
                Search and filter everything
              </Link>
            </div>
            {visible.length ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
                {visible.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-border py-12 text-center">
                <p className="font-display font-medium">No products in this category yet</p>
                <Button variant="ghost" size="sm" className="mt-2" onClick={() => setActiveCategory("all")}>
                  Show everything
                </Button>
              </div>
            )}
          </div>
        </section>

        <section className="border-y border-border bg-panel">
          <div className="mx-auto grid max-w-6xl grid-cols-3 divide-x divide-border px-4 py-5 text-center">
            <div>
              <p className="font-display text-sm font-semibold text-primary">Digital</p>
              <p className="text-[10px] text-muted-foreground">Delivered to your account</p>
            </div>
            <div>
              <p className="font-display text-sm font-semibold text-primary">Checked</p>
              <p className="text-[10px] text-muted-foreground">Confirmed before you pay</p>
            </div>
            <div>
              <p className="font-display text-sm font-semibold text-primary">Reachable</p>
              <p className="text-[10px] text-muted-foreground">Real people on WhatsApp</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-7">
          <h2 className="mb-5 font-display text-[17px] font-medium md:text-2xl">How it works</h2>
          <ol className="grid gap-4 md:grid-cols-3">
            {[
              ["1", "Choose a product", "Pick a game top-up, subscription or gift card and select the option you want."],
              ["2", "Enter your details", "Add the player ID or delivery email the product needs."],
              ["3", "Confirm and receive", "We confirm availability, send payment instructions, then deliver."],
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
          <p className="mt-4 text-xs text-muted-foreground">
            MTDGC will never ask you for your password, OTP or payment PIN.
          </p>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-4 py-7">
            <h2 className="mb-2 font-display text-[17px] font-medium md:text-2xl">Frequently asked</h2>
            {FAQS.map(([question, answer], index) => (
              <div key={question} className="border-b border-border">
                <button
                  className="flex w-full items-center justify-between py-4 text-left font-display text-sm font-medium"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  aria-expanded={openFaq === index}
                >
                  {question}
                  <ChevronDown className={`size-4 transition-transform ${openFaq === index ? "rotate-180" : ""}`} />
                </button>
                {openFaq === index ? <p className="pb-4 pr-6 text-sm text-muted-foreground">{answer}</p> : null}
              </div>
            ))}
            <Link to="/faq" className="mt-4 inline-block font-display text-xs text-primary hover:underline">
              Read the full FAQ
            </Link>
          </div>
        </section>

        <section className="bg-foreground text-background">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-6">
            <span className="grid size-10 shrink-0 place-items-center rounded-md bg-brand-soft">
              <MessageCircle className="size-5" />
            </span>
            <div className="min-w-0">
              <h2 className="font-display text-[15px] font-medium">Questions before you order?</h2>
              <p className="text-xs text-background/60">Chat with the MTDGC team on WhatsApp.</p>
            </div>
            <Button asChild variant="primary" size="sm" className="ml-auto">
              <a href={whatsappLink()} target="_blank" rel="noreferrer">
                Message
              </a>
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
