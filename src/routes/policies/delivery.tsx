import { createFileRoute, Link } from "@tanstack/react-router";

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
      { property: "og:image:alt", content: "MTDGC, the digital marketplace for Nepal and Australia" },
      { name: "twitter:image", content: `${SITE_URL}/og/mtdgc.png` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/policies/delivery` }],
    scripts: [
      pageLd("WebPage", "MTDGC Delivery policy", "/policies/delivery", "Digital delivery for software, subscriptions, deals, gift cards and game top-ups. Listing delivery times apply after payment verification; payment checks and supplier downtime can cause delays."),
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
        <PageHero eyebrow="Policy" title="Delivery policy" intro="Last updated 27 October 2026" />
        <div className="mt-6 space-y-4 text-sm text-foreground/80">
          <p>
            All MTDGC products are digital. Nothing is shipped. Each listing shows its usual delivery time.
            We verify your payment before preparing the order.
          </p>
          <p>
            Payment checks or supplier downtime can delay delivery. We do not promise instant delivery.
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
            If your order is later than the time shown on the listing, <Link to="/support" className="text-primary">contact support</Link> with your order number so we can check the status.
          </p>
        </div>
        <div className="mt-8 space-y-6 text-sm text-foreground/80">
          <section><h2 className="font-display text-lg font-medium text-foreground">Software</h2><p className="mt-2">Your key or account details appear on your order page and by email. Follow the activation instructions on the listing.</p></section>
          <section><h2 className="font-display text-lg font-medium text-foreground">Subscriptions</h2><p className="mt-2">Account details or activation information appear on your order page and by email. Check the listing for the plan and the details we need from you.</p></section>
          <section><h2 className="font-display text-lg font-medium text-foreground">Deals</h2><p className="mt-2">The delivery method and usual time on each included product listing apply. A sale does not change those delivery instructions.</p></section>
          <section><h2 className="font-display text-lg font-medium text-foreground">Gift cards</h2><p className="mt-2">Codes are delivered digitally to your order page and email. Check that the region on the listing matches your store account.</p></section>
          <section><h2 className="font-display text-lg font-medium text-foreground">Game top-ups</h2><p className="mt-2">Top-ups are credited using the player details supplied with your order. Check your player ID, zone or server carefully before submitting.</p></section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
