export function formatNpr(minor: number): string {
  return `Rs ${(minor / 100).toLocaleString("en-NP", { maximumFractionDigits: 0 })}`;
}

// The only place the WhatsApp number is set. Leave empty until the owner provides a real number.
export const WHATSAPP_NUMBER: string = "";

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

export const SITE_URL = "https://mtdgc.com";

export const ORDER_STEPS: Array<{ title: string; body: string; statuses: string[] }> = [
  { title: "Payment received", body: "We have your payment screenshot and will check it against our account.", statuses: ["payment_submitted", "paid"] },
  { title: "Verified", body: "Your payment matched and the order is confirmed.", statuses: ["verified"] },
  { title: "Processing", body: "We are preparing your key, account details or code.", statuses: ["processing"] },
  { title: "Delivered", body: "Your order has been delivered to your order page and email.", statuses: ["delivered", "fulfilled", "completed"] },
];

export const ORDER_NOTICE: Record<string, string> = {
  pending: "Waiting for payment.",
  pending_payment: "Waiting for payment.",
  rejected: "We could not match the payment. See the note and upload a new proof if asked.",
  cancelled: "This order was cancelled.",
  refunded: "This order was refunded.",
};

export function orderStepIndex(status: string): number {
  return ORDER_STEPS.findIndex((step) => step.statuses.includes(status));
}
