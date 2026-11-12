import { createFileRoute } from "@tanstack/react-router";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/sections/page-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SITE_URL } from "@/lib/format";
import { breadcrumbLd, pageLd, canonicalLinks } from "@/lib/seo";

export const Route = createFileRoute("/policies/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy policy | MTDGC" },
      { name: "description", content: "What information MTDGC collects to process and deliver your digital orders, how we use and protect it, and how to ask us about your data." },
      { property: "og:title", content: "Privacy policy | MTDGC" },
      { property: "og:description", content: "What information MTDGC collects to process and deliver your digital orders, how we use and protect it, and how to ask us about your data." },
      { name: "twitter:title", content: "Privacy policy | MTDGC"  },
      { name: "twitter:description", content: "What information MTDGC collects to process and deliver your digital orders, how we use and protect it, and how to ask us about your data."  },
      { property: "og:url", content: `${SITE_URL}/policies/privacy` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: `${SITE_URL}/og/mtdgc.png` },
      { property: "og:image:alt", content: "MTDGC, the digital marketplace for Nepal and Australia" },
      { name: "twitter:image", content: `${SITE_URL}/og/mtdgc.png` },
    ],
    links: canonicalLinks(`${SITE_URL}/policies/privacy`),
    scripts: [
      pageLd("WebPage", "MTDGC Privacy policy", "/policies/privacy", "Privacy policy from MTDGC, the digital marketplace for Nepal and Australia."),
      breadcrumbLd([{ name: "Home", path: "/" }, { name: "Privacy policy", path: "/policies/privacy" }]),
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="focus:outline-none mx-auto max-w-3xl px-4 pb-16 pt-6">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Privacy policy" }]} />
        <PageHero eyebrow="MTDGC · Matrix Digital Goods & Commerce" title="Privacy policy" intro="What MTDGC collects to deliver an order, and how to ask about your data." />
        <div className="mt-6 space-y-4 text-sm text-foreground/80">
          <p>
            MTDGC collects only what is needed to fulfil an order: your name, the contact number or email you want us to
            reply on, and the account details the product requires, such as a player ID or delivery email.
          </p>
          <p>
            If you create an account, we also store your profile details and your order, wishlist and support history so
            you can see them when you sign in. Your account data is protected by access rules that limit it to you and
            to MTDGC staff accounts that need it to help you.
          </p>
          <p>
            We will never ask for your password, one-time code or payment PIN, and you should never send them to anyone
            claiming to represent us.
          </p>
          <p>
            We do not sell customer information. We share details with a supplier only where it is required to deliver
            the product you ordered.
          </p>
          <p>
            You can ask us to delete your account information at any time through the support page. Records we are
            required to keep for accounting reasons will be retained for that purpose only.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
