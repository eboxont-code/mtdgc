import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

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
    bearer: z.string().max(4000).optional(),
    lines: z.array(lineSchema).min(1).max(20),
    coupon: z.string().trim().max(40).optional(), // D4
    website: z.string().max(200).optional(), // 23: honeypot, must stay empty
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

/**
 * D4: validate a coupon and claim one use with a conditional (optimistic) update on used_count.
 * TODO: if the order insert fails after this, the use is not released; move to a single RPC/transaction on Boxont's Supabase.
 */
async function redeemCoupon(admin: any, rawCode: string, subtotal: number): Promise<{ code: string; discount: number }> {
  const code = rawCode.trim().toUpperCase();
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const { data: c } = await admin.from("coupons").select("id, code, kind, value, min_subtotal_minor, max_uses, used_count, starts_at, ends_at, active").eq("code", code).maybeSingle();
    const now = Date.now();
    if (!c || !c.active || (c.starts_at && Date.parse(c.starts_at) > now) || (c.ends_at && Date.parse(c.ends_at) <= now)) throw new Error("That coupon code is not valid.");
    if (subtotal < c.min_subtotal_minor) throw new Error("Your order is below this coupon's minimum.");
    if (c.max_uses != null && c.used_count >= c.max_uses) throw new Error("That coupon has been fully used.");
    const discount = Math.min(subtotal, c.kind === "percent" ? Math.floor((subtotal * c.value) / 100) : c.value);
    const { data: claimed } = await admin.from("coupons").update({ used_count: c.used_count + 1 }).eq("id", c.id).eq("used_count", c.used_count).select("id");
    if (claimed?.length) return { code: c.code, discount };
  }
  throw new Error("Could not apply the coupon. Try again.");
}

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => orderSchema.parse(data))
  .handler(async ({ data }) => {
    if (data.website) throw new Error("Could not place the order"); // 23: honeypot filled
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let resolvedUserId: string | null = null;
    if (data.bearer) {
      const { data: u } = await supabaseAdmin.auth.getUser(data.bearer);
      resolvedUserId = u.user?.id ?? null;
    }
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
    const coupon = data.coupon ? await redeemCoupon(supabaseAdmin, data.coupon, subtotal) : null;
    const discount = coupon?.discount ?? 0;
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
          user_id: resolvedUserId,
          verification_hash: await sha256(orderNumber + contactKey),
          subtotal_minor: subtotal,
          discount_minor: discount,
          total_minor: subtotal - discount,
          coupon_code: coupon?.code ?? null,
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
    return { orderNumber, accessToken, totalMinor: subtotal - discount };
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
      .select("id, status, created_at, total_minor, verification_hash, guest_email, order_items(product_name, variant_name, quantity), order_status_events(status, created_at)")
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
        events: (order.order_status_events ?? []).map((e) => ({ status: e.status, at: e.created_at })),
      },
    };
  });

export const listMyOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("orders")
      .select("id, order_number, status, total_minor, created_at, eta_at, order_items(id, product_name, variant_name, quantity, line_total_minor, products(delivery_time_label)), order_status_events(status, created_at), order_deliveries(id, order_item_id, kind, revealed_at)")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error("We could not load your orders.");
    return (data ?? []).map((o) => ({
      id: o.id,
      orderNumber: o.order_number,
      status: o.status as string,
      totalMinor: o.total_minor,
      createdAt: o.created_at,
      etaAt: o.eta_at,
      items: (o.order_items ?? []).map((i) => ({
        name: `${i.product_name}, ${i.variant_name}`,
        quantity: i.quantity,
        totalMinor: i.line_total_minor,
        deliveryTimeLabel: (i.products as { delivery_time_label: string | null } | null)?.delivery_time_label ?? null,
      })),
      // F19: delivery metadata only; content comes from revealDelivery.
      deliveries: (o.order_deliveries ?? []).map((d) => ({ id: d.id, orderItemId: d.order_item_id, kind: d.kind, revealedAt: d.revealed_at })),
      events: (o.order_status_events ?? []).map((e) => ({ status: e.status, at: e.created_at })),
    }));
  });

const viewerSchema = z.object({
  orderNumber: z.string().trim().min(4).max(40),
  accessToken: z.string().trim().max(128).optional(),
  contact: z.string().trim().max(120).optional(),
  bearer: z.string().max(4000).optional(),
});

