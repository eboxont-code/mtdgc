import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { ACCOUNT_TYPES, DELIVERY_CHANNELS, PRODUCT_TYPES, draftReason } from "@/lib/listing";

type Ctx = { supabase: any; userId: string };

/** Drop undefined keys (exactOptionalPropertyTypes) so optional new fields are only written when sent. */
function clean<T extends object>(o: T): { [K in keyof T]: Exclude<T[K], undefined> } {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as { [K in keyof T]: Exclude<T[K], undefined> };
}

async function assertAdmin(context: Ctx) {
  const { data, error } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
  if (error || !data) throw new Error("Admin access required");
}

const productStatus = z.enum(["available", "low_stock", "coming_soon", "out_of_stock", "temporarily_unavailable", "archived"]);
const orderStatus = z.enum(["paid", "verified", "rejected", "processing", "delivered", "cancelled", "refunded"]);
const slug = z.string().trim().min(2).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes");

export const updateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid(), status: orderStatus, note: z.string().trim().max(500).optional(), eta_at: z.string().datetime({ offset: true }).nullable().optional() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    // P7: eta_at needs migration 0013; only written when sent.
    const patch = clean({ status: data.status, updated_at: new Date().toISOString(), eta_at: data.eta_at });
    const { error } = await context.supabase.from("orders").update(patch).eq("id", data.id);
    if (error) throw new Error("Could not update the order");
    await context.supabase.from("order_status_events").insert({ order_id: data.id, status: data.status, note: data.note ?? null, created_by: context.userId });
    return { ok: true };
  });

export const addOrderNote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid(), status: z.string().max(40), note: z.string().trim().min(1).max(500) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const { error } = await context.supabase.from("order_status_events").insert({ order_id: data.id, status: data.status, note: data.note, created_by: context.userId });
    if (error) throw new Error("Could not save the note");
    return { ok: true };
  });

export const approveReview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const { error } = await context.supabase.from("reviews").update({ is_approved: true }).eq("id", data.id);
    if (error) throw new Error("Could not approve the review");
    return { ok: true };
  });

const productSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(120),
  slug,
  brand: z.string().trim().min(1).max(80),
  summary: z.string().trim().min(1).max(300),
  description: z.string().trim().min(1).max(4000),
  category_id: z.string().uuid().nullable(),
  region: z.string().trim().min(1).max(40),
  platform: z.string().trim().max(60).nullable(),
  delivery_method: z.string().trim().min(1).max(120),
  delivery_time: z.string().trim().min(1).max(120),
  requirements: z.array(z.string().trim().min(1).max(60)).max(8),
  image_url: z.string().trim().url().max(500).nullable(),
  seo_title: z.string().trim().min(1).max(70),
  seo_description: z.string().trim().min(1).max(170),
  status: productStatus,
  is_published: z.boolean(),
  // F9 (needs migration 0011). Optional so the current product form keeps working.
  product_type: z.enum(PRODUCT_TYPES).optional(),
  delivery_channel: z.enum(DELIVERY_CHANNELS).optional(),
  collection: z.string().trim().max(40).nullable().optional().default(null),
  activation_steps: z.array(z.string().trim().min(1).max(200)).max(8).optional(),
  warranty_days: z.number().int().min(0).max(3650).nullable().optional(),
  warranty_note: z.string().trim().max(300).nullable().optional().default(null),
  system_requirements: z.string().trim().max(600).nullable().optional().default(null),
  delivery_time_label: z.string().trim().max(80).nullable().optional().default(null),
  region_locked: z.boolean().optional(),
  refund_note: z.string().trim().max(300).nullable().optional().default(null),
  pairs_with: z.array(slug).max(4).optional(),
});

export const saveProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => productSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const { id, ...rest } = data;
    const row = clean(rest);
    // F11 publish guard, enforced on the server.
    if (row.is_published) {
      const { data: variants } = id
        ? await context.supabase.from("product_variants").select("price_minor, status").eq("product_id", id)
        : { data: [] as Array<{ price_minor: number; status: string }> };
      const reason = draftReason(row, variants ?? []);
      if (reason) throw new Error(reason);
    }
    const q = id
      ? context.supabase.from("products").update({ ...row, updated_at: new Date().toISOString() }).eq("id", id).select("id").single()
      : context.supabase.from("products").insert(row).select("id").single();
    const { data: saved, error } = await q;
    if (error) throw new Error(error.code === "23505" ? "That slug is already used" : "Could not save the product");
    return { id: saved.id as string };
  });

