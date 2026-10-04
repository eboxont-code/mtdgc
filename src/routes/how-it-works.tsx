import { createFileRoute, Link } from "@tanstack/react-router";

import { Breadcrumbs } from "@/components/breadcrumbs";
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
          "How an MTDGC order works: choose a product and denomination, give us the details we need, confirm payment on WhatsApp, then receive your digital item.",
      },
      { property: "og:title", content: "How MTDGC orders and delivery work" },
      { property: "og:description", content: "Ordering, payment and digital delivery at MTDGC, step by step." },
      { property: "og:url", content: `${SITE_URL}/how-it-works` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/how-it-works` }],
    scripts: [
      pageLd("WebPage", "MTDGC How it works", "/how-it-works", "How it works from MTDGC, Nepal's digital marketplace."),
      breadcrumbLd([{ name: "Home", path: "/" }, { name: "How it works", path: "/how-it-works" }]),
    ],
  }),
  component: HowItWorksPage,
});

const STEPS = [
  ["Choose a product and denomination", "Each product page shows the available packs or amounts, the region the product works in and what we need from you."],
  ["Add your details", "Game top-ups need a player ID, and some need a zone or server. Gift cards and subscriptions need a delivery email. We check these before fulfilling."],
  ["Send the order for confirmation", "Your cart opens a prefilled WhatsApp message. Nothing is charged on this website."],
  ["Confirm payment", "We reply with availability and the payment instructions that apply to your order. Payment is arranged directly with our team."],
  ["Receive your item", "Top-ups are credited to the account you gave us. Codes and subscription details are sent to your delivery email."],
];

function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="focus:outline-none mx-auto max-w-3xl px-4 pb-16 pt-6">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "How it works" }]} />
        <h1 className="font-display text-[26px] font-medium md:text-4xl">How ordering and delivery works</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          MTDGC reviews every order by hand before delivering it. Here is the full process, with no steps hidden.
        </p>

        <ol className="mt-8 space-y-6">
          {STEPS.map(([title, body], index) => (
            <li key={title} className="flex gap-3">
              <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full bg-foreground font-display text-sm text-background">
                {index + 1}
              </span>
              <div>
                <h2 className="font-display text-sm font-medium">{title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{body}</p>
              </div>
            </li>
          ))}
        </ol>

        <section className="mt-12">
          <h2 className="font-display text-lg font-medium">Payments</h2>
          <p className="mt-2 text-sm text-foreground/80">
            There is no card checkout on this website and we do not store card details. Payment is arranged with our
            team after we confirm your order. We only ever use the payment methods we tell you about directly, and we
            will never ask for your password, OTP or payment PIN.
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
