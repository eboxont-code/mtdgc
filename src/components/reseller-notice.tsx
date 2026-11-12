import { RESELLER_NOTICE } from "@/lib/brand";

export function ResellerNotice({ className = "" }: { className?: string }) {
  return <p className={`text-xs leading-relaxed text-muted-foreground ${className}`}>{RESELLER_NOTICE}</p>;
}
