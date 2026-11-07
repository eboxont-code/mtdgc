import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { hasCheckoutPriceSnapshotChanges } from "@/lib/checkout-price-snapshot";
import { findUnsafeCustomerRequirement, UNSAFE_CUSTOMER_REQUIREMENT_MESSAGE } from "@/lib/supplier-safety";
import { generateOrderReference } from "@/lib/order-reference";
import {
  buildPaymentProofAssociation,
  hasOrderAccessToken,
  hasOrderContactAccess,
  isAuthenticatedOrderOwner,
  normaliseContact,
  sha256Hex as sha256,
} from "@/lib/order-access";

export { normaliseContact };

const lineSchema = z.object({
  sku: z.string().min(1).max(80),
  quantity: z.number().int().min(1).max(10),
  fields: z.record(z.string().max(80), z.string().max(200)).default({}),
  expectedProductName: z.string().trim().min(1).max(120).optional(),
  expectedVariantName: z.string().trim().min(1).max(120).optional(),
  expectedPriceMinor: z.number().int().positive().optional(),
}).refine(
  (line) => !findUnsafeCustomerRequirement(Object.keys(line.fields)),
  { message: UNSAFE_CUSTOMER_REQUIREMENT_MESSAGE },
).refine((line) => {
  const snapshotValues = [line.expectedProductName, line.expectedVariantName, line.expectedPriceMinor];
  const supplied = snapshotValues.filter((value) => value !== undefined).length;
  return supplied === 0 || supplied === snapshotValues.length;
}, { message: "Checkout price snapshot must be complete." });

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
  })
  .refine((d) => Boolean(d.phone) || Boolean(d.email), "Add a mobile number or an email");

type OrderItemSummarySource = {
  product_name: string;
  variant_name: string;
  quantity: number;
  unit_price_minor: number;
  line_total_minor: number;
  products?: unknown;
};

function summariseOrderItem(item: OrderItemSummarySource) {
  const product = item.products as { categories?: { slug?: string } | null } | null;
  const isGiftCard = product?.categories?.slug === "gift-cards";
  return {
    name: item.product_name,
    variantName: item.variant_name,
    isGiftCard,
    quantity: item.quantity,
    unitPriceMinor: item.unit_price_minor,
    totalMinor: item.line_total_minor,
  };
}

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => orderSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let resolvedUserId: string | null = null;
    if (data.bearer) {
      const { data: u } = await supabaseAdmin.auth.getUser(data.bearer);
      resolvedUserId = u.user?.id ?? null;
    }
    const skus = data.lines.map((l) => l.sku);
    const { data: variants, error } = await supabaseAdmin
      .from("product_variants")
      .select("id, sku, name, price_minor, currency, status, product_id, products(id, name, image_url, currency, is_published, status, categories(slug))")
      .in("sku", skus);
    if (error) throw new Error("Could not load products");

    const resolvedLines = data.lines.map((line) => {
      const v = variants?.find((x) => x.sku === line.sku);
      const p = v?.products as {
        id: string;
        name: string;
        image_url: string | null;
        currency: string;
        is_published: boolean;
        status: string;
        categories: { slug: string } | null;
      } | null | undefined;
      const ok = v && p?.is_published && ["available", "low_stock"].includes(v.status) && ["available", "low_stock"].includes(p.status);
      if (!ok || !v || !p) throw new Error(`An item in your cart is no longer available (${line.sku}).`);
      if (v.currency !== "NPR" || p.currency !== "NPR") throw new Error("This item's price currency is not supported by checkout.");
      return {
        orderItem: {
          product_id: p.id,
          variant_id: v.id,
          sku: v.sku,
          product_name: p.name,
          variant_name: v.name,
          quantity: line.quantity,
          unit_price_minor: v.price_minor,
          line_total_minor: v.price_minor * line.quantity,
          fields: line.fields,
        },
        checkoutLine: {
          sku: v.sku,
          productName: p.name,
          variantName: v.name,
          priceMinor: v.price_minor,
          quantity: line.quantity,
          image: p.image_url,
          categorySlug: p.categories?.slug,
        },
      };
    });
    const items = resolvedLines.map((line) => line.orderItem);
    const checkoutLines = resolvedLines.map((line) => line.checkoutLine);
    const subtotal = items.reduce((s, i) => s + i.line_total_minor, 0);

    if (hasCheckoutPriceSnapshotChanges(data.lines, checkoutLines)) {
      return { status: "cart_changed" as const, totalMinor: subtotal, lines: checkoutLines };
    }
    const email = data.email || null;
    const contactKey = normaliseContact(data.phone || data.email || "");
    const tokenBytes = crypto.getRandomValues(new Uint8Array(32));
    const accessToken = [...tokenBytes].map((b) => b.toString(16).padStart(2, "0")).join("");
    const accessTokenHash = await sha256(accessToken);
    let orderNumber = "";
    let order: { id: string } | null = null;
    for (let attempt = 0; attempt < 5 && !order; attempt += 1) {
      orderNumber = generateOrderReference();
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
    return { status: "created" as const, orderNumber, accessToken, totalMinor: subtotal, lines: checkoutLines };
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
      .select("id, status, created_at, total_minor, verification_hash, guest_email, order_items(product_name, variant_name, quantity, unit_price_minor, line_total_minor, products(categories(slug))), order_status_events(status, created_at)")
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
        items: (order.order_items ?? []).map((i) => summariseOrderItem(i)),
        events: (order.order_status_events ?? []).map((e) => ({ status: e.status, at: e.created_at })),
      },
    };
  });

