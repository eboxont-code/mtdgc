import { useRouterState } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { SUPPORT_MESSAGE, whatsappLink } from "@/lib/format";

/** Floating WhatsApp support button. Support only; ordering and payment stay on the site. */
export function WhatsAppFab() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [expanded, setExpanded] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => setExpanded(false), 4000);
    return () => window.clearTimeout(timer);
  }, []);
  const href = whatsappLink(SUPPORT_MESSAGE);
  if (!href || pathname === "/checkout" || pathname.startsWith("/products/") || pathname.startsWith("/admin")) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp support (opens in a new tab)"
      className="fixed bottom-[calc(76px+env(safe-area-inset-bottom))] right-3 z-40 inline-flex h-12 items-center gap-2 rounded-full border border-primary/40 bg-card/95 px-3.5 text-primary shadow-lg shadow-black/50 backdrop-blur transition-all hover:border-primary md:bottom-6 md:right-6"
    >
      <MessageCircle className="size-5 shrink-0" aria-hidden="true" />
      <span className={`overflow-hidden whitespace-nowrap font-display text-sm font-medium transition-all duration-300 ${expanded ? "max-w-24" : "max-w-0"}`}>Support</span>
    </a>
  );
}
