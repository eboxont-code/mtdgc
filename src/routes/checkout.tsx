import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";

import { contactKind } from "@/lib/product-help";
import { GIFT_CARD_PRICE_DISCLOSURE, isGiftCardCategory } from "@/lib/gift-card-pricing";

import { supabase } from "@/integrations/supabase/client";
import { getPaymentSettings, placeOrder } from "@/lib/orders.functions";
import { PaymentProofForm } from "@/components/payment-proof-form";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { useCart, type CartLine } from "@/lib/cart";
import { formatNpr, SITE_URL } from "@/lib/format";
import { enabledProviders } from "@/lib/payments";
import { getRegionCompatibilityWarning, REGION_CHANGED_MESSAGE, REGION_COMPATIBILITY_CONFIRMATION_REQUIRED_MESSAGE, REGION_NOT_LISTED_MESSAGE, requiresRegionCompatibilityConfirmation } from "@/lib/region-compatibility";
import { Check, ChevronDown, Lock, QrCode, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout | MTDGC" },
      { name: "description", content: "Place your MTDGC order, then pay by QR or bank transfer and upload your payment screenshot for verification." },
      { property: "og:title", content: "MTDGC checkout" },
      { property: "og:description", content: "Place your order and pay locally in NPR." },
      { name: "twitter:title", content: "MTDGC checkout"  },
      { name: "twitter:description", content: "Place your order and pay locally in NPR."  },
      { property: "og:url", content: `${SITE_URL}/checkout` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/checkout` }],
  }),
  component: CheckoutPage,
});

const STEPS = ["Your details", "Payment", "Review"] as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const inputCls = "mt-1 h-11 w-full rounded-lg border bg-background/60 px-3 font-display text-[15px] outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

type Errors = Record<string, string>;
type CheckoutLine = Pick<CartLine, "sku" | "productName" | "variantName" | "priceMinor" | "image" | "region" | "categorySlug" | "quantity">;

const CONTACT_KEY = "mtdgc-checkout-contact";

function CheckoutPage() {
  const { lines, subtotalMinor, updateFields, updateSnapshot, clear, hydrated } = useCart();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [editContact, setEditContact] = useState(false);
  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [placeError, setPlaceError] = useState<string | null>(null);
  const [placed, setPlaced] = useState<{ orderNumber: string; totalMinor: number; lines: CheckoutLine[] } | null>(null);
  const [regionConfirmedFor, setRegionConfirmedFor] = useState<string | null>(null);
  const regionConfirmationLines = lines.filter((line) => requiresRegionCompatibilityConfirmation([line]));
  const regionConfirmationKey = JSON.stringify(
    regionConfirmationLines.map((line) => [line.sku, line.region?.trim() ?? ""]).sort(([a], [b]) => String(a).localeCompare(String(b))),
  );
  const regionConfirmed = regionConfirmationLines.length === 0 || regionConfirmedFor === regionConfirmationKey;
  const formRef = useRef<HTMLDivElement>(null);
  const restored = useRef(false);
  const placeOrderFn = useServerFn(placeOrder);
  const loadPay = useServerFn(getPaymentSettings);
  const [pay, setPay] = useState<Awaited<ReturnType<typeof getPaymentSettings>> | null>(null);
  useEffect(() => { loadPay().then(setPay).catch(() => setPay(null)); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let saved: { name?: string; phone?: string; email?: string; note?: string } = {};
    try { saved = JSON.parse(sessionStorage.getItem(CONTACT_KEY) ?? "{}"); } catch { /* ignore */ }
    if (saved.name) setName(saved.name);
    if (saved.phone) setPhone(saved.phone);
    if (saved.email) setEmail(saved.email);
    if (saved.note) setNote(saved.note);
    restored.current = true;
    supabase.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user;
      if (!user) return;
      const { data: profile } = await supabase.from("profiles").select("display_name, phone, delivery_email").eq("id", user.id).maybeSingle();
      setName((v) => v || profile?.display_name || "");
      setPhone((v) => v || profile?.phone || "");
      setEmail((v) => v || profile?.delivery_email || user.email || "");
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const all = lines.flatMap((l) => Object.entries(l.fields ?? {}));
    const em = all.find(([k, v]) => contactKind(k) === "email" && v.trim())?.[1];
    const ph = all.find(([k, v]) => contactKind(k) === "phone" && v.trim())?.[1];
    if (em) setEmail((v) => v || em);
    if (ph) setPhone((v) => v || ph);
  }, [hydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!restored.current || placed) return;
    try { sessionStorage.setItem(CONTACT_KEY, JSON.stringify({ name, phone, email, note })); } catch { /* ignore */ }
  }, [name, phone, email, note, placed]);

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

  const contactReady = Boolean(name.trim() && (phone.trim() || email.trim())) && Object.keys(validateContact()).length === 0;
  const showContactSummary = contactReady && !editContact;

  const next = () => {
    const e = step === 0 ? { ...validateContact(), ...validateDelivery() } : {};
    setErrors(e);
    if (Object.keys(e).length) return focusFirst(e);
    setStep((s) => Math.min(s + 1, 2));
    window.scrollTo({ top: 0, behavior: "smooth" });
    formRef.current?.focus({ preventScroll: true });
  };

  const submitOrder = async () => {
    if (sending) return;
    if (regionConfirmationLines.length > 0 && !regionConfirmed) {
      setPlaceError(REGION_COMPATIBILITY_CONFIRMATION_REQUIRED_MESSAGE);
      setStep(2);
      return;
    }
    const e = { ...validateContact(), ...validateDelivery() };
    if (Object.keys(e).length) {
      setErrors(e);
      setStep(0);
      return focusFirst(e);
    }
    setSending(true);
    setPlaceError(null);
    try {
      const { data: sess } = await supabase.auth.getSession();
      const result = await placeOrderFn({
        data: {
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          note: note.trim(),
          bearer: sess.session?.access_token,
          lines: lines.map((l) => ({
            sku: l.sku,
            quantity: l.quantity,
            fields: l.fields ?? {},
            expectedProductName: l.productName,
            expectedVariantName: l.variantName,
            expectedPriceMinor: l.priceMinor,
            region: l.region ?? "",
          })),
          regionConfirmed,
        },
      });
      if (result.status === "cart_changed") {
        for (const line of result.lines) {
          updateSnapshot(line.sku, {
            productName: line.productName,
            variantName: line.variantName,
            priceMinor: line.priceMinor,
            image: line.image,
            categorySlug: line.categorySlug,
          });
        }
        setPlaceError("A product name, option or price changed since this cart was saved. We updated the summary with the current catalogue details. Review the new prices and place the order again.");
        return;
      }
      const tokenKey = `mtdgc-order-${result.orderNumber.toUpperCase()}`;
      try { localStorage.setItem(tokenKey, result.accessToken); } catch { /* storage unavailable */ }
      try { sessionStorage.setItem(tokenKey, result.accessToken); sessionStorage.removeItem(CONTACT_KEY); } catch { /* storage unavailable */ }
      setPlaced({ orderNumber: result.orderNumber, totalMinor: result.totalMinor, lines: result.lines });
      clear();
      setStep(3);
      window.scrollTo({ top: 0 });
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      const regionMessages = [REGION_COMPATIBILITY_CONFIRMATION_REQUIRED_MESSAGE, REGION_NOT_LISTED_MESSAGE, REGION_CHANGED_MESSAGE];
      setPlaceError(regionMessages.includes(message) ? message : "We could not save your order. Please check your connection and try again.");
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
  const itemCount = shownLines.reduce((sum, line) => sum + line.quantity, 0);
  const totalMinor = placed?.totalMinor ?? subtotalMinor;
  const provider = enabledProviders()[0];
  const stepIndex = Math.min(step, 2);

  const Panel = ({ n, title, children, id }: { n: number; title: string; children: React.ReactNode; id: string }) => (
    <section aria-labelledby={id} className="rounded-2xl border border-border bg-card p-4 md:p-5">
      <h2 id={id} className="flex items-center gap-2.5 font-display text-[16px] font-semibold md:text-lg">
        <span className="grid size-7 shrink-0 place-items-center rounded-full border border-primary/50 bg-primary/10 font-mono text-xs font-bold text-primary">{n}</span>
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );

  const Done = ({ n, title, onEdit, children }: { n: number; title: string; onEdit: () => void; children: React.ReactNode }) => (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-card/60 p-4">
      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary font-mono text-xs font-bold text-primary-foreground"><Check className="size-4" /></span>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Step {n} · {title}</p>
        <div className="mt-1 text-sm text-foreground/85">{children}</div>
      </div>
      <button type="button" onClick={onEdit} className="shrink-0 text-xs text-primary underline-offset-2 hover:underline">Edit</button>
    </div>
  );

  const summaryLines = (
    <ul className="space-y-3">
      {shownLines.map((line) => (
        <li key={line.sku} className="flex gap-3">
          {line.image ? (
            <img src={line.image} alt="" width={48} height={48} className="size-12 shrink-0 rounded-lg border border-border object-cover" />
          ) : (
            <span className="size-12 shrink-0 rounded-lg border border-border bg-secondary" />
          )}
          <span className="min-w-0 flex-1 text-sm">
            <span className="block truncate font-display font-medium">{line.productName}</span>
            <span className="block text-xs text-muted-foreground">{isGiftCardCategory(line.categorySlug) ? "Face value: " + line.variantName : line.variantName} · Qty {line.quantity}</span>
            <span className="block text-xs text-muted-foreground">{isGiftCardCategory(line.categorySlug) ? "MTDGC selling price" : "Price"}: {formatNpr(line.priceMinor)} each</span>
            {line.region?.trim() && <span className="block text-xs text-muted-foreground">Listed region: {line.region}</span>}
            {requiresRegionCompatibilityConfirmation([line]) && <span role="note" className="mt-2 block rounded-lg border border-warn/40 bg-warn/5 p-2 text-xs leading-relaxed">{getRegionCompatibilityWarning(line.region)}</span>}
          </span>
          <span className="shrink-0 text-right font-mono text-sm font-bold text-price">{formatNpr(line.priceMinor * line.quantity)}<span className="block text-[10px] font-normal text-muted-foreground">Line total</span></span>
        </li>
      ))}
    </ul>
  );

  const totals = (
    <div className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm">
      <div className="flex justify-between text-muted-foreground"><span>Items</span><span>{itemCount}</span></div>
      <div className="flex items-baseline justify-between pt-1 font-display">
        <span className="font-semibold">Total</span>
        <strong className="font-mono text-xl text-price">{formatNpr(totalMinor)}</strong>
      </div>
      {shownLines.some((line) => isGiftCardCategory(line.categorySlug)) && <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{GIFT_CARD_PRICE_DISCLOSURE}</p>}
    </div>
  );

  const reassurance = (
    <ul className="mt-4 space-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
      <li className="flex gap-2"><ShieldCheck className="size-4 shrink-0 text-primary" />We check every order before delivery.</li>
      <li className="flex gap-2"><Lock className="size-4 shrink-0 text-primary" />We never ask for your password, OTP, recovery code or payment PIN.</li>
    </ul>
  );

  const primaryAction =
    step === 0 ? { label: "Continue to payment", onClick: next, disabled: false }
    : step === 1 ? { label: "Review order", onClick: next, disabled: false }
    : step === 2 ? { label: sending ? "Placing your order" : placeError ? "Try again" : "Place order", onClick: submitOrder, disabled: sending || (regionConfirmationLines.length > 0 && !regionConfirmed) }
    : null;

  const contactText = (
    <>
      <span className="block">{name}</span>
      {phone && <span className="block text-muted-foreground">{phone}</span>}
      {email && <span className="block text-muted-foreground">{email}</span>}
    </>
  );

  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="focus:outline-none mx-auto max-w-6xl px-4 pb-32 pt-5 md:pb-16">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Cart", to: "/cart" }, { label: "Checkout" }]} />
        <div className="flex items-end justify-between gap-3">
          <h1 className="font-display text-[26px] font-semibold md:text-4xl">{placed ? "Order placed" : "Checkout"}</h1>
          {!placed && <p className="flex items-center gap-1.5 pb-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"><Lock className="size-3.5 text-primary" />Guest checkout</p>}
        </div>

        {!placed && (
          <ol className="mt-4 grid grid-cols-3 gap-2" aria-label="Checkout steps">
            {STEPS.map((label, i) => (
              <li key={label} aria-current={i === stepIndex ? "step" : undefined} className="min-w-0">
                <span className={`block h-1 rounded-full ${i <= stepIndex ? "bg-primary" : "bg-secondary"}`} />
                <span className={`mt-1.5 block truncate font-mono text-[10px] uppercase tracking-[0.1em] ${i === stepIndex ? "text-primary" : "text-muted-foreground"}`}>
                  {i + 1}. {label}
                </span>
              </li>
            ))}
          </ol>
        )}

        {!placed && !hydrated ? (
          <p className="mt-6 text-sm text-muted-foreground">Loading your order details.</p>
        ) : !placed && lines.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-border bg-card py-14 text-center">
            <p className="font-display font-medium">There is nothing to check out</p>
            <Button asChild className="mt-4"><Link to="/catalog">Browse the catalog</Link></Button>
          </div>
        ) : (
          <div className="mt-5 grid gap-5 md:grid-cols-[minmax(0,1fr)_340px] md:items-start">
            {/* Order summary: collapsible on phones, sticky on desktop */}
            <aside className="md:sticky md:top-24 md:order-2" aria-label="Order summary">
              <details className="group rounded-2xl border border-border bg-card md:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4">
                  <span className="font-display text-sm font-medium">Order summary <span className="text-muted-foreground">({itemCount} {itemCount === 1 ? "item" : "items"})</span></span>
                  <span className="flex items-center gap-2 font-mono text-sm font-bold text-price">{formatNpr(totalMinor)}<ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" /></span>
                </summary>
                <div className="border-t border-border p-4">{summaryLines}{totals}</div>
              </details>
              <div className="hidden rounded-2xl border border-border bg-card p-5 md:block">
                <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Order summary</p>
                {summaryLines}
                {totals}
                {primaryAction && step < 2 && (
                  <Button size="lg" className="mt-4 w-full" disabled={primaryAction.disabled} onClick={primaryAction.onClick}>{primaryAction.label}</Button>
                )}
                {reassurance}
              </div>
            </aside>

            <div ref={formRef} tabIndex={-1} className="min-w-0 space-y-4 focus:outline-none md:order-1">
              {step === 0 && (
                <Panel n={1} title="Your details" id="h-details">
                  <p className="text-xs text-muted-foreground">Add a mobile number, an email, or both, so we can reach you about this order. No account needed.</p>
                  <div className="mt-3 space-y-3">
                    <label htmlFor="co-name" className="block">
                      <span className="font-display text-xs text-muted-foreground">Full name</span>
                      <input {...aria("co-name")} value={name} autoComplete="name" onChange={(e) => setName(e.target.value)} />
                      {err("co-name")}
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label htmlFor="co-phone" className="block">
                        <span className="font-display text-xs text-muted-foreground">Mobile number</span>
                        <input {...aria("co-phone")} value={phone} autoComplete="tel" inputMode="tel" placeholder="98XXXXXXXX" onChange={(e) => setPhone(e.target.value)} />
                        {err("co-phone")}
                      </label>
                      <label htmlFor="co-email" className="block">
                        <span className="font-display text-xs text-muted-foreground">Email</span>
                        <input {...aria("co-email")} value={email} type="email" autoComplete="email" placeholder="you@example.com" onChange={(e) => setEmail(e.target.value)} />
                        {err("co-email")}
                      </label>
                    </div>
                  </div>

                  {lines.some((line) => Object.keys(line.fields ?? {}).length > 0) && (
                    <div className="mt-5 space-y-3 border-t border-border pt-4">
                      <p className="font-display text-sm font-medium">Delivery details</p>
                      {lines.map((line) => {
                        const all = Object.entries(line.fields ?? {});
                        if (!all.length) return null;
                        return (
                          <fieldset key={line.sku} className="rounded-xl border border-border p-3">
                            <legend className="px-1 font-mono text-[11px] uppercase tracking-[0.08em] text-primary">{line.productName}, {line.variantName}</legend>
                            {all.map(([key, value]) => {
                              const id = fieldId(line.sku, key);
                              return (
                                <label key={key} htmlFor={id} className="mt-1 block first:mt-0">
                                  <span className="font-display text-xs text-muted-foreground">{key}</span>
                                  <input {...aria(id)} value={value} onChange={(e) => updateFields(line.sku, { ...line.fields, [key]: e.target.value })} />
                                  {err(id)}
                                </label>
                              );
                            })}
                          </fieldset>
                        );
                      })}
                    </div>
                  )}

                  <label htmlFor="co-note" className="mt-4 block">
                    <span className="font-display text-xs text-muted-foreground">Anything else we should know (optional)</span>
                    <textarea id="co-note" value={note} rows={3} onChange={(e) => setNote(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background/60 p-3 font-display text-[15px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                  </label>
                </Panel>
              )}

              {step >= 1 && step <= 2 && (
                <Done n={1} title="Your details" onEdit={() => setStep(0)}>
                  {contactText}
                  {lines.flatMap((line) => Object.entries(line.fields ?? {}).map(([k, v]) => (
                    <span key={`${line.sku}-${k}`} className="block text-xs text-muted-foreground">{k}: {v}</span>
                  )))}
                </Done>
              )}

              {step === 1 && (
                <Panel n={2} title="Payment method" id="h-payment">
                  {provider && (
                    <div role="radiogroup" aria-label="Payment method">
                      <div role="radio" aria-checked="true" className="flex gap-3 rounded-xl border border-primary bg-primary/5 p-4">
                        <QrCode className="mt-0.5 size-5 shrink-0 text-primary" />
                        <div className="min-w-0 flex-1">
                          <p className="font-display text-sm font-semibold">{provider.label}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{provider.description}</p>
                        </div>
                        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="size-3.5" /></span>
                      </div>
                    </div>
                  )}
                  <div className="mt-4 rounded-xl border border-border bg-background/40 p-4 text-sm">
                    <p className="font-display font-medium">How paying works</p>
                    <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs text-muted-foreground">
                      <li>Place your order to get your order number. No card is charged on this site.</li>
                      <li>{pay?.configured ? "The QR code and bank details appear on the next screen." : "Our team will send payment details shortly after you place the order."}</li>
                      <li>Pay the exact total, then upload your payment screenshot with the transaction reference.</li>
                      <li>We verify the payment and deliver your order.</li>
                    </ol>
                  </div>
                </Panel>
              )}

              {step === 2 && (
                <>
                  <Done n={2} title="Payment method" onEdit={() => setStep(1)}>{provider?.label ?? "QR or bank transfer"}</Done>
                  <Panel n={3} title="Review and place order" id="h-summary">
                    {summaryLines}
                    {totals}
                    {regionConfirmationLines.length > 0 && (
                      <div className="mt-4 rounded-xl border border-warn/50 bg-warn/5 p-3">
                        <label className="flex min-h-11 cursor-pointer items-start gap-3 text-sm">
                          <input
                            type="checkbox"
                            checked={regionConfirmed}
                            onChange={(event) => setRegionConfirmedFor(event.target.checked ? regionConfirmationKey : null)}
                            className="mt-0.5 size-5 shrink-0 accent-primary"
                          />
                          <span>I have checked the issuer's current redemption rules for each intended account. I will not pay unless those rules confirm that every listed code can be redeemed there.</span>
                        </label>
                      </div>
                    )}
                    {note.trim() && <p className="mt-3 text-xs text-muted-foreground">Note: {note}</p>}
                    {placeError && <p role="alert" className="mt-3 text-sm text-destructive">{placeError}</p>}
                    <Button size="lg" className="mt-4 hidden w-full md:flex" disabled={sending || (regionConfirmationLines.length > 0 && !regionConfirmed)} onClick={submitOrder}>
                      {sending ? "Placing your order" : placeError ? "Try again" : "Place order"}
                    </Button>
                    <p className="mt-3 text-xs text-muted-foreground">By placing the order you agree to our <Link to="/policies/terms" className="text-primary underline-offset-2 hover:underline">terms</Link> and <Link to="/policies/refunds" className="text-primary underline-offset-2 hover:underline">refund policy</Link>. No card payments are taken on this site.</p>
                  </Panel>
                </>
              )}

              {step >= 3 && placed && (
                <section role="status" aria-labelledby="h-done" className="rounded-2xl border border-primary/40 bg-card p-5 text-sm">
                  <span className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="size-5" /></span>
                  <h2 id="h-done" className="mt-3 font-display text-lg font-semibold">Thanks, we have your order.</h2>
                  <p className="mt-1 font-display">Order number: <strong className="font-mono text-primary">{placed.orderNumber}</strong></p>
                  <div className="mt-4 rounded-xl border border-border bg-background/40 p-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Pay {formatNpr(placed.totalMinor)}</p>
                    {pay?.configured ? (
                      <div className="mt-2 space-y-2">
                        <p>Pay {formatNpr(placed.totalMinor)} using the details below, then keep your transaction reference.</p>
                        {pay.qrUrl && <img src={pay.qrUrl} alt="Payment QR code" width={220} height={220} className="size-[220px] rounded-lg border border-border bg-white object-contain p-2" />}
                        {pay.bankName && <p>Bank: <strong>{pay.bankName}</strong></p>}
                        {pay.accountName && <p>Account name: <strong>{pay.accountName}</strong></p>}
                        {pay.accountNumber && <p>Account number: <strong className="font-mono">{pay.accountNumber}</strong></p>}
                        {pay.instructions && <p className="text-muted-foreground">{pay.instructions}</p>}
                      </div>
                    ) : (
                      <p className="mt-2">Our team will send payment details shortly. Keep your order number handy.</p>
                    )}
                  </div>
                  <PaymentProofForm orderNumber={placed.orderNumber} />
                  <p className="mt-3 text-xs text-muted-foreground">
                    Keep your order number to <Link to="/track-order" className="text-primary underline-offset-2 hover:underline">track the order</Link> or{" "}
                    <Link to="/support" className="text-primary underline-offset-2 hover:underline">contact support</Link>.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button asChild><Link to="/order/$orderNumber" params={{ orderNumber: placed.orderNumber }}>View your order</Link></Button>
                    <Button asChild variant="outline"><Link to="/catalog">Continue shopping</Link></Button>
                  </div>
                </section>
              )}

              {step > 0 && step <= 2 && (
                <Button variant="outline" className="hidden md:inline-flex" onClick={() => setStep((s) => s - 1)}>Back</Button>
              )}
              <div className="md:hidden">{step <= 2 && reassurance}</div>
            </div>
          </div>
        )}
      </main>

      {/* Sticky action bar on phones */}
      {hydrated && !placed && lines.length > 0 && primaryAction && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3 backdrop-blur md:hidden">
          <div className="flex items-center gap-3">
            {step > 0 && (
              <Button variant="outline" className="h-11 shrink-0 px-4" onClick={() => setStep((s) => s - 1)}>Back</Button>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Total</p>
              <p className="font-mono text-[17px] font-bold leading-tight text-price">{formatNpr(totalMinor)}</p>
            </div>
            <Button className="h-11 shrink-0 px-5" disabled={primaryAction.disabled} onClick={primaryAction.onClick}>{primaryAction.label}</Button>
          </div>
        </div>
      )}
      <SiteFooter />
    </div>
  );
}
