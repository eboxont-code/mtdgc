import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { formatNpr, STATUS_LABEL } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin | MTDGC" },
      { name: "description", content: "MTDGC internal administration." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  status: string;
  is_published: boolean;
  product_variants: { sku: string; name: string; price_minor: number; stock_quantity: number | null; status: string }[] | null;
};
type OrderRow = { id: string; order_number: string; status: string; total_minor: number; created_at: string };
type TicketRow = { id: string; order_number: string | null; issue_type: string; status: string; created_at: string };
type ReviewRow = { id: string; rating: number; body: string; created_at: string };

const LOW_STOCK = 5;

function AdminPage() {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [orderCount, setOrderCount] = useState(0);
  const [ticketCount, setTicketCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [pendingReviews, setPendingReviews] = useState<ReviewRow[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [orderQuery, setOrderQuery] = useState("");
  const ORDER_STATUSES = ["pending", "processing", "paid", "failed", "cancelled", "refunded", "completed"];
  const visibleOrders = orders.filter((o) => o.order_number.toLowerCase().includes(orderQuery.trim().toLowerCase()));

  const updateOrderStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status: status as never }).eq("id", id);
    if (error) {
      setLoadError("Could not update that order status. Please try again.");
      return;
    }
    setOrders((rows) => rows.map((row) => (row.id === id ? { ...row, status } : row)));
  };


  const approveReview = async (id: string) => {
    const { error } = await supabase.from("reviews").update({ is_approved: true }).eq("id", id);
    if (error) {
      setLoadError("Could not approve that review. Please try again.");
      return;
    }
    setPendingReviews((rows) => rows.filter((row) => row.id !== id));
    setReviewCount((count) => Math.max(0, count - 1));
  };

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) return;
      const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      if (!active) return;
      setAllowed(Boolean(isAdmin));
      if (!isAdmin) return;

      const [productRows, orderRows, ticketRows, reviewRows] = await Promise.all([
        supabase
          .from("products")
          .select("id, name, slug, status, is_published, product_variants(sku, name, price_minor, stock_quantity, status)")
          .order("name"),
        supabase
          .from("orders")
          .select("id, order_number, status, total_minor, created_at", { count: "exact" })
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("support_tickets")
          .select("id, order_number, issue_type, status, created_at", { count: "exact" })
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("reviews")
          .select("id, rating, body, created_at", { count: "exact" })
          .eq("is_approved", false)
          .order("created_at", { ascending: false })
          .limit(10),
      ]);
      if (!active) return;
      if (productRows.error || orderRows.error || ticketRows.error || reviewRows.error) {
        setLoadError("Some admin data could not be loaded. Refresh to try again.");
      }
      setProducts((productRows.data ?? []) as ProductRow[]);
      setOrders((orderRows.data ?? []) as OrderRow[]);
      setTickets((ticketRows.data ?? []) as TicketRow[]);
      setPendingReviews((reviewRows.data ?? []) as ReviewRow[]);
      setOrderCount(orderRows.count ?? 0);
      setTicketCount(ticketRows.count ?? 0);
      setReviewCount(reviewRows.count ?? 0);
    })();
    return () => {
      active = false;
    };
  }, []);

  const lowStock = products.flatMap((product) =>
    (product.product_variants ?? [])
      .filter((v) => v.status === "low_stock" || (v.stock_quantity !== null && v.stock_quantity <= LOW_STOCK))
      .map((v) => ({ product: product.name, ...v })),
  );


  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 pb-16 pt-6">
        <h1 className="font-display text-[26px] font-medium md:text-4xl">Admin</h1>

        {allowed === null && <p className="mt-4 text-sm text-muted-foreground">Checking your access.</p>}

        {allowed === false && (
          <p className="mt-4 text-sm text-muted-foreground">
            This area is for MTDGC staff accounts. Your account does not have the admin role.
          </p>
        )}

        {allowed && (
          <>
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                ["Products", String(products.length)],
                ["Orders recorded", String(orderCount)],
                ["Support tickets", String(ticketCount)],
                ["Reviews awaiting approval", String(reviewCount)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg bg-panel p-4">
                  <p className="font-display text-xs uppercase tracking-[0.1em] text-muted-foreground">{label}</p>
                  <p className="mt-1 font-display text-2xl font-semibold">{value}</p>
                </div>
              ))}
            </div>

            <section className="mt-8">
              <h2 className="font-display text-lg font-medium">Catalog</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Products, categories, denominations and availability are stored in the database, so new lines can be
                added without changing the site design.
              </p>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border font-display text-xs uppercase tracking-[0.1em] text-muted-foreground">
                      <th scope="col" className="py-2">Product</th>
                      <th scope="col" className="py-2">Status</th>
                      <th scope="col" className="py-2">Published</th>
                      <th scope="col" className="py-2">Options</th>
                      <th scope="col" className="py-2">From</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => {
                      const prices = (product.product_variants ?? []).map((variant) => variant.price_minor);
                      return (
                        <tr key={product.id} className="border-b border-border">
                          <td className="py-2">{product.name}</td>
                          <td className="py-2">{STATUS_LABEL[product.status] ?? product.status}</td>
                          <td className="py-2">{product.is_published ? "Yes" : "No"}</td>
                          <td className="py-2">{prices.length}</td>
                          <td className="py-2">{prices.length ? formatNpr(Math.min(...prices)) : "Not set"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {products.length === 0 && (
                <p className="mt-3 text-sm text-muted-foreground">No products are in the catalog yet.</p>
              )}
            </section>

            {loadError && <p role="alert" className="mt-6 text-sm text-destructive">{loadError}</p>}

            <section className="mt-8">
              <h2 className="font-display text-lg font-medium">Low stock</h2>
              {lowStock.length ? (
                <ul className="mt-2 divide-y divide-border text-sm">
                  {lowStock.map((v) => (
                    <li key={v.sku} className="flex justify-between py-2">
                      <span>{v.product}, {v.name} <span className="text-xs text-muted-foreground">({v.sku})</span></span>
                      <span>{v.stock_quantity === null ? "Marked low" : `${v.stock_quantity} left`}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">No options are low on stock or marked low.</p>
              )}
            </section>

            <section className="mt-8">
              <h2 className="font-display text-lg font-medium">Latest orders</h2>
              <label className="mt-2 block">
                <span className="sr-only">Search orders by MTD reference</span>
                <input
                  value={orderQuery}
                  onChange={(e) => setOrderQuery(e.target.value)}
                  placeholder="Search by MTD reference"
                  className="h-10 w-full rounded-md border border-border bg-card px-3 font-display text-sm"
                />
              </label>
              {visibleOrders.length ? (
                <ul className="mt-2 divide-y divide-border text-sm">
                  {visibleOrders.map((o) => (
                    <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                      <span className="font-display">{o.order_number}</span>
                      <label>
                        <span className="sr-only">Status for {o.order_number}</span>
                        <select
                          value={o.status}
                          onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                          className="h-8 rounded-md border border-border bg-card px-2 text-sm"
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </label>
                      <span>{formatNpr(o.total_minor)}</span>
                      <span className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">
                  {orders.length ? "No orders match that reference." : "No orders are recorded in the system yet. WhatsApp orders are handled in chat."}
                </p>
              )}
            </section>

            <section className="mt-8">
              <h2 className="font-display text-lg font-medium">Support requests</h2>
              {tickets.length ? (
                <ul className="mt-2 divide-y divide-border text-sm">
                  {tickets.map((t) => (
                    <li key={t.id} className="flex flex-wrap justify-between gap-2 py-2">
                      <span>{t.issue_type}</span>
                      <span className="text-muted-foreground">{t.order_number ?? "No order number"}</span>
                      <span>{t.status}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">No support requests yet.</p>
              )}
            </section>

            <section className="mt-8">
              <h2 className="font-display text-lg font-medium">Reviews awaiting approval</h2>
              {pendingReviews.length ? (
                <ul className="mt-2 space-y-3 text-sm">
                  {pendingReviews.map((r) => (
                    <li key={r.id} className="rounded-lg border border-border p-3">
                      <p className="font-display">{r.rating} out of 5</p>
                      <p className="mt-1 text-muted-foreground">{r.body}</p>
                      <Button size="sm" className="mt-2" onClick={() => approveReview(r.id)}>Approve</Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">Nothing to moderate.</p>
              )}
            </section>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
