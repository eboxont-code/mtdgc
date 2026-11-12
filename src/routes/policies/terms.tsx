import { createFileRoute } from "@tanstack/react-router";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/sections/page-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SITE_URL } from "@/lib/format";
import { breadcrumbLd, pageLd, canonicalLinks } from "@/lib/seo";

export const Route = createFileRoute("/policies/terms")({
  head: () => ({
    meta: [
      { title: "Terms of service | MTDGC" },
      { name: "description", content: "The terms that apply when you order software, subscriptions, gift cards or game top-ups from MTDGC, including payment checks, delivery and your responsibilities." },
      { property: "og:title", content: "Terms of service | MTDGC" },
      { property: "og:description", content: "The terms that apply when you order software, subscriptions, gift cards or game top-ups from MTDGC, including payment checks, delivery and your responsibilities." },
      { name: "twitter:title", content: "Terms of service | MTDGC"  },
      { name: "twitter:description", content: "The terms that apply when you order software, subscriptions, gift cards or game top-ups from MTDGC, including payment checks, delivery and your responsibilities."  },
      { property: "og:url", content: `${SITE_URL}/policies/terms` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: `${SITE_URL}/og/mtdgc.png` },
      { property: "og:image:alt", content: "MTDGC, the digital marketplace for Nepal and Australia" },
      { name: "twitter:image", content: `${SITE_URL}/og/mtdgc.png` },
    ],
    links: canonicalLinks(`${SITE_URL}/policies/terms`),
    scripts: [
      pageLd("WebPage", "MTDGC Terms of service", "/policies/terms", "Terms of service from MTDGC, the digital marketplace for Nepal and Australia."),
      breadcrumbLd([{ name: "Home", path: "/" }, { name: "Terms of service", path: "/policies/terms" }]),
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="focus:outline-none mx-auto max-w-3xl px-4 pb-16 pt-6">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Terms of service" }]} />
        <PageHero eyebrow="MTDGC · Matrix Digital Goods & Commerce" title="Terms of service" intro="The terms for ordering game top-ups, gift cards and subscriptions from MTDGC." />
        <div className="mt-6 space-y-4 text-sm text-foreground/80">
          <p>
            MTDGC (Matrix Digital Goods & Commerce) sells digital products to customers in Nepal and Australia.
            You place your order on this website and receive an order number. The order is confirmed once the product
            can be delivered and your payment has been verified. Delivery then follows the time shown on the listing.
          </p>
          <p>
            Prices are shown in Nepalese rupees and can change as supplier pricing changes. The price we confirm with
            you at the time of ordering is the price that applies to that order.
          </p>
          <p>
            You are responsible for the accuracy of the account details you give us, including player IDs, zone or
            server values and delivery email addresses.
          </p>
          <p>
            Products supplied by MTDGC remain subject to the terms of the platform that issues them. We cannot override
            a publisher or storefront decision about an account.
          </p>
          <p>
            You may not use MTDGC to resell products in breach of a publisher agreement, or to make payments with funds
            or accounts that are not yours.
          </p>
          <p>
            Refund and delivery terms are set out in the refund policy and delivery policy, which form part of these
            terms.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
