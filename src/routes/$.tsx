import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/$")({
  head: () => ({
    meta: [
      { title: "Page not found | MTDGC" },
      { name: "description", content: "This MTDGC page does not exist. Browse the catalog to find the product you need." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CatchAllPage,
});

function CatchAllPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-body text-foreground antialiased">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <p className="font-display text-xs uppercase tracking-widest text-muted-foreground">MTDGC</p>
        <h1 className="mt-3 font-display text-3xl font-medium md:text-4xl">This page is not here</h1>
        <p className="mt-2 max-w-[54ch] text-sm text-muted-foreground">
          The link may be out of date or mistyped. The catalog has every product MTDGC currently sells, with prices in
          Nepalese rupees.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button asChild><Link to="/catalog">Browse the catalog</Link></Button>
          <Button asChild variant="outline"><Link to="/">Go to the home page</Link></Button>
          <Button asChild variant="outline"><Link to="/support">Contact support</Link></Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
