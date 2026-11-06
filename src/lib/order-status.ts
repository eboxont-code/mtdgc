export const ORDER_STATUS_LABELS: Readonly<Record<string, string>> = {
  pending: "Waiting for payment",
  pending_payment: "Waiting for payment",
  payment_submitted: "Payment proof submitted",
  paid: "Payment marked received",
  verified: "Payment proof reviewed",
  processing: "Processing",
  delivered: "Delivered",
  fulfilled: "Delivered",
  completed: "Delivered",
  rejected: "Payment proof rejected",
  failed: "Failed",
  cancelled: "Cancelled",
  refunded: "Refund marked",
};

export const ORDER_NOTICE: Readonly<Record<string, string>> = {
  pending: "Waiting for payment.",
  pending_payment: "Waiting for payment. Follow the payment instructions provided for this order.",
  payment_submitted:
    "Your payment proof was submitted and is awaiting manual review. A screenshot alone does not confirm that funds have settled.",
  paid:
    "Staff marked payment as received under this legacy status. It is not an independent bank-settlement confirmation.",
  verified:
    "An administrator reviewed and accepted the submitted payment proof. This is a manual review, not an automatic bank-settlement confirmation.",
  processing: "Staff have marked your order as being prepared. Fulfilment is handled manually.",
  delivered: "Staff have marked your order as delivered. Contact support if you cannot access the item.",
  fulfilled: "This legacy status is displayed as Delivered. Contact support if you cannot access the item.",
  completed: "This legacy status is displayed as Delivered. Contact support if you cannot access the item.",
  rejected: "The submitted payment proof was rejected. Check any staff note and upload another proof if requested.",
  failed: "This order is marked as failed. Contact support if you need help.",
  cancelled: "This order is marked as cancelled. Contact support if you need help.",
  refunded: "This order is marked as refunded. Contact support if you need details of the refund transaction.",
};

export function orderStatusLabel(status: string): string {
  return ORDER_STATUS_LABELS[status] ?? "Status update";
}

export const ORDER_STEPS: Array<{ title: string; body: string; statuses: string[] }> = [
  {
    title: "Payment",
    body: "Follow the payment instructions for your order and submit proof if requested. Staff review proof manually; a screenshot alone does not confirm that funds have settled.",
    statuses: ["pending", "pending_payment", "payment_submitted", "paid"],
  },
  {
    title: "Payment proof reviewed",
    body: "An administrator has reviewed and accepted the submitted proof. This is a manual review, not an automatic bank-settlement confirmation.",
    statuses: ["verified"],
  },
  {
    title: "Processing",
    body: "Staff are preparing your order. Fulfilment is handled manually.",
    statuses: ["processing"],
  },
  {
    title: "Delivered",
    body: "Staff have marked your order as delivered. Contact support if you cannot access the item.",
    statuses: ["delivered", "fulfilled", "completed"],
  },
];

export function orderStepIndex(status: string): number {
  return ORDER_STEPS.findIndex((step) => step.statuses.includes(status));
}

/** Latest time an order entered any status belonging to the given step. */
export function stepTime(stepIndex: number, events: Array<{ status: string; at: string }>): string | null {
  const step = ORDER_STEPS[stepIndex];
  if (!step) return null;
  const times = events.filter((event) => step.statuses.includes(event.status)).map((event) => event.at).sort();
  const last = times[times.length - 1];
  return last ? new Date(last).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : null;
}
