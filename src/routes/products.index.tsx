import { createFileRoute, Link } from "@tanstack/react-router";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductCard } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { listCatalog } from "@/lib/catalog.functions";
import { SITE_URL } from "@/lib/format";
import { breadcrumbLd, itemListLd } from "@/lib/seo";

export const Route = createFileRoute("/products/")({
  loader: () => listCatalog(),
  head: ({ loaderData }) => ({
    meta: [
      { title: "All digital products for Nepal and Australia, prices in NPR | MTDGC" },
      {
        name: "description",
        content:
          "Every MTDGC product page in one list, covering game top-ups, gift cards and subscriptions priced in Nepalese rupees.",
      },
      { property: "og:title", content: "All MTDGC products" },
      { property: "og:description", content: "Every MTDGC product page in one list, priced in Nepalese rupees." },
      { name: "twitter:title", content: "All MTDGC products"  },
      { name: "twitter:description", content: "Every MTDGC product page in one list, priced in Nepalese rupees."  },
      { property: "og:url", content: `${SITE_URL}/products` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: `${SITE_URL}/og/mtdgc.png` },
      { property: "og:image:alt", content: "MTDGC, the digital marketplace for Nepal and Australia" },
      { name: "twitter:image", content: `${SITE_URL}/og/mtdgc.png` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/products` }],
    scripts: [
      itemListLd("MTDGC Products", "/products", "Digital goods sold by MTDGC in NPR.", (loaderData?.products ?? []).map((p) => ({ name: p.name, path: `/products/${p.slug}` }))),
      breadcrumbLd([{ name: "Home", path: "/" }, { name: "Products", path: "/products" }]),
    ],
  }),
  component: ProductsIndexPage,
});

function ProductsIndexPage() {
  const { products, categories } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="focus:outline-none mx-auto max-w-6xl px-4 pb-16 pt-6">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Products" }]} />
        <h1 className="font-display text-[26px] font-medium md:text-4xl">All products</h1>
        <p className="mt-2 max-w-[62ch] text-sm text-muted-foreground">
          This is the plain list of every MTDGC product page. If you want to search, filter by category or sort by
          price, use the catalog instead.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild size="sm"><Link to="/catalog">Search the catalog</Link></Button>
          {categories.map((category) => (
            <Button key={category.slug} asChild variant="outline" size="sm">
              <Link to="/categories/$slug" params={{ slug: category.slug }}>{category.name}</Link>
            </Button>
          ))}
        </div>

        {products.length ? (
          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
            {products.map((product, index) => (
                <ProductCard key={product.id} product={product} priority={index < 2} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-lg border border-border py-14 text-center">
            <p className="font-display font-medium">No products are listed yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Check back shortly, or message our support team on WhatsApp.</p>
            <Button asChild className="mt-4"><Link to="/support">Contact support</Link></Button>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
