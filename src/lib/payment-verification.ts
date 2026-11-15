export const PAYMENT_GATE_ERROR = "Payment must be verified for this order before processing or delivery. Use Payments to verify; a screenshot alone is not settlement evidence.";
export const DUPLICATE_REFERENCE_ERROR = "This transaction reference is attached to another order. Verification is blocked pending admin review.";

type Proof = { order_id: string; status: string; amount_minor: number; reviewed_at: string | null; reviewed_by: string | null };

export function hasVerifiedOrderPayment(orderId: string, totalMinor: number, proofs: Proof[]): boolean {
  return proofs.some((proof) => proof.order_id === orderId && proof.status === "verified" && proof.amount_minor === totalMinor && Boolean(proof.reviewed_by) && Boolean(proof.reviewed_at));
}

export function normalisePaymentReference(reference: string): string {
  return reference.trim().toLowerCase();
}

export function hasDuplicatePaymentReference(orderId: string, reference: string, proofs: { order_id: string; transaction_ref: string }[]): boolean {
  const normalised = normalisePaymentReference(reference);
  return normalised.length > 0 && proofs.some((proof) => proof.order_id !== orderId && normalisePaymentReference(proof.transaction_ref) === normalised);
}