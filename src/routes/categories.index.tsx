import { createFileRoute, Link } from "@tanstack/react-router";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { listCatalog } from "@/lib/catalog.functions";
import { SITE_URL } from "@/lib/format";

export const Route = createFileRoute("/categories/")({
  loader: () => listCatalog(),
  head: () => ({
    meta: [
      { title: "Product categories | MTDGC" },
      {
        name: "description",
        content:
          "Browse MTDGC categories: game top-ups, gift cards and subscriptions. Each category page lists what is available and how delivery works.",
      },
      { property: "og:title", content: "MTDGC product categories" },
      { property: "og:description", content: "Game top-ups, gift cards and subscriptions available from MTDGC." },
      { property: "og:url", content: `${SITE_URL}/categories` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/categories` }],
  }),
  component: CategoriesIndexPage,
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
          Categories group the products MTDGC currently sells. Lines that are still being prepared are not listed here
          and are not open for orders.
        </p>

        {categories.length ? (
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {categories.map((category) => {
              const count = products.filter((product) => product.category?.slug === category.slug).length;
              return (
                <li key={category.slug} className="rounded-lg border border-border p-4">
                  <h2 className="font-display text-lg font-medium">
                    <Link to="/categories/$slug" params={{ slug: category.slug }} className="hover:text-primary">
                      {category.name}
                    </Link>
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
                  <p className="mt-2 font-display text-xs text-muted-foreground">
                    {count} {count === 1 ? "product" : "products"} listed
                  </p>
                  <Button asChild variant="outline" size="sm" className="mt-3">
                    <Link to="/categories/$slug" params={{ slug: category.slug }}>View {category.name}</Link>
                  </Button>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="mt-8 rounded-lg border border-border py-14 text-center">
            <p className="font-display font-medium">No categories are published yet</p>
            <Button asChild className="mt-4"><Link to="/catalog">Browse the catalog</Link></Button>
          </div>
        )}

        <section className="mt-10 rounded-lg bg-panel p-4">
          <h2 className="font-display text-lg font-medium">How ordering works</h2>
          <p className="mt-2 max-w-[62ch] text-sm text-muted-foreground">
            Choose a product and denomination, give us the details the product needs, then send the order on WhatsApp.
            MTDGC confirms availability and sends payment instructions before you pay. Nothing is charged on this site.
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
