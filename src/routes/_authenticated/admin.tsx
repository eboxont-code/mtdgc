import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { approveReview as approveReviewServer, archiveProduct as archiveProductServer, updateOrderStatus as updateOrderStatusServer } from "@/lib/admin.functions";

import { CatalogPanel } from "@/components/admin/catalog-panel";
import { OrdersPanel } from "@/components/admin/orders-panel";
import { SupportPanel } from "@/components/admin/support-panel";
import { ReviewsPanel } from "@/components/admin/reviews-panel";
import type { ProductRow, OrderRow, TicketRow, ReviewRow } from "@/components/admin/panel-types";
import { PaymentsPanel } from "@/components/admin/payments-panel";
import { VerifyPanel } from "@/components/admin/verify-panel";
import { OrderDetailPanel } from "@/components/admin/order-detail-panel";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { SITE_URL } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin | MTDGC" },
      { name: "description", content: "MTDGC internal administration." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin | MTDGC" },
      { property: "og:description", content: "MTDGC internal administration." },
      { name: "twitter:title", content: "Admin | MTDGC"  },
      { name: "twitter:description", content: "MTDGC internal administration."  },
      { property: "og:url", content: `${SITE_URL}/admin` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/admin` }],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [tab, setTab] = useState<"overview" | "catalog" | "orders" | "support" | "reviews" | "verify" | "payments">("overview");
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [draftsOnly, setDraftsOnly] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  const [ticketCount, setTicketCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [pendingReviews, setPendingReviews] = useState<ReviewRow[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [orderQuery, setOrderQuery] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const updateOrderStatusFn = useServerFn(updateOrderStatusServer);
  const archiveProductFn = useServerFn(archiveProductServer);
  const approveReviewFn = useServerFn(approveReviewServer);

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      await updateOrderStatusFn({ data: { id, status: status as never } });
    } catch {
      setLoadError("Could not update that order status. Please try again.");
      toast.error("Could not update that order status. Please try again.");
      return;
    }
    setOrders((rows) => rows.map((row) => (row.id === id ? { ...row, status } : row)));
  };

  const approveReview = async (id: string) => {
    try {
      await approveReviewFn({ data: { id } });
    } catch {
      setLoadError("Could not approve that review. Please try again.");
      toast.error("Could not approve that review. Please try again.");
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
  }, [reloadKey]);

  const archiveProduct = async (id: string) => {
    try {
      await archiveProductFn({ data: { id } });
      setProducts((rows) => rows.map((r) => r.id === id ? { ...r, status: "archived", is_published: false } : r));
    } catch {
      setLoadError("Could not archive that product. Please try again.");
      toast.error("Could not archive that product. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="focus:outline-none mx-auto max-w-5xl px-4 pb-28 pt-6">
        <h1 className="font-display text-[26px] font-medium md:text-4xl">Admin</h1>

        {allowed === null && <p className="mt-4 text-sm text-muted-foreground">Checking your access.</p>}

        {allowed === false && (
          <p className="mt-4 text-sm text-muted-foreground">
            This area is for MTDGC staff accounts. Your account does not have the admin role.
          </p>
        )}

        {allowed && (
          <>
            <div role="tablist" aria-label="Admin sections" className="mt-6 flex max-w-full gap-2 overflow-x-auto pb-2">
              {(["overview", "catalog", "orders", "support", "reviews", "verify", "payments"] as const).map((t) => (
                <Button key={t} role="tab" aria-selected={tab === t} variant={tab === t ? "primary" : "outline"} size="sm" className="min-h-11 shrink-0" aria-controls={`admin-${t}`} id={`admin-tab-${t}`} onClick={() => setTab(t)}>
                  {t === "overview" ? "Overview" : t === "verify" ? "Payments to verify" : t === "payments" ? "Payment settings" : t === "catalog" ? "Catalog" : t === "orders" ? "Orders" : t === "support" ? "Support" : "Reviews"}
                </Button>
              ))}
            </div>
            {tab === "verify" && <div role="tabpanel" id="admin-verify" aria-labelledby="admin-tab-verify" className="mt-6"><VerifyPanel /></div>}
            {tab === "payments" && <div role="tabpanel" id="admin-payments" aria-labelledby="admin-tab-payments" className="mt-6"><PaymentsPanel /></div>}
            <div role="tabpanel" id="admin-overview" aria-labelledby="admin-tab-overview" hidden={tab !== "overview"}>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
              {[
                ["Products", String(products.length)],
                ["Orders recorded", String(orderCount)],
                ["Support tickets", String(ticketCount)],
                ["Reviews awaiting approval", String(reviewCount)],
              ].map(([label, value]) => (
                <div key={label} className="border-b border-border py-4">
                  <p className="font-display text-xs uppercase tracking-[0.1em] text-muted-foreground">{label}</p>
                  <p className="mt-1 font-display text-2xl font-semibold">{value}</p>
                </div>
              ))}
            </div>

            </div>
            <div role="tabpanel" id="admin-catalog" aria-labelledby="admin-tab-catalog" hidden={tab !== "catalog"}>
              <CatalogPanel products={products} draftsOnly={draftsOnly} setDraftsOnly={setDraftsOnly} editing={editing} setEditing={setEditing} onReload={() => setReloadKey((k) => k + 1)} onArchive={archiveProduct} />
            </div>
            <div role="tabpanel" id="admin-orders" aria-labelledby="admin-tab-orders" hidden={tab !== "orders"}>
              <OrdersPanel orders={orders} orderQuery={orderQuery} setOrderQuery={setOrderQuery} onSelectOrder={setSelectedOrderId} onStatusChange={updateOrderStatus} />
            </div>
            <div role="tabpanel" id="admin-support" aria-labelledby="admin-tab-support" hidden={tab !== "support"}><SupportPanel tickets={tickets} /></div>
            <div role="tabpanel" id="admin-reviews" aria-labelledby="admin-tab-reviews" hidden={tab !== "reviews"}><ReviewsPanel pendingReviews={pendingReviews} approveReview={approveReview} /></div>
            {loadError && <p role="alert" className="mt-6 text-sm text-destructive">{loadError}</p>}
          </>
        )}
      </main>
      <SiteFooter />
      <Toaster position="top-center" />
      {allowed && <OrderDetailPanel orderId={selectedOrderId} onClose={() => setSelectedOrderId(null)} onUpdated={(id, status) => setOrders((rows) => rows.map((row) => row.id === id ? { ...row, status } : row))} />}
    </div>
  );
}
