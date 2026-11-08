import type { CatalogProduct } from "@/lib/catalog.functions";

const HELP: Array<[RegExp, string]> = [
  [/player id|user id|uid/i, "Open the game, tap your profile picture and copy the number shown under your name."],
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
  // Game account fields such as "PUBG Mobile player ID" are not contact details.
  if (/player|\bid\b|uid|nickname|username|server/i.test(key)) return null;
  if (/e-?mail/i.test(key)) return "email";
  if (/whatsapp|phone|mobile/i.test(key)) return "phone";
  return null;
}

/**
 * Product-specific questions only. Generic questions (delivery, payment,
 * refunds, details we need) live on /how-it-works and /faq.
 */
export function productFaqs(product: CatalogProduct): Array<{ q: string; a: string }> {
  return [
    {
      q: `Which region does ${product.name} work in?`,
      a: `This product is for the ${product.region} region. Check that your account matches before ordering.`,
    },
    {
      q: `How is ${product.name} delivered?`,
      a: `${product.delivery_method}. Expected time: ${product.delivery_time}.`,
    },
  ];
}
