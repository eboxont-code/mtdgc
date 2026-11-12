import { organizationJson, websiteJson } from "@/lib/brand";
import { SITE_URL } from "@/lib/format";

const abs = (path: string) => (path.startsWith("http") ? path : `${SITE_URL}${path}`);

export function ldScript(data: Record<string, unknown>) {
  return { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", ...data }) };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return ldScript({
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: abs(item.path),
    })),
  });
}

export function pageLd(type: string, name: string, path: string, description: string, extra: Record<string, unknown> = {}) {
  return ldScript({
    "@type": type,
    name,
    url: abs(path),
    description,
    isPartOf: { "@type": "WebSite", name: "MTDGC", url: `${SITE_URL}/` },
    ...extra,
  });
}

export function organizationLd() {
  return ldScript(organizationJson());
}

export function websiteLd() {
  return ldScript(websiteJson());
}

export function faqLd(items: { q: string; a: string }[]) {
  return ldScript({
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  });
}

export function hreflangLinks(href: string) {
  return (["en-NP", "en-AU", "x-default"] as const).map((hreflang) => ({
    rel: "alternate" as const,
    href,
    hreflang,
  }));
}

/** One English URL serves Nepal and Australia, so the alternates share that canonical. */
export function canonicalLinks(href: string) {
  return [{ rel: "canonical" as const, href }, ...hreflangLinks(href)];
}

export function itemListLd(name: string, path: string, description: string, items: { name: string; path: string }[]) {
  return pageLd("CollectionPage", name, path, description, {
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: abs(item.path),
      })),
    },
  });
}
