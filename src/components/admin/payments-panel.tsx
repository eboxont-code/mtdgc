import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { getAdminPaymentSettings, savePaymentSettings, uploadPaymentQr } from "@/lib/admin.functions";
import { needsPaymentDetailsNotice } from "@/lib/payment-notice";

export function PaymentsPanel() {
  const load = useServerFn(getAdminPaymentSettings);
  const save = useServerFn(savePaymentSettings);
  const upload = useServerFn(uploadPaymentQr);
  const [form, setForm] = useState({ bank_name: "", account_name: "", account_number: "", instructions: "", fonepay_enabled: false });
  const [hasQr, setHasQr] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showPaymentNotice, setShowPaymentNotice] = useState(false);

  useEffect(() => {
    load().then((d) => {
      setShowPaymentNotice(needsPaymentDetailsNotice(d));
      if (!d) return;
      setHasQr(Boolean(d.qr_image_path));
      setForm({ bank_name: d.bank_name ?? "", account_name: d.account_name ?? "", account_number: d.account_number ?? "", instructions: d.instructions ?? "", fonepay_enabled: d.fonepay_enabled });
    }).catch(() => setMsg("Could not load payment settings."));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (form.account_number && !/^[0-9A-Za-z -]{4,40}$/.test(form.account_number)) { setMsg("Account number should be 4 to 40 letters or digits."); return; }
    setBusy(true); setMsg(null);
    try {
      if (file) {
        const fd = new FormData(); fd.append("file", file);
        await upload({ data: fd }); setHasQr(true); setFile(null);
      }
      await save({ data: form });
      setShowPaymentNotice(needsPaymentDetailsNotice({ ...form, qr_image_path: hasQr || file ? "saved" : null }));
      setMsg("Payment settings saved.");
    } catch (err) { setMsg(err instanceof Error ? err.message : "Could not save."); }
    finally { setBusy(false); }
  }

  const field = (key: "bank_name" | "account_name" | "account_number", label: string) => (
    <label htmlFor={`pay-${key}`} className="block font-display text-sm">{label}
      <input id={`pay-${key}`} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3 font-body text-sm" />
    </label>
  );

  return (
    <form onSubmit={onSave} className="space-y-3">
      <h2 className="font-display text-lg font-medium">Payments</h2>
      <p className="text-sm text-muted-foreground">Customers see these details at checkout. While nothing is set, checkout tells them payment details will be sent shortly.</p>
      {showPaymentNotice && (
        <p role="status" className="border-l-2 border-primary py-2 pl-3 text-sm text-foreground">
          No QR or bank details are saved. Checkout accepts orders and tells customers our team will send payment details shortly after the order.
        </p>
      )}
      <label htmlFor="pay-qr" className="block font-display text-sm">QR image (PNG, JPG or WEBP, 2 MB max){hasQr && " · a QR is saved"}
        <input id="pay-qr" type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => { const f = e.target.files?.[0] ?? null; if (f && f.size > 2097152) { setMsg("The image must be 2 MB or smaller."); return; } setFile(f); setPreview(f ? URL.createObjectURL(f) : null); }} className="mt-1 block min-h-11 w-full text-sm" />
      </label>
      {preview && <img src={preview} alt="QR preview" width={160} height={160} className="size-40 rounded-md object-contain" />}
      {field("bank_name", "Bank name")}
      {field("account_name", "Account name")}
      {field("account_number", "Account number")}
      <label htmlFor="pay-instr" className="block font-display text-sm">Instructions
        <textarea id="pay-instr" value={form.instructions} maxLength={500} onChange={(e) => setForm({ ...form, instructions: e.target.value })} className="mt-1 w-full rounded-md border border-input bg-background p-2 font-body text-sm" />
      </label>
      <label className="flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" checked={form.fonepay_enabled} onChange={(e) => setForm({ ...form, fonepay_enabled: e.target.checked })} /> Fonepay accepted</label>
      <Button type="submit" disabled={busy}>{busy ? "Saving" : "Save payment settings"}</Button>
      {msg && <p role="status" className="text-sm">{msg}</p>}
    </form>
  );
}
