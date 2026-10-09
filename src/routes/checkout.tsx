import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useRef, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { placeOrder } from "@/lib/orders.functions";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { formatNpr, SITE_URL } from "@/lib/format";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout | MTDGC" },
      { name: "description", content: "Place your MTDGC order, then pay by QR or bank transfer and upload your payment screenshot for verification." },
      { property: "og:title", content: "MTDGC checkout" },
      { property: "og:description", content: "Place your order and pay locally in NPR." },
      { property: "og:url", content: `${SITE_URL}/checkout` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/checkout` }],
  }),
  component: CheckoutPage,
});

const STEPS = ["Contact", "Delivery details", "Summary", "Payment", "Done"] as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const inputCls = "mt-1 h-10 w-full rounded-md border bg-card px-3 font-display text-sm focus:border-primary";

type Errors = Record<string, string>;

function CheckoutPage() {
  const { lines, subtotalMinor, updateFields, clear } = useCart();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [placeError, setPlaceError] = useState<string | null>(null);
  const [placed, setPlaced] = useState<{ orderNumber: string; totalMinor: number; lines: typeof lines } | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const placeOrderFn = useServerFn(placeOrder);

  const focusFirst = (errs: Errors) => {
    const first = Object.keys(errs)[0];
    if (first) window.setTimeout(() => document.getElementById(first)?.focus(), 0);
  };

  const validateContact = (): Errors => {
    const e: Errors = {};
    if (!name.trim()) e["co-name"] = "Please add your full name.";
    const digits = phone.replace(/\D/g, "");
    if (!phone.trim() && !email.trim()) e["co-phone"] = "Add a mobile number or an email so we can reach you.";
    if (phone.trim() && (digits.length < 7 || digits.length > 15)) e["co-phone"] = "Mobile number must have 7 to 15 digits.";
    if (email.trim() && !EMAIL_RE.test(email.trim())) e["co-email"] = "That email address does not look right.";
    return e;
  };

  const fieldId = (sku: string, key: string) => `co-f-${sku}-${key}`.replace(/\W+/g, "-");

  const validateDelivery = (): Errors => {
    const e: Errors = {};
    for (const line of lines) {
      for (const [key, value] of Object.entries(line.fields ?? {})) {
        if (!value.trim()) e[fieldId(line.sku, key)] = `Please enter ${key.toLowerCase()}.`;
      }
    }
    return e;
  };

  const next = () => {
    const e = step === 0 ? validateContact() : step === 1 ? validateDelivery() : {};
    setErrors(e);
    if (Object.keys(e).length) return focusFirst(e);
    setStep((s) => s + 1);
    formRef.current?.focus();
  };

  const submitOrder = async () => {
    if (sending) return;
    const e = { ...validateContact(), ...validateDelivery() };
    if (Object.keys(e).length) {
      setErrors(e);
      setStep(Object.keys(validateContact()).length ? 0 : 1);
      return focusFirst(e);
    }
    setSending(true);
    setPlaceError(null);
    try {
      const { data: auth } = await supabase.auth.getUser();
      const snapshot = [...lines];
      const result = await placeOrderFn({
        data: {
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          note: note.trim(),
          userId: auth.user?.id ?? null,
          lines: lines.map((l) => ({ sku: l.sku, quantity: l.quantity, fields: l.fields ?? {} })),
        },
      });
      try { sessionStorage.setItem(`mtdgc-order-${result.orderNumber}`, result.accessToken); } catch { /* storage unavailable */ }
      setPlaced({ orderNumber: result.orderNumber, totalMinor: result.totalMinor, lines: snapshot });
      clear();
      setStep(3);
    } catch {
      setPlaceError("We could not save your order. Please check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  const err = (id: string) =>
    errors[id] ? <span id={`${id}-error`} className="mt-1 block text-xs text-destructive">{errors[id]}</span> : null;
  const aria = (id: string) => ({
    id,
    "aria-invalid": errors[id] ? true : undefined,
    "aria-describedby": errors[id] ? `${id}-error` : undefined,
    className: `${inputCls} ${errors[id] ? "border-destructive" : "border-border"}`,
  });

  const shownLines = placed?.lines ?? lines;

  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="focus:outline-none mx-auto max-w-4xl px-4 pb-16 pt-6">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Cart", to: "/cart" }, { label: "Checkout" }]} />
        <h1 className="font-display text-[26px] font-medium md:text-4xl">Checkout</h1>

        <ol className="mt-4 flex flex-wrap gap-2 text-xs" aria-label="Checkout steps">
          {STEPS.map((label, i) => (
            <li
              key={label}
              aria-current={i === step ? "step" : undefined}
              className={`rounded-full px-3 py-1 font-display ${i === step ? "bg-primary text-primary-foreground" : i < step ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground"}`}
            >
              {i + 1}. {label}
            </li>
          ))}
        </ol>

        {!placed && lines.length === 0 ? (
          <div className="mt-8 rounded-lg border border-border py-14 text-center">
            <p className="font-display font-medium">There is nothing to check out</p>
            <Button asChild className="mt-4"><Link to="/catalog">Browse the catalog</Link></Button>
          </div>
        ) : (
          <div ref={formRef} tabIndex={-1} className="mt-6 focus:outline-none md:max-w-xl">
            {step === 0 && (
              <section aria-labelledby="h-contact">
                <h2 id="h-contact" className="font-display text-lg font-medium">Contact</h2>
                <p className="mt-1 text-xs text-muted-foreground">Add a mobile number, an email, or both. You can order as a guest.</p>
                <div className="mt-3 space-y-3">
                  <label htmlFor="co-name" className="block">
                    <span className="font-display text-xs text-muted-foreground">Full name</span>
                    <input {...aria("co-name")} value={name} autoComplete="name" onChange={(e) => setName(e.target.value)} />
                    {err("co-name")}
                  </label>
                  <label htmlFor="co-phone" className="block">
                    <span className="font-display text-xs text-muted-foreground">Mobile number</span>
                    <input {...aria("co-phone")} value={phone} autoComplete="tel" inputMode="tel" onChange={(e) => setPhone(e.target.value)} />
                    {err("co-phone")}
                  </label>
                  <label htmlFor="co-email" className="block">
                    <span className="font-display text-xs text-muted-foreground">Email</span>
                    <input {...aria("co-email")} value={email} type="email" autoComplete="email" onChange={(e) => setEmail(e.target.value)} />
                    {err("co-email")}
                  </label>
                  <label htmlFor="co-note" className="block">
                    <span className="font-display text-xs text-muted-foreground">Anything else we should know (optional)</span>
                    <textarea id="co-note" value={note} rows={3} onChange={(e) => setNote(e.target.value)} className="mt-1 w-full rounded-md border border-border bg-card p-3 font-display text-sm focus:border-primary" />
                  </label>
                </div>
              </section>
            )}

            {step === 1 && (
              <section aria-labelledby="h-delivery">
                <h2 id="h-delivery" className="font-display text-lg font-medium">Delivery details</h2>
                <div className="mt-3 space-y-5">
                  {lines.map((line) => {
                    const entries = Object.entries(line.fields ?? {});
                    return (
                      <fieldset key={line.sku} className="rounded-lg border border-border p-3">
                        <legend className="px-1 font-display text-sm font-medium">{line.productName}, {line.variantName}</legend>
                        {entries.length === 0 ? (
                          <p className="text-xs text-muted-foreground">No extra details needed for this item.</p>
                        ) : (
                          entries.map(([key, value]) => {
                            const id = fieldId(line.sku, key);
                            return (
                              <label key={key} htmlFor={id} className="mt-2 block">
                                <span className="font-display text-xs text-muted-foreground">{key}</span>
                                <input {...aria(id)} value={value} onChange={(e) => updateFields(line.sku, { ...line.fields, [key]: e.target.value })} />
                                {err(id)}
                              </label>
                            );
                          })
                        )}
                      </fieldset>
                    );
                  })}
                </div>
              </section>
            )}

            {step === 2 && (
              <section aria-labelledby="h-summary" className="rounded-lg bg-panel p-4">
                <h2 id="h-summary" className="font-display text-lg font-medium">Summary</h2>
                <ul className="mt-3 space-y-2 text-sm">
                  {lines.map((line) => (
                    <li key={line.sku} className="flex justify-between gap-3">
                      <span className="min-w-0">
                        {line.quantity} × {line.productName}
                        <span className="block text-xs text-muted-foreground">{line.variantName}</span>
                        {Object.entries(line.fields ?? {}).map(([k, v]) => (
                          <span key={k} className="block text-xs text-muted-foreground">{k}: {v}</span>
                        ))}
                      </span>
                      <span className="font-display">{formatNpr(line.priceMinor * line.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <button type="button" onClick={() => setStep(1)} className="mt-1 text-xs text-primary underline">Edit delivery details</button>
                <div className="mt-3 border-t border-border pt-3 text-sm">
                  <p>{name}</p>
                  {phone && <p className="text-muted-foreground">{phone}</p>}
                  {email && <p className="text-muted-foreground">{email}</p>}
                  <button type="button" onClick={() => setStep(0)} className="mt-1 text-xs text-primary underline">Edit contact</button>
                </div>
                <div className="mt-3 flex justify-between border-t border-border pt-3 font-display">
                  <span>Total</span>
                  <strong>{formatNpr(subtotalMinor)}</strong>
                </div>
                {placeError && (
                  <p role="alert" className="mt-3 text-sm text-destructive">{placeError}</p>
                )}
                <Button size="lg" className="mt-4 w-full" disabled={sending} onClick={submitOrder}>
                  {sending ? "Placing your order" : placeError ? "Retry" : "Place order"}
                </Button>
                <p className="mt-2 text-xs text-muted-foreground">No card payments are taken on this site.</p>
              </section>
            )}

            {step >= 3 && placed && (
              <section role="status" aria-labelledby="h-done" className="rounded-lg border border-border bg-card p-5 text-sm">
                <h2 id="h-done" className="font-display text-lg font-medium">Thanks, we have your order.</h2>
                <p className="mt-1">Our team will send payment details shortly.</p>
                <p className="mt-3 font-display">Order number: <strong>{placed.orderNumber}</strong></p>
                <ul className="mt-3 space-y-1 text-muted-foreground">
                  {shownLines.map((line) => (
                    <li key={line.sku}>{line.quantity} × {line.productName}, {line.variantName} · {formatNpr(line.priceMinor * line.quantity)}</li>
                  ))}
                </ul>
                <p className="mt-2 font-display">Total: {formatNpr(placed.totalMinor)}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  Keep your order number to <Link to="/track-order" className="underline">track the order</Link> or{" "}
                  <Link to="/support" className="underline">contact support</Link>.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild><Link to="/order/$orderNumber" params={{ orderNumber: placed.orderNumber }}>View your order</Link></Button>
                  <Button asChild variant="outline"><Link to="/catalog">Continue shopping</Link></Button>
                </div>
              </section>
            )}

            {step < 2 && (
              <div className="mt-5 flex gap-2">
                {step > 0 && <Button variant="outline" onClick={() => setStep((s) => s - 1)}>Back</Button>}
                <Button onClick={next}>Continue</Button>
              </div>
            )}
            {step === 2 && (
              <Button variant="outline" className="mt-3" onClick={() => setStep(1)}>Back</Button>
            )}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
