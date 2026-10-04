import { createFileRoute } from "@tanstack/react-router";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SITE_URL } from "@/lib/format";
import { breadcrumbLd, pageLd } from "@/lib/seo";

export const Route = createFileRoute("/policies/delivery")({
  head: () => ({
    meta: [
      { title: "Delivery policy | MTDGC" },
      { name: "description", content: "How MTDGC delivers digital orders, what we need from you and what affects timing." },
      { property: "og:title", content: "MTDGC delivery policy" },
      { property: "og:description", content: "Digital delivery terms and timing for MTDGC orders." },
      { property: "og:url", content: `${SITE_URL}/policies/delivery` },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/policies/delivery` }],
    scripts: [
      pageLd("WebPage", "MTDGC Delivery policy", "/policies/delivery", "Delivery policy from MTDGC, Nepal's digital marketplace.", { dateModified: "2026-10-04" }),
      breadcrumbLd([{ name: "Home", path: "/" }, { name: "Delivery policy", path: "/policies/delivery" }]),
    ],
  }),
  component: DeliveryPage,
});

function DeliveryPage() {
  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="focus:outline-none mx-auto max-w-3xl px-4 pb-16 pt-6">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Delivery policy" }]} />
        <h1 className="font-display text-[26px] font-medium md:text-4xl">Delivery policy</h1>
        <p className="mt-1 text-xs text-muted-foreground">Last updated 4 October 2026</p>
        <div className="mt-6 space-y-4 text-sm text-foreground/80">
          <p>
            All MTDGC products are digital. Nothing is shipped. Game top-ups are credited to the account identifier you
            provide. Gift card codes and subscription details are sent to the delivery email on your order.
          </p>
          <p>
            Fulfilment is handled by a person, not an automated system, so we do not advertise instant delivery. We
            confirm a realistic delivery time with you before you pay, and we tell you if anything delays it.
          </p>
          <p>
            Delivery depends on the details you give us being correct. A wrong player ID, zone, server or email address
            will delay the order, and in some cases the delivery cannot be recovered.
          </p>
          <p>
            Region restrictions apply to gift cards and wallet codes. The region shown on the product page must match
            your store account, or the code will not redeem.
          </p>
          <p>
            If your order has not arrived in the time we agreed, contact support with your order number and we will
            check the status.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
