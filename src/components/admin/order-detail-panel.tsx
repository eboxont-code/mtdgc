import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { addOrderNote, getPaymentProofUrl, updateOrderStatus } from "@/lib/admin.functions";
import { formatNpr } from "@/lib/format";

export const ADMIN_ORDER_STATUSES = ["paid", "verified", "rejected", "processing", "delivered", "cancelled", "refunded"] as const;
type OrderStatus = typeof ADMIN_ORDER_STATUSES[number];
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

  return <Sheet open={Boolean(orderId)} onOpenChange={(open) => { if (!open) onClose(); }}>
    <SheetContent className="w-full overflow-y-auto font-body sm:w-full sm:max-w-xl [&>button]:min-h-11 [&>button]:min-w-11">
      <SheetTitle className="pr-12 font-display">{order?.order_number ?? "Order details"}</SheetTitle>
      <SheetDescription>Contact, delivery details and payment history.</SheetDescription>
      {loading ? <div aria-label="Loading order" className="mt-6 space-y-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-48 w-full" /><Skeleton className="h-32 w-full" /></div> : error ? <div className="mt-6"><p role="alert" className="text-destructive">{error}</p><Button className="mt-3 min-h-11" onClick={() => void load()}>Retry</Button></div> : !order ? <p className="mt-6">This order is not available.</p> : <div className="mt-6 space-y-6 text-sm">
        <section><h2 className="font-display font-medium">Contact</h2><dl className="mt-2 space-y-2">{entries(order.customer_details).filter(([k]) => ["name", "email", "phone"].includes(k)).map(([k, v]) => <div key={k}><dt className="capitalize text-muted-foreground">{k}</dt><dd className="break-words">{v}</dd></div>)}</dl></section>
        <section><h2 className="font-display font-medium">Order items</h2>{order.order_items.length ? <ul className="divide-y divide-border">{order.order_items.map((line) => <li key={line.id} className="py-3"><p className="font-medium">{line.product_name}</p><p>{line.quantity} × {line.variant_name}</p><p className="tabular-nums">{formatNpr(line.line_total_minor)}</p><dl className="mt-2 space-y-1">{entries(line.fields).map(([k, v]) => <div key={k}><dt className="text-muted-foreground">{k}</dt><dd className="break-words">{v}</dd></div>)}</dl></li>)}</ul> : <p className="mt-2 text-muted-foreground">No item details are recorded.</p>}<p className="mt-2 font-medium tabular-nums">Total: {formatNpr(order.total_minor)}</p></section>
        <section><h2 className="font-display font-medium">Payment screenshot</h2>{proofUrl ? <a href={proofUrl} target="_blank" rel="noopener noreferrer" className="mt-2 block"><img src={proofUrl} alt="Customer payment screenshot" width={480} height={480} className="max-h-96 w-full object-contain" /><span className="inline-flex min-h-11 items-center text-primary">Open screenshot</span></a> : <p className="mt-2 text-muted-foreground">No payment screenshot has been submitted.</p>}</section>
        <section><label htmlFor="admin-order-status" className="font-display font-medium">Order status</label><select id="admin-order-status" value={order.status} disabled={busy} className="mt-2 min-h-11 w-full rounded-md border border-border bg-card px-3 text-base" onChange={async (event) => {
          const status = ADMIN_ORDER_STATUSES.find((s) => s === event.target.value);
          if (!status) return;
          setBusy(true); setError("");
          try { await saveStatus({ data: { id: order.id, status } }); onUpdated(order.id, status); await load(); }
          catch { setError("Could not save the status. Please try again."); } finally { setBusy(false); }
        }}>{!ADMIN_ORDER_STATUSES.includes(order.status as OrderStatus) && <option value={order.status} disabled>{order.status.replaceAll("_", " ")}</option>}{ADMIN_ORDER_STATUSES.map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}</select></section>
        <section><h2 className="font-display font-medium">History and notes</h2>{order.order_status_events.length ? <ol className="mt-2 space-y-3">{[...order.order_status_events].sort((a, b) => a.created_at.localeCompare(b.created_at)).map((event) => <li key={event.id}><p className="capitalize">{event.status.replaceAll("_", " ")}</p><time className="text-muted-foreground" dateTime={event.created_at}>{new Date(event.created_at).toLocaleString()}</time>{event.note && <p className="mt-1 break-words">{event.note}</p>}</li>)}</ol> : <p className="mt-2 text-muted-foreground">No history is recorded.</p>}
          <form className="mt-4" onSubmit={async (event) => { event.preventDefault(); if (!note.trim() || busy) return; setBusy(true); try { await saveNote({ data: { id: order.id, status: order.status, note: note.trim() } }); setNote(""); await load(); } catch { setError("Could not save the note. Please try again."); } finally { setBusy(false); } }}><label htmlFor="admin-order-note">Add a note</label><textarea id="admin-order-note" maxLength={500} value={note} onChange={(e) => setNote(e.target.value)} className="mt-2 min-h-24 w-full rounded-md border border-border bg-card p-3 text-base" /><Button type="submit" disabled={busy || !note.trim()} className="mt-2 min-h-11">{busy ? "Saving" : "Save note"}</Button></form>
        </section>
      </div>}
    </SheetContent>
  </Sheet>;
}