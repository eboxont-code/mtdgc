import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { submitPaymentProof } from "@/lib/orders.functions";

const TYPES = ["image/jpeg", "image/png", "image/webp"];

export function PaymentProofForm({ orderNumber, onDone }: { orderNumber: string; onDone?: () => void }) {
  const submit = useServerFn(submitPaymentProof);
  const [ref, setRef] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  if (done) return <p role="status" className="mt-3 rounded-md bg-panel p-3 text-sm">Thanks, we have your payment proof. We will verify it and update your order.</p>;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    const r = ref.trim();
    if (r.length < 4 || r.length > 64) return setError("Enter the transaction reference (4 to 64 characters).");
    if (!file) return setError("Please attach your payment screenshot.");
    if (!TYPES.includes(file.type)) return setError("Please upload a JPG, PNG or WebP image.");
    if (file.size > 5242880) return setError("The screenshot must be 5 MB or smaller.");
    setError("");
    setBusy(true);
    try {
      const key = `mtdgc-order-${orderNumber.toUpperCase()}`;
      const token = window.localStorage.getItem(key) ?? window.sessionStorage.getItem(key) ?? "";
      const { data: s } = await supabase.auth.getSession();
      const fd = new FormData();
      fd.set("orderNumber", orderNumber);
      fd.set("transactionRef", r);
      fd.set("file", file);
      if (token) fd.set("accessToken", token);
      if (s.session?.access_token) fd.set("bearer", s.session.access_token);
      const res = await submit({ data: fd });
      if (res.ok) { setDone(true); onDone?.(); } else setError(res.error);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 grid gap-3 rounded-lg border border-border p-4" noValidate>
      <h3 className="font-display text-sm font-medium">I've paid</h3>
      <label htmlFor="proof-ref" className="block font-display text-xs">
        Transaction reference
        <input id="proof-ref" value={ref} onChange={(e) => setRef(e.target.value)} maxLength={64} aria-invalid={!!error} aria-describedby="proof-error" className="mt-1 h-10 w-full rounded-md border border-border bg-card px-2 text-sm" />
      </label>
      <label htmlFor="proof-file" className="block font-display text-xs">
        Payment screenshot (JPG, PNG or WebP, up to 5 MB)
        <input id="proof-file" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="mt-1 block w-full text-sm" />
      </label>
      <p id="proof-error" role="alert" className="text-xs text-destructive">{error}</p>
      <Button type="submit" disabled={busy}>{busy ? "Sending" : "Send payment proof"}</Button>
    </form>
  );
}
