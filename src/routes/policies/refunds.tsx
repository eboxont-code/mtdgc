import { createFileRoute } from "@tanstack/react-router";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SITE_URL } from "@/lib/format";
import { breadcrumbLd, pageLd } from "@/lib/seo";

export const Route = createFileRoute("/policies/refunds")({
  head: () => ({
    meta: [
      { title: "Refund policy | MTDGC" },
      { name: "description", content: "When MTDGC can refund a digital order, and when an order can no longer be reversed." },
      { property: "og:title", content: "MTDGC refund policy" },
      { property: "og:description", content: "Refund terms for MTDGC digital orders." },
      { property: "og:url", content: `${SITE_URL}/policies/refunds` },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/policies/refunds` }],
    scripts: [
      pageLd("WebPage", "MTDGC Refund policy", "/policies/refunds", "Refund policy from MTDGC, Nepal's digital marketplace.", { dateModified: "2026-10-04" }),
      breadcrumbLd([{ name: "Home", path: "/" }, { name: "Refund policy", path: "/policies/refunds" }]),
    ],
  }),
  component: RefundsPage,
});

function RefundsPage() {
  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="focus:outline-none mx-auto max-w-3xl px-4 pb-16 pt-6">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Refund policy" }]} />
        <h1 className="font-display text-[26px] font-medium md:text-4xl">Refund policy</h1>
        <p className="mt-1 text-xs text-muted-foreground">Last updated 4 October 2026</p>
        <div className="mt-6 space-y-4 text-sm text-foreground/80">
          <p>
            Every MTDGC order is reviewed before it is fulfilled. If you need to cancel, tell us before fulfilment
            starts and we will cancel the order and return any payment already made.
          </p>
          <p>
            Once a gift card code has been sent or revealed, or in-game currency has been credited to an account, the
            order cannot be reversed. This is a limitation of digital goods, not a company preference.
          </p>
          <p>
            If an order fails on our side, if we cannot source the product, or if we deliver the wrong item, we refund
            in full or redeliver the correct item, whichever you prefer.
          </p>
          <p>
            If a top-up was sent to the wrong player ID because the ID you gave us was incorrect, we cannot recover it.
            Check your player ID carefully before confirming, and tell us immediately if you spot a mistake.
          </p>
          <p>
            To request a refund, contact us on the support page with your order number and a short description of what
            went wrong.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
