import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductCard, lowestPrice } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { listCatalog } from "@/lib/catalog.functions";
import { SITE_URL } from "@/lib/format";

export const Route = createFileRoute("/catalog")({
  loader: () => listCatalog(),
  head: () => ({
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
  }),
  component: CatalogPage,
});

const SORTS = [
  { id: "popular", label: "Popular" },
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price low to high" },
  { id: "price-desc", label: "Price high to low" },
] as const;

function CatalogPage() {
  const { products, categories } = Route.useLoaderData();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<(typeof SORTS)[number]["id"]>("popular");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchesCategory = category === "all" || product.category?.slug === category;
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
      return matchesCategory && (!needle || haystack.includes(needle));
    });

    const sorted = [...filtered];
    sorted.sort((a, b) => {
      if (sort === "newest") return b.created_at.localeCompare(a.created_at);
      if (sort === "price-asc") return (lowestPrice(a) ?? Infinity) - (lowestPrice(b) ?? Infinity);
      if (sort === "price-desc") return (lowestPrice(b) ?? -Infinity) - (lowestPrice(a) ?? -Infinity);
      return (a.featured_rank ?? 999) - (b.featured_rank ?? 999);
    });
    return sorted;
  }, [products, query, category, sort]);

  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-6">
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
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by game, brand, category or SKU"
              className="min-w-0 flex-1 bg-transparent font-display text-sm outline-none placeholder:text-muted-foreground"
            />
          </label>

          <div className="scrollbar-hidden flex gap-2 overflow-x-auto pb-1">
            <Button variant={category === "all" ? "ink" : "outline"} size="sm" className="shrink-0" onClick={() => setCategory("all")}>
              All
            </Button>
            {categories.map((item) => (
              <Button
                key={item.slug}
                variant={category === item.slug ? "ink" : "outline"}
                size="sm"
                className="shrink-0"
                onClick={() => setCategory(item.slug)}
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
              onChange={(event) => setSort(event.target.value as (typeof SORTS)[number]["id"])}
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
        </div>

        {visible.length ? (
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
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
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
