import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const lineSchema = z.object({
  sku: z.string().min(1).max(80),
  quantity: z.number().int().min(1).max(10),
  fields: z.record(z.string().max(80), z.string().max(200)).default({}),
});

const orderSchema = z
  .object({
    name: z.string().trim().min(1).max(80),
    phone: z
      .string()
      .trim()
      .max(24)
      .refine((v) => {
        if (!v) return true;
        const d = v.replace(/\D/g, "");
        return d.length >= 7 && d.length <= 15;
      }, "Phone must have 7 to 15 digits")
      .optional()
      .default(""),
    email: z.string().trim().max(120).email().optional().or(z.literal("")),
    note: z.string().trim().max(500).optional(),
    userId: z.string().uuid().nullable().optional(),
    lines: z.array(lineSchema).min(1).max(20),
  })
  .refine((d) => Boolean(d.phone) || Boolean(d.email), "Add a mobile number or an email");

function makeReference(): string {
  const bytes = crypto.getRandomValues(new Uint32Array(1));
  return `MT${String(100000 + (bytes[0]! % 900000))}`;
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
    const email = data.email || null;
    const contactKey = normaliseContact(data.phone || data.email || "");
    const tokenBytes = crypto.getRandomValues(new Uint8Array(32));
    const accessToken = [...tokenBytes].map((b) => b.toString(16).padStart(2, "0")).join("");
    const accessTokenHash = await sha256(accessToken);
    let orderNumber = "";
    let order: { id: string } | null = null;
    for (let attempt = 0; attempt < 5 && !order; attempt += 1) {
      orderNumber = makeReference();
      const { data: row, error: orderError } = await supabaseAdmin
        .from("orders")
        .insert({
          order_number: orderNumber,
          status: "pending_payment",
          access_token_hash: accessTokenHash,
          guest_email: email,
          guest_phone: data.phone || null,
          user_id: data.userId ?? null,
          verification_hash: await sha256(orderNumber + contactKey),
          subtotal_minor: subtotal,
          total_minor: subtotal,
          customer_details: { name: data.name, phone: data.phone || null, email, note: data.note ?? "" },
        })
        .select("id")
        .single();
      if (row) order = row;
      else if (orderError?.code !== "23505") throw new Error("Could not save order");
    }
    if (!order) throw new Error("Could not save order");
    await supabaseAdmin.from("order_status_events").insert({ order_id: order.id, status: "pending_payment", note: "Order placed" });
    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(items.map((i) => ({ ...i, order_id: order.id })));
    if (itemsError) throw new Error("Could not save order lines");
    return { orderNumber, accessToken, totalMinor: subtotal };
  });

export const lookupOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ orderNumber: z.string().trim().min(4).max(40), contact: z.string().trim().min(3).max(120) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { getRequestHeader } = await import("@tanstack/react-start/server");
    const ip = getRequestHeader("cf-connecting-ip") ?? getRequestHeader("x-forwarded-for")?.split(",")[0] ?? "unknown";
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const ipHash = await sha256(`lookup:${ip.trim()}`);
    const now = Date.now();
    await supabaseAdmin.from("order_lookup_attempts").delete().lt("created_at", new Date(now - 86400000).toISOString());
    const { count } = await supabaseAdmin
      .from("order_lookup_attempts")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", new Date(now - 10 * 60 * 1000).toISOString());
    if ((count ?? 0) >= 10) {
      return { status: "rate_limited" as const, message: "Too many attempts. Please wait a few minutes and try again." };
    }
    await supabaseAdmin.from("order_lookup_attempts").insert({ ip_hash: ipHash });

    const orderNumber = data.orderNumber.toUpperCase();
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("id, status, created_at, total_minor, verification_hash, guest_email, order_items(product_name, variant_name, quantity)")
      .eq("order_number", orderNumber)
      .maybeSingle();
    if (!order) return { status: "not_found" as const };
    const contact = normaliseContact(data.contact);
    const hashMatch = (await sha256(orderNumber + contact)) === order.verification_hash;
    const emailMatch = contact.includes("@") && order.guest_email?.toLowerCase() === contact;
    if (!hashMatch && !emailMatch) return { status: "not_found" as const };
    return {
      status: "found" as const,
      order: {
        orderNumber,
        status: order.status,
        createdAt: order.created_at,
        totalMinor: order.total_minor,
        items: (order.order_items ?? []).map((i) => ({ name: `${i.product_name}, ${i.variant_name}`, quantity: i.quantity })),
      },
    };
  });

export const getOrderForViewer = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        orderNumber: z.string().trim().min(4).max(40),
        accessToken: z.string().trim().max(128).optional(),
        contact: z.string().trim().max(120).optional(),
        bearer: z.string().max(4000).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const orderNumber = data.orderNumber.toUpperCase();
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("id, user_id, status, created_at, total_minor, verification_hash, access_token_hash, guest_email, order_items(product_name, variant_name, quantity, line_total_minor)")
      .eq("order_number", orderNumber)
      .maybeSingle();
    let allowed = false;
    if (order && data.accessToken && order.access_token_hash) {
      allowed = (await sha256(data.accessToken)) === order.access_token_hash;
    }
    if (order && !allowed && data.bearer && order.user_id) {
      const { data: u } = await supabaseAdmin.auth.getUser(data.bearer);
      allowed = u.user?.id === order.user_id;
    }
    if (!allowed && data.contact) {
      const { getRequestHeader } = await import("@tanstack/react-start/server");
      const ip = getRequestHeader("cf-connecting-ip") ?? getRequestHeader("x-forwarded-for")?.split(",")[0] ?? "unknown";
      const ipHash = await sha256(`lookup:${ip.trim()}`);
      const { count } = await supabaseAdmin
        .from("order_lookup_attempts")
        .select("id", { count: "exact", head: true })
        .eq("ip_hash", ipHash)
        .gte("created_at", new Date(Date.now() - 600000).toISOString());
      if ((count ?? 0) >= 10) return { status: "rate_limited" as const };
      await supabaseAdmin.from("order_lookup_attempts").insert({ ip_hash: ipHash });
      if (order) {
        const c = normaliseContact(data.contact);
        allowed = (await sha256(orderNumber + c)) === order.verification_hash || (c.includes("@") && order.guest_email?.toLowerCase() === c);
      }
    }
    if (!order || !allowed) return { status: "locked" as const };
    return {
      status: "found" as const,
      order: {
        orderNumber,
        status: order.status as string,
        createdAt: order.created_at,
        totalMinor: order.total_minor,
        items: (order.order_items ?? []).map((i) => ({ name: `${i.product_name}, ${i.variant_name}`, quantity: i.quantity, totalMinor: i.line_total_minor })),
      },
    };
  });

export const getPaymentSettings = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.from("payment_settings").select("qr_image_path, bank_name, account_name, account_number, instructions, fonepay_enabled").maybeSingle();
  if (!data) return { configured: false as const };
  let qrUrl: string | null = null;
  if (data.qr_image_path) {
    const { data: signed } = await supabaseAdmin.storage.from("payment-qr").createSignedUrl(data.qr_image_path, 3600);
    qrUrl = signed?.signedUrl ?? null;
  }
  const out = { qrUrl, bankName: data.bank_name, accountName: data.account_name, accountNumber: data.account_number, instructions: data.instructions, fonepay: data.fonepay_enabled };
  return { configured: Boolean(qrUrl || (data.bank_name && data.account_number)), ...out };
});
