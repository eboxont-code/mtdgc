import { createFileRoute } from "@tanstack/react-router";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/sections/page-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SITE_URL } from "@/lib/format";
import { breadcrumbLd, pageLd } from "@/lib/seo";

export const Route = createFileRoute("/policies/delivery")({
  head: () => ({
    meta: [
      { title: "Delivery policy for digital orders | MTDGC" },
      { name: "description", content: "How MTDGC delivers keys, account details and codes to your order page and email, what we need from you, and what can affect delivery timing." },
      { property: "og:title", content: "Delivery policy for digital orders | MTDGC" },
      { property: "og:description", content: "How MTDGC delivers keys, account details and codes to your order page and email, what we need from you, and what can affect delivery timing." },
      { name: "twitter:title", content: "Delivery policy for digital orders | MTDGC"  },
      { name: "twitter:description", content: "How MTDGC delivers keys, account details and codes to your order page and email, what we need from you, and what can affect delivery timing."  },
      { property: "og:url", content: `${SITE_URL}/policies/delivery` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: `${SITE_URL}/og/mtdgc.png` },
      { property: "og:image:alt", content: "MTDGC, Nepal's digital marketplace" },
      { name: "twitter:image", content: `${SITE_URL}/og/mtdgc.png` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/policies/delivery` }],
    scripts: [
      pageLd("WebPage", "MTDGC Delivery policy", "/policies/delivery", "Delivery policy from MTDGC, Nepal's digital marketplace."),
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
        <PageHero eyebrow="Policy" title="Delivery policy" intro="Last updated 4 October 2026" />
        <div className="mt-6 space-y-4 text-sm text-foreground/80">
          <p>
            All MTDGC products are digital. Nothing is shipped. Game top-ups are credited to the account identifier you
            provide. Gift card codes and subscription details are sent to the delivery email on your order.
          </p>
          <p>
            Fulfilment is handled by a person, not an automated system, so we do not advertise instant delivery. Each
            product page shows the expected delivery time, and we tell you if anything delays your order.
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
