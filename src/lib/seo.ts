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
