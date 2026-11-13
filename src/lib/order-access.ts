export type OrderAccessRecord = {
  user_id?: string | null;
  access_token_hash?: string | null;
  verification_hash?: string | null;
  guest_email?: string | null;
};

export type PaymentProofOrder = {
  id: string;
  total_minor: number;
};

export function normaliseContact(contact: string): string {
  const value = contact.trim().toLowerCase();
  return value.includes("@") ? value : value.replace(/\D/g, "");
}

export async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

/** An access token is a bearer secret scoped to one order by its stored hash. */
export async function hasOrderAccessToken(order: OrderAccessRecord, accessToken?: string): Promise<boolean> {
  if (!accessToken || !order.access_token_hash) return false;
  return (await sha256Hex(accessToken)) === order.access_token_hash;
}

/** Authenticated access is valid only for the account recorded on the order. */
export function isAuthenticatedOrderOwner(order: OrderAccessRecord, authenticatedUserId?: string | null): boolean {
  return Boolean(authenticatedUserId && order.user_id && authenticatedUserId === order.user_id);
}

/** Contact fallback is guest-only and is used only after the caller's rate limit check. */
export async function hasOrderContactAccess(
  order: OrderAccessRecord,
  orderNumber: string,
  contact?: string,
): Promise<boolean> {
  if (order.user_id || !contact?.trim()) return false;
  const normalised = normaliseContact(contact);
  const hashMatches = Boolean(order.verification_hash)
    && (await sha256Hex(orderNumber.toUpperCase() + normalised)) === order.verification_hash;
  const emailMatches = normalised.includes("@") && order.guest_email?.toLowerCase() === normalised;
  return hashMatches || emailMatches;
}

/**
 * Build both storage and database references from the server-resolved order.
 * No order ID, amount, or storage path is accepted from the customer request.
 */
export function buildPaymentProofAssociation(
  order: PaymentProofOrder,
  nonce: string,
  extension: "jpg" | "png" | "webp",
  transactionRef: string,
): {
  storagePath: string;
  proof: { order_id: string; transaction_ref: string; amount_minor: number };
} {
  if (!/^[0-9a-f]{32}$/i.test(nonce)) throw new Error("Invalid payment proof identifier");
  return {
    storagePath: `${order.id}/${nonce}.${extension}`,
    proof: {
      order_id: order.id,
      transaction_ref: transactionRef,
      amount_minor: order.total_minor,
    },
  };
}
