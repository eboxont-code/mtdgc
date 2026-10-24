import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Gamepad2, Gift, LayoutGrid, Menu, MessageCircle, MonitorCog, Repeat, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Wordmark } from "@/components/brand/wordmark";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { SUPPORT_MESSAGE, whatsappLink } from "@/lib/format";

const CATEGORIES = [
  { slug: "game-top-ups", label: "Game top-ups", icon: Gamepad2 },
  { slug: "gift-cards", label: "Gift cards", icon: Gift },
  { slug: "subscriptions", label: "Subscriptions", icon: Repeat },
  { slug: "software", label: "Software", icon: MonitorCog },
];

const NAV = [
  { to: "/how-it-works", label: "How it works" },
  { to: "/track-order", label: "Track order" },
  { to: "/support", label: "Support" },
] as const;

const NOTICES = [
  "Prices in NPR. Payments verified before delivery.",
  "We never ask for your password or OTP.",
  "Track any order with your order number.",
];

function Notices() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % NOTICES.length), 5000);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <div className="bg-[oklch(0.1_0.01_160)] text-foreground/80">
      <div className="mx-auto flex h-7 max-w-6xl items-center gap-2 px-4">
        <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-primary" />
        <p key={index} className="notice-fade truncate font-mono text-[10px] uppercase tracking-[0.08em]">{NOTICES[index]}</p>
      </div>
    </div>
  );
}

function HeaderSearch({ id, className = "" }: { id: string; className?: string }) {
  const navigate = useNavigate();
  const current = useRouterState({ select: (s) => (s.location.pathname === "/catalog" ? String((s.location.search as { q?: string }).q ?? "") : "") });
  const [query, setQuery] = useState(current);
  useEffect(() => setQuery(current), [current]);
  return (
    <form
      role="search"
      className={`flex h-11 items-center gap-2 rounded-xl border border-border bg-secondary px-3 focus-within:border-primary/60 ${className}`}
      onSubmit={(event) => {
        event.preventDefault();
        void navigate({ to: "/catalog", search: { q: query.trim() || undefined } });
      }}
    >
      <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <label htmlFor={id} className="sr-only">Search MTDGC</label>
      <input
        id={id}
        type="search"
        enterKeyHint="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search games, gift cards, subscriptions"
        className="h-full min-w-0 flex-1 bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted-foreground md:text-sm"
      />
    </form>
  );
}

export function SiteHeader() {
  const { count, setDrawerOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const wa = whatsappLink(SUPPORT_MESSAGE);

  return (
    <>
      <Notices />
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-1 px-2 md:h-16 md:gap-4 md:px-4">
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}>
            <Menu className="size-5" />
          </Button>
          <Link to="/" className="mr-auto inline-flex min-h-11 items-center md:mr-0" aria-label="MTDGC, Matrix Digital Goods & Commerce, home">
            <Wordmark />
          </Link>

          <HeaderSearch id="header-search-desktop" className="hidden max-w-md flex-1 md:flex" />

          <nav aria-label="Main" className="ml-auto hidden items-center gap-0.5 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-md px-3 py-2 font-display text-sm text-foreground/80 transition-colors hover:text-foreground"
                activeProps={{ className: "rounded-md px-3 py-2 font-display text-sm text-primary" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {wa && (
            <Button asChild variant="ghost" size="icon" className="md:ml-auto lg:ml-0">
              <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp support (opens in a new tab)">
                <MessageCircle className="size-5" />
              </a>
            </Button>
          )}
          <Button asChild variant="ghost" size="icon" className="hidden md:inline-flex" aria-label="Your account">
            <Link to="/account"><UserRound className="size-5" /></Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}
            onClick={() => setDrawerOpen(true)}
          >
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute right-0.5 top-0.5 grid min-w-4 place-items-center rounded-full bg-primary px-1 font-mono text-[9px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Button>
        </div>

        <div className="px-4 pb-2.5 md:hidden">
          <HeaderSearch id="header-search-mobile" />
        </div>

        <nav aria-label="Categories" className="hidden border-t border-border md:block">
          <div className="mx-auto flex h-11 max-w-6xl items-center gap-1 px-4">
            {CATEGORIES.map(({ slug, label, icon: Icon }) => (
              <Link
                key={slug}
                to="/catalog"
                search={{ category: slug }}
                className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 font-display text-sm text-foreground/80 hover:bg-secondary hover:text-foreground"
              >
                <Icon className="size-4 text-primary" aria-hidden="true" />
                {label}
              </Link>
            ))}
            <Link to="/catalog" className="ml-auto inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.12em] text-primary hover:underline">
              <LayoutGrid className="size-3.5" aria-hidden="true" /> Full catalog
            </Link>
          </div>
        </nav>
      </header>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-[86%] max-w-sm overflow-y-auto border-border bg-background p-0">
          <div className="flex h-14 items-center justify-between border-b border-border px-4">
            <SheetTitle asChild><span><Wordmark /></span></SheetTitle>
            <Button variant="ghost" size="icon" aria-label="Close menu" onClick={() => setMenuOpen(false)}><X className="size-5" /></Button>
          </div>
          <div className="px-4 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Shop</p>
            <ul className="mt-2 space-y-1">
              {CATEGORIES.map(({ slug, label, icon: Icon }) => (
                <li key={slug}>
                  <Link to="/catalog" search={{ category: slug }} onClick={() => setMenuOpen(false)} className="flex min-h-11 items-center gap-3 rounded-lg px-2 font-display text-[15px] hover:bg-secondary">
                    <span className="grid size-8 place-items-center rounded-lg border border-border bg-card text-primary"><Icon className="size-4" /></span>
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/catalog" onClick={() => setMenuOpen(false)} className="flex min-h-11 items-center gap-3 rounded-lg px-2 font-display text-[15px] hover:bg-secondary">
                  <span className="grid size-8 place-items-center rounded-lg border border-border bg-card text-primary"><LayoutGrid className="size-4" /></span>
                  Full catalog
                </Link>
              </li>
            </ul>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Help</p>
            <ul className="mt-2 space-y-1">
              {[...NAV, { to: "/faq", label: "FAQ" } as const, { to: "/account", label: "Your account" } as const].map((item) => (
                <li key={item.to}>
                  <Link to={item.to} onClick={() => setMenuOpen(false)} className="flex min-h-11 items-center rounded-lg px-2 font-display text-[15px] hover:bg-secondary">
                    {item.label}
                  </Link>
                </li>
              ))}
              {wa && (
                <li>
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-2 rounded-lg px-2 font-display text-[15px] text-primary hover:bg-secondary">
                    <MessageCircle className="size-4" /> WhatsApp support
                  </a>
                </li>
              )}
            </ul>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

