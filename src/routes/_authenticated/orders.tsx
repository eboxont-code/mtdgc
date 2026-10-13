import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ORDER_NOTICE, ORDER_STEPS, orderStepIndex, formatNpr, whatsappLink } from "@/lib/format";

type Order = { id: string; order_number: string; status: string; total_minor: number; created_at: string };

export const Route = createFileRoute("/_authenticated/orders")({
  head: () => ({
    meta: [
      { title: "Your orders | MTDGC" },
      { name: "description", content: "Your MTDGC order history and status." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrdersPage,
});

function OrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    supabase
      .from("orders")
      .select("id, order_number, status, total_minor, created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => setOrders((data ?? []) as Order[]));
  }, []);

  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="focus:outline-none mx-auto max-w-4xl px-4 pb-16 pt-6">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Account", to: "/account" }, { label: "Orders" }]} />
        <h1 className="font-display text-[26px] font-medium md:text-4xl">Your orders</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Orders confirmed by MTDGC appear here. Orders still being arranged on WhatsApp may take a little while to show.
        </p>
        {orders === null ? (
          <p className="mt-6 text-sm text-muted-foreground">Loading your orders.</p>
        ) : orders.length === 0 ? (
          <div className="mt-8 rounded-lg border border-border py-14 text-center">
            <p className="font-display font-medium">No orders on this account yet</p>
            <p className="mt-1 text-sm text-muted-foreground">When you place an order it will be listed here.</p>
            <Button asChild className="mt-4"><Link to="/catalog">Browse the catalog</Link></Button>
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {orders.map((order) => (
              <li key={order.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-4">
                <div className="min-w-0 flex-1">
                  <p className="font-display font-medium">{order.order_number}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString("en-GB")} · {formatNpr(order.total_minor)}
                  </p>
                </div>
                <span className="rounded bg-secondary px-2 py-0.5 font-display text-[10px] uppercase tracking-[0.1em]">
                  {ORDER_NOTICE[order.status] ?? ORDER_STEPS[orderStepIndex(order.status)]?.title ?? order.status}
                </span>
                {whatsappLink() ? (
                  <Button asChild variant="outline" size="sm">
                    <a href={whatsappLink(`Hello MTDGC, I would like to order again: ${order.order_number}`)!} target="_blank" rel="noreferrer">
                      Order again
                    </a>
                  </Button>
                ) : (
                  <Button asChild variant="outline" size="sm"><Link to="/catalog">Order again</Link></Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
