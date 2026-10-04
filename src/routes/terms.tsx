import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  beforeLoad: () => {
    throw redirect({ to: "/policies/terms", statusCode: 301 });
  },
});
