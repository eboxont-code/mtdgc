import { useState } from "react";
import { Button } from "@/components/ui/button";
import { orderStatusLabel } from "@/lib/format";
import { DASHBOARD_FILTERS, dashboardMetrics, matchesDashboardFilter, sortFulfilmentQueue, type DashboardFilter, type DashboardOrder } from "@/lib/order-dashboard";

type Props = { orders: DashboardOrder[] | null; error: string; days: 0 | 7 | 30 | 90; onPeriodChange: (days: 0 | 7 | 30 | 90) => void; onSelectOrder: (id: string) => void };
const rate = (value: number | null) => value === null ? "Not enough data" : `${value.toFixed(1)}%`;
const duration = (value: number | null) => value === null ? "Not enough data" : `${Math.round(value / 60000)} minutes`;

export function OrderDashboardPanel({ orders, error, days, onPeriodChange, onSelectOrder }: Props) {
  const [filter, setFilter] = useState<DashboardFilter>("All");
  const [query, setQuery] = useState("");
  const [queue, setQueue] = useState(false);
  const metrics = orders === null ? null : dashboardMetrics(orders);
  const candidates = orders === null ? [] : queue ? sortFulfilmentQueue(orders) : orders;
  const visible = candidates.filter((order) => matchesDashboardFilter(order, filter) && order.order_number.toLowerCase().includes(query.trim().toLowerCase()));
  return <section className="mt-6 min-w-0" aria-labelledby="order-dashboard-title">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 id="order-dashboard-title" className="font-display text-lg font-medium">Order dashboard</h2>
      <label className="flex min-h-11 items-center gap-2 text-sm">Created in
        <select aria-label="Order reporting period" value={days} onChange={(event) => { const value = Number(event.target.value); if (value === 0 || value === 7 || value === 30 || value === 90) onPeriodChange(value); }} className="min-h-11 rounded-md border border-input bg-card px-3 text-base">
          <option value={7}>Last 7 days</option><option value={30}>Last 30 days</option><option value={90}>Last 90 days</option><option value={0}>All time</option>
        </select>
      </label>
    </div>
    {error ? <p role="alert" className="mt-3 text-sm text-destructive">{error}</p> : orders === null ? <p role="status" className="mt-3 text-sm text-muted-foreground">Loading order dashboard.</p> : <>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {DASHBOARD_FILTERS.filter((item) => item !== "All").map((item) => <Button key={item} variant={filter === item ? "primary" : "outline"} disabled={item === "Overdue"} aria-pressed={filter === item} onClick={() => setFilter(item)} className="h-auto min-h-16 min-w-0 flex-col whitespace-normal py-3 text-center"><span>{item}</span><span className="font-display text-xl">{item === "Overdue" ? "Not set" : orders.filter((order) => matchesDashboardFilter(order, item)).length}</span></Button>)}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Paid includes recorded paid and verified orders. Overdue is not classified: no approved threshold is recorded.</p>
      {metrics && <>
        <dl className="mt-5 grid gap-3 sm:grid-cols-3">{[["Order completion rate", rate(metrics.completionRate)], ["Failed fulfilment rate", rate(metrics.failedFulfilmentRate)], ["Refund rate", rate(metrics.refundRate)], ["Creation to verification", duration(metrics.verificationMedianMs)], ["Verification to delivery", duration(metrics.deliveryMedianMs)]].map(([label, value]) => <div key={label} className="border-b border-border py-3"><dt className="text-sm text-muted-foreground">{label}</dt><dd className="mt-1 font-display text-lg">{value}</dd></div>)}</dl>
        <details className="mt-3 text-xs text-muted-foreground"><summary className="flex min-h-11 cursor-pointer items-center">Calculation details</summary><p>Period uses order creation date. Completion = delivered, fulfilled or completed / all orders. Failed fulfilment = currently failed with a failure event after recorded verification / orders with recorded verification. Refund = refunded / all orders. Each rate is multiplied by 100. These are status-based metrics, not independent settlement or supplier evidence.</p><p className="mt-2">Times are medians from verified proof review timestamps and subsequent delivery events. Verification samples: {metrics.verificationSamples}. Delivery samples: {metrics.deliverySamples}. Missing timestamps are excluded, not estimated.</p></details>
      </>}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant={!queue ? "primary" : "outline"} className="min-h-11" aria-pressed={!queue} onClick={() => setQueue(false)}>All orders</Button>
        <Button variant={queue ? "primary" : "outline"} className="min-h-11" aria-pressed={queue} onClick={() => { setQueue(true); setFilter("All"); }}>Fulfilment queue</Button>
        <label className="flex min-h-11 items-center gap-2 text-sm">Status<select value={filter} onChange={(event) => { const value = DASHBOARD_FILTERS.find((item) => item === event.target.value); if (value) setFilter(value); }} className="min-h-11 rounded-md border border-input bg-card px-3 text-base">{DASHBOARD_FILTERS.map((item) => <option key={item} disabled={item === "Overdue"}>{item}</option>)}</select></label>
      </div>
      {queue && <p className="mt-2 text-xs text-muted-foreground">Paid and verified first, then oldest waiting. Saved player, zone or server details are flagged for additional checking.</p>}
      <label className="mt-3 block text-sm">Search order reference<input value={query} onChange={(event) => setQuery(event.target.value)} maxLength={40} className="mt-1 min-h-11 w-full rounded-md border border-input bg-card px-3 text-base" /></label>
      <p role="status" className="mt-2 text-sm text-muted-foreground">{visible.length} matching orders</p>
      {visible.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">No orders match this period and filter.</p> : <>
        <ul className="mt-3 divide-y divide-border md:hidden">{visible.map((order) => <li key={order.id} className="py-3"><Button variant="ghost" className="min-h-11 max-w-full break-all whitespace-normal text-left" onClick={() => onSelectOrder(order.id)}>{order.order_number}</Button><p className="text-sm">{orderStatusLabel(order.status)}</p><time className="text-xs text-muted-foreground" dateTime={order.created_at}>{new Date(order.created_at).toLocaleString()}</time>{order.topUp && <p className="mt-1 text-sm text-warn">Player details: check before irreversible fulfilment.</p>}</li>)}</ul>
        <table className="mt-3 hidden w-full table-fixed text-left text-sm md:table"><thead><tr className="border-b border-border"><th className="py-3">Order</th><th>Status</th><th>Created</th><th>Risk check</th></tr></thead><tbody>{visible.map((order) => <tr key={order.id} className="border-b border-border"><td className="py-2"><Button variant="ghost" className="min-h-11 max-w-full break-all whitespace-normal text-left" onClick={() => onSelectOrder(order.id)}>{order.order_number}</Button></td><td>{orderStatusLabel(order.status)}</td><td>{new Date(order.created_at).toLocaleString()}</td><td>{order.topUp ? <span className="text-warn">Check player details</span> : "Not stated"}</td></tr>)}</tbody></table>
      </>}
    </>}
  </section>;
}