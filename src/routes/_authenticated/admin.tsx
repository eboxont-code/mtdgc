import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
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
  product_variants: { sku: string; price_minor: number }[] | null;
};

function AdminPage() {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [orderCount, setOrderCount] = useState(0);
  const [ticketCount, setTicketCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

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

      const [productRows, orders, tickets, reviews] = await Promise.all([
        supabase.from("products").select("id, name, slug, status, is_published, product_variants(sku, price_minor)"),
        supabase.from("orders").select("id", { count: "exact", head: true }),
        supabase.from("support_tickets").select("id", { count: "exact", head: true }),
        supabase.from("reviews").select("id", { count: "exact", head: true }).eq("is_approved", false),
      ]);
      if (!active) return;
      setProducts((productRows.data ?? []) as ProductRow[]);
      setOrderCount(orders.count ?? 0);
      setTicketCount(tickets.count ?? 0);
      setReviewCount(reviews.count ?? 0);
    })();
    return () => {
      active = false;
    };
  }, []);

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
            </section>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
