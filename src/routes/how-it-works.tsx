import { createFileRoute, Link } from "@tanstack/react-router";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/sections/page-hero";
import { LayoutGrid, PackageCheck, Route as RouteIcon, ShoppingBag, Upload, UserRound, type LucideIcon } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SITE_URL } from "@/lib/format";
import { breadcrumbLd, pageLd, canonicalLinks } from "@/lib/seo";

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
    links: canonicalLinks(`${SITE_URL}/how-it-works`),
    scripts: [
      pageLd("WebPage", "MTDGC How it works", "/how-it-works", "Choose a product, provide delivery details, place an order, pay by QR or bank transfer and upload your screenshot and transaction reference for verification."),
      breadcrumbLd([{ name: "Home", path: "/" }, { name: "How it works", path: "/how-it-works" }]),
    ],
  }),
  component: HowItWorksPage,
});

const STEPS: Array<[string, string, LucideIcon]> = [
  ["Choose a product and denomination", "Each product page shows the available packs or amounts, the region the product works in and what we need from you.", LayoutGrid],
  ["Add your details", "Game top-ups need a player ID, and some need a zone or server. Gift cards and subscriptions need a delivery email. We check these before fulfilling.", UserRound],
  ["Place your order at checkout", "Checkout takes three short steps on this site. When you place the order you get an order number to keep.", ShoppingBag],
  ["Pay and upload your confirmation", "Your order page shows the QR code or bank details for the NPR total. Pay that amount, then upload your payment confirmation.", Upload],
  ["Receive your item", "After payment is verified, top-ups are credited to the account you gave us. Codes and subscription details are sent to your delivery email and shown on your order page.", PackageCheck],
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
          intro="Order on MTDGC in five steps. You choose the product, pay in NPR, and receive it after payment is verified. The delivery time on each listing is the time to expect."
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

        <section className="mt-12" aria-labelledby="delivery-times">
          <h2 id="delivery-times" className="font-display text-lg font-medium">Delivery times</h2>
          <p className="mt-2 text-sm text-foreground/80">
            The delivery time on the product page is the time to expect after payment is verified. Top-ups are credited
            to the player ID on the order. Codes and subscription details go to your delivery email and your order page.
            If an order passes that time, contact support with your order number.
          </p>
          <p className="mt-3 text-sm">
            <Link to="/policies/delivery" className="text-primary">Read the delivery policy</Link>
            {" · "}
            <Link to="/policies/refunds" className="text-primary">Read the refund policy</Link>
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-lg font-medium">Payments</h2>
          <p className="mt-2 text-sm text-foreground/80">
            MTDGC does not take card numbers on this website. After you place your order, the order page shows the
            QR code or bank details for the NPR total. Pay that amount, then upload your payment confirmation.
            Delivery follows verification.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-lg font-medium">What we need from you</h2>
          <dl className="mt-3 divide-y divide-border text-sm">
            {[
              ["Software and subscriptions", "Delivery email"],
              ["Gift cards", "Delivery email"],
              ["Game top-ups", "Player ID and in-game name; any extra details are shown on the listing"],
            ].map(([type, details]) => (
              <div key={type} className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-2">
                <dt className="font-display font-medium">{type}</dt><dd className="text-muted-foreground">{details}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-sm text-muted-foreground">Follow the activation steps on your listing after delivery. You can check progress on the <Link to="/track-order" className="inline-flex min-h-11 items-center text-primary">Track order page</Link>.</p>
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
