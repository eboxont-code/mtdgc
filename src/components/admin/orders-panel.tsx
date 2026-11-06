import { Button } from "@/components/ui/button";
import { getAdminOrderStatusOptions } from "@/lib/order-transitions";
import { formatNpr } from "@/lib/format";
import type { OrderRow } from "./panel-types";
type Props = {
 orders: OrderRow[];
 orderQuery: string;
 setOrderQuery: (query: string) => void;
 onSelectOrder: (id: string) => void;
 onStatusChange: (id: string, status: string) => void;
};
export function OrdersPanel({ orders, orderQuery, setOrderQuery, onSelectOrder, onStatusChange }: Props) {
 const visibleOrders = orders.filter((o) => o.order_number.toLowerCase().includes(orderQuery.trim().toLowerCase()));
 return (
            <section className="mt-8">
              <h2 className="font-display text-lg font-medium">Latest orders</h2>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[["Awaiting payment", ["pending", "pending_payment"]], ["Processing", ["processing"]], ["Delivered", ["delivered", "completed", "fulfilled"]]].map(([label, statuses]) => <div key={String(label)} className="border-b border-border py-3"><p className="text-sm text-muted-foreground">{label}</p><p className="font-display text-2xl">{orders.filter((o) => (statuses as string[]).includes(o.status)).length}</p><p className="text-xs text-muted-foreground">In latest loaded orders</p></div>)}
              </div>
              <label className="mt-2 block">
                <span className="sr-only">Search orders by MTD reference</span>
                <input
                  value={orderQuery}
                  onChange={(e) => setOrderQuery(e.target.value)}
                  placeholder="Search by MTD reference"
                  className="min-h-11 w-full rounded-md border border-input bg-card px-3 font-display text-sm"
                />
              </label>
              {visibleOrders.length ? (
                <ul className="mt-2 divide-y divide-border text-sm">
                  {visibleOrders.map((o) => {
                    const availableStatuses = getAdminOrderStatusOptions(o.status);
                    return (
                    <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                      <Button variant="ghost" className="min-h-11 font-display" onClick={() => onSelectOrder(o.id)}>{o.order_number}</Button>
                      <label>
                        <span className="sr-only">Status for {o.order_number}</span>
                        <select
                          value={o.status}
                          disabled={availableStatuses.length === 0}
                          onChange={(e) => onStatusChange(o.id, e.target.value)}
                          className="min-h-11 rounded-md border border-input bg-card px-2 text-base"
                        >
                          <option value={o.status} disabled>{o.status.replaceAll("_", " ")}</option>
                          {availableStatuses.map((status) => (
                            <option key={status} value={status}>{status.replaceAll("_", " ")}</option>
                          ))}
                        </select>
                      </label>
                      <span>{formatNpr(o.total_minor)}</span>
                      <span className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</span>
                    </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">
                  {orders.length ? "No orders match that reference." : "No orders are recorded yet."}
                </p>
              )}
            </section>
 );
}
