import { Link, useRouterState } from "@tanstack/react-router";
import { Home, LayoutGrid, PackageSearch, Search, ShoppingBag } from "lucide-react";

import { useCart } from "@/lib/cart";

const item = "relative flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] text-foreground/75";

export function BottomNav() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { count, setDrawerOpen } = useCart();
  if (pathname === "/checkout" || pathname.startsWith("/products/")) return null;
  const focusSearch = (event: React.MouseEvent) => {
    const input = document.getElementById("header-search-mobile") as HTMLInputElement | null;
    if (input) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      input.focus();
    }
  };
  return (
    <nav aria-label="Mobile navigation" className="mobile-bottom-nav fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-background/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
      <Link to="/" aria-current={pathname === "/" ? "page" : undefined} className={item}><Home className="size-5" />Home</Link>
      <Link to="/categories" aria-current={pathname.startsWith("/categories") || pathname === "/catalog" ? "page" : undefined} className={item}><LayoutGrid className="size-5" />Categories</Link>
      <Link to="/catalog" search={{ q: "" }} activeOptions={{ includeSearch: true }} onClick={focusSearch} className={item}><Search className="size-5" />Search</Link>
      <Link to="/track-order" aria-current={pathname.startsWith("/track") || pathname.startsWith("/order") ? "page" : undefined} className={item}><PackageSearch className="size-5" />Orders</Link>
      <button type="button" className={item} aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`} onClick={() => setDrawerOpen(true)}>
        <ShoppingBag className="size-5" />Cart
        {count > 0 && <span className="absolute right-[22%] top-2 grid min-w-4 place-items-center rounded-full bg-primary px-1 font-mono text-[9px] font-bold text-primary-foreground">{count}</span>}
      </button>
    </nav>
  );
}
