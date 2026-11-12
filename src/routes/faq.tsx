import { createFileRoute, Link } from "@tanstack/react-router";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { AccordionList } from "@/components/sections/accordion-list";
import { PageHero } from "@/components/sections/page-hero";
import { HelpCircle } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SITE_URL } from "@/lib/format";
import { breadcrumbLd, pageLd, canonicalLinks } from "@/lib/seo";

const FAQS: [string, string][] = [
  [
    "How long does delivery take?",
    "Each listing shows its usual delivery time. We check your payment before preparing the order. If your order is taking longer than the time shown, contact support with your order number so we can check it.",
  ],
  [
    "What details do you need from me?",
    "The product page lists the details needed for your order. Software, subscriptions and gift cards usually need a delivery email. Game top-ups need the player details requested on the listing. Please check those details before ordering.",
  ],
  [
    "How do I pay?",
    "Place your order on this site, then pay using the QR or bank details shown for your order. If no payment details are shown, our team will send them shortly. Upload your payment screenshot and transaction reference on your order page. Our team verifies the payment before delivery. No card payments are taken on this site.",
  ],
  [
    "Where do my key or account details appear?",
    "Your delivery details appear on your order page and are sent by email. Follow the activation instructions on the listing. Contact support with your order number if you cannot find them.",
  ],
  [
    "Does my subscription renew automatically?",
    "Check the renewal terms on the listing. To continue a plan, review the available options and place another order when needed. Do not assume a renewal or recurring charge unless the listing states it.",
  ],
  [
    "What if my key does not activate?",
    "Check the listing's activation steps and supported region. Send support your order number and the error message. Any replacement follows the replacement period shown on that listing.",
  ],
  [
    "Why does region matter for gift cards?",
    "Gift cards and wallet codes work in the store region stated on the listing. Check that it matches your account before ordering. If you are unsure, contact support before paying.",
  ],
  [
    "Can I get a refund?",
    "Please contact support before delivery if you need to cancel an order. Codes that have been revealed and top-ups that have been credited cannot be reversed. The refund policy explains how requests are reviewed.",
  ],
  [
    "Do I need an account?",
    "No. You can order as a guest. An account is useful if you want your order history, wishlist and support requests in one place.",
  ],
  [
    "Will MTDGC ever ask for my password or OTP?",
    "No. You should keep your password, one-time codes and payment PIN private. If anyone asks for them while claiming to be MTDGC, contact us through the support page before continuing.",
  ],
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Frequently asked questions | MTDGC" },
      {
        name: "description",
        content:
          "Answers from MTDGC, Matrix Digital Goods & Commerce, on delivery times, NPR payment, player IDs, gift card regions, refunds and account security.",
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
    links: canonicalLinks(`${SITE_URL}/faq`),
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
