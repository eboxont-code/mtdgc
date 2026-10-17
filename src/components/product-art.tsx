import { brandArtFor, brandArtSvg, usesCodedArt } from "@/lib/brand-art";
import type { CatalogProduct } from "@/lib/catalog.functions";
import { productImageSources } from "@/lib/product-images";

type ArtProduct = Pick<CatalogProduct, "slug" | "name" | "brand" | "image_url"> & { category?: { name: string } | null };

/** Square product art: the product's own image, or the coded logo-on-brand-colour tile. */
export function ProductArt({
  product,
  priority = false,
  sizes = "(max-width: 640px) 46vw, 220px",
  className = "",
}: {
  product: ArtProduct;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  if (usesCodedArt(product.slug, product.image_url)) {
    const art = brandArtFor(product.slug, product.name, product.brand, product.category?.name);
    return (
      <div
        role="img"
        aria-label={product.name}
        className={`aspect-square w-full overflow-hidden [&>svg]:block [&>svg]:h-full [&>svg]:w-full ${className}`}
        dangerouslySetInnerHTML={{ __html: brandArtSvg(art, { id: product.slug }) }}
      />
    );
  }
  return (
    <img
      {...productImageSources(product.image_url)}
      sizes={sizes}
      alt={product.name}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      width={320}
      height={320}
      className={`aspect-square w-full object-cover ${className}`}
    />
  );
}
