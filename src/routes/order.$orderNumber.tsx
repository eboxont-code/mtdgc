import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { formatNpr } from "@/lib/format";
import { getOrderForViewer } from "@/lib/orders.functions";

export const Route = createFileRoute("/order/$orderNumber")({
  head: () => ({
    meta: [
      { title: "Your order | MTDGC" },
      { name: "description", content: "View the status of your MTDGC order." },
      { property: "og:title", content: "Your MTDGC order" },
      { property: "og:description", content: "View the status of your MTDGC order." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderPage,
});

type Found = { orderNumber: string; status: string; createdAt: string; totalMinor: number; items: { name: string; quantity: number; totalMinor: number }[] };

const STATUS_TEXT: Record<string, string> = {
  pending: "Waiting for payment",
  pending_payment: "Waiting for payment",
  payment_submitted: "Payment received, being checked",
  paid: "Payment received",
  verified: "Payment verified",
  processing: "Processing",
  delivered: "Delivered",
  fulfilled: "Delivered",
  completed: "Delivered",
  rejected: "We could not match the payment",
  failed: "Payment failed",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

function OrderPage() {
  const { orderNumber } = Route.useParams();
  const fetchOrder = useServerFn(getOrderForViewer);
  const [order, setOrder] = useState<Found | null>(null);
  const [state, setState] = useState<"loading" | "locked" | "found" | "limited">("loading");
  const [contact, setContact] = useState("");
  const [busy, setBusy] = useState(false);

  async function load(withContact?: string) {
    let accessToken: string | undefined;
    const key = `mtdgc-order-${orderNumber.toUpperCase()}`;
    try { accessToken = localStorage.getItem(key) ?? sessionStorage.getItem(key) ?? undefined; } catch { /* ignore */ }
    const { data: s } = await supabase.auth.getSession();
    const res = await fetchOrder({ data: { orderNumber, accessToken, contact: withContact, bearer: s.session?.access_token } });
    if (res.status === "found") { setOrder(res.order); setState("found"); }
    else setState(res.status === "rate_limited" ? "limited" : "locked");
  }

  useEffect(() => {
    void load();
    void (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;
      const { data: p } = await supabase.from("profiles").select("phone, delivery_email").eq("id", data.user.id).maybeSingle();
      const pre = p?.phone || p?.delivery_email || data.user.email || "";
      if (pre) setContact((c) => c || pre);
    })();
  }, [orderNumber]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="mx-auto max-w-2xl px-4 pb-16 pt-8 focus:outline-none">
        <h1 className="font-display text-2xl font-medium">Order {orderNumber.toUpperCase()}</h1>
        {state === "loading" && <p className="mt-4 text-sm text-muted-foreground">Loading your order.</p>}
        {(state === "locked" || state === "limited") && (
          <form
            className="mt-5 space-y-3 rounded-lg border border-border bg-card p-5"
            onSubmit={async (e) => { e.preventDefault(); if (busy || contact.trim().length < 3) return; setBusy(true); await load(contact); setBusy(false); }}
          >
            <p className="text-sm">Enter the mobile number or email you used when ordering to view this order.</p>
            {state === "limited" && <p role="alert" className="text-sm text-destructive">Too many attempts. Please wait a few minutes and try again.</p>}
            <label htmlFor="order-contact" className="block font-display text-sm">Mobile number or email</label>
            <input id="order-contact" value={contact} onChange={(e) => setContact(e.target.value)} className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" />
            <Button type="submit" disabled={busy}>{busy ? "Checking" : "View order"}</Button>
          </form>
        )}
        {state === "found" && order && (
          <section className="mt-5 rounded-lg border border-border bg-card p-5 text-sm">
            <p className="font-display">Status: <strong>{STATUS_TEXT[order.status] ?? order.status}</strong></p>
            <p className="mt-1 text-muted-foreground">Placed {new Date(order.createdAt).toLocaleString("en-NP")}</p>
            <ul className="mt-3 space-y-1">
              {order.items.map((i) => <li key={i.name}>{i.quantity} × {i.name} · {formatNpr(i.totalMinor)}</li>)}
            </ul>
            <p className="mt-3 font-display">Total: {formatNpr(order.totalMinor)}</p>
            {order.status === "pending_payment" && <p className="mt-3">Thanks, we have your order. Our team will send payment details shortly.</p>}
            <p className="mt-4 text-xs text-muted-foreground">Questions? <Link to="/support" className="underline">Contact support</Link>.</p>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
