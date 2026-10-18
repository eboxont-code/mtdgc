import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { getPaymentProofUrl, listPaymentsToVerify, reviewPayment } from "@/lib/admin.functions";
import { formatNpr } from "@/lib/format";

type Row = {
  id: string;
  order_number: string;
  total_minor: number;
  updated_at: string;
  proof: { id: string; transaction_ref: string; created_at: string } | null;
};

export function VerifyPanel() {
  const listFn = useServerFn(listPaymentsToVerify);
  const urlFn = useServerFn(getPaymentProofUrl);
  const reviewFn = useServerFn(reviewPayment);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState("");
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [askNew, setAskNew] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError("");
    try {
      setRows((await listFn()) as Row[]);
    } catch {
      setError("Could not load payments to verify.");
    }
  }, [listFn]);

  useEffect(() => {
    void load();
  }, [load]);

  const open = async (proofId: string) => {
    try {
      const { url } = await urlFn({ data: { proofId } });
      setUrls((u) => ({ ...u, [proofId]: url }));
    } catch {
      setError("Could not open the screenshot.");
    }
  };

  const decide = async (proofId: string, decision: "verify" | "reject") => {
    const note = notes[proofId]?.trim();
    if (decision === "reject" && !note) {
      setError("Add a note before rejecting a payment.");
      return;
    }
    setBusy(proofId);
    setError("");
    try {
      await reviewFn({ data: { proofId, decision, note: note || undefined, askNewProof: !!askNew[proofId] } });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save the decision.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <section aria-labelledby="verify-title">
      <h2 id="verify-title" className="font-display text-lg font-medium">Payments to verify</h2>
      {error && <p role="alert" className="mt-2 text-sm text-destructive">{error}</p>}
      {rows === null ? (
        <p className="mt-3 text-sm text-muted-foreground">Loading payments.</p>
      ) : rows.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">No payments are waiting for verification.</p>
      ) : (
        <ul className="mt-3 grid gap-3">
          {rows.map((row) => (
            <li key={row.id} className="rounded-lg border border-glass-border bg-glass-bg p-3">
              <div className="flex flex-wrap justify-between gap-2 font-display text-sm">
                <strong>{row.order_number}</strong>
                <span>{formatNpr(row.total_minor)}</span>
              </div>
              {row.proof ? (
                <>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Reference {row.proof.transaction_ref} · Submitted {new Date(row.proof.created_at).toLocaleString()}
                  </p>
                  {urls[row.proof.id] ? (
                    <a href={urls[row.proof.id]} target="_blank" rel="noreferrer" className="mt-2 block">
                      <img src={urls[row.proof.id]} alt={`Payment screenshot for ${row.order_number}`} className="max-h-72 w-full rounded-md object-contain" />
                    </a>
                  ) : (
                    <Button variant="outline" size="sm" className="mt-2 min-h-11" onClick={() => open(row.proof!.id)}>View screenshot</Button>
                  )}
                  <label className="mt-3 block text-xs text-muted-foreground" htmlFor={`note-${row.proof.id}`}>Note (required to reject)</label>
                  <textarea id={`note-${row.proof.id}`} rows={2} maxLength={500} value={notes[row.proof.id] ?? ""} onChange={(e) => setNotes((n) => ({ ...n, [row.proof!.id]: e.target.value }))} className="mt-1 w-full rounded-md border border-input bg-card p-2 text-sm" />
                  <label className="mt-2 flex min-h-11 items-center gap-2 text-sm">
                    <input type="checkbox" checked={!!askNew[row.proof.id]} onChange={(e) => setAskNew((a) => ({ ...a, [row.proof!.id]: e.target.checked }))} />
                    Ask for a new proof
                  </label>
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                    <Button className="min-h-11" disabled={busy === row.proof.id} onClick={() => decide(row.proof!.id, "verify")}>Verify payment</Button>
                    <Button className="min-h-11" variant="outline" disabled={busy === row.proof.id} onClick={() => decide(row.proof!.id, "reject")}>Reject</Button>
                  </div>
                </>
              ) : (
                <p className="mt-1 text-xs text-muted-foreground">No proof file found for this order.</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
