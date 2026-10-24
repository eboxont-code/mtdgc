import { createFileRoute, Link } from "@tanstack/react-router";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { AccordionList } from "@/components/sections/accordion-list";
import { PageHero } from "@/components/sections/page-hero";
import { HelpCircle } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SITE_URL } from "@/lib/format";
import { breadcrumbLd, pageLd } from "@/lib/seo";

const FAQS: [string, string][] = [
  [
    "How long does delivery take?",
    "Every order is reviewed by a person first, so delivery time depends on the product and when you order. Each product page shows the expected delivery time, and we tell you if anything delays your order. We do not promise instant delivery, because our fulfilment is not automated.",
  ],
  [
    "What details do you need from me?",
    "Game top-ups need your player ID, and some titles also need a zone or server. Gift cards and subscriptions need a delivery email. The exact list is shown on each product page.",
  ],
  [
    "How do I pay?",
    "Place your order through the checkout on this site. You get an order number and the payment details for your order. Pay, then upload a screenshot of the payment on your order page. We verify it and then deliver.",
  ],
  [
    "Why does region matter for gift cards?",
    "Gift cards and wallet codes are issued for a specific store region. If the code region does not match your account region, the store will refuse the code. Each listing states the region it works in.",
  ],
  [
    "Can I get a refund?",
    "Refunds are reviewed before fulfilment. Once a code has been revealed or in-game currency has been credited, the order cannot be reversed. Full terms are in the refund policy.",
  ],
  [
    "Do I need an account?",
    "No. You can order as a guest. An account is useful if you want your order history, wishlist and support requests in one place.",
  ],
  [
    "Will MTDGC ever ask for my password or OTP?",
    "No. Keep your password, one-time codes and payment PIN to yourself. If someone claiming to be MTDGC asks for them, stop and contact us through the support page.",
  ],
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Frequently asked questions | MTDGC" },
      {
        name: "description",
        content:
          "Answers about MTDGC delivery times, payment, player IDs, gift card regions, refunds and account security.",
      },
      { property: "og:title", content: "MTDGC frequently asked questions" },
      { property: "og:description", content: "Delivery, payment, regions, refunds and security questions answered." },
      { name: "twitter:title", content: "MTDGC frequently asked questions"  },
      { name: "twitter:description", content: "Delivery, payment, regions, refunds and security questions answered."  },
      { property: "og:url", content: `${SITE_URL}/faq` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: `${SITE_URL}/og/mtdgc.png` },
      { property: "og:image:alt", content: "MTDGC, the digital marketplace for Nepal and Australia" },
      { name: "twitter:image", content: `${SITE_URL}/og/mtdgc.png` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/faq` }],
    scripts: [
      breadcrumbLd([{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq" }]),
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map(([question, answer]) => ({
            "@type": "Question",
            name: question,
            acceptedAnswer: { "@type": "Answer", text: answer },
          })),
        }),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="focus:outline-none mx-auto max-w-3xl px-4 pb-16 pt-6">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "FAQ" }]} />
        <PageHero
          variant="icon"
          icon={HelpCircle}
          eyebrow="Help"
          title="Frequently asked questions"
          intro="The questions our customers ask most often, answered plainly. Tap a question to open it."
        />

        <AccordionList
          className="mt-8"
          headingLevel={2}
          defaultOpen={[0]}
          items={FAQS.map(([question, answer]) => ({ id: question, title: question, content: <p>{answer}</p> }))}
        />

        <p className="mt-8 text-sm">
          Still stuck? Visit <Link to="/support" className="text-primary">support</Link> or read{" "}
          <Link to="/how-it-works" className="text-primary">how ordering works</Link>.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
