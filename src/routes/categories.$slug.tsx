import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductCard } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { getCategoryBySlug } from "@/lib/catalog.functions";
import { SITE_URL } from "@/lib/format";

export const Route = createFileRoute("/categories/$slug")({
  loader: async ({ params }) => {
    const result = await getCategoryBySlug({ data: { slug: params.slug } });
    if (!result.category) throw notFound();
    return result;
  },
  head: ({ params, loaderData }) => {
    if (!loaderData?.category) {
      return { meta: [{ title: "Category not found | MTDGC" }, { name: "robots", content: "noindex" }] };
    }
    const category = loaderData.category;
    const url = `${SITE_URL}/categories/${params.slug}`;
    const title = `${category.name} in Nepal | MTDGC`;
    const description = category.description;
    const shareSlug = ["game-top-ups", "gift-cards", "subscriptions"].includes(category.slug) ? category.slug : "mtdgc";
    const shareImage = `${SITE_URL}/og/${shareSlug}.png`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        { property: "og:image", content: shareImage },
        { property: "og:image:alt", content: `${category.name} from MTDGC` },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: shareImage },
        { name: "twitter:image:alt", content: `${category.name} from MTDGC` },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
              { "@type": "ListItem", position: 2, name: "Catalog", item: `${SITE_URL}/catalog` },
              { "@type": "ListItem", position: 3, name: category.name, item: url },
            ],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: category.name,
            description,
            url,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: loaderData.products.length,
              itemListElement: loaderData.products.map((p, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: p.name,
                url: `${SITE_URL}/products/${p.slug}`,
              })),
            },
          }),
        },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category, products } = Route.useLoaderData();
  if (!category) return null;

  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="focus:outline-none mx-auto max-w-6xl px-4 pb-16 pt-6">
        <Breadcrumbs
          items={[{ label: "Home", to: "/" }, { label: "Catalog", to: "/catalog" }, { label: category.name }]}
        />
        <h1 className="font-display text-[26px] font-medium md:text-4xl">{category.name}</h1>
        <p className="mt-2 max-w-[62ch] text-sm text-muted-foreground">{category.description}</p>

        {products.length ? (
          <>
            <p className="mt-6 font-display text-xs text-muted-foreground">
              {products.length} {products.length === 1 ? "product" : "products"} in this category. Every price is in
              Nepalese rupees and each product page lists the region, what we need from you and how delivery works.
            </p>
            <h2 className="sr-only">Products in {category.name}</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} priority={index < 2} />
              ))}
            </div>
          </>
        ) : (
          <div className="mt-8 rounded-lg border border-border py-14 text-center">
            <p className="font-display font-medium">Nothing listed here yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              This category is being prepared and is not open for orders. Browse what is available today.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-3">
              <Link to="/catalog">Go to the catalog</Link>
            </Button>
          </div>
        )}

        <section className="mt-12 rounded-lg bg-panel p-5">
          <h2 className="font-display text-lg font-medium">Ordering from MTDGC</h2>
          <p className="mt-2 max-w-[70ch] text-sm text-foreground/80">
            Choose a product and denomination, give us the account details the product needs, and send the order to us
            on WhatsApp. We confirm availability and the price before you pay. There is no card checkout on this site
            and we never ask for your password, one-time code or payment PIN.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm"><Link to="/how-it-works">How ordering works</Link></Button>
            <Button asChild variant="outline" size="sm"><Link to="/policies/delivery">Delivery policy</Link></Button>
            <Button asChild variant="outline" size="sm"><Link to="/faq">Read the FAQ</Link></Button>
          </div>
        </section>

        <nav aria-label="Other categories" className="mt-8">
          <h2 className="font-display text-lg font-medium">Other ways to browse</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm"><Link to="/categories">All categories</Link></Button>
            <Button asChild variant="outline" size="sm"><Link to="/products">All products</Link></Button>
            <Button asChild variant="outline" size="sm"><Link to="/support">Ask us on support</Link></Button>
          </div>
        </nav>
      </main>
      <SiteFooter />
    </div>
  );
}
