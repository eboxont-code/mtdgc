import { Landmark, MessageCircle, PackageSearch, QrCode, ShieldCheck, Wallet } from "lucide-react";

import { enabledProviders } from "@/lib/payments";

const POINTS = [
  { icon: ShieldCheck, title: "Verified, then delivered", body: "Pay the NPR total. Your order is delivered after payment is verified." },
  { icon: Wallet, title: "NPR, with an A$ guide", body: "You pay in rupees. Australian customers can read the dollar guide." },
  { icon: PackageSearch, title: "Track every order", body: "Follow payment and delivery with your order number." },
  { icon: MessageCircle, title: "Support on WhatsApp", body: "Orders are placed on the site. Message the team if you need help." },
];

export function TrustBand() {
  return (
    <section aria-labelledby="trust-heading" className="mx-auto max-w-6xl px-4 pt-10 md:pt-14">
      <h2 id="trust-heading" className="sr-only">Why order from MTDGC</h2>
      <ul className="grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-3">
        {POINTS.map(({ icon: Icon, title, body }) => (
          <li key={title} className="rounded-2xl border border-border bg-card p-3.5 md:p-5">
            <span className="grid size-9 place-items-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
              <Icon className="size-[18px]" aria-hidden="true" />
            </span>
            <p className="mt-3 font-display text-[13px] font-semibold leading-snug md:text-[15px]">{title}</p>
            <p className="mt-1 text-[11.5px] leading-snug text-muted-foreground md:text-[13px]">{body}</p>
          </li>
        ))}
      </ul>
      <PaymentsRow className="mt-3" />
    </section>
  );
}

/** Lists only the payment methods that work today, from src/lib/payments.ts. */
export function PaymentsRow({ className = "" }: { className?: string }) {
  const providers = enabledProviders();
  if (!providers.length) return null;
  return (
    <div className={`flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card px-3.5 py-3 ${className}`}>
      <p className="mr-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">How you can pay</p>
      {providers.map((provider) =>
        provider.display === "qr_and_bank" ? (
          <span key={provider.id} className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-2.5 py-1 text-xs"><QrCode className="size-3.5 text-primary" aria-hidden="true" />QR code</span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-2.5 py-1 text-xs"><Landmark className="size-3.5 text-primary" aria-hidden="true" />Bank transfer</span>
          </span>
        ) : (
          <span key={provider.id} className="inline-flex items-center rounded-lg border border-border bg-secondary px-2.5 py-1 text-xs">{provider.label}</span>
        ),
      )}
      <p className="w-full text-[11px] text-muted-foreground md:ml-auto md:w-auto">Pay the NPR total, upload your payment confirmation, and we deliver after it is verified.</p>
    </div>
  );
}
