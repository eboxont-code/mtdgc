import { createFileRoute } from "@tanstack/react-router";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/sections/page-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SITE_URL } from "@/lib/format";
import { breadcrumbLd, pageLd } from "@/lib/seo";

export const Route = createFileRoute("/policies/refunds")({
  head: () => ({
    meta: [
      { title: "Refund policy for digital orders | MTDGC" },
      { name: "description", content: "When MTDGC refunds a digital order, how replacement periods on each listing work, and when a key, code or top-up can no longer be reversed." },
      { property: "og:title", content: "Refund policy for digital orders | MTDGC" },
      { property: "og:description", content: "When MTDGC refunds a digital order, how replacement periods on each listing work, and when a key, code or top-up can no longer be reversed." },
      { name: "twitter:title", content: "Refund policy for digital orders | MTDGC"  },
      { name: "twitter:description", content: "When MTDGC refunds a digital order, how replacement periods on each listing work, and when a key, code or top-up can no longer be reversed."  },
      { property: "og:url", content: `${SITE_URL}/policies/refunds` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: `${SITE_URL}/og/mtdgc.png` },
      { property: "og:image:alt", content: "MTDGC, the digital marketplace for Nepal and Australia" },
      { name: "twitter:image", content: `${SITE_URL}/og/mtdgc.png` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/policies/refunds` }],
    scripts: [
      pageLd("WebPage", "MTDGC Refund policy", "/policies/refunds", "Full refunds when MTDGC cannot deliver, software key reveal limits, listing-specific subscription replacement periods, gift card code limits and credited top-up restrictions."),
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
        <PageHero eyebrow="Policy" title="Refund policy" intro="Last updated 27 October 2026" />
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
        <div className="mt-8 space-y-6 text-sm text-foreground/80">
          <section><h2 className="font-display text-lg font-medium text-foreground">Software</h2><p className="mt-2">Software keys are refundable until the key is revealed on your order page. After that, activation problems are handled under the replacement period stated on the listing. Contact support with your order number and the error you see; no additional replacement period is promised here.</p></section>
          <section><h2 className="font-display text-lg font-medium text-foreground">Subscriptions</h2><p className="mt-2">Subscription problems follow the replacement period stated on the listing. Changes you make to a shared plan are not covered. If no replacement period is stated, contact support for clarification before ordering.</p></section>
          <section><h2 className="font-display text-lg font-medium text-foreground">Deals</h2><p className="mt-2">The refund and replacement terms of each included product apply. We refund in full when we cannot deliver your order.</p></section>
          <section><h2 className="font-display text-lg font-medium text-foreground">Gift cards</h2><p className="mt-2">A gift card cannot be refunded after its code is revealed. Check the listing region against your account before ordering.</p></section>
          <section><h2 className="font-display text-lg font-medium text-foreground">Game top-ups</h2><p className="mt-2">Top-ups cannot be reversed after they are credited. A top-up delivered to the incorrect player details you supplied cannot be recovered.</p></section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
