import { Skeleton } from "@/components/ui/skeleton";

export function OrderLoading({ label = "Loading your order" }: { label?: string }) {
  return (
    <section role="status" aria-busy="true" className="mt-5 min-h-64 space-y-4 rounded-lg border border-input bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div aria-hidden="true" className="space-y-4">
        <Skeleton className="h-5 w-40 motion-reduce:animate-none" />
        <Skeleton className="h-4 w-48 max-w-full motion-reduce:animate-none" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-full motion-reduce:animate-none" />
          <Skeleton className="h-5 w-3/4 motion-reduce:animate-none" />
        </div>
        <Skeleton className="h-11 w-40 motion-reduce:animate-none" />
      </div>
    </section>
  );
}