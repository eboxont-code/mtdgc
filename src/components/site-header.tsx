import { Link } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { SUPPORT_MESSAGE, whatsappLink } from "@/lib/format";

const NAV = [
  { to: "/catalog", label: "Catalog" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/track-order", label: "Track order" },
  { to: "/support", label: "Support" },
];

export function SiteHeader() {
  const { count, setDrawerOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="overflow-hidden bg-foreground text-background">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2">
          <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-brand-soft" />
          <p className="font-display text-[10px] uppercase tracking-[0.12em]">
            Digital delivery after order review. Prices in NPR.
          </p>
        </div>
      </div>

      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-1 px-4">
          <Link to="/" className="mr-auto inline-flex min-h-11 items-center gap-2" aria-label="MTDGC home">
            <span aria-hidden="true" className="size-3 rounded-sm bg-primary" />
            <span className="flex flex-col leading-none">
              <span className="font-display text-[15px] font-semibold">MTDGC</span>
              <span className="hidden text-[9px] uppercase tracking-[0.12em] text-muted-foreground sm:block">
                Modern Tech Digital Goods &amp; Commerce
              </span>
            </span>
          </Link>

          <nav aria-label="Main" className="mr-2 hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-md px-3 py-2 font-display text-sm text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
                activeProps={{ className: "rounded-md px-3 py-2 font-display text-sm font-medium text-primary" }}
              >
                {item.label}
              </Link>
            ))}
            {whatsappLink() && (
              <a
                href={whatsappLink(SUPPORT_MESSAGE)!}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md px-3 py-2 font-display text-sm text-primary hover:bg-secondary"
              >
                WhatsApp support
              </a>
            )}
          </nav>

          <Button asChild variant="ghost" size="icon" aria-label="Search the catalog">
            <Link to="/catalog"><Search className="size-4" /></Link>
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label="Your account">
            <Link to="/account"><UserRound className="size-4" /></Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}
            onClick={() => setDrawerOpen(true)}
          >
            <ShoppingBag className="size-4" />
            {count > 0 && (
              <span className="absolute right-0.5 top-0.5 grid min-w-4 place-items-center rounded-full bg-primary px-1 text-[9px] text-primary-foreground">
                {count}
              </span>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </div>

        {menuOpen && (
          <nav aria-label="Mobile" className="border-t border-border px-4 py-2 md:hidden">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className="block rounded-md px-2 py-3 font-display text-sm"
              >
                {item.label}
              </Link>
            ))}
            {whatsappLink() && (
              <a
                href={whatsappLink(SUPPORT_MESSAGE)!}
                target="_blank"
                rel="noopener noreferrer"
                className="block min-h-11 rounded-md px-2 py-3 font-display text-sm text-primary"
              >
                WhatsApp support
              </a>
            )}
          </nav>
        )}
      </header>
    </>
  );
}
