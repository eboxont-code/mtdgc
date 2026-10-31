import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useState } from "react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { ORDER_NOTICE, ORDER_STEPS, orderStepIndex, stepTime, formatNpr, SITE_URL } from "@/lib/format";
import { listMyOrders } from "@/lib/orders.functions";
import { EmptyState } from "@/components/empty-state";
import { Package } from "lucide-react";

type Order = Awaited<ReturnType<typeof listMyOrders>>[number];

export const Route = createFileRoute("/_authenticated/orders")({
  head: () => ({
    meta: [
      { title: "Your orders | MTDGC" },
      { name: "description", content: "Your MTDGC order history and status." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Your orders | MTDGC" },
      { property: "og:description", content: "Your MTDGC order history and status." },
      { name: "twitter:title", content: "Your orders | MTDGC"  },
      { name: "twitter:description", content: "Your MTDGC order history and status."  },
      { property: "og:url", content: `${SITE_URL}/orders` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/orders` }],
  }),
  component: OrdersPage,
});

function OrdersPage() {
  const fetchOrders = useServerFn(listMyOrders);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setError(false);
    setOrders(null);
    fetchOrders()
      .then(setOrders)
      .catch(() => setError(true));
  }, [fetchOrders]);

  useEffect(load, [load]);

  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="focus:outline-none mx-auto max-w-4xl px-4 pb-28 pt-6">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Account", to: "/account" }, { label: "Orders" }]} />
        <h1 className="font-display text-[26px] font-medium md:text-4xl">Your orders</h1>
        <p className="mt-2 text-sm text-muted-foreground">Orders you place while signed in are listed here with their current status.</p>
        {error ? (
          <div role="alert" className="mt-6 rounded-lg border border-glass-border bg-glass-bg p-4 text-sm">
            <p>We could not load your orders.</p>
            <Button className="mt-3 min-h-11" variant="outline" onClick={load}>Try again</Button>
          </div>
        ) : orders === null ? (
          <p className="mt-6 text-sm text-muted-foreground">Loading your orders.</p>
        ) : orders.length === 0 ? (
          <EmptyState icon={Package} title="No orders on this account yet" text="When you place an order it will be listed here." action={<Button asChild className="min-h-11"><Link to="/catalog">Browse the catalog</Link></Button>} />
        ) : (
          <ul className="mt-6 space-y-3">
            {orders.map((order) => {
              const current = orderStepIndex(order.status);
              return (
                <li key={order.id} className="rounded-lg border border-glass-border bg-glass-bg p-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-display font-medium">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("en-GB")} · {formatNpr(order.totalMinor)}
                      </p>
                    </div>
                    <span className="rounded bg-secondary px-2 py-0.5 font-display text-[10px] uppercase tracking-[0.1em]">
                      {ORDER_NOTICE[order.status] ?? ORDER_STEPS[current]?.title ?? order.status}
                    </span>
                  </div>
                  <ol className="mt-3 grid gap-2 sm:grid-cols-4">
                    {ORDER_STEPS.map((step, index) => (
                      <li key={step.title} aria-current={index === current ? "step" : undefined} className={`text-xs ${index <= current ? "text-foreground" : "text-muted-foreground"}`}>
                        <span className={`font-display ${index === current ? "font-semibold text-primary" : ""}`}>{index + 1}. {step.title}</span>
                        {index <= current && stepTime(index, order.events) && <span className="block">{stepTime(index, order.events)}</span>}
                      </li>
                    ))}
                  </ol>
                  <details className="mt-3">
                    <summary className="flex min-h-11 cursor-pointer items-center font-display text-sm">Order details</summary>
                    <ul className="mt-1 space-y-1 text-sm">
                      {order.items.map((item, i) => (
                        <li key={i} className="flex justify-between gap-3">
                          <span>{item.quantity} × {item.name}</span>
                          <span className="font-display">{formatNpr(item.totalMinor)}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to="/order/$orderNumber" params={{ orderNumber: order.orderNumber }} className="mt-2 inline-flex min-h-11 items-center text-sm text-primary underline">
                      Open order page
                    </Link>
                    <p className="mt-2 text-sm text-muted-foreground">To order again, find the current listing and check its available options. Saved order details are not added automatically.</p>
                    <Button asChild variant="outline" className="mt-2 min-h-11"><Link to="/catalog">Find items to order again</Link></Button>
                  </details>
                </li>
              );
            })}
          </ul>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
