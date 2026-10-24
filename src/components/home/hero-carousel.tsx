import { Link } from "@tanstack/react-router";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { CodeRain } from "@/components/brand/code-rain";
import { ProductArt } from "@/components/product-art";
import type { CatalogProduct } from "@/lib/catalog.functions";
import { isOrderable } from "@/lib/format";

export type Slide = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  to: string;
  search?: Record<string, string>;
  params?: Record<string, string>;
  art: CatalogProduct[];
  tint: string;
};

/** Builds slides only from products that exist and can be ordered today. */
export function buildSlides(products: CatalogProduct[]): Slide[] {
  const live = products.filter((p) => isOrderable(p.status));
  const bySlug = (slug: string) => live.find((p) => p.slug === slug);
  const inCategory = (slug: string) => live.filter((p) => p.category?.slug === slug);
  const slides: Slide[] = [];

  const topUps = inCategory("game-top-ups");
  if (topUps.length) {
    slides.push({
      id: "top-ups",
      eyebrow: "Game top-ups",
      title: "Top up with just your player ID",
      body: `${topUps.slice(0, 3).map((p) => p.name.replace(/ (UC|Diamonds|Passes)$/, "")).join(", ")} and more. Priced in NPR.`,
      cta: "Shop top-ups",
      to: "/catalog",
      search: { category: "game-top-ups" },
      art: topUps.slice(0, 3),
      tint: "from-[#0b2a18]",
    });
  }
  const netflix = bySlug("netflix-subscription");
  if (netflix) {
    slides.push({
      id: "netflix",
      eyebrow: "Subscriptions",
      title: "Netflix plans, paid in rupees",
      body: "Pick a plan length, give us your delivery email and check out. We deliver once your payment is verified.",
      cta: "See plans",
      to: "/products/$slug",
      params: { slug: netflix.slug },
      art: [netflix],
      tint: "from-[#2a0b0e]",
    });
  }
  const giftCards = inCategory("gift-cards");
  if (giftCards.length) {
    slides.push({
      id: "gift-cards",
      eyebrow: "Gift cards",
      title: "Gift cards for the games you play",
      body: `${giftCards.slice(0, 2).map((p) => p.name).join(" and ")}, delivered digitally.`,
      cta: "Shop gift cards",
      to: "/catalog",
      search: { category: "gift-cards" },
      art: giftCards.slice(0, 2),
      tint: "from-[#0b1a2a]",
    });
  }
  slides.push({
    id: "track",
    eyebrow: "Order tracking",
    title: "Follow every order, step by step",
    body: "Use your order number to see payment, checks and delivery as they happen.",
    cta: "Track an order",
    to: "/track-order",
    art: [],
    tint: "from-[#0b2420]",
  });
  return slides;
}

function SlideArt({ art }: { art: CatalogProduct[] }) {
  if (!art.length) {
    return (
      <div aria-hidden="true" className="grid grid-cols-3 gap-1.5 opacity-90">
        {Array.from({ length: 9 }, (_, i) => (
          <span key={i} className={`size-5 rounded-[5px] bg-primary md:size-7 ${[1, 2, 3, 4, 5, 8].includes(i) ? "" : "opacity-20"}`} />
        ))}
      </div>
    );
  }
  const rotations = ["-rotate-6", "rotate-3", "rotate-12"];
  return (
    <div aria-hidden="true" className="relative h-[110px] w-[112px] md:h-[200px] md:w-[220px]">
      {art.slice(0, 3).map((product, i) => (
        <div
          key={product.id}
          className={`absolute w-[78px] overflow-hidden rounded-xl border border-white/15 shadow-2xl shadow-black/60 md:w-[140px] ${rotations[i]}`}
          style={{ left: `${i * 18}%`, top: `${i * 8}%`, zIndex: 3 - i }}
        >
          <ProductArt product={product} sizes="140px" priority={i === 0} />
        </div>
      ))}
    </div>
  );
}

export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "start" });
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const onSelect = useCallback(() => { if (embla) setIndex(embla.selectedScrollSnap()); }, [embla]);
  useEffect(() => {
    if (!embla) return;
    embla.on("select", onSelect);
    onSelect();
    return () => { embla.off("select", onSelect); };
  }, [embla, onSelect]);

  useEffect(() => {
    if (!embla || paused || slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => { if (!document.hidden) embla.scrollNext(); }, 6000);
    return () => window.clearInterval(timer);
  }, [embla, paused, slides.length]);

  return (
    <section aria-roledescription="carousel" aria-label="Featured" className="relative min-w-0" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
      <div ref={emblaRef} className="overflow-hidden rounded-2xl border border-border">
        <div className="flex">
          {slides.map((slide, i) => (
            <div key={slide.id} className="min-w-0 flex-[0_0_100%]" role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${slides.length}`}>
              <div className={`relative isolate flex h-[184px] items-center gap-3 overflow-hidden bg-gradient-to-br ${slide.tint} to-card px-5 md:h-[300px] md:px-10`}>
                <div className="matrix-grid absolute inset-0 -z-10 opacity-60" />
                <div className="relative z-10 min-w-0 flex-1">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary md:text-xs">{slide.eyebrow}</p>
                  <h2 className="mt-1.5 max-w-[15ch] font-display text-[20px] font-bold leading-[1.15] md:max-w-[18ch] md:text-[38px]">{slide.title}</h2>
                  <p className="mt-1.5 line-clamp-2 max-w-[34ch] text-[12px] text-foreground/70 md:mt-3 md:text-base">{slide.body}</p>
                  <Link
                    {...({ to: slide.to, search: slide.search ?? {}, params: slide.params ?? {} } as unknown as { to: "/" })}
                    tabIndex={i === index ? 0 : -1}
                    className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 font-display text-[13px] font-semibold text-primary-foreground md:mt-5 md:h-11 md:px-6 md:text-sm"
                  >
                    {slide.cta} <ArrowRight className="size-4" />
                  </Link>
                </div>
                <div className="relative z-10 shrink-0 pr-1 md:pr-6">
                  <SlideArt art={slide.art} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[184px] overflow-hidden rounded-2xl mix-blend-screen [mask-image:linear-gradient(to_left,black,transparent_75%)] md:h-[300px]">
        <CodeRain opacity={0.22} />
      </div>
      {slides.length > 1 && (
        <div className="mt-2.5 flex justify-center gap-1.5">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Show slide ${i + 1}`}
              aria-current={i === index}
              onClick={() => embla?.scrollTo(i)}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-primary" : "w-1.5 bg-foreground/25"}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
