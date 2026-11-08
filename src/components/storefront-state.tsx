import { Link, useRouter } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function StorefrontLoading() {
  return (
    <div className="min-h-dvh bg-background font-body text-foreground">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-4 pb-24 pt-6">
        <p role="status" aria-live="polite" className="text-sm text-muted-foreground">Loading products...</p>
        <div aria-hidden="true" className="mt-4 space-y-5">
          <Skeleton className="h-8 w-48 motion-reduce:animate-none" />
          <Skeleton className="h-11 w-full max-w-md motion-reduce:animate-none" />
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="aspect-square w-full motion-reduce:animate-none" />
                <Skeleton className="h-4 w-3/4 motion-reduce:animate-none" />
                <Skeleton className="h-4 w-1/2 motion-reduce:animate-none" />
              </div>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

export function StorefrontError({ reset }: { reset: () => void }) {
  const router = useRouter();
  return (
    <div className="min-h-dvh bg-background font-body text-foreground">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="mx-auto max-w-3xl px-4 pb-24 pt-6">
        <h1 className="font-display text-2xl font-medium">Products could not load</h1>
        <div role="alert">
          <EmptyState icon={AlertCircle} title="Please try again" text="The product information could not be loaded. Retry or contact support if the problem continues." action={
            <div className="flex flex-wrap justify-center gap-2">
              <Button onClick={() => { void router.invalidate(); reset(); }}>Try again</Button>
              <Button asChild variant="outline"><Link to="/support">Contact support</Link></Button>
            </div>
          } />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}