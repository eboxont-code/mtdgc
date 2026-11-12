import { getOrderNextStep } from "@/lib/order-next-step";

export function OrderNextStep({ status }: { status: string }) {
  const next = getOrderNextStep(status);
  return (
    <p className="mt-3 break-words border-l-2 border-primary pl-3 text-sm leading-relaxed" aria-live="polite" aria-atomic="true">
      <strong className="font-display font-medium">What happens next: </strong>
      {next.message}
    </p>
  );
}