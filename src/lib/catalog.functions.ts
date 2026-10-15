import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import type { Database } from "@/integrations/supabase/types";
import { PRODUCT_TYPE_ORDER, isSaleLive, percentOff, type AccountType, type DeliveryChannel, type ProductType } from "@/lib/listing";

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
  duration_months: number | null;
  account_type: AccountType | null;
  device_limit: number | null;
  compare_at_minor: number | null;
  sale_ends_at: string | null;
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
  product_type: ProductType;
  delivery_channel: DeliveryChannel;
  activation_steps: string[];
  warranty_days: number | null;
  warranty_note: string | null;
  system_requirements: string | null;
  delivery_time_label: string | null;
  region_locked: boolean;
  refund_note: string | null;
  collection: string | null;
  pairs_with: string[];
  category: { slug: string; name: string } | null;
  variants: Variant[];
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
  "id, slug, name, brand, summary, description, platform, region, currency, delivery_method, delivery_time, requirements, redemption_instructions, refund_eligibility, tags, badges, status, image_url, seo_title, seo_description, featured_rank, created_at, product_type, delivery_channel, activation_steps, warranty_days, warranty_note, system_requirements, delivery_time_label, region_locked, refund_note, collection, pairs_with, categories(slug, name), product_variants(id, sku, name, price_minor, currency, stock_quantity, status, is_default, sort_order, duration_months, account_type, device_limit, compare_at_minor, sale_ends_at)";

type RawProduct = Record<string, unknown> & {
  categories?: { slug: string; name: string } | null;
  product_variants?: Variant[] | null;
  requirements?: unknown;
  activation_steps?: unknown;
  pairs_with?: unknown;
};

function shape(row: RawProduct): CatalogProduct {
  const now = Date.now();
  // Server-side: an expired sale never reaches the client (F8).
  const variants = [...(row.product_variants ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((v) => (isSaleLive(v, now) ? v : { ...v, compare_at_minor: null, sale_ends_at: null }));
  const requirements = Array.isArray(row.requirements) ? (row.requirements as string[]) : [];
  const activation_steps = Array.isArray(row.activation_steps) ? (row.activation_steps as string[]).slice(0, 8) : [];
  const { categories, product_variants: _ignored, ...rest } = row;
  return {
    ...(rest as unknown as Omit<CatalogProduct, "category" | "variants" | "requirements">),
    requirements,
    activation_steps,
    pairs_with: Array.isArray(row.pairs_with) ? (row.pairs_with as string[]) : [],
    category: categories ?? null,
    variants,
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

export const listCatalog = createServerFn({ method: "GET" }).handler(() => cached("catalog", async () => {
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
}));

export const getProductBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(({ data }) => cached(`product:${data.slug}`, async () => {
    const supabase = publicClient();
    const { data: row, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("slug", data.slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) return { product: null, related: [] as CatalogProduct[], explore: [] as CatalogProduct[], pairs: [] as CatalogProduct[] };

    const product = shape(row as RawProduct);
    // D6: admin-chosen pairs (published only, up to 4).
    const { data: pairRows } = product.pairs_with.length
      ? await supabase.from("products").select(PRODUCT_SELECT).eq("is_published", true).in("slug", product.pairs_with.slice(0, 4))
      : { data: [] as unknown[] };
    const pairs = (pairRows ?? []).map((r) => shape(r as RawProduct));
    const { data: relatedRows } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("is_published", true)
      .neq("slug", data.slug)
      .limit(8);
    const others = (relatedRows ?? []).map((r) => shape(r as RawProduct));
    const sameCategory = others.filter((r) => r.category?.slug === product.category?.slug);
    const otherCategories = others.filter((r) => r.category?.slug !== product.category?.slug);
    return {
      product,
      related: (sameCategory.length ? sameCategory : others).slice(0, 4),
      explore: sameCategory.length ? otherCategories.slice(0, 4) : [],
      pairs,
    };
  }));

export const getCategoryBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
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

const ORDERABLE: Database["public"]["Enums"]["product_status"][] = ["available", "low_stock"];
const isOrderable = (s: string) => (ORDERABLE as string[]).includes(s);

export type Deal = {
  product: Pick<CatalogProduct, "id" | "slug" | "name" | "brand" | "image_url" | "product_type" | "category">;
  variant: Pick<Variant, "id" | "sku" | "name" | "price_minor" | "compare_at_minor" | "sale_ends_at" | "duration_months">;
  percent_off: number;
  sale_ends_at: string | null;
};

/** D1 (feeds D2 /deals, F23 Deals tab, F25 Deals row, F17 card badge). */
export const listDeals = createServerFn({ method: "GET" }).handler(() => cached("deals", async () => {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_published", true)
    .in("status", ORDERABLE);
  if (error) throw new Error(error.message);
  const deals: Deal[] = [];
  for (const p of (data ?? []).map((r) => shape(r as RawProduct))) {
    for (const v of p.variants) {
      if (!isOrderable(v.status) || v.compare_at_minor == null) continue; // shape() already nulls expired sales
      deals.push({
        product: { id: p.id, slug: p.slug, name: p.name, brand: p.brand, image_url: p.image_url, product_type: p.product_type, category: p.category },
        variant: { id: v.id, sku: v.sku, name: v.name, price_minor: v.price_minor, compare_at_minor: v.compare_at_minor, sale_ends_at: v.sale_ends_at, duration_months: v.duration_months },
        percent_off: percentOff(v.compare_at_minor, v.price_minor),
        sale_ends_at: v.sale_ends_at,
      });
    }
  }
  return deals.sort((a, b) => b.percent_off - a.percent_off || PRODUCT_TYPE_ORDER[a.product.product_type] - PRODUCT_TYPE_ORDER[b.product.product_type]);
}));

/** Item 1: live status and price per SKU for cart/checkout re-checks. Not cached. */
export const getVariantStatuses = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ skus: z.array(z.string().min(1).max(80)).min(1).max(40) }).parse(d))
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const { data: rows, error } = await supabase
      .from("product_variants")
      .select("sku, status, price_minor, products(is_published, status)")
      .in("sku", data.skus);
    if (error) throw new Error("Could not check your cart");
    return data.skus.map((sku) => {
      const r = rows?.find((x) => x.sku === sku);
      const p = r?.products as { is_published: boolean; status: string } | null | undefined;
      const orderable = Boolean(r && p?.is_published && isOrderable(r.status) && isOrderable(p.status));
      return { sku, status: (r?.status ?? "archived") as string, price_minor: r?.price_minor ?? null, orderable };
    });
  });

