export type DashboardOrder = {
  id: string;
  order_number: string;
  status: string;
  total_minor: number;
  created_at: string;
  events: { status: string; created_at: string }[];
  verifiedAt: string | null;
  topUp: boolean;
};

// No owner-approved overdue threshold is recorded. Null disables overdue classification,
// rather than inventing a delivery promise. Set only after the owner documents a threshold.
export const OVERDUE_THRESHOLD_MS: number | null = null;
export const DASHBOARD_FILTERS = ["All", "Paid", "Awaiting verification", "Processing", "Overdue", "Delivered", "Failed", "Refunded"] as const;
export type DashboardFilter = typeof DASHBOARD_FILTERS[number];
const delivered = new Set(["delivered", "fulfilled", "completed"]);

export function matchesDashboardFilter(order: DashboardOrder, filter: DashboardFilter): boolean {
  switch (filter) {
    case "Paid": return ["paid", "verified"].includes(order.status);
    case "Awaiting verification": return order.status === "payment_submitted";
    case "Processing": return order.status === "processing";
    case "Overdue": return false;
    case "Delivered": return delivered.has(order.status);
    case "Failed": return order.status === "failed";
    case "Refunded": return order.status === "refunded";
    default: return true;
  }
}

export function sortFulfilmentQueue(orders: DashboardOrder[]): DashboardOrder[] {
  const priority = (order: DashboardOrder) => ["paid", "verified"].includes(order.status) ? 0 : 1;
  return orders.filter((order) => ["paid", "verified", "processing"].includes(order.status)).sort((a, b) => priority(a) - priority(b) || a.created_at.localeCompare(b.created_at) || Number(b.topUp) - Number(a.topUp) || a.id.localeCompare(b.id));
}

export function median(values: number[]): number | null {
  const sorted = values.filter((value) => Number.isFinite(value) && value >= 0).sort((a, b) => a - b);
  if (!sorted.length) return null;
  const middle = Math.floor(sorted.length / 2);
  const upper = sorted[middle];
  const lower = sorted[middle - 1];
  if (upper === undefined) return null;
  return sorted.length % 2 || lower === undefined ? upper : (lower + upper) / 2;
}

export function dashboardMetrics(orders: DashboardOrder[]) {
  const verifiedOrders = orders.filter((order) => order.verifiedAt);
  const failedAfterVerification = verifiedOrders.filter((order) => order.status === "failed" && order.events.some((event) => event.status === "failed" && Date.parse(event.created_at) >= Date.parse(order.verifiedAt ?? "")));
  const verificationDurations = verifiedOrders.map((order) => Date.parse(order.verifiedAt ?? "") - Date.parse(order.created_at));
  const deliveryDurations = verifiedOrders.flatMap((order) => {
    const at = order.events.filter((event) => delivered.has(event.status) && Date.parse(event.created_at) >= Date.parse(order.verifiedAt ?? "")).map((event) => event.created_at).sort()[0];
    return at ? [Date.parse(at) - Date.parse(order.verifiedAt ?? "")] : [];
  });
  return {
    completionRate: orders.length ? orders.filter((order) => delivered.has(order.status)).length / orders.length * 100 : null,
    failedFulfilmentRate: verifiedOrders.length ? failedAfterVerification.length / verifiedOrders.length * 100 : null,
    refundRate: orders.length ? orders.filter((order) => order.status === "refunded").length / orders.length * 100 : null,
    verificationMedianMs: median(verificationDurations),
    deliveryMedianMs: median(deliveryDurations),
    verificationSamples: verificationDurations.filter((value) => Number.isFinite(value) && value >= 0).length,
    deliverySamples: deliveryDurations.length,
  };
}