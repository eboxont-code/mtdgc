import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, MessageCircle, Search, ArrowUpRight, MonitorCog, Repeat, Tag, Gift, Gamepad2 } from "lucide-react";
import { useMemo, useState } from "react";

import { ProductCard } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { listCatalog } from "@/lib/catalog.functions";
import { SITE_URL, whatsappLink } from "@/lib/format";

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
          "Software licences and subscriptions in Nepal, plus digital deals and gift cards, with game top-ups too. Priced in NPR with on-site order tracking.",
      },
      { property: "og:title", content: "MTDGC | Nepal's Digital Marketplace" },
      {
        property: "og:description",
        content: "Software licences and subscriptions in Nepal, plus deals, gift cards and game top-ups. Priced in NPR.",
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
  const [heroQuery, setHeroQuery] = useState("");
  const navigate = Route.useNavigate();

  const visible = useMemo(() => {
    const sorted = [...products].sort(
      (a, b) => (a.featured_rank ?? 999) - (b.featured_rank ?? 999) || a.name.localeCompare(b.name),
    );
    return activeCategory === "all" ? sorted : sorted.filter((p) => p.category?.slug === activeCategory);
  }, [products, activeCategory]);

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MTDGC",
    alternateName: "Matrix Digital Goods & Commerce",
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
        <section className="future-hero border-b border-border">
          <div className="brand-line" />
          <div className="mx-auto max-w-6xl px-4 pb-8 pt-12 md:pb-12 md:pt-20">
            <div>
              <p className="mb-2 font-display text-[11px] uppercase tracking-[0.16em] text-primary">
                MTDGC / Nepal&apos;s Digital Marketplace
              </p>
              <h1 className="max-w-3xl font-display text-[36px] font-semibold leading-tight md:text-6xl">
                Software and subscriptions,<br className="hidden md:block" /> <span className="brand-text">delivered in Nepal.</span>
              </h1>
              <p className="mt-2 max-w-[46ch] text-[15px] text-foreground/70 md:text-lg">
                Explore software licences, subscriptions and digital goods. Prices in NPR.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button asChild size="lg">
                  <Link to="/catalog">Browse the catalog</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/how-it-works">How ordering works</Link>
                </Button>
              </div>
              <form className="glass-surface mt-8 flex max-w-2xl items-center gap-3 rounded-2xl p-2" onSubmit={(event) => { event.preventDefault(); void navigate({ to: "/catalog", search: { q: heroQuery.trim() } }); }}>
                <Search className="ml-2 size-5 shrink-0 text-primary" />
                <label htmlFor="home-search" className="sr-only">Search the catalog</label>
                <input id="home-search" value={heroQuery} onChange={(event) => setHeroQuery(event.target.value)} placeholder="Search software, subscriptions…" className="h-12 min-w-0 flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground" />
                <Button type="submit" size="icon" aria-label="Search"><ArrowUpRight className="size-5" /></Button>
              </form>
              <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-5">
                {[
                  { slug: "software", name: "Software", icon: MonitorCog },
                  { slug: "subscriptions", name: "Subscriptions", icon: Repeat },
                  { slug: "deals", name: "Deals", icon: Tag },
                  { slug: "gift-cards", name: "Gift cards", icon: Gift },
                  { slug: "game-top-ups", name: "Game top-ups", icon: Gamepad2 },
                ].map(({ slug, name, icon: Icon }) => <Link key={slug} to="/catalog" search={{ category: slug }} className="category-tile glass-surface flex min-h-24 flex-col justify-center gap-3 rounded-2xl p-4 font-display text-sm"><Icon className="size-6 text-primary" />{name}</Link>)}
              </div>
            </div>


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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
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
                <Button variant="ghost"
                  className="flex w-full items-center justify-between py-4 text-left font-display text-sm font-medium"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  aria-expanded={openFaq === index}
                >
                  {question}
                  <ChevronDown className={`size-4 transition-transform ${openFaq === index ? "rotate-180" : ""}`} />
                </Button>
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
              <p className="text-xs text-background/60">Our support team can help before you place an order.</p>
            </div>
            <Button asChild variant="primary" size="sm" className="ml-auto">
              {whatsappLink() ? (
                <a href={whatsappLink()!} target="_blank" rel="noreferrer">Message</a>
              ) : (
                <Link to="/support">Get help</Link>
              )}
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
