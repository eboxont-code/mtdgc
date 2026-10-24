import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/sections/page-hero";
import { LifeBuoy, PackageX, RotateCcw, UserX, type LucideIcon } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { SITE_URL, whatsappLink } from "@/lib/format";
import { breadcrumbLd, pageLd } from "@/lib/seo";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support and order help | MTDGC" },
      {
        name: "description",
        content:
          "Get help with an MTDGC order. Report a wrong player ID, a missing delivery or ask about a refund, and reach the team on WhatsApp.",
      },
      { property: "og:title", content: "MTDGC support and order help" },
      { property: "og:description", content: "Order help, delivery questions and refund requests for MTDGC customers." },
      { name: "twitter:title", content: "MTDGC support and order help"  },
      { name: "twitter:description", content: "Order help, delivery questions and refund requests for MTDGC customers."  },
      { property: "og:url", content: `${SITE_URL}/support` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: `${SITE_URL}/og/mtdgc.png` },
      { property: "og:image:alt", content: "MTDGC, Nepal's digital marketplace" },
      { name: "twitter:image", content: `${SITE_URL}/og/mtdgc.png` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/support` }],
    scripts: [
      pageLd("ContactPage", "MTDGC Support", "/support", "Support from MTDGC, Nepal's digital marketplace.", { contactPoint: { "@type": "ContactPoint", contactType: "customer support", url: `${SITE_URL}/support`, availableLanguage: ["English", "Nepali"] } }),
      breadcrumbLd([{ name: "Home", path: "/" }, { name: "Support", path: "/support" }]),
    ],
  }),
  component: SupportPage,
});

const DRAFT_KEY = "mtdgc-support-draft";

const ISSUE_TYPES = [
  "Wrong player ID or UID",
  "Order not delivered",
  "Refund request",
  "Payment question",
  "Something else",
];

function SupportPage() {
  const [issueType, setIssueType] = useState(ISSUE_TYPES[0]!);
  const [orderNumber, setOrderNumber] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "signin" | "error">("idle");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const d = JSON.parse(raw) as { issueType?: string; orderNumber?: string; description?: string };
      if (d.issueType && ISSUE_TYPES.includes(d.issueType)) setIssueType(d.issueType);
      setOrderNumber(d.orderNumber ?? "");
      setDescription(d.description ?? "");
      sessionStorage.removeItem(DRAFT_KEY);
    } catch { /* ignore */ }
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status === "sending") return;
    if (!description.trim()) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user) {
      try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ issueType, orderNumber, description })); } catch { /* ignore */ }
      setStatus("signin");
      return;
    }
    const { error } = await supabase.from("support_tickets").insert({
      user_id: user.id,
      issue_type: issueType,
      description,
      order_number: orderNumber || null,
    });
    setStatus(error ? "error" : "sent");
  };

  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="focus:outline-none mx-auto max-w-4xl px-4 pb-16 pt-6">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Support" }]} />
        <PageHero
          variant="split"
          icon={LifeBuoy}
          eyebrow="Support"
          title="Support and order help"
          intro="Send your order number and a short description of the problem and our team will work through it with you."
        >
        <div className="mt-5 flex flex-wrap gap-2">
          {whatsappLink() && (
            <Button asChild size="lg">
              <a href={whatsappLink("Hello MTDGC, I need help with an order.")!} target="_blank" rel="noreferrer">
                Message MTDGC on WhatsApp
              </a>
            </Button>
          )}
          <Button asChild variant="outline" size="lg"><Link to="/track-order">Track an order</Link></Button>
        </div>
        </PageHero>

        <section className="mt-10 grid gap-3 md:grid-cols-3" aria-label="Common issues">
          {([
            ["Wrong player ID", "Tell us straight away with your order number. If the top-up has not been sent yet we can correct the ID before delivery.", UserX],
            ["Order not delivered", "Send your order number. We check the fulfilment status and tell you where the order is in the process.", PackageX],
            ["Refund request", "Refunds are reviewed before fulfilment. Once a code is revealed or currency is credited, the order cannot be reversed.", RotateCcw],
          ] as Array<[string, string, LucideIcon]>).map(([title, body, Icon]) => (
            <article key={title} className="rounded-2xl border border-border border-l-2 border-l-primary bg-card p-4">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10">
                  <Icon className="size-5 text-primary" />
                </span>
                <h2 className="font-display text-sm font-medium">{title}</h2>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-2xl border border-primary/30 bg-card p-4 md:p-6">
          <h2 className="font-display text-lg font-medium">Raise a support request</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Support requests are stored on your MTDGC account, so you need to be signed in to send one.
          </p>
          <form onSubmit={submit} className="mt-4 grid gap-3 md:max-w-xl" noValidate>
            <label className="block">
              <span className="font-display text-xs text-muted-foreground">Issue type</span>
              <select
                value={issueType}
                onChange={(event) => setIssueType(event.target.value)}
                className="mt-1 h-10 w-full rounded-md border border-border bg-card px-2 font-display text-sm"
              >
                {ISSUE_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="font-display text-xs text-muted-foreground">Order number, if you have one</span>
              <input
                value={orderNumber}
                onChange={(event) => setOrderNumber(event.target.value)}
                className="mt-1 h-10 w-full rounded-md border border-border bg-card px-3 font-display text-sm outline-none focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="font-display text-xs text-muted-foreground">What happened</span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={4}
                required
                className="mt-1 w-full rounded-md border border-border bg-card p-3 font-display text-sm outline-none focus:border-primary"
              />
            </label>
            <div>
              <Button type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Sending" : "Send request"}
              </Button>
            </div>
            {status === "sent" && <p className="text-sm text-success">Your request has been recorded. We will reply to the email address on your account.</p>}
            {status === "signin" && (
              <p role="alert" className="text-sm text-muted-foreground">
                Please <Link to="/auth" search={{ redirect: "/support" }} className="text-primary">sign in</Link> to send a support request, or message us on
                WhatsApp instead.
              </p>
            )}
            {status === "error" && <p role="alert" className="text-sm text-destructive">Please describe the problem and try again.</p>}
          </form>
        </section>

      </main>
      <SiteFooter />
    </div>
  );
}
