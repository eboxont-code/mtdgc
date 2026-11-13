import { createFileRoute, Link } from "@tanstack/react-router";
import { SearchX, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { EmptyState } from "@/components/empty-state";
import { StorefrontError, StorefrontLoading } from "@/components/storefront-state";
import { ProductCard, lowestPrice } from "@/components/product-card";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { listCatalog } from "@/lib/catalog.functions";
import { catalogFacetOptions, compareCatalogProducts, matchesCatalogFacets, searchScore } from "@/lib/catalog-search";
import { SITE_URL } from "@/lib/format";
import { availabilityCounts, isComingSoon, isPurchasable, isUnavailable } from "@/lib/product-availability";
import { breadcrumbLd, itemListLd, canonicalLinks } from "@/lib/seo";

export const Route = createFileRoute("/catalog")({
  validateSearch: (search: Record<string, unknown>): { q?: string | undefined; category?: string | undefined; sort?: string | undefined; availability?: string | undefined; price?: string | undefined; platform?: string | undefined; region?: string | undefined } => ({
    q: typeof search["q"] === "string" ? (search["q"] as string) : undefined,
    category: typeof search["category"] === "string" ? search["category"] as string : undefined,
    sort: typeof search["sort"] === "string" ? search["sort"] as string : undefined,
    availability: typeof search["availability"] === "string" ? search["availability"] as string : undefined,
    price: typeof search["price"] === "string" ? search["price"] as string : undefined,
    platform: typeof search["platform"] === "string" ? (search["platform"] as string).slice(0, 80) : undefined,
    region: typeof search["region"] === "string" ? (search["region"] as string).slice(0, 80) : undefined,
  }),
  loader: () => listCatalog(),
  head: ({ loaderData }) => ({
    meta: [
      { title: "Catalog | MTDGC, Matrix Digital Goods & Commerce" },
      {
        name: "description",
        content:
          "Browse the MTDGC catalog of game top-ups, gift cards and subscriptions for Nepal and Australia. Prices in NPR, with an Australian dollar guide.",
      },
      { property: "og:title", content: "MTDGC catalog" },
      { property: "og:description", content: "Game top-ups, gift cards and subscriptions for Nepal and Australia, priced in NPR." },
      { name: "twitter:title", content: "MTDGC catalog"  },
      { name: "twitter:description", content: "Game top-ups, gift cards and subscriptions for Nepal and Australia, priced in NPR."  },
      { property: "og:url", content: `${SITE_URL}/catalog` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: `${SITE_URL}/og/mtdgc.png` },
      { property: "og:image:alt", content: "MTDGC, the digital marketplace for Nepal and Australia" },
      { name: "twitter:image", content: `${SITE_URL}/og/mtdgc.png` },
    ],
    links: canonicalLinks(`${SITE_URL}/catalog`),
    scripts: [
      itemListLd("MTDGC Catalog", "/catalog", "Digital goods sold by MTDGC in NPR.", (loaderData?.products ?? []).map((p) => ({ name: p.name, path: `/products/${p.slug}` }))),
      breadcrumbLd([{ name: "Home", path: "/" }, { name: "Catalog", path: "/catalog" }]),
    ],
  }),
  component: CatalogPage,
  pendingComponent: StorefrontLoading,
  errorComponent: StorefrontError,
});

const SORTS = [
  { id: "relevance", label: "Relevance" },
  { id: "price-asc", label: "Price low-high" },
  { id: "price-desc", label: "Price high-low" },
  { id: "availability", label: "Availability" },
  { id: "popular", label: "Popular" },
  { id: "newest", label: "Newest" },
] as const;

const PAGE_SIZE = 12;

function CatalogPage() {
  const { products, categories } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [query, setQuery] = useState((search.q ?? "").slice(0, 100));
  const [category, setCategory] = useState(search.category ?? "all");
  const sort = SORTS.find((item) => item.id === search.sort)?.id ?? "relevance";
  const [availability, setAvailability] = useState(search.availability ?? "all");
  const [price, setPrice] = useState(search.price ?? "all");
  const [platform, setPlatform] = useState(search.platform ?? "all");
  const [region, setRegion] = useState(search.region ?? "all");
  const [shown, setShown] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { setQuery((search.q ?? "").slice(0, 100)); }, [search.q]);
  useEffect(() => { setCategory(search.category ?? "all"); }, [search.category]);
  useEffect(() => { setAvailability(search.availability ?? "all"); setPrice(search.price ?? "all"); }, [search.availability, search.price]);
  useEffect(() => { setPlatform(search.platform ?? "all"); setRegion(search.region ?? "all"); }, [search.platform, search.region]);
  useEffect(() => { setShown(PAGE_SIZE); }, [query, category, sort, availability, price, platform, region]);

  const platformOptions = useMemo(() => catalogFacetOptions(products, "platform"), [products]);
  const regionOptions = useMemo(() => catalogFacetOptions(products, "region"), [products]);

  const visible = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesCategory = category === "all" || product.category?.slug === category;
      const matchesFacets = matchesCatalogFacets(product, { platform, region });
      const matchesAvailability = availability === "all" || (availability === "available" ? isPurchasable(product) : availability === "coming_soon" ? isComingSoon(product) : isUnavailable(product));
      const lowest = lowestPrice(product);
      const matchesPrice = price === "all" || (lowest !== null && (price === "under-1000" ? lowest < 100000 : price === "1000-3000" ? lowest >= 100000 && lowest <= 300000 : lowest > 300000));
      return matchesCategory && matchesFacets && matchesAvailability && matchesPrice && searchScore(product, query) > 0;
    });

    const sorted = [...filtered];
    sorted.sort((a, b) => compareCatalogProducts(a, b, sort, query, lowestPrice));
    return sorted;
  }, [products, query, category, availability, price, platform, region, sort]);

  const syncUrl = (next: Partial<{ q: string; category: string; sort: string; availability: string; price: string; platform: string; region: string }>) => {
    void navigate({
      search: (prev) => ({
        ...prev,
        ...(next.q !== undefined ? { q: next.q || undefined } : {}),
        ...(next.category !== undefined ? { category: next.category === "all" ? undefined : next.category } : {}),
        ...(next.sort !== undefined ? { sort: next.sort === "relevance" ? undefined : next.sort } : {}),
        ...(next.availability !== undefined ? { availability: next.availability === "all" ? undefined : next.availability } : {}),
        ...(next.price !== undefined ? { price: next.price === "all" ? undefined : next.price } : {}),
        ...(next.platform !== undefined ? { platform: next.platform === "all" ? undefined : next.platform } : {}),
        ...(next.region !== undefined ? { region: next.region === "all" ? undefined : next.region } : {}),
      }),
      replace: true,
    });
  };

  const activeCategory = categories.find((item) => item.slug === category);
  const counts = availabilityCounts(visible);
  const filterCount = Number(category !== "all") + Number(platform !== "all") + Number(region !== "all") + Number(availability !== "all") + Number(price !== "all");
  const setFilter = (next: { platform?: string; region?: string; availability?: string; price?: string }) => {
    const nextPlatform = next.platform ?? platform;
    const nextRegion = next.region ?? region;
    const nextAvailability = next.availability ?? availability;
    const nextPrice = next.price ?? price;
    setPlatform(nextPlatform);
    setRegion(nextRegion);
    setAvailability(nextAvailability);
    setPrice(nextPrice);
    syncUrl({ q: query, category, sort, platform: nextPlatform, region: nextRegion, availability: nextAvailability, price: nextPrice });
  };
  const clearAll = () => {
    setQuery("");
    setCategory("all");
    setPlatform("all");
    setRegion("all");
    setAvailability("all");
    setPrice("all");
    syncUrl({ q: "", category: "all", sort: "relevance", platform: "all", region: "all", availability: "all", price: "all" });
  };

  const chip = (active: boolean) =>
    `min-h-11 rounded-full border px-3 py-1.5 text-[13px] transition-colors ${active ? "border-primary bg-primary/15 text-primary" : "border-border bg-card text-foreground/85 hover:border-primary/40"}`;

  const filterGroups = (
    <div className="space-y-6">
      {platformOptions.length > 1 && (
        <fieldset>
          <legend className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Platform</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button variant="outline" aria-pressed={platform === "all"} className={chip(platform === "all")} onClick={() => setFilter({ platform: "all" })}>All platforms</Button>
            {platformOptions.map((value) => (
              <Button variant="outline" key={value} aria-pressed={platform === value} className={chip(platform === value)} onClick={() => setFilter({ platform: value })}>{value}</Button>
            ))}
          </div>
        </fieldset>
      )}
      {regionOptions.length > 1 && (
        <fieldset>
          <legend className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Region</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button variant="outline" aria-pressed={region === "all"} className={chip(region === "all")} onClick={() => setFilter({ region: "all" })}>All regions</Button>
            {regionOptions.map((value) => (
              <Button variant="outline" key={value} aria-pressed={region === value} className={chip(region === value)} onClick={() => setFilter({ region: value })}>{value}</Button>
            ))}
          </div>
        </fieldset>
      )}
      <fieldset>
        <legend className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Availability</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {([["all", "All"], ["available", "Available now"], ["coming_soon", "Coming soon"], ["unavailable", "Unavailable"]] as const).map(([value, label]) => (
            <Button variant="outline" key={value} aria-pressed={availability === value} className={chip(availability === value)} onClick={() => setFilter({ availability: value })}>{label}</Button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Price in NPR</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {([["all", "All prices"], ["under-1000", "Under Rs 1,000"], ["1000-3000", "Rs 1,000 to 3,000"], ["over-3000", "Over Rs 3,000"]] as const).map(([value, label]) => (
            <Button variant="outline" key={value} aria-pressed={price === value} className={chip(price === value)} onClick={() => setFilter({ price: value })}>{label}</Button>
          ))}
        </div>
      </fieldset>
    </div>
  );

  const sortSelect = (
    <label className="relative inline-flex h-11 min-w-0 items-center rounded-full border border-border bg-card pl-3 pr-2 text-[13px]">
      <span className="mr-1 text-muted-foreground">Sort:</span>
      <select
        id="sort"
        value={sort}
        onChange={(event) => { syncUrl({ q: query, category, sort: event.target.value, availability, price }); }}
        className="h-full min-w-0 appearance-none bg-transparent pr-1 text-foreground outline-none"
      >
        {SORTS.map((option) => (
          <option key={option.id} value={option.id} className="bg-card">{option.label}</option>
        ))}
      </select>
    </label>
  );

  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="focus:outline-none mx-auto max-w-6xl px-4 pb-16 pt-3 md:pt-6">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Catalog", ...(activeCategory ? { to: "/catalog" } : {}) }, ...(activeCategory ? [{ label: activeCategory.name }] : [])]} />

        <div className="md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden md:block">
            <div className="sticky top-32 space-y-6">
              <nav aria-label="Catalog categories">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Categories</p>
                <ul className="mt-2 space-y-0.5">
                  {[{ slug: "all", name: "All products" }, ...categories].map((item) => (
                    <li key={item.slug}>
                      <Button variant="ghost"
                        type="button"
                        aria-current={category === item.slug ? "page" : undefined}
                        onClick={() => { setCategory(item.slug); syncUrl({ q: query, category: item.slug, sort, availability, price }); }}
                        className={`flex min-h-11 h-auto w-full items-center justify-between gap-2 whitespace-normal rounded-lg px-3 py-2 text-left text-sm ${category === item.slug ? "bg-primary/12 text-primary" : "text-foreground/85 hover:bg-secondary"}`}
                      >
                        {item.name}
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {availabilityCounts(item.slug === "all" ? products : products.filter((p) => p.category?.slug === item.slug)).available} available now
                        </span>
                      </Button>
                    </li>
                  ))}
                </ul>
              </nav>
              {filterGroups}
            </div>
          </aside>

          <div className="min-w-0">
            <div className="grid min-w-0 gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
              <h1 className="min-w-0 font-display text-[22px] font-semibold md:text-3xl">{activeCategory?.name ?? "Catalog"}</h1>
              <span role="status" aria-live="polite" aria-atomic="true" className="min-w-0 pb-1 font-mono text-xs text-muted-foreground">
                {visible.length} listed / {counts.available} available now / {counts.comingSoon} coming soon / {counts.unavailable} unavailable
              </span>
            </div>

            <nav aria-label="Product types" className="mt-3 hidden flex-wrap gap-2 md:flex">
              {([
                ["all", "All"],
                ["software", "Software"],
                ["subscriptions", "Subscriptions"],
                ["gift-cards", "Gift cards"],
                ["game-top-ups", "Game top-ups"],
              ] as const).map(([slug, label]) => (
                <Button key={slug} variant={category === slug ? "primary" : "outline"} className="min-h-11" aria-pressed={category === slug} onClick={() => {
                  setCategory(slug);
                  syncUrl({ q: query, category: slug, sort, availability, price });
                }}>{label}</Button>
              ))}
            </nav>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Button ref={filterButtonRef} variant="outline" onClick={() => setFiltersOpen(true)} className="h-11 gap-1.5 rounded-full border-border bg-card px-3 text-[13px] md:hidden">
                <SlidersHorizontal className="size-4 text-primary" /> Filters{filterCount ? ` (${filterCount})` : ""}
              </Button>
              {sortSelect}
              {query && (
                <Button variant="outline" aria-label="Clear search" onClick={() => { setQuery(""); syncUrl({ q: "", category, sort, availability, price }); }} className="h-11 max-w-full gap-1 rounded-full border-primary/40 bg-primary/10 px-3 text-[13px] text-primary">
                  <span className="truncate">{query}</span><X className="size-3.5 shrink-0" aria-hidden="true" />
                </Button>
              )}
            </div>

            {visible.length ? (
              <>
                <h2 className="sr-only">All products</h2>
                <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                  {visible.slice(0, shown).map((product, index) => (
                    <ProductCard key={product.id} product={product} priority={index < 2} />
                  ))}
                </div>
                {visible.length > shown && (
                  <div className="mt-6 text-center">
                    <Button variant="outline" onClick={() => setShown((n) => n + PAGE_SIZE)} aria-controls="catalog-load-status">
                      Show more ({visible.length - shown} left)
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <EmptyState icon={SearchX} title="No products match that search" text="Try a different word, or clear the filters." action={<>
                <Button variant="ghost" size="sm" onClick={clearAll}>Clear filters</Button>
                <nav aria-label="Browse product categories" className="mt-3 flex flex-wrap justify-center gap-3 text-sm">
                  {categories.map((item) => <Link key={item.id} to="/categories/$slug" params={{ slug: item.slug }} className="inline-flex min-h-11 items-center text-primary underline">{item.name}</Link>)}
                </nav>
                <div className="mt-3 flex flex-wrap justify-center gap-3 text-sm"><Link to="/categories" className="inline-flex min-h-11 items-center underline">Browse categories</Link><Link to="/faq" className="inline-flex min-h-11 items-center underline">Read the FAQ</Link><Link to="/support" className="inline-flex min-h-11 items-center underline">Ask support</Link></div>
              </>} />
            )}
            <p id="catalog-load-status" role="status" aria-live="polite" aria-atomic="true" className="sr-only">Showing {Math.min(shown, visible.length)} of {visible.length} products.</p>

            <p className="mt-10 max-w-[62ch] text-xs text-muted-foreground">
              {activeCategory?.description ||
                "Every product MTDGC currently sells, with the region, delivery method and what we need from you shown on each product page. Prices are in Nepalese rupees."}
            </p>
          </div>
        </div>
      </main>

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side="bottom" onCloseAutoFocus={() => filterButtonRef.current?.focus()} aria-describedby={undefined} className="max-h-[85dvh] overflow-y-auto rounded-t-lg border-border bg-background px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-5 [&>button]:flex [&>button]:size-11 [&>button]:items-center [&>button]:justify-center motion-reduce:transition-none motion-reduce:animate-none">
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-foreground/20" aria-hidden="true" />
          <SheetTitle className="font-display text-lg font-semibold">Filters</SheetTitle>
          <fieldset className="mt-4">
            <legend className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Categories</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {[{ slug: "all", name: "All products" }, ...categories].map((item) => (
                <Button key={item.slug} variant="outline" aria-pressed={category === item.slug} className={chip(category === item.slug)} onClick={() => { setCategory(item.slug); syncUrl({ q: query, category: item.slug, sort, availability, price }); }}>{item.name}</Button>
              ))}
            </div>
          </fieldset>
          <div className="mt-4">{filterGroups}</div>
          <div className="mt-6 flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => { setCategory("all"); setPlatform("all"); setRegion("all"); setAvailability("all"); setPrice("all"); syncUrl({ q: query, category: "all", sort, platform: "all", region: "all", availability: "all", price: "all" }); }}>Reset</Button>
            <Button className="flex-1" onClick={() => setFiltersOpen(false)}>Show {visible.length} {visible.length === 1 ? "product" : "products"}</Button>
          </div>
        </SheetContent>
      </Sheet>
      <SiteFooter />
    </div>
  );
}