export const listMyOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("orders")
      .select("id, order_number, status, total_minor, created_at, order_items(product_name, variant_name, quantity, unit_price_minor, line_total_minor, products(categories(slug))), order_status_events(status, created_at)")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error("We could not load your orders.");
    return (data ?? []).map((o) => ({
      id: o.id,
      orderNumber: o.order_number,
      status: o.status as string,
      totalMinor: o.total_minor,
      createdAt: o.created_at,
      items: (o.order_items ?? []).map((i) => summariseOrderItem(i)),
      events: (o.order_status_events ?? []).map((e) => ({ status: e.status, at: e.created_at })),
    }));
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
      .select("id, user_id, status, created_at, total_minor, verification_hash, access_token_hash, guest_email, order_items(product_name, variant_name, quantity, unit_price_minor, line_total_minor, products(categories(slug)))")
      .eq("order_number", orderNumber)
      .maybeSingle();
    let allowed = order ? await hasOrderAccessToken(order, data.accessToken) : false;
    if (order && !allowed && data.bearer && order.user_id) {
      const { data: u } = await supabaseAdmin.auth.getUser(data.bearer);
      allowed = isAuthenticatedOrderOwner(order, u.user?.id);
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
      if (order) allowed = await hasOrderContactAccess(order, orderNumber, data.contact);
    }
    if (!order || !allowed) return { status: "locked" as const };
    return {
      status: "found" as const,
      order: {
        orderNumber,
        status: order.status as string,
        createdAt: order.created_at,
        totalMinor: order.total_minor,
        items: (order.order_items ?? []).map((i) => summariseOrderItem(i)),
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

const MIME_EXT: Record<string, "jpg" | "png" | "webp"> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

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
    let allowed = order ? await hasOrderAccessToken(order, data.accessToken) : false;
    if (order && !allowed && data.bearer && order.user_id) {
      const { data: u } = await supabaseAdmin.auth.getUser(data.bearer);
      allowed = isAuthenticatedOrderOwner(order, u.user?.id);
    }
    if (order && !allowed && data.contact) {
      const { getRequestHeader } = await import("@tanstack/react-start/server");
      const ip = getRequestHeader("cf-connecting-ip") ?? getRequestHeader("x-forwarded-for")?.split(",")[0] ?? "unknown";
      const ipHash = await sha256(`lookup:${ip.trim()}`);
      const { count } = await supabaseAdmin.from("order_lookup_attempts").select("id", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", new Date(Date.now() - 600000).toISOString());
      if ((count ?? 0) >= 10) return { ok: false as const, error: "Too many attempts. Please wait 10 minutes and try again." };
      await supabaseAdmin.from("order_lookup_attempts").insert({ ip_hash: ipHash });
      allowed = await hasOrderContactAccess(order, orderNumber, data.contact);
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
    const association = buildPaymentProofAssociation(order, rand, ext, data.transactionRef);
    const up = await supabaseAdmin.storage.from("payment-proofs").upload(association.storagePath, buffer, { contentType: file.type });
    if (up.error) return { ok: false as const, error: "Upload failed. Please try again." };

    const { data: moved } = await supabaseAdmin.from("orders").update({ status: "payment_submitted", updated_at: new Date().toISOString() }).eq("id", association.proof.order_id).eq("status", "pending_payment").select("id");
    if (!moved?.length) {
      await supabaseAdmin.storage.from("payment-proofs").remove([association.storagePath]);
      return { ok: false as const, error: "This order is not waiting for payment." };
    }
    await supabaseAdmin.from("payment_proofs").insert({ ...association.proof, storage_path: association.storagePath });
    await supabaseAdmin.from("order_status_events").insert({ order_id: order.id, status: "payment_submitted", note: "Payment proof submitted by customer" });
    return { ok: true as const };
  });
