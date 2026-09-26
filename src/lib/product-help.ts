import type { CatalogProduct } from "@/lib/catalog.functions";

const HELP: Array<[RegExp, string]> = [
  [/player id|uid/i, "Open the game, tap your profile picture and copy the number shown under your name."],
  [/server|zone/i, "Shown next to your Player ID on the profile screen, usually in brackets."],
  [/region/i, "Must match the region your account was created in, or the top-up may not apply."],
  [/email/i, "We send codes and order updates here. Check it for typos before you continue."],
  [/phone|whatsapp/i, "The WhatsApp number we should contact about this order."],
  [/username|account/i, "Your public username only. Never share a password."],
];

export function requirementHelp(requirement: string): string | null {
  return HELP.find(([pattern]) => pattern.test(requirement))?.[1] ?? null;
}

export function productFaqs(product: CatalogProduct): Array<{ q: string; a: string }> {
  const faqs = [
    {
      q: `Which region does ${product.name} work in?`,
      a: `This product is for the ${product.region} region. Check that your account matches before ordering.`,
    },
    {
      q: "How is it delivered?",
      a: `${product.delivery_method}. ${product.delivery_time}. MTDGC confirms your order on WhatsApp before you pay.`,
    },
    {
      q: "How do I pay?",
      a: "After you send your order, MTDGC replies on WhatsApp with the total and payment instructions. Nothing is charged on this site.",
    },
    { q: "Can I get a refund?", a: product.refund_eligibility },
  ];
  if (product.requirements.length) {
    faqs.splice(1, 0, {
      q: "What details do you need from me?",
      a: `${product.requirements.join(", ")}. We never ask for your password, OTP or payment PIN.`,
    });
  }
  return faqs;
}
