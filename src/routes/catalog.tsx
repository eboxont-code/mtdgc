import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductCard, lowestPrice } from "@/components/product-card";
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
      { title: "Catalog | MTDGC digital goods for Nepal" },
      {
        name: "description",
        content:
          "Browse the MTDGC catalog of game top-ups, gift cards and subscriptions. Search, filter by category and sort by price, all priced in NPR.",
      },
      { property: "og:title", content: "MTDGC catalog" },
      { property: "og:description", content: "Game top-ups, gift cards and subscriptions for Nepal, priced in NPR." },
      { property: "og:url", content: `${SITE_URL}/catalog` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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

  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="focus:outline-none mx-auto max-w-6xl px-4 pb-16 pt-6">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Catalog" }]} />
        <h1 className="font-display text-[26px] font-medium md:text-4xl">Catalog</h1>
        <p className="mt-2 max-w-[62ch] text-sm text-muted-foreground">
          Every product MTDGC currently sells, with the region, delivery method and what we need from you shown on each
          product page. Prices are in Nepalese rupees.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <label className="flex h-11 items-center gap-2 rounded-md border border-border bg-card px-3">
            <span className="sr-only">Search products</span>
            <input
              value={query}
              onChange={(event) => { const q = event.target.value; setQuery(q); syncUrl({ q, category, sort, availability, price }); }}
              placeholder="Search by game, brand, category or SKU"
              className="h-11 min-w-0 flex-1 bg-transparent px-3 font-display text-base outline-none placeholder:text-muted-foreground"
            />
          </label>

          <div className="scrollbar-hidden flex gap-2 overflow-x-auto pb-1">
            <Button variant={category === "all" ? "ink" : "outline"} size="sm" className="shrink-0" onClick={() => { setCategory("all"); syncUrl({ q: query, category: "all", sort, availability, price }); }}>
              All
            </Button>
            {categories.map((item) => (
              <Button
                key={item.slug}
                variant={category === item.slug ? "ink" : "outline"}
                size="sm"
                className="shrink-0"
                onClick={() => { setCategory(item.slug); syncUrl({ q: query, category: item.slug, sort, availability, price }); }}
              >
                {item.name}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="font-display text-xs text-muted-foreground">Sort</label>
            <select
              id="sort"
              value={sort}
              onChange={(event) => { const value = event.target.value as (typeof SORTS)[number]["id"]; setSort(value); syncUrl({ q: query, category, sort: value, availability, price }); }}
              className="h-9 rounded-md border border-border bg-card px-2 font-display text-sm"
            >
              {SORTS.map((option) => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
            <span className="ml-auto font-display text-xs text-muted-foreground">
              {visible.length} {visible.length === 1 ? "product" : "products"}
            </span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="font-display text-xs text-muted-foreground">Availability
              <select value={availability} onChange={(event) => { setAvailability(event.target.value); syncUrl({ q: query, category, sort, availability: event.target.value, price }); }} className="mt-1 h-9 w-full rounded-md border border-border bg-card px-2 text-sm text-foreground">
                <option value="all">All availability</option><option value="available">Available now</option><option value="coming_soon">Coming soon</option>
              </select>
            </label>
            <label className="font-display text-xs text-muted-foreground">Price in NPR
              <select value={price} onChange={(event) => { setPrice(event.target.value); syncUrl({ q: query, category, sort, availability, price: event.target.value }); }} className="mt-1 h-9 w-full rounded-md border border-border bg-card px-2 text-sm text-foreground">
                <option value="all">All prices</option><option value="under-1000">Under Rs 1,000</option><option value="1000-3000">Rs 1,000 to Rs 3,000</option><option value="over-3000">Over Rs 3,000</option>
              </select>
            </label>
          </div>
        </div>

        {visible.length ? (
          <>
            <h2 className="sr-only">All products</h2>
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              {visible.slice(0, shown).map((product, index) => (
                <ProductCard key={product.id} product={product} priority={index < 2} />
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
          <div className="mt-8 rounded-lg border border-border py-14 text-center">
            <p className="font-display font-medium">No products match that search</p>
            <p className="mt-1 text-sm text-muted-foreground">Try a different word, or clear the filters.</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-3"
              onClick={() => {
                setQuery("");
                setCategory("all");
                setAvailability("all"); setPrice("all"); setSort("popular");
                syncUrl({ q: "", category: "all", sort: "popular", availability: "all", price: "all" });
              }}
            >
              Clear filters
            </Button>
            <div className="mt-3 flex flex-wrap justify-center gap-3 text-sm"><a href="/categories" className="underline">Browse categories</a><a href="/faq" className="underline">Read the FAQ</a><a href="/support" className="underline">Ask support</a></div>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
