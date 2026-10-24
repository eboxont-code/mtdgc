import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";
import { SITE_URL } from "@/lib/format";

// Static pages. No lastmod: we only publish dates we can stand behind.
const STATIC_PAGES: [string, string][] = [
  ["/", "1.0"],
  ["/catalog", "0.9"],
  ["/products", "0.8"],
  ["/categories", "0.8"],
  ["/about", "0.6"],
  ["/how-it-works", "0.6"],
  ["/faq", "0.6"],
  ["/support", "0.5"],
  ["/track-order", "0.5"],
  ["/policies/refunds", "0.4"],
  ["/policies/delivery", "0.4"],
  ["/policies/privacy", "0.4"],
  ["/policies/terms", "0.4"],
];

const esc = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function entry(path: string, priority: string, lastmod?: string | null) {
  const mod = lastmod ? `\n    <lastmod>${lastmod.slice(0, 10)}</lastmod>` : "";
  return `  <url>\n    <loc>${esc(`${SITE_URL}${path}`)}</loc>${mod}\n    <priority>${priority}</priority>\n  </url>`;
}

async function buildSitemap() {
  const urls = STATIC_PAGES.map(([path, priority]) => entry(path, priority));
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (url && key) {
    const db = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
          headers.set("apikey", key);
          return fetch(input, { ...init, headers });
        },
      },
    });
    const [categories, products] = await Promise.all([
      db.from("categories").select("slug").eq("is_published", true).order("sort_order"),
      db.from("products").select("slug, updated_at").eq("is_published", true).order("slug"),
    ]);
    for (const c of categories.data ?? []) urls.push(entry(`/categories/${c.slug}`, "0.7"));
    for (const p of products.data ?? []) urls.push(entry(`/products/${p.slug}`, "0.8", p.updated_at));
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () =>
        new Response(await buildSitemap(), {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
          },
        }),
    },
  },
});
