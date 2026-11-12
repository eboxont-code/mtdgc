import { Link } from "@tanstack/react-router";

import { WHATSAPP_DISPLAY, whatsappLink } from "@/lib/format";

const LINKS = [
  { to: "/policies/refunds", title: "Refund policy", body: "If MTDGC cannot deliver, the payment is returned. A revealed code or a credited top-up cannot be reversed." },
  { to: "/policies/delivery", title: "Delivery times", body: "Each listing states the delivery time to expect after payment is verified." },
  { to: "/how-it-works", title: "How ordering works", body: "Choose a product, pay the NPR total, and receive it after payment is verified." },
  { to: "/support", title: "Contact support", body: `WhatsApp ${WHATSAPP_DISPLAY}, or send a request on the support page.` },
] as const;

export function BuyerProtection() {
  const wa = whatsappLink();
  return (
    <section className="mx-auto max-w-6xl px-4 py-8" aria-labelledby="buyer-protection">
      <h2 id="buyer-protection" className="font-display text-[17px] font-medium md:text-2xl">Buyer protection</h2>
      <p className="mt-2 max-w-[68ch] text-sm text-foreground/80">
        You pay by QR or bank transfer using the details on your order. MTDGC does not take card numbers on this website, and it does not ask for your password, one-time code or payment PIN.
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {LINKS.map((item) => (
          <li key={item.to} className="rounded-2xl border border-border bg-card p-4">
            <Link to={item.to} className="font-display text-sm font-medium text-primary">{item.title}</Link>
            <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
          </li>
        ))}
      </ul>
      {wa && (
        <p className="mt-3 text-sm">
          <a href={wa} className="text-primary underline underline-offset-4" target="_blank" rel="noreferrer">Message support on WhatsApp</a>
        </p>
      )}
    </section>
  );
}
