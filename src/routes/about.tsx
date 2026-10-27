import { createFileRoute, Link } from "@tanstack/react-router";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/sections/page-hero";
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
          "MTDGC is a digital commerce company serving Nepal and Australia selling game top-ups, gift cards and subscriptions, with more digital product lines being prepared.",
      },
      { property: "og:title", content: "About MTDGC" },
      { property: "og:description", content: "Who MTDGC is, what we sell and how digital delivery works." },
      { name: "twitter:title", content: "About MTDGC"  },
      { name: "twitter:description", content: "Who MTDGC is, what we sell and how digital delivery works."  },
      { property: "og:url", content: `${SITE_URL}/about` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: `${SITE_URL}/og/mtdgc.png` },
      { property: "og:image:alt", content: "MTDGC, the digital marketplace for Nepal and Australia" },
      { name: "twitter:image", content: `${SITE_URL}/og/mtdgc.png` },
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
          areaServed: ["NP", "AU"],
          description:
            "Digital commerce company serving Nepal and Australia selling game top-ups, gift cards and subscriptions with manual order review before fulfilment.",
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
        <PageHero eyebrow="Company" title="About MTDGC" intro="Matrix Digital Goods and Commerce. Digital products for customers in Nepal and Australia, checked by a person before delivery." />

        <section className="mt-6 space-y-4 text-sm text-foreground/80">
          <p>
            MTDGC stands for Matrix Digital Goods and Commerce. We are a digital commerce company serving customers
            in Nepal and Australia. Our first product lines are game top-ups, digital gift cards and subscription plans, and the
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
            Prices on this site are shown in Nepalese rupees. You place your order through the checkout on this site and
            receive an order number with the payment details. After you pay, you upload a screenshot of the payment,
            and we deliver once our team has verified it. WhatsApp is there if you need support.
          </p>
          <p>
            We publish only claims we can stand behind. There are no customer counts, ratings or review numbers on this
            site until real orders and real reviews exist to support them.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-lg font-medium">What we sell</h2>
          <ul className="mt-3 space-y-2 text-sm text-foreground/80">
            <li><Link to="/catalog" search={{ category: "software" }} className="text-primary">Software</Link>: licence keys and activations, when listings are available.</li>
            <li><Link to="/categories/$slug" params={{ slug: "subscriptions" }} className="text-primary">Subscriptions</Link>: streaming, music, AI tools and cloud storage, subject to the available listings.</li>
            <li>Deals: a place for software and subscription offers when sale prices are available.</li>
            <li><Link to="/categories/$slug" params={{ slug: "gift-cards" }} className="text-primary">Gift cards</Link>: digital gift cards and wallet codes with the region stated on the listing.</li>
            <li><Link to="/categories/$slug" params={{ slug: "game-top-ups" }} className="text-primary">Game top-ups</Link>: options delivered using the player details requested on each listing.</li>
          </ul>
          <p className="mt-3 text-sm text-muted-foreground">
            Available options and prices are shown on each listing. Coming-soon products are not open for orders.
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
