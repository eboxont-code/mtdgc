// Shared listing vocabulary for F5/F6 columns. Pure helpers, safe on client and server.
// HOLD: these columns exist only once migrations 0011/0012 are applied on Boxont's own Supabase.

export const PRODUCT_TYPES = ["software_key", "subscription", "gift_card", "game_topup"] as const;
export type ProductType = (typeof PRODUCT_TYPES)[number];
export const PRODUCT_TYPE_LABEL: Record<ProductType, string> = {
  software_key: "Software",
  subscription: "Subscription",
  gift_card: "Gift card",
  game_topup: "Game top-up",
};
/** Store order used for sorting deals and rows. */
export const PRODUCT_TYPE_ORDER: Record<ProductType, number> = { software_key: 0, subscription: 1, gift_card: 2, game_topup: 3 };

export const DELIVERY_CHANNELS = ["email", "order_page", "email_and_order_page"] as const;
export type DeliveryChannel = (typeof DELIVERY_CHANNELS)[number];
export const DELIVERY_CHANNEL_LABEL: Record<DeliveryChannel, string> = {
  email: "Sent by email",
  order_page: "Shown on your order page",
  email_and_order_page: "By email and on your order page",
};

export const ACCOUNT_TYPES = ["private", "shared", "own_account", "licence_key"] as const;
export type AccountType = (typeof ACCOUNT_TYPES)[number];
export const ACCOUNT_TYPE_LABEL: Record<AccountType, string> = {
  private: "Private account",
  shared: "Shared account",
  own_account: "Upgrade on your own account",
  licence_key: "Licence key",
};

/** Collections per product type (F9 select, F21 chips, F23 search). */
export const COLLECTIONS: Array<{ slug: string; label: string; type: ProductType }> = [
  { slug: "windows-office", label: "Windows and Office", type: "software_key" },
  { slug: "security", label: "Antivirus and security", type: "software_key" },
  { slug: "vpn", label: "VPN", type: "software_key" },
  { slug: "design", label: "Design and productivity", type: "software_key" },
  { slug: "streaming", label: "Streaming", type: "subscription" },
  { slug: "music", label: "Music", type: "subscription" },
  { slug: "ai-tools", label: "AI tools", type: "subscription" },
  { slug: "cloud-storage", label: "Cloud storage", type: "subscription" },
];
export function collectionLabel(slug: string | null | undefined): string | null {
  return COLLECTIONS.find((c) => c.slug === slug)?.label ?? null;
}

export function durationLabel(months: number | null | undefined): string | null {
  if (!months) return null;
  if (months % 12 === 0) return months === 12 ? "1 year" : `${months / 12} years`;
  return months === 1 ? "1 month" : `${months} months`;
}

export function isSaleLive(v: { compare_at_minor: number | null; price_minor: number; sale_ends_at: string | null }, now = Date.now()): boolean {
  return v.compare_at_minor != null && v.compare_at_minor > v.price_minor && (!v.sale_ends_at || Date.parse(v.sale_ends_at) > now);
}

export function percentOff(compareAt: number, price: number): number {
  return compareAt > price ? Math.round(((compareAt - price) / compareAt) * 100) : 0;
}

/** Words that block publishing (F11). */
export function draftReason(p: { name: string; summary: string; description: string }, variants: Array<{ price_minor: number; status: string }>): string | null {
  if (variants.some((v) => v.status !== "archived" && v.price_minor === 0)) return "Set a price on every option before publishing.";
  if (/^draft/i.test(p.name.trim()) || /^draft/i.test(p.summary.trim())) return "Remove DRAFT from the name and summary before publishing.";
  if (/draft|todo|lorem|editor'?s note/i.test(`${p.summary}\n${p.description}`)) return "The summary or description still has placeholder text (DRAFT, TODO, lorem or editor's note).";
  return null;
}
