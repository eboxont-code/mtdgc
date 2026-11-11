import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { PackageOpen } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { StorefrontError, StorefrontLoading } from "@/components/storefront-state";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductCard } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { getCategoryBySlug, listCatalog } from "@/lib/catalog.functions";
import { SITE_URL } from "@/lib/format";
import { categoryListingSeo } from "@/lib/listing-seo";
import { availabilityCounts } from "@/lib/product-availability";

export const Route = createFileRoute("/categories/$slug")({
  loader: async ({ params }) => {
    const result = await getCategoryBySlug({ data: { slug: params.slug } });
    if (!result.category) throw notFound();
    const catalog = await listCatalog();
    return { ...result, categories: catalog.categories };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.category) {
      return { meta: [{ title: "Category not found | MTDGC" }, { name: "robots", content: "noindex" }] };
    }
    const category = loaderData.category;
    const { url, title, description } = categoryListingSeo(category);
    const shareSlug = ["game-top-ups", "gift-cards", "subscriptions"].includes(category.slug) ? category.slug : "mtdgc";
    const shareImage = `${SITE_URL}/og/${shareSlug}.png`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      { name: "twitter:title", content: title  },
      { name: "twitter:description", content: description  },
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
  pendingComponent: StorefrontLoading,
  errorComponent: StorefrontError,
});

const CATEGORY_INTROS: Record<string, string> = {
  subscriptions:
    "A prepaid subscription gives you access to a service for a fixed period that you pay for up front. Nothing renews on its own: when the period ends, you simply order again if you want to continue. Some plans are private accounts that only you use, while others are shared plans where you receive one profile or seat on an account we manage. Each listing states which type it is before you order. After we verify your payment, your account details or activation instructions appear on your order page and are also sent to your delivery email. If anything is unclear before you order, our how it works page walks through each step from choosing a plan to receiving your details.",
  "gift-cards":
    "A gift card is a prepaid code that adds balance or membership time to an account on the service it belongs to. You choose the amount and region on the listing, and we deliver the code digitally after your payment is verified. Codes arrive on your order page and by email, so you can keep them or forward them as a gift. Region matters: a code only redeems on accounts registered in the region shown on the listing, so check your account region before ordering. Once a code is revealed it cannot be taken back, which is why we ask you to confirm the region and the delivery email at checkout. Our how it works page explains the full ordering and delivery process step by step.",
  "game-top-ups":
    "A game top-up adds in-game currency or a pass directly to your game account. To deliver it we need the details shown on the listing, usually your player ID and sometimes a server or zone ID, both of which you can copy from your profile screen inside the game. We never need your password or login. After you place the order and your payment is verified, the top-up is credited to the account matching the ID you gave us, so it is important to double check that ID before you confirm. Credited top-ups cannot be reversed. Each listing shows the region it supports and what you receive. If you are unsure where to find your ID, the product page and our how it works page show you where to look.",
};

function CategoryPage() {
  const { category, products, categories } = Route.useLoaderData();
  if (!category) return null;
  const counts = availabilityCounts(products);

  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="focus:outline-none mx-auto max-w-6xl px-4 pb-16 pt-6">
        <Breadcrumbs
          items={[{ label: "Home", to: "/" }, { label: "Catalog", to: "/catalog" }, { label: category.name }]}
        />
        <h1 className="font-display text-[26px] font-medium md:text-4xl">{category.name}</h1>
        <p className="mt-2 max-w-[62ch] text-sm text-muted-foreground">{category.description}</p>
        {CATEGORY_INTROS[category.slug] && (
          <p className="mt-3 max-w-[70ch] text-sm text-foreground/80">
            {CATEGORY_INTROS[category.slug]}{" "}
            <Link to="/how-it-works" className="text-primary underline underline-offset-4">
              See how ordering works
            </Link>
            .
          </p>
        )}

        {products.length ? (
          <>
            <p className="mt-6 font-display text-xs text-muted-foreground">
              {products.length} listed / {counts.available} available now / {counts.comingSoon} coming soon / {counts.unavailable} unavailable.
              Each product page lists the region, required details and delivery method.
            </p>
            <h2 className="sr-only">Products in {category.name}</h2>
            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} priority={index < 2} />
              ))}
            </div>
          </>
        ) : (
          <EmptyState icon={PackageOpen} title="No listings in this category" text="Tell us what you are looking for." action={<Button asChild variant="outline"><Link to="/support">Contact support</Link></Button>} />
        )}

        <section className="mt-12 rounded-lg bg-panel p-5">
          <h2 className="font-display text-lg font-medium">Ordering from MTDGC</h2>
          <p className="mt-2 max-w-[70ch] text-sm text-foreground/80">
            Choose a product and denomination, give us the account details the product needs, and place the order
            at checkout. You get an order number and the payment details, then upload a screenshot of your payment. We
            deliver once the payment is verified.
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
            {[...categories].sort((a, b) => a.sort_order - b.sort_order).filter((other) => other.slug !== category.slug).map((other) => (
              <Button key={other.id} asChild variant="outline" className="min-h-11">
                <Link to="/categories/$slug" params={{ slug: other.slug }}>{other.name}</Link>
              </Button>
            ))}
            <Button asChild variant="outline" className="min-h-11"><Link to="/deals">Deals</Link></Button>
            <Button asChild variant="outline" className="min-h-11"><Link to="/faq">FAQ</Link></Button>
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
