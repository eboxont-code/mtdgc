import type { CatalogProduct } from "@/lib/catalog.functions";

const HELP: Array<[RegExp, string]> = [
  [/player id|uid/i, "Open the game, tap your profile picture and copy the number shown under your name."],
  [/server|zone/i, "Shown next to your Player ID on the profile screen, usually in brackets."],
  [/region/i, "Must match the region your account was created in, or the top-up may not apply."],
  [/email/i, "We send codes and order updates here. Check it for typos before you continue."],
  [/phone|whatsapp|mobile/i, "The mobile number we should contact about this order."],
  [/username|account/i, "Your public username only. Never share a password."],
];

export function requirementHelp(requirement: string): string | null {
  return HELP.find(([pattern]) => pattern.test(requirement))?.[1] ?? null;
}

export function contactKind(key: string): "email" | "phone" | null {
  if (/e-?mail/i.test(key)) return "email";
  if (/whatsapp|phone|mobile/i.test(key)) return "phone";
  return null;
}

export function productFaqs(product: CatalogProduct): Array<{ q: string; a: string }> {
  const faqs = [
    {
      q: `Which region does ${product.name} work in?`,
      a: `This product is for the ${product.region} region. Check that your account matches before ordering.`,
    },
    {
      q: "How is it delivered?",
      a: `${product.delivery_method}. Our team verifies your payment, then delivers the order and updates its status on the site.`,
    },
    {
      q: "How do I pay?",
      a: "Place the order, then pay by QR or bank transfer using the details shown at checkout and upload your payment screenshot. No card payments are taken on this site.",
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
