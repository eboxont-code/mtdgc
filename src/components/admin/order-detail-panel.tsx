import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { addOrderNote, getPaymentProofUrl, updateOrderStatus } from "@/lib/admin.functions";
import { formatNpr } from "@/lib/format";
import { getAdminOrderStatusOptions } from "@/lib/order-transitions";
import { getPreFulfilmentChecklist } from "@/lib/pre-fulfilment";

type Detail = {
  id: string; order_number: string; status: string; total_minor: number;
  guest_email: string | null; guest_phone: string | null; customer_details: unknown;
  order_items: { id: string; product_name: string; variant_name: string; quantity: number; line_total_minor: number; fields: unknown }[];
  order_status_events: { id: string; status: string; note: string | null; created_at: string }[];
};
const entries = (value: unknown): [string, string][] => value && typeof value === "object" && !Array.isArray(value)
  ? Object.entries(value).filter(([, v]) => typeof v === "string" && v.trim()).map(([k, v]) => [k, String(v)]) : [];

export function OrderDetailPanel({ orderId, onClose, onUpdated }: { orderId: string | null; onClose: () => void; onUpdated: (id: string, status: string) => void }) {
  const [order, setOrder] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const saveStatus = useServerFn(updateOrderStatus);
  const saveNote = useServerFn(addOrderNote);
  const getProof = useServerFn(getPaymentProofUrl);
  const load = useCallback(async () => {
    if (!orderId) return;
    setLoading(true); setError(""); setProofUrl(""); setOrder(null);
    try {
      const result = await supabase.from("orders").select("id, order_number, status, total_minor, guest_email, guest_phone, customer_details, order_items(id, product_name, variant_name, quantity, line_total_minor, fields), order_status_events(id, status, note, created_at)").eq("id", orderId).maybeSingle();
      if (result.error) throw result.error;
      setOrder(result.data as Detail | null);
      const proof = await supabase.from("payment_proofs").select("id").eq("order_id", orderId).order("created_at", { ascending: false }).limit(1).maybeSingle();
      if (proof.error) throw proof.error;
      if (proof.data) setProofUrl((await getProof({ data: { proofId: proof.data.id } })).url);
    } catch { setError("Could not load this order. Please try again."); }
    finally { setLoading(false); }
  }, [orderId, getProof]);
  useEffect(() => { setNote(""); void load(); }, [load]);
  const availableStatuses = order ? getAdminOrderStatusOptions(order.status) : [];

  return <Sheet open={Boolean(orderId)} onOpenChange={(open) => { if (!open) onClose(); }}>
    <SheetContent className="w-full overflow-y-auto pb-28 font-body sm:w-full sm:max-w-xl [&>button]:min-h-11 [&>button]:min-w-11">
      <SheetTitle className="pr-12 font-display">{order?.order_number ?? "Order details"}</SheetTitle>
      <SheetDescription>Contact, delivery details and payment history.</SheetDescription>
      {loading ? <div aria-label="Loading order" className="mt-6 space-y-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-48 w-full" /><Skeleton className="h-32 w-full" /></div> : error ? <div className="mt-6"><p role="alert" className="text-destructive">{error}</p><Button className="mt-3 min-h-11" onClick={() => void load()}>Retry</Button></div> : !order ? <p className="mt-6">This order is not available.</p> : <div className="mt-6 space-y-6 text-sm">
        <section><h2 className="font-display font-medium">Contact</h2><dl className="mt-2 space-y-2">{entries(order.customer_details).filter(([k]) => ["name", "email", "phone"].includes(k)).map(([k, v]) => <div key={k}><dt className="capitalize text-muted-foreground">{k}</dt><dd className="break-words">{v}</dd></div>)}</dl></section>
        <section>
          <h2 className="font-display font-medium">Order items</h2>
          {order.order_items.length ? (
            <ul className="divide-y divide-border">
              {order.order_items.map((line) => {
                const checklist = getPreFulfilmentChecklist(line.fields, line.variant_name);
                const requiredLabels = new Set(checklist.requiredFields.map((field) => field.label));
                const additionalFields = checklist.capturedFields.filter(([label]) => !requiredLabels.has(label));
                const missingCount = checklist.missingRequiredCount ?? 0;
                return (
                  <li key={line.id} className="py-3">
                    <p className="font-medium">{line.product_name}</p>
                    <p>{line.quantity} × {line.variant_name}</p>
                    <p className="tabular-nums">{formatNpr(line.line_total_minor)}</p>
                    <div className="mt-3 rounded-md border border-border p-3">
                      <h3 className="font-display font-medium">Pre-fulfilment checklist</h3>
                      <dl className="mt-2 grid gap-2 sm:grid-cols-2">
                        <div>
                          <dt className="text-muted-foreground">Selected option / denomination</dt>
                          <dd className="break-words">{checklist.selectedOption ?? "Not recorded"}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Product region at order time</dt>
                          <dd className="break-words">
                            {checklist.snapshotStatus === "captured"
                              ? checklist.region ?? "Not specified at order time"
                              : checklist.snapshotStatus === "not_captured"
                                ? "Not captured for this order"
                                : "Snapshot could not be read"}
                          </dd>
                        </div>
                      </dl>
                      {checklist.snapshotStatus === "captured" ? (
                        <>
                          {checklist.requiredFields.length ? (
                            <>
                              <p className="mt-3 text-xs text-muted-foreground">
                                {missingCount === 0
                                  ? "All configured customer details were recorded at checkout."
                                  : `${missingCount} required detail(s) missing — confirm with the customer before fulfilment.`}
                              </p>
                              <ul className="mt-2 space-y-2">
                                {checklist.requiredFields.map((field) => (
                                  <li key={field.label} className="flex items-start justify-between gap-3 border-t border-border pt-2">
                                    <div className="min-w-0">
                                      <p className="font-medium">{field.label}</p>
                                      <p className="break-words text-muted-foreground">
                                        {field.value || "Missing — confirm with the customer before fulfilment"}
                                      </p>
                                    </div>
                                    <span className={field.missing ? "shrink-0 text-destructive" : "shrink-0 text-success"}>
                                      {field.missing ? "Missing" : "Recorded"}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </>
                          ) : (
                            <p className="mt-3 text-xs text-muted-foreground">
                              No product-specific customer fields were configured at order time.
                            </p>
                          )}
                          {additionalFields.length > 0 && (
                            <details className="mt-2">
                              <summary className="min-h-11 cursor-pointer font-display text-xs">Other saved customer details</summary>
                              <dl className="space-y-1">
                                {additionalFields.map(([label, value]) => (
                                  <div key={label}>
                                    <dt className="text-muted-foreground">{label}</dt>
                                    <dd className="break-words">{value || "No value recorded"}</dd>
                                  </div>
                                ))}
                              </dl>
                            </details>
                          )}
                        </>
                      ) : (
                        <>
                          <p className="mt-3 text-xs text-muted-foreground">
                            {checklist.snapshotStatus === "not_captured"
                              ? "No order-time checklist snapshot is stored. Product region and required fields were not captured for this item, so missing requirements cannot be determined."
                              : "The saved checklist snapshot is not recognised. Verify the saved details manually; do not infer the order-time region or required fields."}
                          </p>
                          {checklist.capturedFields.length ? (
                            <dl className="mt-2 space-y-1">
                              {checklist.capturedFields.map(([label, value]) => (
                                <div key={label}>
                                  <dt className="text-muted-foreground">{label}</dt>
                                  <dd className="break-words">{value || "No value recorded"}</dd>
                                </div>
                              ))}
                            </dl>
                          ) : (
                            <p className="mt-2 text-xs text-muted-foreground">No customer-provided item details are recorded.</p>
                          )}
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-2 text-muted-foreground">No item details are recorded.</p>
          )}
          <p className="mt-2 font-medium tabular-nums">Total: {formatNpr(order.total_minor)}</p>
        </section>
        <section><h2 className="font-display font-medium">Payment screenshot</h2>{proofUrl ? <a href={proofUrl} target="_blank" rel="noopener noreferrer" className="mt-2 block"><img src={proofUrl} alt="Customer payment screenshot" width={480} height={480} className="max-h-96 w-full object-contain" /><span className="inline-flex min-h-11 items-center text-primary">Open screenshot</span></a> : <p className="mt-2 text-muted-foreground">No payment screenshot has been submitted.</p>}</section>
        <section><label htmlFor="admin-order-status" className="font-display font-medium">Order status</label><select id="admin-order-status" value={order.status} disabled={busy || availableStatuses.length === 0} className="mt-2 min-h-11 w-full rounded-md border border-input bg-card px-3 text-base" onChange={async (event) => {
          const status = availableStatuses.find((s) => s === event.target.value);
          if (!status) return;
          setBusy(true); setError("");
          try { await saveStatus({ data: { id: order.id, status } }); onUpdated(order.id, status); await load(); }
          catch { setError("Could not save the status. Please try again."); } finally { setBusy(false); }
        }}><option value={order.status} disabled>{order.status.replaceAll("_", " ")}</option>{availableStatuses.map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}</select></section>
        <section><h2 className="font-display font-medium">History and notes</h2>{order.order_status_events.length ? <ol className="mt-2 space-y-3">{[...order.order_status_events].sort((a, b) => a.created_at.localeCompare(b.created_at)).map((event) => <li key={event.id}><p className="capitalize">{event.status.replaceAll("_", " ")}</p><time className="text-muted-foreground" dateTime={event.created_at}>{new Date(event.created_at).toLocaleString()}</time>{event.note && <p className="mt-1 break-words">{event.note}</p>}</li>)}</ol> : <p className="mt-2 text-muted-foreground">No history is recorded.</p>}
          <form className="mt-4" onSubmit={async (event) => { event.preventDefault(); if (!note.trim() || busy) return; setBusy(true); try { await saveNote({ data: { id: order.id, status: order.status, note: note.trim() } }); setNote(""); await load(); } catch { setError("Could not save the note. Please try again."); } finally { setBusy(false); } }}><label htmlFor="admin-order-note">Add a note</label><textarea id="admin-order-note" maxLength={500} value={note} onChange={(e) => setNote(e.target.value)} className="mt-2 min-h-24 w-full rounded-md border border-input bg-card p-3 text-base" /><Button type="submit" disabled={busy || !note.trim()} className="mt-2 min-h-11">{busy ? "Saving" : "Save note"}</Button></form>
        </section>
      </div>}
    </SheetContent>
  </Sheet>;
}