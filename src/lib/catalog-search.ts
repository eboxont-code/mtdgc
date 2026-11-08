import { isPurchasable } from "./product-availability";

type SearchProduct = {
  name: string;
  brand: string;
  summary: string;
  region: string;
  platform?: string | null;
  category: { name: string } | null;
  tags: readonly string[];
  currency: string;
  variants: readonly { name: string; sku: string; status: string; price_minor: number; currency: string }[];
  slug: string;
  status: string;
  featured_rank: number | null;
  created_at: string;
};

export type CatalogFacet = "platform" | "region";
export type CatalogFacetFilters = { platform?: string; region?: string };

function normalizeFacet(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

/** Derive facet choices from the published catalogue; never hardcode or mutate listing metadata. */
export function catalogFacetOptions<T extends SearchProduct>(products: readonly T[], facet: CatalogFacet): string[] {
  const options = new Map<string, string>();
  for (const product of products) {
    const raw = product[facet];
    if (typeof raw !== "string") continue;
    const value = raw.trim();
    if (!value) continue;
    const key = value.toLowerCase();
    if (!options.has(key)) options.set(key, value);
  }
  return [...options.values()].sort((a, b) => {
    const left = a.toLowerCase();
    const right = b.toLowerCase();
    return left < right ? -1 : left > right ? 1 : a < b ? -1 : a > b ? 1 : 0;
  });
}

/** Platform and region are catalogue labels, matched without case or surrounding-space sensitivity. */
export function matchesCatalogFacets<T extends SearchProduct>(product: T, filters: CatalogFacetFilters): boolean {
  const matches = (actual: string | null | undefined, expected: string | undefined) =>
    !expected || expected === "all" || normalizeFacet(actual) === normalizeFacet(expected);
  return matches(product.platform, filters.platform) && matches(product.region, filters.region);
}

const aliases: Record<string, string> = {
  ff: "free fire", pubg: "pubg", ml: "mobile legends", mlbb: "mobile legends", nfx: "netflix",
};

function normalize(value: string): string {
  return value.toLowerCase().replace(/([0-9]),(?=[0-9]{3}\b)/g, "$1").replace(/[^a-z0-9]+/g, " ").trim();
}

/** Token aliases apply to the query, never to saved listing names or offers. */
export function searchScore(product: SearchProduct, query: string): number {
  const tokens = normalize(query).split(/\s+/).filter(Boolean).flatMap((token) => (aliases[token] ?? token).split(" "));
  if (!tokens.length) return 1;
  const title = normalize(`${product.name} ${product.brand}`);
  const options = normalize(product.variants.filter((v) => v.status !== "archived").map((v) => `${v.name} ${v.sku}`).join(" "));
  const details = normalize([product.summary, product.region, product.platform, product.category?.name, ...product.tags].filter(Boolean).join(" "));
  if (!tokens.every((token) => `${title} ${options} ${details}`.includes(token))) return 0;
  return tokens.reduce((score, token) => score + (title.includes(token) ? 10 : options.includes(token) ? 5 : 1), 0) + (title.includes(tokens.join(" ")) ? 20 : 0);
}

/** Null display prices sort last in both directions without exposing hidden values. */
export function compareCatalogProducts<T extends SearchProduct>(a: T, b: T, sort: string, query: string, displayPrice: (product: T) => number | null): number {
  const rank = (a.featured_rank ?? 999) - (b.featured_rank ?? 999);
  if (sort === "price-asc" || sort === "price-desc") {
    const ap = displayPrice(a);
    const bp = displayPrice(b);
    if (ap === null) return bp === null ? rank : 1;
    if (bp === null) return -1;
    return (sort === "price-asc" ? ap - bp : bp - ap) || rank;
  }
  if (sort === "availability") return Number(isPurchasable(b)) - Number(isPurchasable(a)) || rank;
  if (sort === "newest") return b.created_at.localeCompare(a.created_at) || rank;
  if (sort === "popular") return rank;
  return searchScore(b, query) - searchScore(a, query) || rank;
}