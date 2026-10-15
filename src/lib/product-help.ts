import type { CatalogProduct } from "@/lib/catalog.functions";
import { ACCOUNT_TYPE_LABEL, DELIVERY_CHANNEL_LABEL } from "@/lib/listing";

const HELP: Array<[RegExp, string]> = [
  [/account email/i, "The email of the account we should upgrade or invite. We never need its password."],
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

function typeFaqs(product: CatalogProduct): Array<{ q: string; a: string }> | null {
  if (product.product_type === "software_key") {
    const faqs = [
      { q: "Where do I get my key?", a: `${DELIVERY_CHANNEL_LABEL[product.delivery_channel]} once your payment is verified.` },
      {
        q: "What if the key does not activate?",
        a: product.warranty_days != null
          ? [`Contact support with your order number within ${product.warranty_days} days of delivery.`, product.warranty_note].filter(Boolean).join(" ")
          : "Contact support with your order number before trying again.",
      },
    ];
    if (product.system_requirements) faqs.push({ q: "What do I need before buying?", a: product.system_requirements });
    return faqs;
  }
  if (product.product_type === "subscription") {
    const types = [...new Set(product.variants.map((v) => v.account_type).filter((t): t is NonNullable<typeof t> => Boolean(t)))];
    const faqs: Array<{ q: string; a: string }> = [];
    if (types.length) faqs.push({ q: "Is the account private or shared?", a: `${types.map((t) => ACCOUNT_TYPE_LABEL[t]).join(" or ")}, depending on the plan you choose.` });
    faqs.push({ q: "Does it renew on its own?", a: "No. Plans are prepaid. Order again when you want to continue." });
    const limits = [...new Set(product.variants.map((v) => v.device_limit).filter((n): n is number => n != null))];
    if (limits.length) faqs.push({ q: "How many devices?", a: limits.length === 1 ? `Up to ${limits[0]} devices.` : `Between ${Math.min(...limits)} and ${Math.max(...limits)} devices, depending on the plan.` });
    return faqs;
  }
  return null;
}

export function productFaqs(product: CatalogProduct): Array<{ q: string; a: string }> {
  const typed = typeFaqs(product);
  if (typed) return typed;
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
