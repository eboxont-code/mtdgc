export const SUPPLIER_REFERENCE_EVENT_STATUS = "supplier_reference";
export const MAX_SUPPLIER_REFERENCE_LENGTH = 500;

const SUPPLIER_REFERENCE_ORDER_STATUSES = new Set([
  "processing",
  "delivered",
  "fulfilled",
  "completed",
]);

/** References may be captured once fulfilment starts and remain available after delivery. */
export function canRecordSupplierReference(status: string): boolean {
  return SUPPLIER_REFERENCE_ORDER_STATUSES.has(status);
}

/** Trim only surrounding whitespace; preserve supplier-issued case and internal characters. */
export function normaliseSupplierReference(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const reference = value.trim();
  if (!reference || reference.length > MAX_SUPPLIER_REFERENCE_LENGTH) return null;
  return reference;
}

export function isSupplierReferenceEventStatus(status: string): boolean {
  return status === SUPPLIER_REFERENCE_EVENT_STATUS;
}

export function isSupplierReferenceEvent(event: { status: string; note: string | null }): boolean {
  return isSupplierReferenceEventStatus(event.status);
}

export function getSupplierReferenceFromEvent(event: { status: string; note: string | null }): string | null {
  if (!isSupplierReferenceEvent(event)) return null;
  return normaliseSupplierReference(event.note);
}
