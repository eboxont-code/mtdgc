import { Link } from "@tanstack/react-router";
import { ShoppingBag, X } from "lucide-react";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { MAX_QTY, useCart } from "@/lib/cart";
import { formatNpr } from "@/lib/format";

export function CartDrawer() {
  const { lines, count, subtotalMinor, drawerOpen, setDrawerOpen, setQuantity, remove } = useCart();
  if (!drawerOpen) return null;

  return <OpenCartDrawer />;
}

function OpenCartDrawer() {
  const { lines, count, subtotalMinor, setDrawerOpen, setQuantity, remove } = useCart();
  const dialogRef = useRef<HTMLElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    dialog?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false);
      if (event.key !== "Tab" || !dialog) return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled])'));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      returnFocusRef.current?.focus();
    };
  }, [setDrawerOpen]);

  return (
    <div className="fixed inset-0 z-50 bg-foreground/45" role="presentation" onClick={() => setDrawerOpen(false)}>
      <aside
        ref={dialogRef}
        tabIndex={-1}
        className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-auto rounded-t-lg bg-background p-4 md:left-auto md:top-0 md:h-full md:w-[420px] md:rounded-none"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Your cart ({count})</h2>
          <Button variant="ghost" size="icon" aria-label="Close cart" onClick={() => setDrawerOpen(false)}>
            <X className="size-5" />
          </Button>
        </div>

        {count ? (
          <>
            <ul className="space-y-3">
              {lines.map((line) => (
                <li key={line.sku} className="flex items-center gap-3 border-b border-border pb-3">
                  {line.image ? (
                    <img src={line.image} alt="" className="size-12 rounded-md object-cover" />
                  ) : (
                    <span aria-hidden="true" className="size-12 rounded-md bg-secondary" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-sm font-medium">{line.productName}</p>
                    <p className="text-xs text-muted-foreground">
                      {line.variantName} · {formatNpr(line.priceMinor)}
                    </p>
                    <p className="mt-1 font-display text-xs">Subtotal {formatNpr(line.priceMinor * line.quantity)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label={`Reduce quantity of ${line.productName}`}
                      disabled={line.quantity <= 1}
                      onClick={() => setQuantity(line.sku, line.quantity - 1)}
                    >
                      −
                    </Button>
                    <span className="w-6 text-center font-display text-sm">{line.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label={`Increase quantity of ${line.productName}`}
                      disabled={line.quantity >= MAX_QTY}
                      onClick={() => setQuantity(line.sku, line.quantity + 1)}
                    >
                      +
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove ${line.productName} from cart`}
                      onClick={() => remove(line.sku)}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex items-center justify-between font-display">
              <span>Estimated total</span>
              <strong>{formatNpr(subtotalMinor)}</strong>
            </div>
            <p className="mt-3 rounded-md bg-secondary p-3 text-xs text-muted-foreground">
              MTDGC confirms availability and sends payment instructions before you pay. Nothing is charged on this
              site.
            </p>
            <Button asChild className="mt-3 w-full" size="lg" onClick={() => setDrawerOpen(false)}>
              <Link to="/checkout">Go to checkout</Link>
            </Button>
            <Button asChild variant="outline" className="mt-2 w-full" onClick={() => setDrawerOpen(false)}>
              <Link to="/cart">View full cart</Link>
            </Button>
            <Button asChild variant="ghost" className="mt-2 w-full" onClick={() => setDrawerOpen(false)}>
              <Link to="/catalog">Continue shopping</Link>
            </Button>
          </>
        ) : (
          <div className="py-16 text-center">
            <ShoppingBag className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
            <p className="mt-3 font-display font-medium">Your MTDGC cart is empty</p>
            <p className="mt-1 text-sm text-muted-foreground">Add a product to start your order.</p>
            <Button asChild className="mt-4" onClick={() => setDrawerOpen(false)}>
              <Link to="/catalog">Browse the catalog</Link>
            </Button>
          </div>
        )}
      </aside>
    </div>
  );
}
