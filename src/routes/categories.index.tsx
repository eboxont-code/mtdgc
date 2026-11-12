import { createFileRoute, Link } from "@tanstack/react-router";

import { PackageOpen } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { StorefrontError, StorefrontLoading } from "@/components/storefront-state";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { listCatalog } from "@/lib/catalog.functions";
import { SITE_URL } from "@/lib/format";
import { availabilityCounts } from "@/lib/product-availability";
import { breadcrumbLd, itemListLd, canonicalLinks } from "@/lib/seo";

export const Route = createFileRoute("/categories/")({
  loader: () => listCatalog(),
  head: ({ loaderData }) => ({
    meta: [
      { title: "Shop by category | MTDGC, Matrix Digital Goods & Commerce" },
      {
        name: "description",
        content:
          "Browse MTDGC categories: game top-ups, gift cards and subscriptions for Nepal and Australia. Each category lists what is available and the delivery time to expect.",
      },
      { property: "og:title", content: "Shop by category: software, subscriptions and more | MTDGC" },
      { property: "og:description", content: "Game top-ups, gift cards and subscriptions available from MTDGC." },
      { name: "twitter:title", content: "Shop by category: software, subscriptions and more | MTDGC"  },
      { name: "twitter:description", content: "Game top-ups, gift cards and subscriptions available from MTDGC."  },
      { property: "og:url", content: `${SITE_URL}/categories` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: canonicalLinks(`${SITE_URL}/categories`),
    scripts: [
      itemListLd("MTDGC Categories", "/categories", "Digital goods sold by MTDGC in NPR.", (loaderData?.categories ?? []).map((c) => ({ name: c.name, path: `/categories/${c.slug}` }))),
      breadcrumbLd([{ name: "Home", path: "/" }, { name: "Categories", path: "/categories" }]),
    ],
  }),
  component: CategoriesIndexPage,
  pendingComponent: StorefrontLoading,
  errorComponent: StorefrontError,
});

function CategoriesIndexPage() {
  const { products, categories } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="focus:outline-none mx-auto max-w-5xl px-4 pb-16 pt-6">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Categories" }]} />
        <h1 className="font-display text-[26px] font-medium md:text-4xl">Product categories</h1>
        <p className="mt-2 max-w-[62ch] text-sm text-muted-foreground">
          Browse available products and upcoming listings by category. Coming-soon listings are not open for orders.
        </p>

        {categories.length ? (
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {[...categories].sort((a, b) => a.sort_order - b.sort_order).map((category) => {
              const counts = availabilityCounts(products.filter((product) => product.category?.slug === category.slug));
              return (
                <li key={category.slug} className="rounded-lg border border-border p-4">
                  <h2 className="font-display text-lg font-medium">
                    <Link to="/categories/$slug" params={{ slug: category.slug }} className="hover:text-primary">
                      {category.name}
                      <span className="ml-2 text-sm text-muted-foreground">({counts.available} available now)</span>
                    </Link>
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
                  <p className="mt-2 font-display text-xs text-muted-foreground">
                    {counts.available} available now / {counts.comingSoon} coming soon / {counts.unavailable} unavailable
                  </p>
                  <Button asChild variant="outline" size="sm" className="mt-3">
                    <Link to="/categories/$slug" params={{ slug: category.slug }}>View {category.name}</Link>
                  </Button>
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyState icon={PackageOpen} title="No categories are published yet" text="Browse the catalog or contact support about the product you need." action={<Button asChild><Link to="/catalog">Browse the catalog</Link></Button>} />
        )}

        <section className="mt-10 rounded-lg bg-panel p-4">
          <h2 className="font-display text-lg font-medium">How ordering works</h2>
          <p className="mt-2 max-w-[62ch] text-sm text-muted-foreground">
            Choose a product and denomination, give us the details the product needs, then place the order at checkout.
            You get an order number and payment details, upload a screenshot of your payment, and we deliver once it is verified.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm"><Link to="/how-it-works">How it works</Link></Button>
            <Button asChild variant="outline" size="sm"><Link to="/policies/delivery">Delivery policy</Link></Button>
            <Button asChild variant="outline" size="sm"><Link to="/faq">FAQ</Link></Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
