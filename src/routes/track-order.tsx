import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { SITE_URL, whatsappLink } from "@/lib/format";

export const Route = createFileRoute("/track-order")({
  head: () => ({
    meta: [
      { title: "Track your order | MTDGC" },
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
  }),
  component: TrackOrderPage,
});

const TIMELINE = [
  ["Placed", "We have your order details and the products you selected."],
  ["Payment confirmed", "Your payment has been received and matched to the order."],
  ["Processing", "The team is preparing the top-up, code or subscription."],
  ["Fulfilled", "The digital item has been delivered to your account or email."],
  ["Completed", "The order is closed. Refund terms for the product still apply."],
];

function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [contact, setContact] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!orderNumber.trim() || !contact.trim()) {
      setError("Please enter your order number and the email or phone number used on the order.");
      return;
    }
    setError(null);
    window.open(
      whatsappLink(`Hello MTDGC, please check my order ${orderNumber}. Contact on the order: ${contact}.`),
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 pb-16 pt-6">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Track order" }]} />
        <h1 className="font-display text-[26px] font-medium md:text-4xl">Track your order</h1>
        <p className="mt-2 max-w-[62ch] text-sm text-muted-foreground">
          Every MTDGC order gets a readable order number. Enter it with the email or phone number used on the order and
          we confirm the current status on WhatsApp. If you have an account, your orders also appear in your{" "}
          <Link to="/account" className="text-primary">account dashboard</Link>.
        </p>

        <form onSubmit={submit} className="mt-6 grid gap-3 md:max-w-xl" noValidate>
          <label className="block">
            <span className="font-display text-xs text-muted-foreground">Order number</span>
            <input
              value={orderNumber}
              onChange={(event) => setOrderNumber(event.target.value)}
              placeholder="MTDGC-000000"
              className="mt-1 h-10 w-full rounded-md border border-border bg-card px-3 font-display text-sm outline-none focus:border-primary"
            />
          </label>
          <label className="block">
            <span className="font-display text-xs text-muted-foreground">Email or phone number used on the order</span>
            <input
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              className="mt-1 h-10 w-full rounded-md border border-border bg-card px-3 font-display text-sm outline-none focus:border-primary"
            />
          </label>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <div><Button type="submit">Check my order</Button></div>
        </form>

        <section className="mt-12">
          <h2 className="font-display text-lg font-medium">What each status means</h2>
          <ol className="mt-4 space-y-4">
            {TIMELINE.map(([title, body], index) => (
              <li key={title} className="flex gap-3">
                <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-full bg-foreground font-display text-xs text-background">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-display text-sm font-medium">{title}</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">{body}</p>
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
