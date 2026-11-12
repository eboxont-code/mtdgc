import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import displayFont from "@fontsource/space-grotesk/files/space-grotesk-latin-400-normal.woff2?url";
import { CartProvider } from "../lib/cart";
import { CartDrawer } from "../components/cart-drawer";
import { BottomNav } from "../components/bottom-nav";
import { ScrollReveals } from "../components/scroll-reveals";
import { WhatsAppFab } from "../components/whatsapp-fab";
import { Wordmark } from "../components/brand/wordmark";
import { SITE_URL } from "../lib/format";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {

  return (
    <main id="main-content" tabIndex={-1} className="focus:outline-none flex min-h-screen items-center justify-center bg-background px-4 font-body text-foreground">
      <div className="max-w-md text-center">
        <div className="mb-7 flex justify-center"><Wordmark size="lg" /></div>
        <h1 className="mt-3 font-display text-3xl font-medium">This page is not here</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The link may be out of date or mistyped. The catalog below has every product MTDGC currently sells.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link
            to="/catalog"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 font-display text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Browse the catalog
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 font-display text-sm font-medium transition-colors hover:bg-accent"
          >
            Go to the home page
          </Link>
          <Link
            to="/support"
            className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 font-display text-sm font-medium transition-colors hover:bg-accent"
          >
            Contact support
          </Link>
        </div>
      </div>
    </main>
  );
}

function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error instanceof Error ? error : new Error(String(error)), { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="mb-7 flex justify-center"><Wordmark size="lg" /></div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: ({ matches }) => {
    const pageMeta = matches.flatMap((match) => match.meta ?? []);
    const titleMeta = [...pageMeta].reverse().find((meta) => meta && "title" in meta);
    const descriptionMeta = [...pageMeta].reverse().find((meta) => meta && "name" in meta && meta.name === "description");
    const title = titleMeta && "title" in titleMeta ? String(titleMeta.title) : "MTDGC | Digital Marketplace for Nepal and Australia";
    const description = descriptionMeta && "content" in descriptionMeta ? String(descriptionMeta.content) : "Subscriptions and gift cards for Nepal and Australia, priced in NPR.";
    const canonical = [...matches].reverse().flatMap((match) => match.links ?? []).find((link) => link?.rel === "canonical");
    const leafOgTitle = [...pageMeta].reverse().find((meta) => meta && "property" in meta && meta.property === "og:title");
    const leafOgDescription = [...pageMeta].reverse().find((meta) => meta && "property" in meta && meta.property === "og:description");
    const shareTitle = leafOgTitle && "content" in leafOgTitle ? String(leafOgTitle.content) : title;
    const shareDescription = leafOgDescription && "content" in leafOgDescription ? String(leafOgDescription.content) : description;
    const hasOgImage = pageMeta.some((meta) => meta && "property" in meta && meta.property === "og:image");
    const hasTwitterImage = pageMeta.some((meta) => meta && "name" in meta && meta.name === "twitter:image");
    return {
    meta: [
      { charSet: "utf-8" },
      ...(matches.some((m) => m.status === "notFound")
        ? [
            { title: "Page not found | MTDGC" },
            { name: "robots", content: "noindex" },
            { name: "description", content: "This MTDGC page could not be found. Browse the catalog or contact support." },
          ]
        : []),
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#070b09" },
      { name: "author", content: "MTDGC" },
      { property: "og:site_name", content: "MTDGC" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      ...(!hasOgImage ? [
        { property: "og:image", content: `${SITE_URL}/og/mtdgc.png` },
        { property: "og:image:alt", content: "MTDGC, Matrix Digital Goods & Commerce" },
      ] : []),
      ...(canonical?.href ? [{ property: "og:url", content: canonical.href }] : []),
      { name: "twitter:title", content: shareTitle },
      { name: "twitter:description", content: shareDescription },
      { name: "twitter:card", content: "summary_large_image" },
      ...(!hasTwitterImage ? [
        { name: "twitter:image", content: `${SITE_URL}/og/mtdgc.png` },
        { name: "twitter:image:alt", content: "MTDGC, Matrix Digital Goods & Commerce" },
      ] : []),
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preload", href: "/fonts/jetbrains-mono-latin-700-normal.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" },
      { rel: "preload", href: displayFont, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
      // Keep the approved 5x5 emerald M consistent across search, browsers and app icons.
      { rel: "icon", href: "/icon-512.png", type: "image/png", sizes: "512x512" },
      { rel: "icon", href: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { rel: "icon", href: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
      { rel: "icon", href: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon", sizes: "64x64" },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml", sizes: "any" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
  }; },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {/* burn-test */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">Skip to main content</a>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
        <CartDrawer />
        <BottomNav />
        <WhatsAppFab />
        <ScrollReveals />
      </CartProvider>
    </QueryClientProvider>
  );
}
