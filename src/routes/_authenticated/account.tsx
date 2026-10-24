import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { formatNpr, SITE_URL } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: [
      { title: "Your account | MTDGC" },
      { name: "description", content: "Your MTDGC profile, order history, wishlist and support requests." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Your account | MTDGC" },
      { property: "og:description", content: "Your MTDGC profile, order history, wishlist and support requests." },
      { name: "twitter:title", content: "Your account | MTDGC"  },
      { name: "twitter:description", content: "Your MTDGC profile, order history, wishlist and support requests."  },
      { property: "og:url", content: `${SITE_URL}/account` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/account` }],
  }),
  component: AccountPage,
});

type OrderRow = { id: string; order_number: string; status: string; total_minor: number; created_at: string };
type WishRow = { product_id: string; products: { slug: string; name: string } | null };
type TicketRow = { id: string; issue_type: string; status: string; created_at: string };

function AccountPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryEmail, setDeliveryEmail] = useState("");
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [wishlist, setWishlist] = useState<WishRow[]>([]);
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) return;
      if (active) setEmail(user.email ?? "");

      const [profile, orderRows, wishRows, ticketRows] = await Promise.all([
        supabase.from("profiles").select("display_name, phone, delivery_email").eq("id", user.id).maybeSingle(),
        supabase.from("orders").select("id, order_number, status, total_minor, created_at").order("created_at", { ascending: false }),
        supabase.from("wishlist_items").select("product_id, products(slug, name)"),
        supabase.from("support_tickets").select("id, issue_type, status, created_at").order("created_at", { ascending: false }),
      ]);
      if (!active) return;
      if (!profile.error && !profile.data) {
        await supabase.from("profiles").upsert({ id: user.id }, { onConflict: "id", ignoreDuplicates: true });
      }
      setDisplayName(profile.data?.display_name ?? "");
      setPhone(profile.data?.phone ?? "");
      setDeliveryEmail(profile.data?.delivery_email ?? "");
      setOrders((orderRows.data ?? []) as OrderRow[]);
      setWishlist((wishRows.data ?? []) as unknown as WishRow[]);
      setTickets((ticketRows.data ?? []) as TicketRow[]);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setSaved(false);
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (user) {
      await supabase
        .from("profiles")
        .upsert({ id: user.id, display_name: displayName, phone, delivery_email: deliveryEmail });
      setSaved(true);
    }
    setSaving(false);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    await navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="focus:outline-none mx-auto max-w-4xl px-4 pb-16 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-[26px] font-medium md:text-4xl">Your account</h1>
          <Button variant="outline" className="min-h-11" onClick={signOut}>Sign out</Button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{email}</p>

        <section className="mt-8">
          <h2 className="font-display text-lg font-medium">Profile</h2>
          <form onSubmit={saveProfile} className="mt-3 grid gap-3 md:grid-cols-2">
            <label className="block">
              <span className="font-display text-xs text-muted-foreground">Display name</span>
              <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} className="mt-1 min-h-11 w-full rounded-md border border-input bg-card px-3 font-display text-sm focus:border-primary" />
            </label>
            <label className="block">
              <span className="font-display text-xs text-muted-foreground">Mobile number</span>
              <input value={phone} onChange={(event) => setPhone(event.target.value)} inputMode="tel" className="mt-1 min-h-11 w-full rounded-md border border-input bg-card px-3 font-display text-sm focus:border-primary" />
            </label>
            <label className="block md:col-span-2">
              <span className="font-display text-xs text-muted-foreground">Delivery email for codes and subscriptions</span>
              <input value={deliveryEmail} onChange={(event) => setDeliveryEmail(event.target.value)} type="email" className="mt-1 min-h-11 w-full rounded-md border border-input bg-card px-3 font-display text-sm focus:border-primary" />
            </label>
            <div className="md:col-span-2">
              <Button type="submit" className="min-h-11" disabled={saving}>{saving ? "Saving" : "Save profile"}</Button>
              {saved && <span className="ml-3 font-display text-xs text-success">Saved</span>}
            </div>
          </form>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-lg font-medium">Order history</h2>
          {loading ? (
            <p className="mt-2 text-sm text-muted-foreground">Loading your orders.</p>
          ) : orders.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              No orders on your account yet. Orders you place at checkout while signed in appear here.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {orders.map((order) => (
                <li key={order.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-display text-sm font-medium">{order.order_number}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()} · {order.status}
                    </p>
                  </div>
                  <span className="font-display text-sm">{formatNpr(order.total_minor)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-10">
          <h2 className="font-display text-lg font-medium">Wishlist</h2>
          {wishlist.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Nothing saved yet. Save a product from its page to find it again quickly.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {wishlist.map((item) => (
                <li key={item.product_id}>
                  {item.products ? (
                    <Link to="/products/$slug" params={{ slug: item.products.slug }} className="inline-flex min-h-11 items-center font-display text-sm text-primary">
                      {item.products.name}
                    </Link>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-10">
          <h2 className="font-display text-lg font-medium">Support requests</h2>
          {tickets.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              No support requests yet. You can raise one from the <Link to="/support" className="inline-flex min-h-11 items-center text-primary">support page</Link>.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {tickets.map((ticket) => (
                <li key={ticket.id} className="flex items-center justify-between py-3 text-sm">
                  <span>{ticket.issue_type}</span>
                  <span className="text-muted-foreground">{ticket.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
