import type { CatalogCategory, CatalogProduct, PublicReview } from "@/lib/catalog.functions";

const category = (slug: string, name: string, description: string, sort: number): CatalogCategory => ({
  id: `fixture-${slug}`,
  slug,
  name,
  description,
  is_published: true,
  sort_order: sort,
});

const categories = {
  topups: category("game-top-ups", "Game Top-Ups", "In-game currency and passes, credited to your player ID after payment is verified.", 1),
  gifts: category("gift-cards", "Gift Cards", "Digital gift cards and wallet codes. The listing states the region.", 2),
  subs: category("subscriptions", "Subscriptions", "Streaming and service plans with the length shown on the listing.", 3),
};

function product(partial: Pick<CatalogProduct, "slug" | "name" | "brand" | "summary" | "status" | "category"> & { price: number }): CatalogProduct {
  return {
    id: `fixture-${partial.slug}`,
    slug: partial.slug,
    name: partial.name,
    brand: partial.brand,
    summary: partial.summary,
    description: partial.summary,
    platform: "Mobile",
    region: "Global",
    currency: "NPR",
    delivery_method: "Direct top-up to player ID",
    delivery_time: "Delivered after payment is verified",
    requirements: ["Player ID"],
    redemption_instructions: null,
    refund_eligibility: "Reviewed before fulfilment. Once credited the order cannot be reversed.",
    tags: [],
    badges: [],
    status: partial.status,
    image_url: null,
    seo_title: partial.name,
    seo_description: partial.summary,
    featured_rank: 1,
    created_at: "2026-01-01T00:00:00.000Z",
    category: partial.category ? { slug: partial.category.slug, name: partial.category.name } : null,
    variants: [
      {
        id: `fixture-${partial.slug}-v`,
        sku: `${partial.slug}-1`,
        name: "Standard",
        price_minor: partial.status === "coming_soon" ? 0 : partial.price,
        currency: "NPR",
        stock_quantity: null,
        status: partial.status,
        is_default: true,
        sort_order: 1,
      },
    ],
  };
}

const products: CatalogProduct[] = [
  product({ slug: "free-fire-diamonds", name: "Free Fire Diamonds", brand: "Garena", summary: "Diamond packs for Garena Free Fire, credited to your player ID.", status: "available", category: categories.topups, price: 12500 }),
  product({ slug: "pubg-mobile-uc", name: "PUBG Mobile UC", brand: "Krafton", summary: "UC packs for PUBG Mobile, credited to your player ID.", status: "available", category: categories.topups, price: 15500 }),
  product({ slug: "steam-wallet-code", name: "Steam Wallet Code", brand: "Valve", summary: "Steam wallet codes. The listing shows when a code can be ordered.", status: "coming_soon", category: categories.gifts, price: 0 }),
];

/** Verification catalog. Used only when MTDGC_CATALOG_FIXTURE=1. Never enable that on production. */
export function fixtureCatalog() {
  return { products, categories: Object.values(categories) };
}

export function fixtureProduct(slug: string) {
  const found = products.find((item) => item.slug === slug) ?? null;
  return {
    product: found,
    related: products.filter((item) => item.slug !== slug).slice(0, 4),
    explore: [] as CatalogProduct[],
    reviews: [] as PublicReview[],
  };
}

export function fixtureCategory(slug: string) {
  const found = Object.values(categories).find((item) => item.slug === slug) ?? null;
  return {
    category: found,
    products: found ? products.filter((item) => item.category?.slug === slug) : [],
  };
}

export function catalogFixtureEnabled() {
  return process.env["MTDGC_CATALOG_FIXTURE"] === "1";
}
