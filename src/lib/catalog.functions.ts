import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";
import { catalogFixtureEnabled, fixtureCatalog, fixtureCategory, fixtureProduct } from "@/lib/catalog-fixture";
import { pricesHidden } from "@/lib/price-visibility";

export type Variant = {
  id: string;
  sku: string;
  name: string;
  price_minor: number;
  currency: string;
  stock_quantity: number | null;
  status: Database["public"]["Enums"]["product_status"];
  is_default: boolean;
  sort_order: number;
};

export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  summary: string;
  description: string;
  platform: string | null;
  region: string;
  currency: string;
  delivery_method: string;
  delivery_time: string;
  requirements: string[];
  redemption_instructions: string | null;
  refund_eligibility: string;
  tags: string[];
  badges: string[];
  status: Database["public"]["Enums"]["product_status"];
  image_url: string | null;
  seo_title: string;
  seo_description: string;
  featured_rank: number | null;
  created_at: string;
  category: { slug: string; name: string } | null;
  variants: Variant[];
};

export type PublicReview = {
  id: string;
  rating: number;
  body: string;
  created_at: string;
  is_verified_purchase: boolean;
};

export type CatalogCategory = {
  id: string;
  slug: string;
  name: string;
  description: string;
  is_published: boolean;
  sort_order: number;
};

function publicClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

const PRODUCT_SELECT =
  "id, slug, name, brand, summary, description, platform, region, currency, delivery_method, delivery_time, requirements, redemption_instructions, refund_eligibility, tags, badges, status, image_url, seo_title, seo_description, featured_rank, created_at, categories(slug, name), product_variants(id, sku, name, price_minor, currency, stock_quantity, status, is_default, sort_order)";

type RawProduct = Record<string, unknown> & {
  categories?: { slug: string; name: string } | null;
  product_variants?: Variant[] | null;
  requirements?: unknown;
};

function shape(row: RawProduct): CatalogProduct {
  const variants = [...(row.product_variants ?? [])].sort((a, b) => a.sort_order - b.sort_order);
  const requirements = Array.isArray(row.requirements) ? (row.requirements as string[]) : [];
  const { categories, product_variants: _ignored, ...rest } = row;
  const base = rest as unknown as Omit<CatalogProduct, "category" | "variants" | "requirements">;
  // Sample and coming-soon prices never leave the server: no price, and no option can be ordered.
  const hidden = pricesHidden(base);
  return {
    ...base,
    requirements,
    category: categories ?? null,
    variants: hidden
      ? variants.map((variant) => ({
          ...variant,
          price_minor: 0,
          status: variant.status === "available" || variant.status === "low_stock" ? "coming_soon" : variant.status,
        }))
      : variants,
  };
}

// Published catalog reads only. Never cache admin, cart, order or user data here.
const CACHE_TTL_MS = 60_000;
const publicCache = new Map<string, { at: number; value: unknown }>();
async function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
  const hit = publicCache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.value as T;
  const value = await load();
  publicCache.set(key, { at: Date.now(), value });
  return value;
}

export const listCatalog = createServerFn({ method: "GET" }).handler(() => {
  if (catalogFixtureEnabled()) return fixtureCatalog();
  return cached("catalog", async () => {
  const supabase = publicClient();
  const [products, categories] = await Promise.all([
    supabase.from("products").select(PRODUCT_SELECT).eq("is_published", true),
    supabase.from("categories").select("id, slug, name, description, is_published, sort_order").eq("is_published", true).order("sort_order"),
  ]);
  if (products.error) throw new Error(products.error.message);
  if (categories.error) throw new Error(categories.error.message);
  return {
    products: (products.data ?? []).map((row) => shape(row as RawProduct)),
    categories: (categories.data ?? []) as CatalogCategory[],
  };
  });
});

export const getProductBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(({ data }) => {
    if (catalogFixtureEnabled()) return fixtureProduct(data.slug);
    return cached(`product:${data.slug}`, async () => {
    const supabase = publicClient();
    const { data: row, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("slug", data.slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) return { product: null, related: [] as CatalogProduct[], explore: [] as CatalogProduct[], reviews: [] as PublicReview[] };

    const product = shape(row as RawProduct);
    const [{ data: relatedRows }, { data: reviewRows }] = await Promise.all([
      supabase.from("products").select(PRODUCT_SELECT).eq("is_published", true).neq("slug", data.slug).limit(8),
      supabase
        .from("reviews")
        .select("id, rating, body, created_at, is_verified_purchase")
        .eq("product_id", product.id)
        .eq("is_approved", true)
        .order("created_at", { ascending: false }),
    ]);
    const others = (relatedRows ?? []).map((r) => shape(r as RawProduct));
    const sameCategory = others.filter((r) => r.category?.slug === product.category?.slug);
    const otherCategories = others.filter((r) => r.category?.slug !== product.category?.slug);
    return {
      product,
      related: (sameCategory.length ? sameCategory : others).slice(0, 4),
      explore: sameCategory.length ? otherCategories.slice(0, 4) : [],
      reviews: (reviewRows ?? []) as PublicReview[],
    };
    });
  });

export const getCategoryBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    if (catalogFixtureEnabled()) return fixtureCategory(data.slug);
    const supabase = publicClient();
    const { data: category, error } = await supabase
      .from("categories")
      .select("id, slug, name, description, is_published, sort_order")
      .eq("slug", data.slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!category) return { category: null, products: [] as CatalogProduct[] };
    const { data: rows } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("is_published", true)
      .eq("category_id", category.id);
    return {
      category: category as CatalogCategory,
      products: (rows ?? []).map((r) => shape(r as RawProduct)),
    };
  });
