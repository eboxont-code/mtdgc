import { createFileRoute, Link } from "@tanstack/react-router";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SITE_URL } from "@/lib/format";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About MTDGC | Matrix Digital Goods & Commerce" },
      {
        name: "description",
        content:
          "MTDGC is a digital commerce company in Nepal selling game top-ups, gift cards and subscriptions, with more digital product lines being prepared.",
      },
      { property: "og:title", content: "About MTDGC" },
      { property: "og:description", content: "Who MTDGC is, what we sell and how digital delivery works." },
      { property: "og:url", content: `${SITE_URL}/about` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/about` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "MTDGC",
          legalName: "Matrix Digital Goods & Commerce",
          url: SITE_URL,
          areaServed: "NP",
          description:
            "Digital commerce company in Nepal selling game top-ups, gift cards and subscriptions with manual order review before fulfilment.",
        }),
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="focus:outline-none mx-auto max-w-3xl px-4 pb-16 pt-6">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "About" }]} />
        <h1 className="font-display text-[26px] font-medium md:text-4xl">About MTDGC</h1>

        <section className="mt-6 space-y-4 text-sm text-foreground/80">
          <p>
            MTDGC stands for Matrix Digital Goods and Commerce. We are a digital commerce company serving customers
            in Nepal. Our first product lines are game top-ups, digital gift cards and subscription plans, and the
            catalog is built so we can add software, AI services, mobile products and business services as each line is
            properly sourced.
          </p>
          <p>
            Every order is reviewed by a person before it is fulfilled. That is slower than a fully automated shop, but
            it means we can check the player ID you sent, confirm the product is genuinely available in your region and
            correct mistakes before anything is delivered. We do not describe delivery as instant, because our
            fulfilment is not automated yet.
          </p>
          <p>
            Prices on this site are shown in Nepalese rupees. We do not take card payments on the website. You send your
            order through the cart, we confirm availability and payment instructions on WhatsApp, and delivery follows
            once payment is settled.
          </p>
          <p>
            We publish only claims we can stand behind. There are no customer counts, ratings or review numbers on this
            site until real orders and real reviews exist to support them.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-lg font-medium">What we sell today</h2>
          <ul className="mt-3 space-y-2 text-sm text-foreground/80">
            <li>Game top-ups delivered to your player ID, including Free Fire, PUBG Mobile, Mobile Legends and Clash of Clans.</li>
            <li>Digital gift cards and wallet codes, delivered to your email with the region clearly stated.</li>
            <li>Subscription plans supplied for a set number of months.</li>
          </ul>
          <p className="mt-3 text-sm text-muted-foreground">
            Software, AI, mobile and business lines are being prepared and are not open for orders. We do not list a
            category as available until we can actually fulfil it.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-lg font-medium">Keep reading</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/how-it-works" className="text-primary">How ordering and delivery works</Link></li>
            <li><Link to="/faq" className="text-primary">Frequently asked questions</Link></li>
            <li><Link to="/policies/refunds" className="text-primary">Refund policy</Link></li>
            <li><Link to="/catalog" className="text-primary">Browse the catalog</Link></li>
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
