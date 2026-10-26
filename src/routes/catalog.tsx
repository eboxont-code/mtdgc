import { createFileRoute } from "@tanstack/react-router";
import { SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { CategoryRail } from "@/components/home/rails";
import { ProductCard, lowestPrice } from "@/components/product-card";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { listCatalog } from "@/lib/catalog.functions";
import { SITE_URL } from "@/lib/format";
import { breadcrumbLd, itemListLd } from "@/lib/seo";

export const Route = createFileRoute("/catalog")({
  validateSearch: (search: Record<string, unknown>): { q?: string | undefined; category?: string | undefined; sort?: string | undefined; availability?: string | undefined; price?: string | undefined } => ({
    q: typeof search["q"] === "string" ? (search["q"] as string) : undefined,
    category: typeof search["category"] === "string" ? search["category"] as string : undefined,
    sort: typeof search["sort"] === "string" ? search["sort"] as string : undefined,
    availability: typeof search["availability"] === "string" ? search["availability"] as string : undefined,
    price: typeof search["price"] === "string" ? search["price"] as string : undefined,
  }),
  loader: () => listCatalog(),
  head: ({ loaderData }) => ({
    meta: [
      { title: "Catalog | MTDGC digital goods for Nepal and Australia" },
      {
        name: "description",
        content:
          "Browse the MTDGC catalog of game top-ups, gift cards and subscriptions. Search, filter by category and sort by price, all priced in NPR.",
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
    links: [{ rel: "canonical", href: `${SITE_URL}/catalog` }],
    scripts: [
      itemListLd("MTDGC Catalog", "/catalog", "Digital goods sold by MTDGC in NPR.", (loaderData?.products ?? []).map((p) => ({ name: p.name, path: `/products/${p.slug}` }))),
      breadcrumbLd([{ name: "Home", path: "/" }, { name: "Catalog", path: "/catalog" }]),
    ],
  }),
  component: CatalogPage,
});

const SORTS = [
  { id: "popular", label: "Popular" },
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price low to high" },
  { id: "price-desc", label: "Price high to low" },
] as const;

const PAGE_SIZE = 12;

function CatalogPage() {
  const { products, categories } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [query, setQuery] = useState((search.q ?? "").slice(0, 100));
  const [category, setCategory] = useState(search.category ?? "all");
  const [sort, setSort] = useState<(typeof SORTS)[number]["id"]>((SORTS.some((item) => item.id === search.sort) ? search.sort : "popular") as (typeof SORTS)[number]["id"]);
  const [availability, setAvailability] = useState(search.availability ?? "all");
  const [price, setPrice] = useState(search.price ?? "all");
  const [shown, setShown] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);
  useEffect(() => { setQuery((search.q ?? "").slice(0, 100)); }, [search.q]);
  useEffect(() => { setCategory(search.category ?? "all"); }, [search.category]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchesCategory = category === "all" || product.category?.slug === category;
      const matchesAvailability = availability === "all" || (availability === "available" ? ["available", "low_stock"].includes(product.status) : product.status === "coming_soon");
      const lowest = lowestPrice(product);
      const matchesPrice = price === "all" || (lowest !== null && (price === "under-1000" ? lowest < 100000 : price === "1000-3000" ? lowest >= 100000 && lowest <= 300000 : lowest > 300000));
      const haystack = [
        product.name,
        product.brand,
        product.summary,
        product.region,
        product.category?.name ?? "",
        ...product.tags,
        ...product.variants.map((variant) => variant.sku),
      ]
        .join(" ")
        .toLowerCase();
      return matchesCategory && matchesAvailability && matchesPrice && (!needle || haystack.includes(needle));
    });

    const sorted = [...filtered];
    sorted.sort((a, b) => {
      if (sort === "newest") return b.created_at.localeCompare(a.created_at);
      if (sort === "price-asc") return (lowestPrice(a) ?? Infinity) - (lowestPrice(b) ?? Infinity);
      if (sort === "price-desc") return (lowestPrice(b) ?? -Infinity) - (lowestPrice(a) ?? -Infinity);
      return (a.featured_rank ?? 999) - (b.featured_rank ?? 999);
    });
    return sorted;
  }, [products, query, category, availability, price, sort]);

  const syncUrl = (next: { q?: string; category?: string; sort?: string; availability?: string; price?: string }) => {
    void navigate({ search: { q: next.q || undefined, category: next.category === "all" ? undefined : next.category, sort: next.sort === "popular" ? undefined : next.sort, availability: next.availability === "all" ? undefined : next.availability, price: next.price === "all" ? undefined : next.price }, replace: true });
  };

  const activeCategory = categories.find((item) => item.slug === category);
  const filterCount = Number(availability !== "all") + Number(price !== "all");
  const setFilter = (next: { availability?: string; price?: string }) => {
    const a = next.availability ?? availability;
    const p = next.price ?? price;
    setAvailability(a);
    setPrice(p);
    syncUrl({ q: query, category, sort, availability: a, price: p });
  };
  const clearAll = () => {
    setQuery("");
    setCategory("all");
    setAvailability("all"); setPrice("all"); setSort("popular");
    syncUrl({ q: "", category: "all", sort: "popular", availability: "all", price: "all" });
  };

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-[13px] transition-colors ${active ? "border-primary bg-primary/15 text-primary" : "border-border bg-card text-foreground/85 hover:border-primary/40"}`;

  const filterGroups = (
    <div className="space-y-6">
      <fieldset>
        <legend className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Availability</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {([["all", "All"], ["available", "Available now"], ["coming_soon", "Coming soon"]] as const).map(([value, label]) => (
            <button key={value} type="button" aria-pressed={availability === value} className={chip(availability === value)} onClick={() => setFilter({ availability: value })}>{label}</button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Price in NPR</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {([["all", "All prices"], ["under-1000", "Under Rs 1,000"], ["1000-3000", "Rs 1,000 to 3,000"], ["over-3000", "Over Rs 3,000"]] as const).map(([value, label]) => (
            <button key={value} type="button" aria-pressed={price === value} className={chip(price === value)} onClick={() => setFilter({ price: value })}>{label}</button>
          ))}
        </div>
      </fieldset>
    </div>
  );

  const sortSelect = (
    <label className="relative inline-flex h-9 items-center rounded-full border border-border bg-card pl-3 pr-2 text-[13px]">
      <span className="mr-1 text-muted-foreground">Sort:</span>
      <select
        id="sort"
        value={sort}
        onChange={(event) => { const value = event.target.value as (typeof SORTS)[number]["id"]; setSort(value); syncUrl({ q: query, category, sort: value, availability, price }); }}
        className="h-full appearance-none bg-transparent pr-1 text-foreground outline-none"
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
                      <button
                        type="button"
                        aria-current={category === item.slug ? "page" : undefined}
                        onClick={() => { setCategory(item.slug); syncUrl({ q: query, category: item.slug, sort, availability, price }); }}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${category === item.slug ? "bg-primary/12 text-primary" : "text-foreground/85 hover:bg-secondary"}`}
                      >
                        {item.name}
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {item.slug === "all" ? products.length : products.filter((p) => p.category?.slug === item.slug).length}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
              {filterGroups}
            </div>
          </aside>

          <div className="min-w-0">
            <div className="flex items-end justify-between gap-3">
              <h1 className="font-display text-[22px] font-semibold md:text-3xl">{activeCategory?.name ?? "Catalog"}</h1>
              <span className="pb-1 font-mono text-xs text-muted-foreground">
                {visible.length} {visible.length === 1 ? "product" : "products"}
              </span>
            </div>

            <div className="mt-3 md:hidden">
              <CategoryRail categories={categories} active={category} />
            </div>

            <nav aria-label="Product types" className="mt-3 flex flex-wrap gap-2">
              {[
                ["all", "All"],
                ["software", "Software"],
                ["subscriptions", "Subscriptions"],
                ["gift-cards", "Gift cards"],
                ["game-top-ups", "Game top-ups"],
              ].map(([slug, label]) => (
                <Button key={slug} variant={category === slug ? "secondary" : "outline"} className="min-h-11" aria-pressed={category === slug} onClick={() => {
                  setCategory(slug);
                  syncUrl({ q: query, category: slug, sort, availability, price });
                }}>{label}</Button>
              ))}
            </nav>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => setFiltersOpen(true)} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-[13px] md:hidden">
                <SlidersHorizontal className="size-4 text-primary" /> Filters{filterCount ? ` (${filterCount})` : ""}
              </button>
              {sortSelect}
              {query && (
                <button type="button" onClick={() => { setQuery(""); syncUrl({ q: "", category, sort, availability, price }); }} className="inline-flex h-9 items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-3 text-[13px] text-primary">
                  &ldquo;{query}&rdquo; <X className="size-3.5" aria-label="Clear search" />
                </button>
              )}
            </div>

            {visible.length ? (
              <>
                <h2 className="sr-only">All products</h2>
                <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                  {visible.slice(0, shown).map((product, index) => (
                    <ProductCard key={product.id} product={product} priority={index < 4} />
                  ))}
                </div>
                {visible.length > shown && (
                  <div className="mt-6 text-center">
                    <Button variant="outline" onClick={() => setShown((n) => n + PAGE_SIZE)}>
                      Show more ({visible.length - shown} left)
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="mt-8 rounded-2xl border border-border py-14 text-center">
                <p className="font-display font-medium">No products match that search</p>
                <p className="mt-1 text-sm text-muted-foreground">Try a different word, or clear the filters.</p>
                <Button variant="ghost" size="sm" className="mt-3" onClick={clearAll}>Clear filters</Button>
                <div className="mt-3 flex flex-wrap justify-center gap-3 text-sm"><a href="/categories" className="underline">Browse categories</a><a href="/faq" className="underline">Read the FAQ</a><a href="/support" className="underline">Ask support</a></div>
              </div>
            )}

            <p className="mt-10 max-w-[62ch] text-xs text-muted-foreground">
              {activeCategory?.description ||
                "Every product MTDGC currently sells, with the region, delivery method and what we need from you shown on each product page. Prices are in Nepalese rupees."}
            </p>
          </div>
        </div>
      </main>

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl border-border bg-background px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-5">
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-foreground/20" aria-hidden="true" />
          <SheetTitle className="font-display text-lg font-semibold">Filters</SheetTitle>
          <div className="mt-4">{filterGroups}</div>
          <div className="mt-6 flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setFilter({ availability: "all", price: "all" })}>Reset</Button>
            <Button className="flex-1" onClick={() => setFiltersOpen(false)}>Show {visible.length} {visible.length === 1 ? "product" : "products"}</Button>
          </div>
        </SheetContent>
      </Sheet>
      <SiteFooter />
    </div>
  );
}
