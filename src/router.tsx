import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import * as Sentry from "@sentry/react";

let sentryInitialized = false;
function initSentry() {
  const dsn = import.meta.env["VITE_SENTRY_DSN"];
  if (sentryInitialized || typeof window === "undefined" || !dsn) return;
  sentryInitialized = true;
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 0.1,
  });
}

export const getRouter = () => {
  initSentry();
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
