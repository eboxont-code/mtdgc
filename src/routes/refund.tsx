import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/refund")({
  beforeLoad: () => {
    throw redirect({ to: "/policies/refunds", statusCode: 301 });
  },
});