/** Shared access check for getOrderForViewer and revealDelivery (F19). */
async function authorizeViewer(data: z.infer<typeof viewerSchema>) {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const orderNumber = data.orderNumber.toUpperCase();
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("id, user_id, status, created_at, total_minor, eta_at, verification_hash, access_token_hash, guest_email, order_items(product_name, variant_name, quantity, line_total_minor, products(delivery_time_label))")
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
      if ((count ?? 0) >= 10) return { rateLimited: true as const, order: null, allowed: false, orderNumber };
      await supabaseAdmin.from("order_lookup_attempts").insert({ ip_hash: ipHash });
      if (order) {
        const c = normaliseContact(data.contact);
        allowed = (await sha256(orderNumber + c)) === order.verification_hash || (c.includes("@") && order.guest_email?.toLowerCase() === c);
      }
    }
    return { rateLimited: false as const, order, allowed, orderNumber };
}

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
    const auth = await authorizeViewer(data);
    if (auth.rateLimited) return { status: "rate_limited" as const };
    const { order, allowed, orderNumber } = auth;
    if (!order || !allowed) return { status: "locked" as const };
    return {
      status: "found" as const,
      order: {
        orderNumber,
        status: order.status as string,
        createdAt: order.created_at,
        totalMinor: order.total_minor,
        etaAt: order.eta_at, // P7
        items: (order.order_items ?? []).map((i) => ({
          name: `${i.product_name}, ${i.variant_name}`,
          quantity: i.quantity,
          totalMinor: i.line_total_minor,
          deliveryTimeLabel: (i.products as { delivery_time_label: string | null } | null)?.delivery_time_label ?? null, // P6-ETA
        })),
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

function sniffImage(bytes: Uint8Array): "jpg" | "png" | "webp" | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "png";
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return "webp";
  return null;
}

const MIME_EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export const submitPaymentProof = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    if (!(data instanceof FormData)) throw new Error("Invalid form");
    const file = data.get("file");
    if (!(file instanceof File)) throw new Error("Please attach your payment screenshot.");
    const parsed = z
      .object({
        orderNumber: z.string().trim().min(4).max(40),
        transactionRef: z.string().trim().min(4, "Enter the transaction reference (4 to 64 characters).").max(64),
        accessToken: z.string().trim().max(128).optional(),
        contact: z.string().trim().max(120).optional(),
        bearer: z.string().max(4000).optional(),
      })
      .parse({
        orderNumber: data.get("orderNumber"),
        transactionRef: data.get("transactionRef"),
        accessToken: data.get("accessToken") || undefined,
        contact: data.get("contact") || undefined,
        bearer: data.get("bearer") || undefined,
      });
    return { ...parsed, file };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const orderNumber = data.orderNumber.toUpperCase();
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("id, user_id, status, total_minor, verification_hash, access_token_hash, guest_email")
      .eq("order_number", orderNumber)
      .maybeSingle();
    let allowed = false;
    if (order && data.accessToken && order.access_token_hash) allowed = (await sha256(data.accessToken)) === order.access_token_hash;
    if (order && !allowed && data.bearer && order.user_id) {
      const { data: u } = await supabaseAdmin.auth.getUser(data.bearer);
      allowed = u.user?.id === order.user_id;
    }
    if (order && !allowed && data.contact) {
      const { getRequestHeader } = await import("@tanstack/react-start/server");
      const ip = getRequestHeader("cf-connecting-ip") ?? getRequestHeader("x-forwarded-for")?.split(",")[0] ?? "unknown";
      const ipHash = await sha256(`lookup:${ip.trim()}`);
      const { count } = await supabaseAdmin.from("order_lookup_attempts").select("id", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", new Date(Date.now() - 600000).toISOString());
      if ((count ?? 0) >= 10) return { ok: false as const, error: "Too many attempts. Please wait 10 minutes and try again." };
      await supabaseAdmin.from("order_lookup_attempts").insert({ ip_hash: ipHash });
      const c = normaliseContact(data.contact);
      allowed = (await sha256(orderNumber + c)) === order.verification_hash || (c.includes("@") && order.guest_email?.toLowerCase() === c);
    }
    if (!order || !allowed) return { ok: false as const, error: "We could not open this order." };
    if (order.status !== "pending_payment") return { ok: false as const, error: "This order is not waiting for payment." };

    const { data: latest } = await supabaseAdmin.from("payment_proofs").select("resubmit_requested").eq("order_id", order.id).order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (latest && !latest.resubmit_requested) return { ok: false as const, error: "We already have a payment proof for this order." };

    const file = data.file;
    if (file.size > 5242880) return { ok: false as const, error: "The screenshot must be 5 MB or smaller." };
    const ext = MIME_EXT[file.type];
    const buffer = new Uint8Array(await file.arrayBuffer());
    const sniffed = sniffImage(buffer);
    if (!ext || !sniffed || sniffed !== ext) return { ok: false as const, error: "Please upload a JPG, PNG or WebP image." };

    const rand = [...crypto.getRandomValues(new Uint8Array(16))].map((b) => b.toString(16).padStart(2, "0")).join("");
    const path = `${order.id}/${rand}.${ext}`;
    const up = await supabaseAdmin.storage.from("payment-proofs").upload(path, buffer, { contentType: file.type });
    if (up.error) return { ok: false as const, error: "Upload failed. Please try again." };

    const { data: moved } = await supabaseAdmin.from("orders").update({ status: "payment_submitted", updated_at: new Date().toISOString() }).eq("id", order.id).eq("status", "pending_payment").select("id");
    if (!moved?.length) {
      await supabaseAdmin.storage.from("payment-proofs").remove([path]);
      return { ok: false as const, error: "This order is not waiting for payment." };
    }
    await supabaseAdmin.from("payment_proofs").insert({ order_id: order.id, storage_path: path, transaction_ref: data.transactionRef, amount_minor: order.total_minor });
    await supabaseAdmin.from("order_status_events").insert({ order_id: order.id, status: "payment_submitted", note: "Payment proof submitted by customer" });
    return { ok: true as const };
  });

