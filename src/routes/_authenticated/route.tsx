import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { supabase } from "@/integrations/supabase/client";
import { LoaderCircle } from "lucide-react";
import { Wordmark } from "@/components/brand/wordmark";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  pendingMs: 0,
  pendingMinMs: 200,
  pendingComponent: AccountLoading,
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth", search: { redirect: location.href } });
    return { user: data.user };
  },
  component: () => <Outlet />,
});

function AccountLoading() {
  return (
    <main id="main-content" className="mx-auto flex min-h-80 max-w-6xl flex-col items-center justify-center gap-4 px-4 py-12" aria-busy="true">
      <Wordmark size="lg" />
      <div role="status" className="flex items-center gap-3 text-muted-foreground">
        <LoaderCircle className="size-5 motion-safe:animate-spin" aria-hidden="true" />
        <p>Loading your account</p>
      </div>
    </main>
  );
}
