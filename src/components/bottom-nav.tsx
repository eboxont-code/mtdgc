import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Search, ShoppingBag, UserRound, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";

export function BottomNav() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { count, setDrawerOpen } = useCart();
  if (pathname === "/checkout") return null;
  return <nav aria-label="Mobile navigation" className="mobile-bottom-nav glass-surface fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 pb-[env(safe-area-inset-bottom)] md:hidden">
    <Link to="/" aria-current={pathname === "/" ? "page" : undefined} className="flex min-h-16 flex-col items-center justify-center gap-1 text-sm"><Home className="size-5" />Home</Link>
    <Link to="/catalog" aria-current={pathname === "/catalog" ? "page" : undefined} className="flex min-h-16 flex-col items-center justify-center gap-1 text-sm"><LayoutGrid className="size-5" />Catalog</Link>
    <Link to="/catalog" search={{ q: "" }} aria-label="Search catalog" className="flex min-h-16 flex-col items-center justify-center gap-1 text-sm"><Search className="size-5" />Search</Link>
    <Button variant="ghost" className="relative h-16 flex-col gap-1 rounded-none px-0 text-sm" aria-label={`Open cart, ${count} items`} onClick={() => setDrawerOpen(true)}><ShoppingBag className="size-5" />Cart{count > 0 && <span className="absolute right-3 top-1 rounded-full bg-primary px-1.5 text-xs text-primary-foreground">{count}</span>}</Button>
    <Link to="/account" aria-current={pathname === "/account" ? "page" : undefined} className="flex min-h-16 flex-col items-center justify-center gap-1 text-sm"><UserRound className="size-5" />Account</Link>
  </nav>;
}