/** F19: reveal one delivery. Same access check as getOrderForViewer; sets revealed_at the first time. Never logs content. */
export const revealDelivery = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => viewerSchema.extend({ deliveryId: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const auth = await authorizeViewer(data);
    if (auth.rateLimited) return { status: "rate_limited" as const };
    if (!auth.order || !auth.allowed) return { status: "locked" as const };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin.from("order_deliveries").select("id, kind, content, revealed_at").eq("id", data.deliveryId).eq("order_id", auth.order.id).maybeSingle();
    if (!row) return { status: "locked" as const };
    let revealedAt = row.revealed_at;
    if (!revealedAt) {
      revealedAt = new Date().toISOString();
      await supabaseAdmin.from("order_deliveries").update({ revealed_at: revealedAt }).eq("id", row.id).is("revealed_at", null);
    }
    return { status: "found" as const, delivery: { id: row.id, kind: row.kind, content: row.content, revealedAt } };
  });

/** Item 21 + 23: support request from guests or signed-in users, with honeypot. */
export const createSupportTicket = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        issueType: z.string().trim().min(1).max(60),
        orderNumber: z.string().trim().max(40).optional(),
        description: z.string().trim().min(10).max(2000),
        contact: z.string().trim().max(120).optional(),
        bearer: z.string().max(4000).optional(),
        website: z.string().max(200).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    if (data.website) throw new Error("Could not send your request"); // honeypot
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let userId: string | null = null;
    if (data.bearer) {
      const { data: u } = await supabaseAdmin.auth.getUser(data.bearer);
      userId = u.user?.id ?? null;
    }
    const contact = data.contact ?? "";
    const validContact = z.string().email().safeParse(contact).success || (/^[+\d\s()-]+$/.test(contact) && contact.replace(/\D/g, "").length >= 7 && contact.replace(/\D/g, "").length <= 15);
    if (!userId && !validContact) throw new Error("Add an email or a mobile number so we can reply.");
    // TODO: rate-limit guest tickets (reuse order_lookup_attempts pattern or a new table) before going live.
    const { error } = await supabaseAdmin.from("support_tickets").insert({
      user_id: userId,
      issue_type: data.issueType,
      order_number: data.orderNumber ? data.orderNumber.toUpperCase() : null,
      description: data.description,
      contact: contact || null,
    });
    if (error) throw new Error("Could not send your request");
    return { ok: true };
  });

/** Item 10: submit a review (always is_approved false). is_verified_purchase is decided here only. */
export const submitReview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ productId: z.string().uuid(), rating: z.number().int().min(1).max(5), body: z.string().trim().min(20).max(1000) }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: bought } = await supabaseAdmin
      .from("order_items")
      .select("id, orders!inner(user_id, status)")
      .eq("product_id", data.productId)
      .eq("orders.user_id", context.userId)
      .in("orders.status", ["delivered", "fulfilled", "completed"])
      .limit(1);
    const { error } = await supabaseAdmin.from("reviews").insert({
      product_id: data.productId,
      user_id: context.userId,
      rating: data.rating,
      body: data.body,
      is_approved: false,
      is_verified_purchase: Boolean(bought?.length),
    });
    if (error) throw new Error("Could not save your review");
    return { ok: true };
  });
