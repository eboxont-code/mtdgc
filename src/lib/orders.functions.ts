import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const lineSchema = z.object({
  sku: z.string().min(1).max(80),
  quantity: z.number().int().min(1).max(10),
  fields: z.record(z.string().max(80), z.string().max(200)).default({}),
});

const orderSchema = z.object({
  name: z.string().trim().min(1).max(80),
  phone: z.string().trim().max(24).refine((v) => {
    const d = v.replace(/\D/g, "");
    return d.length >= 7 && d.length <= 15;
  }, "Phone must have 7 to 15 digits"),
  email: z.string().trim().max(120).email().optional().or(z.literal("")),
  note: z.string().trim().max(500).optional(),
  userId: z.string().uuid().nullable().optional(),
  lines: z.array(lineSchema).min(1).max(20),
});

function makeReference(): string {
  const now = new Date();
  const date = `${String(now.getUTCFullYear()).slice(2)}${String(now.getUTCMonth() + 1).padStart(2, "0")}${String(now.getUTCDate()).padStart(2, "0")}`;
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  let tail = "";
  for (const b of bytes) tail += alphabet[b % alphabet.length];
  return `MTD-${date}-${tail}`;
}

export function normaliseContact(contact: string): string {
  const v = contact.trim().toLowerCase();
  return v.includes("@") ? v : v.replace(/\D/g, "");
}

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => orderSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const skus = data.lines.map((l) => l.sku);
    const { data: variants, error } = await supabaseAdmin
      .from("product_variants")
      .select("id, sku, name, price_minor, status, product_id, products(id, name, is_published, status)")
      .in("sku", skus);
    if (error) throw new Error("Could not load products");

    const items = data.lines.map((line) => {
      const v = variants?.find((x) => x.sku === line.sku);
      const p = v?.products as { id: string; name: string; is_published: boolean; status: string } | null | undefined;
      const ok = v && p?.is_published && ["available", "low_stock"].includes(v.status) && ["available", "low_stock"].includes(p.status);
      if (!ok || !v || !p) throw new Error(`An item in your cart is no longer available (${line.sku}).`);
      return {
        product_id: p.id,
        variant_id: v.id,
        sku: v.sku,
        product_name: p.name,
        variant_name: v.name,
        quantity: line.quantity,
        unit_price_minor: v.price_minor,
        line_total_minor: v.price_minor * line.quantity,
        fields: line.fields,
      };
    });
    const subtotal = items.reduce((s, i) => s + i.line_total_minor, 0);
    const orderNumber = makeReference();
    const email = data.email || null;
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        order_number: orderNumber,
        status: "pending",
        guest_email: email,
        guest_phone: data.phone,
        user_id: data.userId ?? null,
        verification_hash: await sha256(orderNumber + normaliseContact(data.phone)),
        subtotal_minor: subtotal,
        total_minor: subtotal,
        customer_details: { name: data.name, phone: data.phone, email, note: data.note ?? "" },
      })
      .select("id")
      .single();
    if (orderError || !order) throw new Error("Could not save order");
    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(items.map((i) => ({ ...i, order_id: order.id })));
    if (itemsError) throw new Error("Could not save order lines");
    return { orderNumber, totalMinor: subtotal };
  });
