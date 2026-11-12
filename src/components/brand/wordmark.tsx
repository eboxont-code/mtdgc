import { Glyph } from "@/components/brand/glyph";
import { BRAND_FULL_NAME, BRAND_NAME, LOGO_ALT } from "@/lib/brand";

export { BRAND_FULL_NAME, BRAND_NAME };

/** Wordmark with the full company name always visible under the short mark. */
export function Wordmark({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const mark = size === "lg" ? "text-[22px]" : size === "sm" ? "text-[14px]" : "text-[16px]";
  const desc = size === "lg" ? "text-[10px]" : "text-[8.5px]";
  const glyph = size === "lg" ? "size-8" : "size-[22px]";
  return (
    <span className="inline-flex items-center gap-2.5">
      <Glyph className={`${glyph} shrink-0`} title={LOGO_ALT} />
      <span className="flex flex-col leading-none">
        <span className={`font-mono ${mark} font-bold tracking-[0.06em] text-foreground`}>{BRAND_NAME}</span>
        <span className={`mt-1 font-mono ${desc} whitespace-nowrap uppercase tracking-[0.1em] text-muted-foreground`}>{BRAND_FULL_NAME}</span>
      </span>
    </span>
  );
}
