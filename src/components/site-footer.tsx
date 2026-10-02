import { Link } from "@tanstack/react-router";

import { whatsappLink } from "@/lib/format";

const GROUPS: { title: string; links: { to: string; label: string }[] }[] = [
  {
    title: "Shop",
    links: [
      { to: "/catalog", label: "Full catalog" },
      { to: "/cart", label: "Cart" },
      { to: "/track-order", label: "Track an order" },
      { to: "/account", label: "Your account" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About MTDGC" },
      { to: "/how-it-works", label: "How delivery works" },
      { to: "/faq", label: "FAQ" },
      { to: "/support", label: "Support" },
    ],
  },
  {
    title: "Policies",
    links: [
      { to: "/policies/refunds", label: "Refund policy" },
      { to: "/policies/delivery", label: "Delivery policy" },
      { to: "/policies/privacy", label: "Privacy" },
      { to: "/policies/terms", label: "Terms of service" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-panel">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-[1.2fr_repeat(3,0.6fr)]">
          <div>
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="size-3 rounded-sm bg-primary" />
              <span className="font-display text-[15px] font-semibold">MTDGC</span>
            </div>
            <p className="mt-2 font-display text-xs uppercase tracking-[0.12em] text-muted-foreground">
              Modern Tech Digital Goods &amp; Commerce
            </p>
            <p className="mt-2 max-w-[46ch] text-xs text-muted-foreground">
              Nepal&apos;s digital marketplace for game top-ups, gift cards and subscriptions, built to add more
              digital product lines over time.
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              MTDGC will never ask for your password, OTP or payment PIN.
            </p>
          </div>

          {GROUPS.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="font-display text-xs uppercase tracking-[0.12em] text-muted-foreground">{group.title}</h2>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="font-display text-sm text-foreground/80 hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-border pt-5 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} MTDGC. Modern Tech Digital Goods &amp; Commerce.</p>
          <a href={whatsappLink()} target="_blank" rel="noreferrer" className="font-display font-medium text-foreground">
            WhatsApp support
          </a>
        </div>
      </div>
    </footer>
  );
}