/** Item 9: approved reviews only. Never exposes user_id. */
export const getApprovedReviews = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ productId: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const { data: rows, error } = await supabase
      .from("reviews")
      .select("id, rating, body, created_at, is_verified_purchase")
      .eq("product_id", data.productId)
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error("Could not load reviews");
    const reviews = rows ?? [];
    const average = reviews.length ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10 : null;
    return { reviews, count: reviews.length, average };
  });

/** S2: products in >= 2 distinct delivered/fulfilled/completed orders together with this one. */
export const getFrequentlyOrderedTogether = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ productId: z.string().uuid() }).parse(d))
  .handler(({ data }) => cached(`fot:${data.productId}`, async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: mine } = await supabaseAdmin
      .from("order_items")
      .select("order_id, orders!inner(status)")
      .eq("product_id", data.productId)
      .in("orders.status", ["delivered", "fulfilled", "completed"])
      .limit(1000);
    const orderIds = [...new Set((mine ?? []).map((r) => r.order_id))];
    if (!orderIds.length) return [] as CatalogProduct[];
    const { data: others } = await supabaseAdmin
      .from("order_items")
      .select("order_id, product_id")
      .in("order_id", orderIds)
      .neq("product_id", data.productId);
    const seen = new Map<string, Set<string>>();
    for (const r of others ?? []) {
      if (!r.product_id) continue;
      if (!seen.has(r.product_id)) seen.set(r.product_id, new Set());
      seen.get(r.product_id)!.add(r.order_id);
    }
    const ranked = [...seen.entries()].filter(([, s]) => s.size >= 2).sort((a, b) => b[1].size - a[1].size).map(([id]) => id);
    if (!ranked.length) return [] as CatalogProduct[];
    const { data: rows } = await publicClient().from("products").select(PRODUCT_SELECT).eq("is_published", true).in("id", ranked.slice(0, 12));
    const byId = new Map((rows ?? []).map((r) => [(r as { id: string }).id, shape(r as RawProduct)]));
    return ranked.map((id) => byId.get(id)).filter((p): p is CatalogProduct => Boolean(p)).slice(0, 4);
  }));
