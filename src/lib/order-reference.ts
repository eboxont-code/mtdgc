const ORDER_REFERENCE_PREFIX = "MT";
const ORDER_REFERENCE_RANDOM_BYTES = 16;

/**
 * Generate a customer-facing order reference with 128 bits of cryptographic
 * randomness. The database UNIQUE constraint remains the final uniqueness
 * guarantee; callers retry a unique-key collision.
 */
export function generateOrderReference(): string {
  const bytes = globalThis.crypto.getRandomValues(new Uint8Array(ORDER_REFERENCE_RANDOM_BYTES));
  const suffix = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("").toUpperCase();
  return `${ORDER_REFERENCE_PREFIX}${suffix}`;
}

const ORDER_REFERENCE_PATTERN = /^(?:MT[0-9A-F]{32}|MT\d{6}|(?:MTD|MTDGC)-[A-Z0-9-]{4,})$/;

/** Accept new references and historical formats already used by the storefront. */
export function isSupportedOrderReference(value: string): boolean {
  return ORDER_REFERENCE_PATTERN.test(value.trim().toUpperCase());
}
