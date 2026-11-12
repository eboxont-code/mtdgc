import { createFileRoute, Link } from "@tanstack/react-router";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { BuyerProtection } from "@/components/buyer-protection";
import { PageHero } from "@/components/sections/page-hero";
import { ResellerNotice } from "@/components/reseller-notice";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { BRAND_DESCRIPTION, BRAND_FULL_NAME, BRAND_NAME, organizationJson } from "@/lib/brand";
import { SITE_URL, WHATSAPP_DISPLAY, whatsappLink } from "@/lib/format";
import { breadcrumbLd, ldScript, pageLd, canonicalLinks } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `About ${BRAND_NAME} | ${BRAND_FULL_NAME}` },
      { name: "description", content: BRAND_DESCRIPTION },
      { property: "og:title", content: `About ${BRAND_NAME} | ${BRAND_FULL_NAME}` },
      { property: "og:description", content: BRAND_DESCRIPTION },
      { name: "twitter:title", content: `About ${BRAND_NAME} | ${BRAND_FULL_NAME}` },
      { name: "twitter:description", content: BRAND_DESCRIPTION },
      { property: "og:url", content: `${SITE_URL}/about` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: `${SITE_URL}/og/mtdgc.png` },
      { property: "og:image:alt", content: `${BRAND_NAME}, ${BRAND_FULL_NAME}` },
      { name: "twitter:image", content: `${SITE_URL}/og/mtdgc.png` },
    ],
    links: canonicalLinks(`${SITE_URL}/about`),
    scripts: [
      pageLd("AboutPage", `About ${BRAND_NAME}`, "/about", BRAND_DESCRIPTION, { mainEntity: organizationJson() }),
      breadcrumbLd([{ name: "Home", path: "/" }, { name: "About", path: "/about" }]),
      ldScript(organizationJson()),
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const supportUrl = whatsappLink();
  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="focus:outline-none mx-auto max-w-3xl px-4 pb-8 pt-6">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "About" }]} />
        <PageHero eyebrow={BRAND_FULL_NAME} title={BRAND_NAME} intro={BRAND_DESCRIPTION} />

        <section className="mt-6 space-y-4 text-sm leading-relaxed text-foreground/85">
          <p>
            {BRAND_NAME} is {BRAND_FULL_NAME}. The name on the store is {BRAND_NAME}. It is the store for game top-ups, gift cards and subscriptions for customers in Nepal and Australia.
          </p>
          <p>
            You order on this website. Each listing shows the pack, the region and the delivery time to expect. Checkout gives you an order number and the NPR total. You pay that total by QR or bank transfer, upload your payment confirmation, and the top-up, code or subscription details are delivered after payment is verified.
          </p>
          <p>
            Prices are in Nepalese rupees. Customers in Australia also see an Australian dollar guide beside the NPR price so the amount is easy to read. The guide is not a second price. The amount you pay is the NPR total at checkout.
          </p>
          <p>
            {BRAND_NAME} serves customers in Nepal and Australia from this store. Support is on WhatsApp at {WHATSAPP_DISPLAY} and on the support page. Have your order number ready and the team will pick up the order from there.
          </p>
        </section>

        <ResellerNotice className="mt-4" />

        <section className="mt-10" aria-labelledby="what-we-sell">
          <h2 id="what-we-sell" className="font-display text-lg font-medium">What {BRAND_NAME} sells</h2>
          <ul className="mt-3 space-y-2 text-sm text-foreground/85">
            <li><Link to="/categories/$slug" params={{ slug: "game-top-ups" }} className="text-primary">Game top-ups</Link>: in-game currency and passes, credited with the player details on the listing.</li>
            <li><Link to="/categories/$slug" params={{ slug: "gift-cards" }} className="text-primary">Gift cards</Link>: digital codes and wallet balance, with the region stated on the listing.</li>
            <li><Link to="/categories/$slug" params={{ slug: "subscriptions" }} className="text-primary">Subscriptions</Link>: plans for a fixed period, with the length and delivery details on the listing.</li>
            <li><Link to="/catalog" className="text-primary">Full catalog</Link>: every published listing, with its price and delivery time.</li>
          </ul>
        </section>

        <section className="mt-10" aria-labelledby="reach-us">
          <h2 id="reach-us" className="font-display text-lg font-medium">Contact {BRAND_NAME}</h2>
          <p className="mt-2 text-sm text-foreground/85">
            Customer support for Nepal and Australia is WhatsApp {WHATSAPP_DISPLAY}, the support form, and order tracking with your order number.
          </p>
          <div className="mt-3 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild variant="outline" className="min-h-11"><Link to="/support">Contact support</Link></Button>
            <Button asChild variant="outline" className="min-h-11"><Link to="/track-order">Track an order</Link></Button>
            <Button asChild variant="outline" className="min-h-11"><Link to="/policies/refunds">Refund policy</Link></Button>
            {supportUrl && <Button asChild variant="outline" className="min-h-11"><a href={supportUrl} target="_blank" rel="noreferrer">WhatsApp {WHATSAPP_DISPLAY}</a></Button>}
          </div>
        </section>
      </main>
      <BuyerProtection />
      <SiteFooter />
    </div>
  );
}
