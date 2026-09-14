import { createFileRoute } from "@tanstack/react-router";
import { Check, ChevronDown, MessageCircle, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import clashImage from "@/assets/clash.jpg.asset.json";
import freeFireImage from "@/assets/free-fire.jpg.asset.json";
import mobileLegendsImage from "@/assets/mobile-legends.jpg.asset.json";
import netflixImage from "@/assets/netflix.jpg.asset.json";
import pubgImage from "@/assets/pubg.jpg.asset.json";
import robloxImage from "@/assets/roblox.jpg.asset.json";
import steamImage from "@/assets/steam.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MTDGC | Nepal's Digital Marketplace" },
      { name: "description", content: "MTDGC, Modern Tech Digital Goods & Commerce. Game top-ups, gift cards and subscriptions delivered digitally across Nepal." },
      { property: "og:title", content: "MTDGC | Nepal's Digital Marketplace" },
      { property: "og:description", content: "Modern Tech Digital Goods & Commerce. Game top-ups, gift cards and subscriptions for Nepal." },
      { property: "og:url", content: "https://topupmandu-plus.lovable.app/" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://topupmandu-plus.lovable.app/" }],
  }),
  component: Index,
});

const products = [
  { id: "free-fire", title: "Free Fire Diamonds", detail: "25–11,200 diamonds", price: 30, category: "Battle Royale", image: freeFireImage.url },
  { id: "pubg", title: "PUBG Mobile UC", detail: "60–8,100 UC", price: 155, category: "Battlegrounds", image: pubgImage.url },
  { id: "mobile-legends", title: "Mobile Legends", detail: "Diamonds & weekly pass", price: 145, category: "MOBA", image: mobileLegendsImage.url },
  { id: "clash", title: "Clash of Clans", detail: "Passes & event offers", price: 399, category: "Strategy", image: clashImage.url },
  { id: "netflix", title: "Netflix Subscription", detail: "1–12 month plans", price: 350, category: "Subscriptions", image: netflixImage.url },
  { id: "roblox", title: "Roblox Gift Card", detail: "Digital gift cards", price: 825, category: "Gift Cards", image: robloxImage.url },
  { id: "steam", title: "Steam Wallet Code", detail: "Global wallet codes", price: 0, category: "Gift Cards", image: steamImage.url, unavailable: true },
];

const categories = ["All", "Battle Royale", "Battlegrounds", "MOBA", "Strategy", "Subscriptions", "Gift Cards"];

