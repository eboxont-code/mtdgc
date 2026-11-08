import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ORDER_NOTICE, ORDER_STATUS_LABEL, ORDER_STEPS, formatNpr, whatsappLink, SITE_URL } from "@/lib/format";
import { GIFT_CARD_PRICE_DISCLOSURE } from "@/lib/gift-card-pricing";
import { getOrderForViewer } from "@/lib/orders.functions";
import { PaymentProofForm } from "@/components/payment-proof-form";
import { OrderLoading } from "@/components/order-loading";

export const Route = createFileRoute("/order/$orderNumber")({
  head: ({ params }) => ({
    meta: [
      { title: "Your order | MTDGC" },
      { name: "description", content: "View the status of your MTDGC order." },
      { property: "og:title", content: "Your MTDGC order" },
      { property: "og:description", content: "View the status of your MTDGC order." },
      { name: "twitter:title", content: "Your MTDGC order"  },
      { name: "twitter:description", content: "View the status of your MTDGC order."  },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/order/${params.orderNumber}` }],
  }),
  component: OrderPage,
});

type Found = { orderNumber: string; status: string; createdAt: string; totalMinor: number; items: { name: string; variantName: string; isGiftCard: boolean; quantity: number; unitPriceMinor: number; totalMinor: number }[] };

function OrderPage() {
  const { orderNumber } = Route.useParams();
  const fetchOrder = useServerFn(getOrderForViewer);
  const [order, setOrder] = useState<Found | null>(null);
  const [state, setState] = useState<"loading" | "locked" | "found" | "limited">("loading");
  const [contact, setContact] = useState("");
  const [busy, setBusy] = useState(false);
  const statusStep = order ? ORDER_STEPS.find((step) => step.statuses.includes(order.status)) : undefined;

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
      <main id="main-content" tabIndex={-1} className="mx-auto max-w-2xl px-4 pb-28 pt-8 focus:outline-none">
        <h1 className="font-display text-2xl font-medium">Order {orderNumber.toUpperCase()}</h1>
        {state === "loading" && <OrderLoading />}
        {(state === "locked" || state === "limited") && (
          <form
            className="mt-5 space-y-3 rounded-lg border border-input bg-card p-5"
            onSubmit={async (e) => { e.preventDefault(); if (busy || contact.trim().length < 3) return; setBusy(true); await load(contact); setBusy(false); }}
          >
            <p className="text-sm">Enter the mobile number or email you used when ordering to view this order.</p>
            {state === "limited" && <p role="alert" className="text-sm text-destructive">Too many attempts. Please wait a few minutes and try again.</p>}
            <label htmlFor="order-contact" className="block font-display text-sm">Mobile number or email</label>
            <input id="order-contact" value={contact} onChange={(e) => setContact(e.target.value)} className="min-h-11 w-full rounded-md border border-input bg-background px-3 text-sm" />
            <Button type="submit" disabled={busy}>{busy ? "Checking" : "View order"}</Button>
          </form>
        )}
        {state === "found" && order && (
          <section className="mt-5 rounded-lg border border-input bg-card p-5 text-sm">
            <p className="font-display">Status: <strong>{ORDER_STATUS_LABEL[order.status] ?? order.status}</strong></p>
            {statusStep && <p className="mt-1 text-xs text-muted-foreground">{statusStep.body}</p>}
            {order.status === "paid" && <p className="mt-1 text-xs text-muted-foreground">{ORDER_NOTICE.paid}</p>}
            <p className="mt-1 text-muted-foreground">Placed {new Date(order.createdAt).toLocaleString("en-NP")}</p>
            <ul className="mt-3 space-y-1">
              {order.items.map((i) => (
                <li key={i.name + "-" + i.variantName}>
                  <p>{i.quantity} × {i.name}</p>
                  <p className="text-xs text-muted-foreground">{i.isGiftCard ? "Face value: " + i.variantName : i.variantName}</p>
                  <p className="text-xs">{i.isGiftCard ? "MTDGC selling price: " + formatNpr(i.unitPriceMinor) + " each · " : ""}Line total: {formatNpr(i.totalMinor)}</p>
                </li>
              ))}
            </ul>
            <p className="mt-3 font-display">Total: {formatNpr(order.totalMinor)}</p>
            {order.items.some((item) => item.isGiftCard) && <p className="mt-2 text-xs text-muted-foreground">{GIFT_CARD_PRICE_DISCLOSURE}</p>}
            <Button asChild variant="outline" className="mt-4 min-h-11">
              <Link to="/track-order" search={{ order: order.orderNumber }}>Track this order</Link>
            </Button>
            {order.status === "pending_payment" && (
              <>
                <p className="mt-3">Thanks, we have your order. Pay using the details shown at checkout, or the details our team sends you, then upload your screenshot here.</p>
                <PaymentProofForm orderNumber={order.orderNumber} />
              </>
            )}
            <p className="mt-4 text-xs text-muted-foreground">Questions? <Link to="/support" className="inline-flex min-h-11 items-center text-primary underline">Contact support</Link>.</p>
            {whatsappLink() && (
              <p className="text-sm text-muted-foreground">
                Need help with this order?{" "}
                <a
                  href={whatsappLink(`Hi MTDGC, I need help with order ${order.orderNumber}`)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center text-primary underline"
                >
                  Message our support team on WhatsApp.
                </a>
              </p>
            )}
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
