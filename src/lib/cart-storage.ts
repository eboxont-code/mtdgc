export type CartLine = {
  sku: string;
  productSlug: string;
  productName: string;
  variantName: string;
  priceMinor: number;
  image: string | null;
  region?: string;
  categorySlug?: string | undefined;
  quantity: number;
  fields?: Record<string, string>;
};

export const MAX_QTY = 10;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function nonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Restore only valid, purchasable cart snapshots. Invalid entries are discarded
 * individually so one damaged browser-storage entry cannot erase valid items.
 */
export function parseStoredCart(raw: string | null): CartLine[] {
  if (!raw) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }

  if (!Array.isArray(parsed)) return [];

  return parsed.flatMap((value): CartLine[] => {
    if (!isRecord(value)) return [];

    const { sku, productSlug, productName, variantName, priceMinor } = value;
    if (
      !nonEmptyString(sku) ||
      !nonEmptyString(productSlug) ||
      productSlug.startsWith("sample-") ||
      !nonEmptyString(productName) ||
      !nonEmptyString(variantName) ||
      !Number.isSafeInteger(priceMinor) ||
      (priceMinor as number) <= 0
    ) {
      return [];
    }

    const rawQuantity = value["quantity"];
    const quantity = rawQuantity === undefined
      ? 1
      : Number.isSafeInteger(rawQuantity) && (rawQuantity as number) > 0
        ? Math.min(MAX_QTY, rawQuantity as number)
        : null;
    if (quantity === null) return [];

    const image = value["image"] === undefined || value["image"] === null
      ? null
      : typeof value["image"] === "string"
        ? value["image"]
        : null;
    const region = typeof value["region"] === "string" ? value["region"] : undefined;
    const categorySlug = typeof value["categorySlug"] === "string" ? value["categorySlug"] : undefined;
    const fields = isRecord(value["fields"])
      ? Object.fromEntries(Object.entries(value["fields"]).filter((entry): entry is [string, string] => typeof entry[1] === "string"))
      : undefined;

    return [{
      sku,
      productSlug,
      productName,
      variantName,
      priceMinor: priceMinor as number,
      image,
      ...(region !== undefined ? { region } : {}),
      ...(categorySlug !== undefined ? { categorySlug } : {}),
      quantity,
      ...(fields && Object.keys(fields).length ? { fields } : {}),
    }];
  });
}
