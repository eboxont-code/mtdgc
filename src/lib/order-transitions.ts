export const ADMIN_ORDER_TRANSITIONS = {
  verified: ["processing"],
  processing: ["delivered"],
} as const;

export type AdminOrderTransition =
  (typeof ADMIN_ORDER_TRANSITIONS)[keyof typeof ADMIN_ORDER_TRANSITIONS][number];

/**
 * Returns the only generic admin fulfilment transitions allowed from a status.
 *
 * Payment decisions stay in reviewPayment. Legacy/manual paid, terminal
 * statuses, and cancellation/refund outcomes are intentionally not exposed
 * through the generic status editor.
 */
export function getAdminOrderStatusOptions(currentStatus: string): AdminOrderTransition[] {
  const transitions = ADMIN_ORDER_TRANSITIONS[currentStatus as keyof typeof ADMIN_ORDER_TRANSITIONS];
  return transitions ? [...transitions] : [];
}

/** Server-side guard shared with the admin UI; the server remains authoritative. */
export function canAdminTransitionOrder(currentStatus: string, nextStatus: string): boolean {
  return getAdminOrderStatusOptions(currentStatus).some((status) => status === nextStatus);
}
