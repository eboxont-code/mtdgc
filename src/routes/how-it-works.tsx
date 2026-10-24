import { createFileRoute, Link } from "@tanstack/react-router";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/sections/page-hero";
import { LayoutGrid, PackageCheck, Route as RouteIcon, ShoppingBag, Upload, UserRound, type LucideIcon } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SITE_URL } from "@/lib/format";
import { breadcrumbLd, pageLd } from "@/lib/seo";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How ordering and delivery works | MTDGC" },
      {
        name: "description",
        content:
          "How an MTDGC order works: choose a product and denomination, give us the details we need, place the order at checkout, pay and upload your payment proof, then receive your digital item.",
      },
      { property: "og:title", content: "How MTDGC orders and delivery work" },
      { property: "og:description", content: "Ordering, payment and digital delivery at MTDGC, step by step." },
      { name: "twitter:title", content: "How MTDGC orders and delivery work"  },
      { name: "twitter:description", content: "Ordering, payment and digital delivery at MTDGC, step by step."  },
      { property: "og:url", content: `${SITE_URL}/how-it-works` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: `${SITE_URL}/og/mtdgc.png` },
      { property: "og:image:alt", content: "MTDGC, the digital marketplace for Nepal and Australia" },
      { name: "twitter:image", content: `${SITE_URL}/og/mtdgc.png` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/how-it-works` }],
    scripts: [
      pageLd("WebPage", "MTDGC How it works", "/how-it-works", "How it works from MTDGC, the digital marketplace for Nepal and Australia."),
      breadcrumbLd([{ name: "Home", path: "/" }, { name: "How it works", path: "/how-it-works" }]),
    ],
  }),
  component: HowItWorksPage,
});

const STEPS: Array<[string, string, LucideIcon]> = [
  ["Choose a product and denomination", "Each product page shows the available packs or amounts, the region the product works in and what we need from you.", LayoutGrid],
  ["Add your details", "Game top-ups need a player ID, and some need a zone or server. Gift cards and subscriptions need a delivery email. We check these before fulfilling.", UserRound],
  ["Place your order at checkout", "Checkout takes three short steps on this site. When you place the order you get an order number to keep.", ShoppingBag],
  ["Pay and upload your proof", "Your order page shows the payment details for your order. Pay, then upload a screenshot of the payment so our team can verify it.", Upload],
  ["Receive your item", "We deliver once your payment is verified. Top-ups are credited to the account you gave us. Codes and subscription details are sent to your delivery email.", PackageCheck],
];

function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="focus:outline-none mx-auto max-w-3xl px-4 pb-16 pt-6">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "How it works" }]} />
        <PageHero
          variant="split"
          icon={RouteIcon}
          eyebrow="Five steps"
          title="How ordering and delivery works"
          intro="MTDGC reviews every order by hand before delivering it. Here is the full process, with no steps hidden."
        />

        <ol className="mt-8 grid gap-3 sm:grid-cols-2">
          {STEPS.map(([title, body, Icon], index) => (
            <li key={title} className={`relative rounded-2xl border border-border bg-card p-4 ${index === STEPS.length - 1 ? "sm:col-span-2" : ""}`}>
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-xl border border-primary/40 bg-primary/10">
                  <Icon className="size-5 text-primary" />
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary">Step {index + 1}</span>
              </div>
              <h2 className="mt-3 font-display text-sm font-medium">{title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            </li>
          ))}
        </ol>

        <section className="mt-12">
          <h2 className="font-display text-lg font-medium">Payments</h2>
          <p className="mt-2 text-sm text-foreground/80">
            There is no card checkout on this website and we do not store card details. After you place your order,
            your order page shows the payment details. Pay using only those details, then upload your payment
            screenshot so our team can verify it.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-lg font-medium">Regions</h2>
          <p className="mt-2 text-sm text-foreground/80">
            Gift cards and wallet codes are tied to a store region. A code bought for one region usually cannot be
            redeemed on an account registered in another. Each product page states the region, so check it matches your
            account before ordering.
          </p>
        </section>

        <p className="mt-10 text-sm">
          Questions left over? Read the <Link to="/faq" className="text-primary">FAQ</Link> or contact{" "}
          <Link to="/support" className="text-primary">support</Link>.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
