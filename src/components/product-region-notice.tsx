import { Globe } from "lucide-react";
import { listingRegion } from "@/lib/product-region";

export function ProductRegionNotice({ region }: { region: string | null | undefined }) {
  const savedRegion = listingRegion(region);
  if (!savedRegion) return null;

  return (
    <aside aria-label="Redemption region notice" className="min-w-0 rounded-lg border border-warn/50 bg-warn/10 p-3 text-xs leading-relaxed">
      <p className="flex items-start gap-2 font-semibold text-warn">
        <Globe aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
        <span className="min-w-0 [overflow-wrap:anywhere]">Listing region: {savedRegion}</span>
      </p>
      <p className="mt-1 text-foreground">Check that your account or redemption region matches this listing before ordering.</p>
    </aside>
  );
}