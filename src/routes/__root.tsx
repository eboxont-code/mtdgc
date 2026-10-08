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
import { CartProvider } from "../lib/cart";
import { CartDrawer } from "../components/cart-drawer";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {

  return (
    <main id="main-content" tabIndex={-1} className="focus:outline-none flex min-h-screen items-center justify-center bg-background px-4 font-body text-foreground">
      <div className="max-w-md text-center">
        <p className="font-display text-xs uppercase tracking-widest text-muted-foreground">MTDGC</p>
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

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
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
  head: ({ matches }) => ({
    meta: [
      { charSet: "utf-8" },
      ...(matches.some((m) => m.status === "notFound" || m.globalNotFound)
        ? [
            { title: "Page not found | MTDGC" },
            { name: "robots", content: "noindex" },
            { name: "description", content: "This MTDGC page could not be found. Browse the catalog or contact support." },
          ]
        : []),
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "MTDGC" },
      { property: "og:site_name", content: "MTDGC" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://mtdgc.com/og/mtdgc.png" },
      { property: "og:image:alt", content: "MTDGC, digital goods for Nepal" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://mtdgc.com/og/mtdgc.png" },
      { name: "twitter:image:alt", content: "MTDGC, digital goods for Nepal" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&family=Space+Grotesk:wght@400;500;600;700&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "apple-touch-icon", href: "/favicon.ico" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
  }),
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
      </CartProvider>
    </QueryClientProvider>
  );
}