function Index() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const visibleProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const matchesQuery = product.title.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  }), [activeCategory, query]);

  const cartItems = products.filter((product) => cart[product.id]);
  const cartCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const cartTotal = cartItems.reduce((sum, product) => sum + product.price * (cart[product.id] ?? 0), 0);

  const addToCart = (id: string) => setCart((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }));

  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <div className="overflow-hidden bg-foreground text-background">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2">
          <span className="size-1.5 shrink-0 rounded-full bg-brand-soft" />
          <div className="overflow-hidden">
            <div className="ticker flex w-max gap-8 whitespace-nowrap font-display text-[10px] uppercase tracking-[0.12em]">
              {["Fast digital delivery", "Secure payment", "Friendly WhatsApp support", "Fast digital delivery", "Secure payment", "Friendly WhatsApp support"].map((text, index) => <span key={`${text}-${index}`}>{text}</span>)}
            </div>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-1 px-4">
          <a href="#top" className="mr-auto flex items-center gap-2" aria-label="MTDGC home">
            <span className="grid size-7 place-items-center rounded-md bg-primary font-display text-sm font-semibold text-primary-foreground">M</span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-[15px] font-semibold">MTDGC</span>
              <span className="hidden text-[9px] uppercase tracking-[0.12em] text-muted-foreground sm:block">Modern Tech Digital Goods &amp; Commerce</span>
            </span>
          </a>
          <Button variant="ghost" size="icon" aria-label="Search products" onClick={() => setSearchOpen((open) => !open)}><Search className="size-4" /></Button>
          <Button variant="ghost" size="icon" aria-label="Account"><UserRound className="size-4" /></Button>
          <Button variant="ghost" size="icon" className="relative" aria-label={`Cart with ${cartCount} items`} onClick={() => setCartOpen(true)}>
            <ShoppingBag className="size-4" />
            {cartCount > 0 && <span className="absolute right-0.5 top-0.5 grid min-w-4 place-items-center rounded-full bg-primary px-1 text-[9px] text-primary-foreground">{cartCount}</span>}
          </Button>
        </div>
        {searchOpen && <div className="mx-auto max-w-6xl px-4 pb-3"><label className="flex h-10 items-center gap-2 rounded-md border border-border bg-card px-3"><Search className="size-4 text-muted-foreground" /><span className="sr-only">Search products</span><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search games, gift cards…" className="min-w-0 flex-1 bg-transparent font-display text-sm outline-none placeholder:text-muted-foreground" /><button aria-label="Close search" onClick={() => { setQuery(""); setSearchOpen(false); }}><X className="size-4" /></button></label></div>}
      </header>

      <main id="top" className="pb-24 md:pb-10">
        <section className="border-b border-border bg-panel">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-7 md:grid-cols-[1fr_0.8fr] md:items-center md:py-14">
            <div>
              <p className="reveal mb-2 font-display text-[11px] uppercase tracking-[0.16em] text-primary">Nepal&apos;s Digital Marketplace</p>
              <h1 className="reveal delay-1 max-w-xl font-display text-[34px] font-medium leading-tight md:text-6xl">Digital goods, delivered in minutes.</h1>
              <p className="reveal delay-2 mt-2 max-w-[46ch] text-[15px] text-foreground/70 md:text-lg">MTDGC is a digital commerce company serving Nepal. We start with game top-ups, gift cards and subscriptions, and we keep adding product lines.</p>
              <div className="reveal delay-3 mt-4 flex items-center gap-3">
                <Button onClick={() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })}>Browse the catalog</Button>
                <span className="font-display text-xs text-muted-foreground">{products.length} products live</span>
              </div>
            </div>
            <div className="reveal delay-3 rounded-lg bg-background p-3 ring-1 ring-foreground/5">
              <div className="flex gap-3">
                <img src={pubgImage.url} alt="PUBG Mobile UC" className="size-16 shrink-0 rounded-md object-cover md:size-24" />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-[10px] uppercase tracking-[0.12em] text-primary">Popular choice</p>
                  <div className="mt-1 flex items-baseline justify-between gap-2"><h2 className="font-display text-[15px] font-medium md:text-xl">PUBG Mobile UC</h2><span className="shrink-0 font-display text-[15px] font-semibold">From Rs 155</span></div>
                  <p className="mt-0.5 text-xs text-muted-foreground">Select a package, then enter your Player ID.</p>
                </div>
              </div>
              <div className="mt-3 flex gap-2"><Button variant="ink" className="flex-1" size="sm" onClick={() => addToCart("pubg")}>Add to cart</Button><Button variant="outline" size="sm" onClick={() => { setActiveCategory("Battlegrounds"); document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" }); }}>View</Button></div>
            </div>
          </div>
        </section>

        <section id="catalog" className="mx-auto max-w-6xl bg-background pt-5">
          <div className="scrollbar-hidden flex gap-2.5 overflow-x-auto px-4 pb-1">
            {categories.map((category) => <Button key={category} variant={activeCategory === category ? "ink" : "outline"} size="sm" className="shrink-0" onClick={() => setActiveCategory(category)}>{category}</Button>)}
          </div>
          <div className="px-4 py-6">
            <div className="mb-4 flex items-baseline justify-between"><h2 className="font-display text-[17px] font-medium md:text-2xl">Popular right now</h2><span className="font-display text-xs text-muted-foreground">{visibleProducts.length} products</span></div>
            {visibleProducts.length ? <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
              {visibleProducts.map((product) => <article key={product.id} className="flex flex-col rounded-lg bg-card p-3 ring-1 ring-foreground/5 transition-transform active:-translate-y-0.5">
                <img src={product.image} alt={product.title} loading="lazy" className="mb-3 aspect-square w-full rounded-md object-cover" />
                <span className={`self-start rounded px-2 py-0.5 font-display text-[9px] uppercase tracking-[0.1em] ${product.unavailable ? "bg-muted text-muted-foreground" : "bg-accent text-accent-foreground"}`}>{product.unavailable ? "Coming soon" : "Available"}</span>
                <h3 className="mt-2 font-display text-[14px] font-medium leading-tight">{product.title}</h3>
                <p className="mt-1 text-[11px] text-muted-foreground">{product.detail}</p>
                <div className="mt-auto flex items-center justify-between pt-3"><span className="font-display text-[10px] text-muted-foreground">{product.unavailable ? "" : "From"}</span><span className="font-display text-[15px] font-semibold">{product.unavailable ? "Soon" : `Rs ${product.price}`}</span></div>
                <Button className="mt-3 w-full" variant={product.unavailable ? "outline" : "primary"} size="sm" disabled={product.unavailable} onClick={() => addToCart(product.id)}>{product.unavailable ? "Unavailable" : "Add"}</Button>
              </article>)}
            </div> : <div className="rounded-lg border border-border py-12 text-center"><p className="font-display font-medium">No products found</p><Button variant="ghost" size="sm" className="mt-2" onClick={() => { setQuery(""); setActiveCategory("All"); }}>Clear search</Button></div>}
          </div>
        </section>

        <section className="border-y border-border bg-panel"><div className="mx-auto grid max-w-6xl grid-cols-3 divide-x divide-border px-4 py-5 text-center"><div><p className="font-display text-sm font-semibold text-primary">Fast</p><p className="text-[10px] text-muted-foreground">Digital delivery</p></div><div><p className="font-display text-sm font-semibold text-primary">Secure</p><p className="text-[10px] text-muted-foreground">Protected payment</p></div><div><p className="font-display text-sm font-semibold text-primary">Helpful</p><p className="text-[10px] text-muted-foreground">Direct support</p></div></div></section>

        <section className="mx-auto max-w-6xl px-4 py-7"><h2 className="mb-5 font-display text-[17px] font-medium md:text-2xl">How it works</h2><ol className="grid gap-4 md:grid-cols-3">{[["1","Choose a product","Pick a game, subscription or gift card."],["2","Enter your details","Add the correct Player ID or delivery email."],["3","Pay & receive","Confirm payment and follow your order status."]].map(([number,title,text]) => <li key={number} className="flex gap-3"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-foreground font-display text-xs text-background">{number}</span><div><h3 className="font-display text-sm font-medium">{title}</h3><p className="mt-0.5 text-xs text-muted-foreground">{text}</p></div></li>)}</ol></section>

        <section className="border-t border-border"><div className="mx-auto max-w-6xl px-4 py-7"><h2 className="mb-2 font-display text-[17px] font-medium md:text-2xl">Frequently asked</h2>{[["How quickly will I receive my order?","Delivery time varies by product. You’ll receive the digital item through the method shown during ordering."],["What details do I need?","Game top-ups usually require your Player ID. Subscriptions and gift cards may require an email or WhatsApp number."],["Can I get help with an order?","Yes. Message the MTDGC team on WhatsApp and include your order information."]].map(([question,answer], index) => <div key={question} className="border-b border-border"><button className="flex w-full items-center justify-between py-4 text-left font-display text-sm font-medium" onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}>{question}<ChevronDown className={`size-4 transition-transform ${openFaq === index ? "rotate-180" : ""}`} /></button>{openFaq === index && <p className="pb-4 pr-6 text-sm text-muted-foreground">{answer}</p>}</div>)}</div></section>

        <section className="bg-foreground text-background"><div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-6"><span className="grid size-10 shrink-0 place-items-center rounded-md bg-brand-soft"><MessageCircle className="size-5" /></span><div className="min-w-0"><h2 className="font-display text-[15px] font-medium">Questions? We answer fast.</h2><p className="text-xs text-background/60">Chat with the MTDGC team on WhatsApp.</p></div><Button asChild variant="primary" size="sm" className="ml-auto"><a href="https://wa.me/19379307376" target="_blank" rel="noreferrer">Message</a></Button></div></section>
      </main>

      <footer className="border-t border-border bg-panel">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-md bg-primary font-display text-sm font-semibold text-primary-foreground">M</span>
              <span className="font-display text-[15px] font-semibold">MTDGC</span>
            </div>
            <p className="mt-2 font-display text-xs uppercase tracking-[0.12em] text-muted-foreground">Modern Tech Digital Goods &amp; Commerce</p>
            <p className="mt-1 max-w-[48ch] text-xs text-muted-foreground">Nepal&apos;s Digital Marketplace. Game top-ups, gift cards and subscriptions today, with more digital product lines on the way.</p>
          </div>
          <div className="text-xs text-muted-foreground">
            <a href="https://wa.me/19379307376" target="_blank" rel="noreferrer" className="font-display font-medium text-foreground">WhatsApp support</a>
            <p className="mt-2">© {new Date().getFullYear()} MTDGC</p>
          </div>
        </div>
      </footer>

      {cartCount > 0 && <div className="fixed inset-x-0 bottom-0 z-40 border-t border-background/10 bg-foreground text-background"><div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3"><div className="min-w-0"><p className="font-display text-[10px] uppercase tracking-[0.12em] text-background/50">Cart</p><p className="font-display text-[15px] font-semibold">{cartCount} {cartCount === 1 ? "item" : "items"} · Rs {cartTotal}</p></div><Button className="ml-auto" onClick={() => setCartOpen(true)}>View cart</Button></div></div>}

      {cartOpen && <div className="fixed inset-0 z-50 bg-foreground/45" role="presentation" onClick={() => setCartOpen(false)}><aside className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-auto rounded-t-lg bg-background p-4 md:left-auto md:top-0 md:w-[420px] md:rounded-none" role="dialog" aria-modal="true" aria-label="Shopping cart" onClick={(event) => event.stopPropagation()}><div className="mb-5 flex items-center justify-between"><h2 className="font-display text-xl font-semibold">Your cart</h2><Button variant="ghost" size="icon" aria-label="Close cart" onClick={() => setCartOpen(false)}><X className="size-5" /></Button></div>{cartItems.length ? <><div className="space-y-3">{cartItems.map((product) => <div key={product.id} className="flex items-center gap-3 border-b border-border pb-3"><img src={product.image} alt="" className="size-12 rounded-md object-cover" /><div className="min-w-0 flex-1"><p className="truncate font-display text-sm font-medium">{product.title}</p><p className="text-xs text-muted-foreground">Rs {product.price} × {cart[product.id]}</p></div><div className="flex items-center gap-1"><Button variant="outline" size="icon" aria-label={`Remove one ${product.title}`} onClick={() => setCart((current) => ({...current, [product.id]: Math.max(0, (current[product.id] ?? 0) - 1)}))}>−</Button><Button variant="outline" size="icon" aria-label={`Add one ${product.title}`} onClick={() => addToCart(product.id)}>+</Button></div></div>)}</div><div className="mt-5 flex items-center justify-between font-display"><span>Total</span><strong>Rs {cartTotal}</strong></div><div className="mt-4 rounded-md bg-secondary p-3 text-xs text-muted-foreground"><Check className="mr-1 inline size-3 text-success" />Demo cart. MTDGC checkout goes live once payment processing is connected.</div><Button className="mt-3 w-full" size="lg" onClick={() => window.open("https://wa.me/19379307376", "_blank")}>Order on WhatsApp</Button></> : <div className="py-16 text-center"><ShoppingBag className="mx-auto size-8 text-muted-foreground" /><p className="mt-3 font-display font-medium">Your cart is empty</p></div>}</aside></div>}
    </div>
  );
}
