import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { buildOrderMessage, useCart } from "@/lib/cart";
import { formatNpr, SITE_URL, whatsappLink } from "@/lib/format";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout | MTDGC" },
      { name: "description", content: "Send your MTDGC order for confirmation. No card payment is taken on this site." },
      { property: "og:title", content: "MTDGC checkout" },
      { property: "og:description", content: "Confirm your MTDGC order details before payment." },
      { property: "og:url", content: `${SITE_URL}/checkout` },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/checkout` }],
  }),
  component: CheckoutPage,
});

function makeReference(): string {
  const now = new Date();
  const date = `${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let tail = "";
  for (let i = 0; i < 4; i += 1) tail += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `MTD-${date}-${tail}`;
}

function CheckoutPage() {
  const { lines, subtotalMinor } = useCart();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sentRef, setSentRef] = useState<string | null>(null);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (sending) return;
    const digits = contact.replace(/[^\d]/g, "");
    if (!name.trim()) {
      setError("Please add your full name.");
      return;
    }
    if (digits.length < 7 || digits.length > 15) {
      setError("Please enter a WhatsApp number with 7 to 15 digits, including the country code if outside Nepal.");
      return;
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("That email address does not look right. Please check it or leave it empty.");
      return;
    }
    setError(null);
    setSending(true);
    const reference = sentRef ?? makeReference();
    const extras = [
      `Reference: ${reference}`,
      `Name: ${name.trim().slice(0, 80)}`,
      `WhatsApp: ${contact.trim().slice(0, 20)}`,
      ...(email.trim() ? [`Delivery email: ${email.trim().slice(0, 120)}`] : []),
      ...lines.flatMap((line) =>
        Object.entries(line.fields ?? {})
          .filter(([, value]) => value)
          .map(([key, value]) => `${line.productName} - ${key}: ${value}`),
      ),
      ...(note.trim() ? [`Note: ${note.trim().slice(0, 500)}`] : []),
    ];
    const message = buildOrderMessage(lines, subtotalMinor, extras);
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
    setSentRef(reference);
    window.setTimeout(() => setSending(false), 2500);
  };


  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="focus:outline-none mx-auto max-w-4xl px-4 pb-16 pt-6">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Cart", to: "/cart" }, { label: "Checkout" }]} />
        <h1 className="font-display text-[26px] font-medium md:text-4xl">Checkout</h1>
        <p className="mt-2 max-w-[60ch] text-sm text-muted-foreground">
          MTDGC does not take card payments on this site yet. Send your order details and our team confirms availability
          and payment instructions on WhatsApp before you pay.
        </p>

        {lines.length === 0 ? (
          <div className="mt-8 rounded-lg border border-border py-14 text-center">
            <p className="font-display font-medium">There is nothing to check out</p>
            <Button asChild className="mt-4"><Link to="/catalog">Browse the catalog</Link></Button>
          </div>
        ) : (
          <div className="mt-6 grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
            <form onSubmit={submit} noValidate>
              <h2 className="font-display text-lg font-medium">Your details</h2>
              <div className="mt-3 space-y-3">
                <label className="block">
                  <span className="font-display text-xs text-muted-foreground">Full name</span>
                  <input value={name} onChange={(event) => setName(event.target.value)} required className="mt-1 h-10 w-full rounded-md border border-border bg-card px-3 font-display text-sm outline-none focus:border-primary" />
                </label>
                <label className="block">
                  <span className="font-display text-xs text-muted-foreground">WhatsApp number</span>
                  <input value={contact} onChange={(event) => setContact(event.target.value)} required inputMode="tel" className="mt-1 h-10 w-full rounded-md border border-border bg-card px-3 font-display text-sm outline-none focus:border-primary" />
                </label>
                <label className="block">
                  <span className="font-display text-xs text-muted-foreground">Delivery email, if the product needs one</span>
                  <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" className="mt-1 h-10 w-full rounded-md border border-border bg-card px-3 font-display text-sm outline-none focus:border-primary" />
                </label>
                <label className="block">
                  <span className="font-display text-xs text-muted-foreground">Anything else we should know</span>
                  <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} className="mt-1 w-full rounded-md border border-border bg-card p-3 font-display text-sm outline-none focus:border-primary" />
                </label>
              </div>
              {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
              {sentRef && (
                <div role="status" className="mt-4 rounded-lg border border-border bg-card p-4 text-sm">
                  <p className="font-display font-medium">Your order reference is {sentRef}</p>
                  <p className="mt-1 text-muted-foreground">
                    WhatsApp should now be open with your order filled in. Press send there so our team receives it. We
                    reply with availability and payment instructions. Nothing has been charged.
                  </p>
                  <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                    {lines.map((line) => (
                      <li key={line.sku}>
                        {line.quantity} × {line.productName}, {line.variantName}
                        {Object.entries(line.fields ?? {})
                          .filter(([, v]) => v)
                          .map(([k, v]) => ` · ${k}: ${v}`)
                          .join("")}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-xs text-muted-foreground">
                    WhatsApp did not open? Press the button again, or keep this reference and <Link to="/support" className="underline">contact support</Link>.
                  </p>
                </div>
              )}
              <Button type="submit" size="lg" className="mt-4 w-full" disabled={sending}>
                {sending ? "Opening WhatsApp" : sentRef ? "Open WhatsApp again" : "Send order for confirmation"}
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">
                You can order as a guest. An account is not required.
              </p>
            </form>

            <aside className="h-fit rounded-lg bg-panel p-4">
              <h2 className="font-display text-lg font-medium">Order summary</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {lines.map((line) => (
                  <li key={line.sku} className="flex justify-between gap-3">
                    <span className="min-w-0">
                      {line.quantity} × {line.productName}
                      <span className="block text-xs text-muted-foreground">{line.variantName}</span>
                    </span>
                    <span className="font-display">{formatNpr(line.priceMinor * line.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between border-t border-border pt-3 font-display">
                <span>Estimated total</span>
                <strong>{formatNpr(subtotalMinor)}</strong>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Order statuses are pending, processing, paid, fulfilled, completed, cancelled, failed or refunded. We
                tell you which one your order is in.
              </p>
            </aside>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