export const archiveProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const { error } = await context.supabase.from("products").update({ status: "archived", is_published: false }).eq("id", data.id);
    if (error) throw new Error("Could not archive the product");
    return { ok: true };
  });

const variantSchema = z.object({
  id: z.string().uuid().optional(),
  product_id: z.string().uuid(),
  sku: z.string().trim().min(2).max(80),
  name: z.string().trim().min(1).max(80),
  price_minor: z.number().int().min(0).max(100000000),
  stock_quantity: z.number().int().min(0).nullable(),
  status: productStatus,
  is_default: z.boolean(),
  sort_order: z.number().int().min(0).max(1000),
  // F10 (needs migration 0012). Optional so the current variants editor keeps working.
  duration_months: z.number().int().min(1).max(120).nullable().optional(),
  account_type: z.enum(ACCOUNT_TYPES).nullable().optional(),
  device_limit: z.number().int().min(1).max(100).nullable().optional(),
  compare_at_minor: z.number().int().min(1).max(100000000).nullable().optional(),
  sale_ends_at: z.string().datetime({ offset: true }).nullable().optional(),
}).refine((v) => v.compare_at_minor == null || v.compare_at_minor > v.price_minor, { message: "The compare-at price must be higher than the price", path: ["compare_at_minor"] });

export const saveVariant = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => variantSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const { id, ...rest } = data;
    const row = clean(rest);
    const { error } = id
      ? await context.supabase.from("product_variants").update(row).eq("id", id)
      : await context.supabase.from("product_variants").insert({ ...row, currency: "NPR" });
    if (error) throw new Error(error.code === "23505" ? "That SKU is already used" : "Could not save the option");
    return { ok: true };
  });

export const archiveVariant = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const { error } = await context.supabase.from("product_variants").update({ status: "archived" }).eq("id", data.id);
    if (error) throw new Error("Could not archive the option");
    return { ok: true };
  });

export const saveCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid().optional(), name: z.string().trim().min(2).max(80), slug, description: z.string().trim().max(600), sort_order: z.number().int().min(0).max(1000), is_published: z.boolean() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const { id, ...row } = data;
    const { error } = id
      ? await context.supabase.from("categories").update(row).eq("id", id)
      : await context.supabase.from("categories").insert(row);
    if (error) throw new Error(error.code === "23505" ? "That slug is already used" : "Could not save the category");
    return { ok: true };
  });

const optText = (max: number) => z.string().trim().max(max).transform((v) => (v ? v : null));

export const getAdminPaymentSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as Ctx);
    const { data } = await context.supabase.from("payment_settings").select("*").maybeSingle();
    return data as null | { qr_image_path: string | null; bank_name: string | null; account_name: string | null; account_number: string | null; instructions: string | null; fonepay_enabled: boolean };
  });

export const savePaymentSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ bank_name: optText(80), account_name: optText(80), account_number: optText(40), instructions: optText(500), fonepay_enabled: z.boolean() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("payment_settings").upsert({ id: true, ...data, updated_at: new Date().toISOString(), updated_by: context.userId });
    if (error) throw new Error("Could not save payment settings");
    return { ok: true };
  });

export const uploadPaymentQr = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => {
    if (!(d instanceof FormData)) throw new Error("Invalid upload");
    const file = d.get("file");
    if (!(file instanceof File)) throw new Error("Choose an image");
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) throw new Error("Use a PNG, JPG or WEBP image");
    if (file.size > 2 * 1024 * 1024) throw new Error("The image must be 2 MB or smaller");
    return { file };
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const ext = data.file.type === "image/png" ? "png" : data.file.type === "image/webp" ? "webp" : "jpg";
    const path = `qr-${Date.now()}.${ext}`;
    const { error } = await supabaseAdmin.storage.from("payment-qr").upload(path, await data.file.arrayBuffer(), { contentType: data.file.type });
    if (error) throw new Error("Could not upload the QR image");
    const { error: e2 } = await supabaseAdmin.from("payment_settings").upsert({ id: true, qr_image_path: path, updated_at: new Date().toISOString(), updated_by: context.userId });
    if (e2) throw new Error("Could not save the QR image");
    return { ok: true };
  });

