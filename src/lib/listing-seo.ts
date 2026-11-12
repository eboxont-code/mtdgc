import { SITE_URL } from "./format";

type ListingIdentity = { slug: string; name?: string | null };
type ProductIdentity = ListingIdentity & {
  category?: { name?: string | null } | null;
  region?: string | null;
  platform?: string | null;
};

const clean = (value?: string | null) => value?.trim().replace(/\s+/g, " ") || "";
const listingName = (listing: ListingIdentity, fallback: string) =>
  clean(listing.name) || clean(listing.slug.replace(/[-_]+/g, " ")) || fallback;

// Only the saved route identity contributes to the canonical, never view-state queries.
export function listingCanonical(kind: "products" | "categories", slug: string) {
  const identity = slug.split(/[?#]/, 1)[0] ?? "";
  return `${SITE_URL}/${kind}/${encodeURIComponent(identity)}`;
}

export function productListingSeo(product: ProductIdentity) {
  const name = listingName(product, "Product");
  const type = clean(product.category?.name);
  const region = clean(product.region);
  const platform = clean(product.platform);
  const details = [...new Set([name, type, region, platform].filter(Boolean))];
  return {
    title: `${details.join(" | ")} | MTDGC`,
    description: [
      `Buy ${name} from MTDGC, Matrix Digital Goods & Commerce.`,
      type ? `Category: ${type}.` : "",
      region ? `Region: ${region}.` : "",
      platform ? `Platform: ${platform}.` : "",
      "Priced in NPR with an Australian dollar guide. Delivered after payment is verified.",
    ].filter(Boolean).join(" "),
    url: listingCanonical("products", product.slug),
  };
}

export function categoryListingSeo(category: ListingIdentity & { description?: string | null }) {
  const name = listingName(category, "Category");
  const description = clean(category.description);
  return {
    title: `${name} | MTDGC`,
    description: `Shop ${name} at MTDGC, Matrix Digital Goods & Commerce, for Nepal and Australia. ${description || "Each listing shows the options, region and delivery time."}`,
    url: listingCanonical("categories", category.slug),
  };
}