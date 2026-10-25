type PublicationText = { name: string; summary: string; description: string };
type PublicationVariant = { status: string; price_minor: number };

export function publicationBlockReason(text: PublicationText, variants: PublicationVariant[]): string | null {
  if (/^\s*DRAFT/i.test(text.name) || /^\s*DRAFT/i.test(text.summary)) {
    return "Remove the DRAFT prefix before publishing.";
  }
  if (/DRAFT|TODO|lorem|editor['\u2019]s note/i.test(`${text.summary}\n${text.description}`)) {
    return "Replace unfinished summary or description text before publishing.";
  }
  if (variants.some((variant) => variant.status !== "archived" && variant.price_minor === 0)) {
    return "Set a price for every non-archived option before publishing.";
  }
  return null;
}