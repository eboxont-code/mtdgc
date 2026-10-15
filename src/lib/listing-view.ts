// Derived view data for the backend halves of F13, F14, F16, F17, F21, F23 and D3.
// Route/component wiring is UI work and is left to the UI route (Lovable); these helpers only read F5/F6 fields.
import type { CatalogProduct, Variant } from "@/lib/catalog.functions";
import { ACCOUNT_TYPE_LABEL, DELIVERY_CHANNEL_LABEL, collectionLabel, durationLabel, isSaleLive, percentOff } from "@/lib/listing";

/** F13: info grid rows for software_key and subscription; empty rows omitted. Returns null for other types (keep Region/Platform). */
export function infoRows(p: CatalogProduct, plan: Variant | undefined): Array<{ label: string; value: string }> | null {
  if (p.product_type !== "software_key" && p.product_type !== "subscription") return null;
  const receive = plan?.account_type ? ACCOUNT_TYPE_LABEL[plan.account_type] : p.product_type === "software_key" ? "Licence key" : null;
  const delivery = [DELIVERY_CHANNEL_LABEL[p.delivery_channel], p.delivery_time_label].filter(Boolean).join(", ");
  const rows = [
    { label: "You receive", value: receive },
    { label: "Delivery", value: delivery },
    { label: "Duration", value: durationLabel(plan?.duration_months) },
    { label: "Replacement period", value: p.warranty_days != null ? `${p.warranty_days} days from delivery` : null },
  ];
  return rows.filter((r): r is { label: string; value: string } => Boolean(r.value));
}

/** F14: plans sorted by duration then price, with live sale info. */
export function planRows(p: CatalogProduct) {
  return [...p.variants]
    .filter((v) => v.status !== "archived")
    .sort((a, b) => (a.duration_months ?? 0) - (b.duration_months ?? 0) || a.price_minor - b.price_minor)
    .map((v) => ({ variant: v, duration: durationLabel(v.duration_months), accountType: v.account_type ? ACCOUNT_TYPE_LABEL[v.account_type] : null, sale: saleInfo(v) }));
}

/** D3/F14: live sale for one plan. */
export function saleInfo(v: Variant) {
  if (!isSaleLive(v) || v.compare_at_minor == null) return null;
  return { compareAtMinor: v.compare_at_minor, saveMinor: v.compare_at_minor - v.price_minor, percentOff: percentOff(v.compare_at_minor, v.price_minor), endsAt: v.sale_ends_at };
}

/** F16: Replacement and refunds lines. */
export function protectionLines(p: CatalogProduct, plan: Variant | undefined): string[] {
  const lines: string[] = [];
  if (p.warranty_days != null) {
    lines.push(`If it stops working within ${p.warranty_days} days of delivery, contact support with your order number and we will sort it out under this listing's terms.`);
    if (p.warranty_note) lines.push(p.warranty_note);
  }
  lines.push(["Refundable before delivery.", p.refund_note].filter(Boolean).join(" "));
  if (plan?.account_type === "shared") lines.push("Shared plan: please do not change the password, profile or settings.");
  if (p.region_locked) lines.push(`This only works on ${p.region} accounts. Check your account region before you pay.`);
  lines.push("MTDGC will never ask for your password, OTP or payment PIN.");
  return lines;
}

/** F17: card meta line, delivery badge and best live sale. */
export function cardMeta(p: CatalogProduct) {
  const durations = p.variants.map((v) => v.duration_months).filter((n): n is number => n != null);
  const typeLine = p.product_type === "software_key" ? DELIVERY_CHANNEL_LABEL[p.delivery_channel] : p.product_type === "subscription" && durations.length ? `From ${durationLabel(Math.min(...durations))}` : null;
  const sales = p.variants.map(saleInfo).filter((s): s is NonNullable<ReturnType<typeof saleInfo>> => Boolean(s));
  return {
    typeLine,
    deliveryBadge: p.delivery_time_label,
    lowestCompareAtMinor: sales.length ? Math.min(...sales.map((s) => s.compareAtMinor)) : null,
    maxPercentOff: sales.length ? Math.max(...sales.map((s) => s.percentOff)) : null,
  };
}

/** F21: filter by collection chip. */
export function filterByCollection(products: CatalogProduct[], collection: string | null): CatalogProduct[] {
  return collection ? products.filter((p) => p.collection === collection) : products;
}

/** F23: search over name, brand, tags and collection label; Deals tab predicate. */
export function matchesSearch(p: CatalogProduct, q: string): boolean {
  const t = q.trim().toLowerCase();
  if (!t) return true;
  return [p.name, p.brand, p.summary, ...p.tags, collectionLabel(p.collection) ?? "", p.collection ?? ""].some((s) => s.toLowerCase().includes(t));
}
export const hasLiveDeal = (p: CatalogProduct) => p.variants.some((v) => saleInfo(v) != null);
