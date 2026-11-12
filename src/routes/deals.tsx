import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/sections/page-hero";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SITE_URL } from "@/lib/format";
import { breadcrumbLd, canonicalLinks } from "@/lib/seo";

const title = "Deals | MTDGC, Matrix Digital Goods & Commerce";
const description = "Sale prices at MTDGC are published here when a listed price is reduced. Prices stay in NPR, with an Australian dollar guide on each listing.";

export const Route = createFileRoute("/deals")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: `${SITE_URL}/deals` },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: canonicalLinks(`${SITE_URL}/deals`),
    scripts: [breadcrumbLd([{ name: "Home", path: "/" }, { name: "Deals", path: "/deals" }])],
  }),
  component: DealsPage,
});

function DealsPage() {
  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="focus:outline-none mx-auto max-w-3xl px-4 pb-16 pt-6">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Deals" }]} />
        <PageHero eyebrow="Shop" title="Deals" intro={description} />
        <section className="mt-8" aria-label="Current deals">
          <p className="text-sm text-muted-foreground">No deals are running right now.</p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-6">
            <Link to="/catalog" search={{ category: "software" }} className="inline-flex min-h-11 items-center text-sm text-primary">Software</Link>
            <Link to="/categories/$slug" params={{ slug: "subscriptions" }} className="inline-flex min-h-11 items-center text-sm text-primary">Subscriptions</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}