import { AlertTriangle } from "lucide-react";
import { TOPUP_DETAILS_WARNING } from "@/lib/topup-details";

export function TopupWarning() {
  return <p role="note" className="flex min-w-0 gap-2 rounded-lg border border-warn/40 bg-warn/10 p-3 text-sm leading-snug text-foreground"><AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-warn" /><span className="min-w-0 [overflow-wrap:anywhere]">{TOPUP_DETAILS_WARNING}</span></p>;
}