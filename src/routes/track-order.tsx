import { supabase } from "@/integrations/supabase/client";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { ORDER_NOTICE, ORDER_STEPS, orderStepIndex, stepTime, formatNpr, SITE_URL, STATUS_LABEL, whatsappLink } from "@/lib/format";
import { lookupOrder } from "@/lib/orders.functions";

const STATUS_TEXT: Record<string, string> = { ...STATUS_LABEL, pending: "Placed", paid: "Payment confirmed", processing: "Processing", fulfilled: "Fulfilled", completed: "Completed", cancelled: "Cancelled", failed: "Failed", refunded: "Refunded" };
import { breadcrumbLd, pageLd } from "@/lib/seo";

export const Route = createFileRoute("/track-order")({
  head: () => ({
    meta: [
      { title: "Track your MTDGC order" },
      {
        name: "description",
        content:
          "Check where your MTDGC order is. Send your order number with the email or phone number used on the order and we confirm the status.",
      },
      { property: "og:title", content: "Track your MTDGC order" },
      { property: "og:description", content: "Check the status of an MTDGC order using your order number." },
      { property: "og:url", content: `${SITE_URL}/track-order` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/track-order` }],
    scripts: [
      pageLd("WebPage", "MTDGC Track order", "/track-order", "Track order from MTDGC, Nepal's digital marketplace."),
      breadcrumbLd([{ name: "Home", path: "/" }, { name: "Track order", path: "/track-order" }]),
    ],
  }),
  component: TrackOrderPage,
});


type Found = { orderNumber: string; status: string; createdAt: string; totalMinor: number; items: { name: string; quantity: number }[]; events: { status: string; at: string }[] };

function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [contact, setContact] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [found, setFound] = useState<Found | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let active = true;
    void (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user || !active) return;
      const { data: p } = await supabase.from("profiles").select("phone, delivery_email").eq("id", data.user.id).maybeSingle();
      const pre = p?.phone || p?.delivery_email || data.user.email || "";
      if (active && pre) setContact((c) => c || pre);
    })();
    return () => { active = false; };
  }, []);
  const lookup = useServerFn(lookupOrder);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loading) return;
    const order = orderNumber.trim().toUpperCase();
    const who = contact.trim();
    setFound(null);
    if (!order || !who) {
      setError("Please enter your order number and the email or phone number used on the order.");
      return;
    }
    if (!/^(MT\d{6}|(MTD|MTDGC)-[A-Z0-9-]{4,})$/.test(order)) {
      setError("That order number does not look right. MTDGC order numbers look like MT123456.");
      return;
    }
    const digits = who.replace(/\D/g, "");
    const looksEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(who);
    if (!looksEmail && (digits.length < 7 || digits.length > 15)) {
      setError("Please enter a valid email address or a phone number of 7 to 15 digits.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await lookup({ data: { orderNumber: order, contact: who } });
      if (result.status === "found") setFound(result.order);
      else if (result.status === "rate_limited") setError("Too many attempts. Please wait a few minutes and try again.");
      else setError("We could not find an order with that number and contact. Please confirm both and try again, or contact us through the support page.");
    } catch {
      setError("We could not check your order right now. Please try again shortly or contact us through the support page.");
    } finally {
      setLoading(false);
    }
  };
  const current = found ? orderStepIndex(found.status) : -1;

  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="focus:outline-none mx-auto max-w-4xl px-4 pb-28 pt-6">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Track order" }]} />
        <h1 className="font-display text-[26px] font-medium md:text-4xl">Track your order</h1>
        <p className="mt-2 max-w-[62ch] text-sm text-muted-foreground">
          Every MTDGC order gets a readable order number. Enter it with the email or phone number used on the order to
          see its current status. If you have an account, your orders also appear in your{" "}
          <Link to="/account" className="inline-flex min-h-11 items-center text-primary">account dashboard</Link>.
        </p>

        <form onSubmit={submit} className="mt-6 grid gap-3 md:max-w-xl" noValidate>
          <label className="block">
            <span className="font-display text-xs text-muted-foreground">Order number</span>
            <input
              value={orderNumber}
              onChange={(event) => setOrderNumber(event.target.value)}
              placeholder="MT123456"
              autoComplete="off"
              className="mt-1 min-h-11 w-full rounded-md border border-input bg-card px-3 font-display text-sm focus:border-primary"
            />
          </label>
          <label className="block">
            <span className="font-display text-xs text-muted-foreground">Email or phone number used on the order</span>
            <input
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              className="mt-1 min-h-11 w-full rounded-md border border-input bg-card px-3 font-display text-sm focus:border-primary"
            />
          </label>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={loading}>{loading ? "Checking" : "Check my order"}</Button>
            <Button asChild variant="outline"><Link to="/support">Contact support</Link></Button>
          </div>
          {whatsappLink() && (
            <p className="text-sm text-muted-foreground">
              Need help with this order?{" "}
              <a
                href={whatsappLink(orderNumber.trim() ? `Hi MTDGC, I need help with order ${orderNumber.trim().toUpperCase()}` : "Hi MTDGC, I need help")!}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center text-primary underline"
              >
                Message our support team on WhatsApp.
              </a>
            </p>
          )}
        </form>

        {found && (
          <section role="status" className="mt-8 rounded-lg border border-input bg-card p-4 md:max-w-xl">
            <h2 className="font-display text-lg font-medium">Order {found.orderNumber}</h2>
            <p className="text-xs text-muted-foreground">
              Placed {new Date(found.createdAt).toLocaleDateString("en-GB")} · {formatNpr(found.totalMinor)} · Status: {STATUS_TEXT[found.status] ?? found.status}
            </p>
            <ul className="mt-2 text-sm">
              {found.items.map((i) => <li key={i.name}>{i.quantity} × {i.name}</li>)}
            </ul>
          </section>
        )}

        <section className="mt-12">
          <h2 className="font-display text-lg font-medium">{found ? "Where your order is" : "What each status means"}</h2>
          <ol className="mt-4 space-y-4">
            {found && ORDER_NOTICE[found.status] && <p className="text-sm">{ORDER_NOTICE[found.status]}</p>}
            {ORDER_STEPS.map(({ title, body }, index) => (
              <li key={title} className="flex gap-3" aria-current={index === current ? "step" : undefined}>
                <span aria-hidden="true" className={`grid size-7 shrink-0 place-items-center rounded-full font-display text-xs ${index === current ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2" : index < current ? "bg-foreground text-background" : current >= 0 ? "bg-secondary text-muted-foreground" : "bg-foreground text-background"}`}>
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-display text-sm font-medium">{title}</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">{body}</p>
                  {found && index <= current && stepTime(index, found.events) && (
                    <p className="mt-0.5 font-display text-xs">{stepTime(index, found.events)}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-muted-foreground">
            Orders can also be cancelled, failed or refunded. If that happens we tell you why and what happens next.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
