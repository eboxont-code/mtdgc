import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { SITE_URL } from "@/lib/format";
import { availabilityLabel, isPurchasable } from "@/lib/product-availability";
import { EmptyState } from "@/components/empty-state";
import { Heart } from "lucide-react";

type Row = { product_id: string; products: { slug: string; name: string; summary: string; image_url: string | null; status: string; tags: string[]; product_variants: { status: string; price_minor: number }[] } | null };

export const Route = createFileRoute("/_authenticated/wishlist")({
  head: () => ({
    meta: [
      { title: "Your wishlist | MTDGC" },
      { name: "description", content: "Products you have saved on MTDGC." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Your wishlist | MTDGC" },
      { property: "og:description", content: "Products you have saved on MTDGC." },
      { name: "twitter:title", content: "Your wishlist | MTDGC"  },
      { name: "twitter:description", content: "Products you have saved on MTDGC."  },
      { property: "og:url", content: `${SITE_URL}/wishlist` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/wishlist` }],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setRows(null);
    try {
      const { data, error: loadError } = await supabase
      .from("wishlist_items")
      .select("product_id, products(slug, name, summary, image_url, status, tags, product_variants(status, price_minor))")
      .order("created_at", { ascending: false });
      if (loadError) throw loadError;
      setRows((data ?? []) as unknown as Row[]);
    } catch {
      setError("Your saved products could not be loaded. Please try again.");
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function remove(productId: string) {
    if (removing) return;
    setRemoving(productId);
    setError(null);
    try {
      const { error: removeError } = await supabase.from("wishlist_items").delete().eq("product_id", productId);
      if (removeError) throw removeError;
      setRows((current) => current?.filter((row) => row.product_id !== productId) ?? null);
    } catch {
      setError("That product could not be removed. Please try again.");
    } finally {
      setRemoving(null);
    }
  }

  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="focus:outline-none mx-auto max-w-4xl px-4 pb-28 pt-6">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Account", to: "/account" }, { label: "Wishlist" }]} />
        <h1 className="font-display text-[26px] font-medium md:text-4xl">Your wishlist</h1>
        {error && <div role="alert" className="mt-6 text-sm text-destructive"><p>{error}</p>{rows === null && <Button variant="outline" className="mt-3 min-h-11" onClick={() => void load()}>Try again</Button>}</div>}
        {rows === null ? (
          !error && <p role="status" className="mt-6 text-sm text-muted-foreground">Loading your saved products.</p>
        ) : rows.length === 0 ? (
          <EmptyState icon={Heart} title="Nothing saved yet" text="Your saved products will appear here." action={<Button asChild className="min-h-11"><Link to="/catalog">Browse the catalog</Link></Button>} />
        ) : (
          <ul className="mt-6 space-y-3">
            {rows.map((row) =>
              row.products ? (
                <li key={row.product_id} className="flex flex-col items-start gap-3 rounded-lg border border-glass-border bg-glass-bg p-3 sm:flex-row sm:items-center">
                  {row.products.image_url ? (
                    <img src={row.products.image_url} alt="" width={56} height={56} className="size-14 shrink-0 rounded-md object-cover" loading="lazy" />
                  ) : (
                    <span aria-hidden="true" className="size-14 rounded-md bg-secondary" />
                  )}
                  <div className="min-w-0 w-full flex-1">
                    <Link to="/products/$slug" params={{ slug: row.products.slug }} className="inline-flex min-h-11 items-center font-display font-medium hover:text-primary">
                      {row.products.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">{row.products.summary}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{availabilityLabel({ ...row.products, variants: row.products.product_variants ?? [] })}</p>
                    <Button asChild variant="outline" className="mt-2 min-h-11"><Link to="/products/$slug" params={{ slug: row.products.slug }}>{isPurchasable({ ...row.products, variants: row.products.product_variants ?? [] }) ? "Choose option and order details" : "View product details"}</Link></Button>
                  </div>
                  <Button className="min-h-11 shrink-0" variant="ghost" size="sm" disabled={removing !== null} onClick={() => remove(row.product_id)}>{removing === row.product_id ? "Removing" : "Remove"}</Button>
                </li>
              ) : <li key={row.product_id} className="border-b border-border py-3 text-sm"><p className="text-muted-foreground">This saved product is no longer available.</p><Button variant="ghost" className="mt-2 min-h-11" disabled={removing !== null} onClick={() => remove(row.product_id)}>Remove</Button></li>,
            )}
          </ul>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
