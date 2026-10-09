import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Ctx = { supabase: any; userId: string };

async function assertAdmin(context: Ctx) {
  const { data, error } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
  if (error || !data) throw new Error("Admin access required");
}

const productStatus = z.enum(["available", "low_stock", "coming_soon", "out_of_stock", "temporarily_unavailable", "archived"]);
const orderStatus = z.enum(["pending", "processing", "paid", "failed", "cancelled", "refunded", "fulfilled", "completed"]);
const slug = z.string().trim().min(2).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes");

export const updateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid(), status: orderStatus, note: z.string().trim().max(500).optional() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const { error } = await context.supabase.from("orders").update({ status: data.status, updated_at: new Date().toISOString() }).eq("id", data.id);
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
});

export const saveProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => productSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const { id, ...row } = data;
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
});

export const saveVariant = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => variantSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const { id, ...row } = data;
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