export const listPaymentsToVerify = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as Ctx);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select("id, order_number, total_minor, updated_at")
      .eq("status", "payment_submitted")
      .order("updated_at", { ascending: true });
    if (error) throw new Error("Could not load payments to verify");
    const ids = (orders ?? []).map((o) => o.id);
    const { data: proofs } = ids.length
      ? await supabaseAdmin.from("payment_proofs").select("id, order_id, transaction_ref, amount_minor, created_at, status").in("order_id", ids).eq("status", "submitted")
      : { data: [] as any[] };
    return (orders ?? []).map((o) => {
      const proof = (proofs ?? []).filter((p: any) => p.order_id === o.id).sort((a: any, b: any) => b.created_at.localeCompare(a.created_at))[0] ?? null;
      return { ...o, proof: proof ? { id: proof.id, transaction_ref: proof.transaction_ref, created_at: proof.created_at } : null };
    });
  });

export const getPaymentProofUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ proofId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: proof } = await supabaseAdmin.from("payment_proofs").select("storage_path").eq("id", data.proofId).maybeSingle();
    if (!proof) throw new Error("Proof not found");
    const { data: signed, error } = await supabaseAdmin.storage.from("payment-proofs").createSignedUrl(proof.storage_path, 300);
    if (error || !signed) throw new Error("Could not open the screenshot");
    return { url: signed.signedUrl };
  });

const reviewSchema = z.object({
  proofId: z.string().uuid(),
  decision: z.enum(["verify", "reject"]),
  note: z.string().trim().max(500).optional(),
  askNewProof: z.boolean().optional(),
});

export const reviewPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => reviewSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    if (data.decision === "reject" && !data.note) throw new Error("Add a note explaining the rejection");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: proof } = await supabaseAdmin.from("payment_proofs").select("id, order_id, status").eq("id", data.proofId).maybeSingle();
    if (!proof || proof.status !== "submitted") throw new Error("This proof has already been reviewed");
    const verified = data.decision === "verify";
    const orderStatus = verified ? "verified" : data.askNewProof ? "pending_payment" : "rejected";
    const { data: moved, error } = await supabaseAdmin
      .from("orders")
      .update({ status: orderStatus, updated_at: new Date().toISOString() })
      .eq("id", proof.order_id)
      .eq("status", "payment_submitted")
      .select("id");
    if (error) throw new Error("Could not update the order");
    if (!moved?.length) throw new Error("This order is no longer waiting for verification");
    await supabaseAdmin.from("payment_proofs").update({
      status: verified ? "verified" : "rejected",
      resubmit_requested: !verified && !!data.askNewProof,
      review_note: data.note ?? null,
      reviewed_by: context.userId,
      reviewed_at: new Date().toISOString(),
    }).eq("id", proof.id);
    if (!verified && data.askNewProof) {
      await supabaseAdmin.from("order_status_events").insert({ order_id: proof.order_id, status: "rejected", note: data.note ?? null, created_by: context.userId });
    }
    await supabaseAdmin.from("order_status_events").insert({ order_id: proof.order_id, status: orderStatus, note: data.note ?? null, created_by: context.userId });
    return { ok: true, status: orderStatus };
  });

const iso = () => new Date().toISOString();

