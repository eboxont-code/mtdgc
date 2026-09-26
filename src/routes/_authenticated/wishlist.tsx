import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type Row = { product_id: string; products: { slug: string; name: string; summary: string; image_url: string | null } | null };

export const Route = createFileRoute("/_authenticated/wishlist")({
  head: () => ({
    meta: [
      { title: "Your wishlist | MTDGC" },
      { name: "description", content: "Products you have saved on MTDGC." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    supabase
      .from("wishlist_items")
      .select("product_id, products(slug, name, summary, image_url)")
      .order("created_at", { ascending: false })
      .then(({ data }) => setRows((data ?? []) as unknown as Row[]));
  }, []);

  async function remove(productId: string) {
    await supabase.from("wishlist_items").delete().eq("product_id", productId);
    setRows((current) => current?.filter((row) => row.product_id !== productId) ?? null);
  }

  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 pb-16 pt-6">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Account", to: "/account" }, { label: "Wishlist" }]} />
        <h1 className="font-display text-[26px] font-medium md:text-4xl">Your wishlist</h1>
        {rows === null ? (
          <p className="mt-6 text-sm text-muted-foreground">Loading your saved products.</p>
        ) : rows.length === 0 ? (
          <div className="mt-8 rounded-lg border border-border py-14 text-center">
            <p className="font-display font-medium">Nothing saved yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Tap "Save to wishlist" on any product page to keep it here.</p>
            <Button asChild className="mt-4"><Link to="/catalog">Browse the catalog</Link></Button>
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {rows.map((row) =>
              row.products ? (
                <li key={row.product_id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                  {row.products.image_url ? (
                    <img src={row.products.image_url} alt="" className="size-14 rounded-md object-cover" loading="lazy" />
                  ) : (
                    <span aria-hidden="true" className="size-14 rounded-md bg-secondary" />
                  )}
                  <div className="min-w-0 flex-1">
                    <Link to="/products/$slug" params={{ slug: row.products.slug }} className="font-display font-medium hover:text-primary">
                      {row.products.name}
                    </Link>
                    <p className="truncate text-xs text-muted-foreground">{row.products.summary}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => remove(row.product_id)}>Remove</Button>
                </li>
              ) : null,
            )}
          </ul>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
