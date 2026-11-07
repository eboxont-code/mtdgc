export function formatNpr(minor: number): string {
  return `Rs ${(minor / 100).toLocaleString("en-NP", { maximumFractionDigits: 0 })}`;
}

// MTDGC support WhatsApp number (support only, never part of ordering or payment).
// Digits only with country code, as wa.me expects. Use only through whatsappLink().
export const WHATSAPP_NUMBER: string = "9779740204403";
export const WHATSAPP_DISPLAY = "+977 9740204403";
export const SUPPORT_MESSAGE = "Hi MTDGC, I need help";

export function whatsappLink(message?: string): string | null {
  if (!WHATSAPP_NUMBER) return null;
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const STATUS_LABEL: Record<string, string> = {
  available: "Available",
  low_stock: "Low stock",
  coming_soon: "Coming soon",
  out_of_stock: "Out of stock",
  temporarily_unavailable: "Temporarily unavailable",
  archived: "Archived",
};

export function isOrderable(status: string): boolean {
  return status === "available" || status === "low_stock";
}

export const PRODUCT_TYPE_LABEL = {
  software: "Software",
  subscription: "Subscription",
  gift_card: "Gift card",
  game_top_up: "Game top-up",
} as const;

export const ACCOUNT_TYPE_LABEL = {
  private: "Private account, only you use it",
  shared: "Shared account, you get one profile or seat",
  own_account: "Activated on your own account",
  licence_key: "Licence key",
} as const;

export const DELIVERY_CHANNEL_LABEL = {
  email: "By email",
  order_page: "On your order page",
  email_and_order_page: "By email and on your order page",
} as const;

export const AVAILABILITY_LABEL: Readonly<Record<string, string>> = new Proxy(
  { available: "Available", low_stock: "Limited" },
  { get: (labels, status: string) => labels[status as keyof typeof labels] ?? "Unavailable" },
);

export function durationLabel(months: number): string | null {
  if (!Number.isInteger(months) || months <= 0) return null;
  if (months % 12 === 0) {
    const years = months / 12;
    return `${years} ${years === 1 ? "year" : "years"}`;
  }
  return `${months} ${months === 1 ? "month" : "months"}`;
}

export function percentOff(priceMinor: number, compareAtMinor?: number | null): number | null {
  if (!Number.isFinite(priceMinor) || priceMinor <= 0 ||
      compareAtMinor == null || !Number.isFinite(compareAtMinor) || compareAtMinor <= priceMinor) return null;
  return Math.floor(((compareAtMinor - priceMinor) / compareAtMinor) * 100);
}

export function categoryTypeFromSlug(slug: string): keyof typeof PRODUCT_TYPE_LABEL | null {
  switch (slug) {
    case "software": return "software";
    case "subscriptions": return "subscription";
    case "gift-cards": return "gift_card";
    case "game-top-ups": return "game_top_up";
    default: return null;
  }
}

export const SITE_URL = "https://mtdgc.com";

export const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: "Waiting for payment",
  pending_payment: "Waiting for payment",
  payment_submitted: "Payment proof received",
  paid: "Legacy payment status",
  verified: "Marked verified by staff",
  processing: "Processing",
  delivered: "Delivered",
  fulfilled: "Delivered",
  completed: "Delivered",
  rejected: "Rejected",
  failed: "Failed",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export const ORDER_STEPS: Array<{ title: string; body: string; statuses: string[] }> = [
  {
    title: "Payment proof received",
    body: "We have received a payment-proof submission for review. Uploading a screenshot or reference does not confirm that funds reached our account.",
    statuses: ["payment_submitted"],
  },
  {
    title: "Verified by staff",
    body: "An MTDGC administrator has marked this order as verified. This is a manual status; the app does not receive independent bank or payment-provider settlement confirmation.",
    statuses: ["verified"],
  },
  {
    title: "Processing",
    body: "Our team has marked this order as processing. This is a manual staff update, not a live supplier/API signal or proof of delivery.",
    statuses: ["processing"],
  },
  {
    title: "Delivered",
    body: "Our team has marked this order as delivered. Check your order page for delivery details; contact support if you cannot find them.",
    statuses: ["delivered", "fulfilled", "completed"],
  },
];

export const ORDER_NOTICE: Record<string, string> = {
  pending: "Waiting for payment.",
  pending_payment: "Waiting for payment.",
  paid: "This legacy/manual status is not independent confirmation that funds reached MTDGC.",
  rejected: "We could not match the payment. See the note and upload a new proof if asked.",
  cancelled: "This order was cancelled.",
  refunded: "This order was refunded.",
};

export function orderStepIndex(status: string): number {
  return ORDER_STEPS.findIndex((step) => step.statuses.includes(status));
}

/** Latest time an order entered any status belonging to the given step. */
export function stepTime(stepIndex: number, events: Array<{ status: string; at: string }>): string | null {
  const step = ORDER_STEPS[stepIndex];
  if (!step) return null;
  const times = events.filter((e) => step.statuses.includes(e.status)).map((e) => e.at).sort();
  const last = times[times.length - 1];
  return last ? new Date(last).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : null;
}