/** P7: real counts for the admin summary tiles. */
export const getAdminSummary = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as Ctx);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // TODO: confirm business timezone (Nepal, UTC+5:45) vs server timezone.
    const count = async (q: PromiseLike<{ count: number | null }>) => (await q).count ?? 0;
    const orders = () => supabaseAdmin.from("orders").select("id", { count: "exact", head: true });
    const [ordersToday, awaitingPayment, paymentsToVerify, processing, delivered, openSupport, reviewsPending] = await Promise.all([
      count(orders().gte("created_at", startOfDay.toISOString())),
      count(orders().eq("status", "pending_payment")),
      count(orders().eq("status", "payment_submitted")),
      count(orders().eq("status", "processing")),
      count(orders().eq("status", "delivered")),
      count(supabaseAdmin.from("support_tickets").select("id", { count: "exact", head: true }).in("status", ["open", "in_progress"])),
      count(supabaseAdmin.from("reviews").select("id", { count: "exact", head: true }).eq("is_approved", false)),
    ]);
    return { ordersToday, awaitingPayment, paymentsToVerify, processing, delivered, openSupport, reviewsPending };
  });

/** F19: deliver a key / credentials / invite / note for one order line. Content is never logged. */
export const deliverOrderItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ orderItemId: z.string().uuid(), kind: z.enum(["key", "credentials", "invite", "note"]), content: z.string().trim().min(1).max(4000) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: item } = await supabaseAdmin.from("order_items").select("id, order_id").eq("id", data.orderItemId).maybeSingle();
    if (!item) throw new Error("Order line not found");
    const { error } = await supabaseAdmin.from("order_deliveries").insert({ order_id: item.order_id, order_item_id: item.id, kind: data.kind, content: data.content, created_by: context.userId });
    if (error) throw new Error("Could not save the delivery");
    const [{ data: items }, { data: delivered }] = await Promise.all([
      supabaseAdmin.from("order_items").select("id").eq("order_id", item.order_id),
      supabaseAdmin.from("order_deliveries").select("order_item_id").eq("order_id", item.order_id),
    ]);
    const done = new Set((delivered ?? []).map((r) => r.order_item_id));
    const complete = (items ?? []).every((i) => done.has(i.id));
    await supabaseAdmin.from("order_status_events").insert({ order_id: item.order_id, status: complete ? "delivered" : "processing", note: `Delivery added (${data.kind})`, created_by: context.userId });
    if (complete) await supabaseAdmin.from("orders").update({ status: "delivered", updated_at: iso() }).eq("id", item.order_id);
    return { ok: true, orderDelivered: complete };
  });

/** F19 admin panel: deliveries for an order with revealed time (content included for "Copy for email"). */
export const listOrderDeliveries = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ orderId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin.from("order_deliveries").select("id, order_item_id, kind, content, created_at, revealed_at").eq("order_id", data.orderId).order("created_at");
    if (error) throw new Error("Could not load deliveries");
    return rows ?? [];
  });

/* D4/D5: coupons (needs migration 0016). */
const couponSchema = z.object({
  id: z.string().uuid().optional(),
  code: z.string().trim().min(3).max(40).regex(/^[A-Za-z0-9_-]+$/).transform((v) => v.toUpperCase()),
  kind: z.enum(["percent", "fixed"]),
  value: z.number().int().min(1),
  min_subtotal_minor: z.number().int().min(0).default(0),
  max_uses: z.number().int().min(1).nullable().default(null),
  starts_at: z.string().datetime({ offset: true }).nullable().default(null),
  ends_at: z.string().datetime({ offset: true }).nullable().default(null),
  active: z.boolean().default(true),
}).refine((c) => c.kind !== "percent" || c.value <= 100, { message: "A percent coupon cannot exceed 100", path: ["value"] });

export const listCoupons = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as Ctx);
    const { data, error } = await context.supabase.from("coupons").select("*").order("created_at", { ascending: false });
    if (error) throw new Error("Could not load coupons");
    return data ?? [];
  });

export const saveCoupon = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => couponSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const { id, ...row } = data;
    const { error } = id ? await context.supabase.from("coupons").update(row).eq("id", id) : await context.supabase.from("coupons").insert(row);
    if (error) throw new Error(error.code === "23505" ? "That code is already used" : "Could not save the coupon");
    return { ok: true };
  });

export const deactivateCoupon = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const { error } = await context.supabase.from("coupons").update({ active: false }).eq("id", data.id);
    if (error) throw new Error("Could not deactivate the coupon");
    return { ok: true };
  });

