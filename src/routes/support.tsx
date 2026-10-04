import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { SITE_URL, whatsappLink } from "@/lib/format";

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
      { property: "og:url", content: `${SITE_URL}/support` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/support` }],
  }),
  component: SupportPage,
});

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
        <h1 className="font-display text-[26px] font-medium md:text-4xl">Support and order help</h1>
        <p className="mt-2 max-w-[62ch] text-sm text-muted-foreground">
          The fastest way to reach MTDGC is WhatsApp. Send your order number and a short description of the problem and
          our team will work through it with you.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <Button asChild size="lg">
            <a href={whatsappLink("Hello MTDGC, I need help with an order.")} target="_blank" rel="noreferrer">
              Message MTDGC on WhatsApp
            </a>
          </Button>
          <Button asChild variant="outline" size="lg"><Link to="/track-order">Track an order</Link></Button>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            ["Wrong player ID", "Tell us straight away with your order number. If the top-up has not been sent yet we can correct the ID before delivery."],
            ["Order not delivered", "Send your order number. We check the fulfilment status and tell you where the order is in the process."],
            ["Refund request", "Refunds are reviewed before fulfilment. Once a code is revealed or currency is credited, the order cannot be reversed."],
          ].map(([title, body]) => (
            <article key={title}>
              <h2 className="font-display text-sm font-medium">{title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            </article>
          ))}
        </section>

        <section className="mt-12">
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
            {status === "sent" && <p className="text-sm text-success">Your request has been recorded. We will follow up on WhatsApp.</p>}
            {status === "signin" && (
              <p role="alert" className="text-sm text-muted-foreground">
                Please <Link to="/auth" className="text-primary">sign in</Link> to send a support request, or message us on
                WhatsApp instead.
              </p>
            )}
            {status === "error" && <p role="alert" className="text-sm text-destructive">Please describe the problem and try again.</p>}
          </form>
        </section>

        <p className="mt-10 text-xs text-muted-foreground">
          MTDGC will never ask for your password, OTP or payment PIN.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