/** D7: variants with a compare-at price (live or expired). */
export const listAdminDeals = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as Ctx);
    const { data, error } = await context.supabase
      .from("product_variants")
      .select("id, sku, name, price_minor, compare_at_minor, sale_ends_at, products(name, slug)")
      .not("compare_at_minor", "is", null);
    if (error) throw new Error("Could not load deals");
    const now = Date.now();
    return (data ?? []).map((v: any) => ({
      ...v,
      percent_off: v.compare_at_minor > v.price_minor ? Math.round(((v.compare_at_minor - v.price_minor) / v.compare_at_minor) * 100) : 0,
      live: !v.sale_ends_at || Date.parse(v.sale_ends_at) > now,
    }));
  });

export const endSale = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ variantId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const { error } = await context.supabase.from("product_variants").update({ compare_at_minor: null, sale_ends_at: null }).eq("id", data.variantId);
    if (error) throw new Error("Could not end the sale");
    return { ok: true };
  });

/** Item 11: hide (delete) a pending or approved review; list approved reviews. */
export const hideReview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const { error } = await context.supabase.from("reviews").delete().eq("id", data.id);
    if (error) throw new Error("Could not hide the review");
    return { ok: true };
  });

export const listApprovedReviews = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as Ctx);
    const { data, error } = await context.supabase.from("reviews").select("id, rating, body, created_at, is_verified_purchase, products(name, slug)").eq("is_approved", true).order("created_at", { ascending: false }).limit(200);
    if (error) throw new Error("Could not load reviews");
    return data ?? [];
  });

/** Item 12: customers with order counts and search over name, email, phone. */
export const listCustomers = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ q: z.string().trim().max(80).optional() }).parse(d ?? {}))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let query = supabaseAdmin.from("profiles").select("id, display_name, delivery_email, phone, created_at").order("created_at", { ascending: false }).limit(200);
    if (data.q) {
      const term = data.q.replace(/[%,()]/g, " ");
      query = query.or(`display_name.ilike.%${term}%,delivery_email.ilike.%${term}%,phone.ilike.%${term}%`);
    }
    const { data: profiles, error } = await query;
    if (error) throw new Error("Could not load customers");
    const ids = (profiles ?? []).map((p) => p.id);
    const { data: orders } = ids.length ? await supabaseAdmin.from("orders").select("user_id").in("user_id", ids) : { data: [] as Array<{ user_id: string | null }> };
    const counts = new Map<string, number>();
    for (const o of orders ?? []) if (o.user_id) counts.set(o.user_id, (counts.get(o.user_id) ?? 0) + 1);
    return (profiles ?? []).map((p) => ({ ...p, order_count: counts.get(p.id) ?? 0 }));
  });

/** Item 13: support request status. */
export const updateSupportStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid(), status: z.enum(["open", "in_progress", "resolved"]) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const { error } = await context.supabase.from("support_tickets").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error("Could not update the request");
    return { ok: true };
  });

/** Item 14: orders CSV for a date range. Totals in NPR (major units). */
export const exportOrdersCsv = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ from: z.string().date(), to: z.string().date() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const end = new Date(`${data.to}T00:00:00Z`);
    end.setUTCDate(end.getUTCDate() + 1);
    const { data: rows, error } = await supabaseAdmin
      .from("orders")
      .select("created_at, order_number, status, total_minor, order_items(quantity)")
      .gte("created_at", `${data.from}T00:00:00Z`)
      .lt("created_at", end.toISOString())
      .order("created_at")
      .limit(10000);
    if (error) throw new Error("Could not export orders");
    const esc = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
    const lines = ["date,order_number,status,total_npr,item_count"];
    for (const o of rows ?? []) {
      const items = (o.order_items ?? []).reduce((s: number, i: { quantity: number }) => s + i.quantity, 0);
      lines.push([o.created_at, o.order_number, String(o.status), (o.total_minor / 100).toFixed(2), String(items)].map(esc).join(","));
    }
    return { filename: `orders-${data.from}-to-${data.to}.csv`, csv: lines.join("\n") };
  });
