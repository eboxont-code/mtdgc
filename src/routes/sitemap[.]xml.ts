import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";
import { SITE_URL } from "@/lib/format";

const STATIC_PATHS = [
  { path: "/", priority: "1.0" },
  { path: "/catalog", priority: "0.9" },
  { path: "/about", priority: "0.6" },
  { path: "/how-it-works", priority: "0.6" },
  { path: "/faq", priority: "0.6" },
  { path: "/support", priority: "0.5" },
  { path: "/track-order", priority: "0.5" },
  { path: "/policies/refunds", priority: "0.4" },
  { path: "/policies/delivery", priority: "0.4" },
  { path: "/policies/privacy", priority: "0.4" },
  { path: "/policies/terms", priority: "0.4" },
];

function entry(path: string, priority: string, lastmod?: string): string {
  const mod = lastmod ? `<lastmod>${lastmod.slice(0, 10)}</lastmod>` : "";
  return `<url><loc>${SITE_URL}${path}</loc>${mod}<priority>${priority}</priority></url>`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const urls = STATIC_PATHS.map((item) => entry(item.path, item.priority));

        try {
          const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
          const supabase = createClient<Database>(process.env["SUPABASE_URL"]!, key, {
            auth: { persistSession: false, autoRefreshToken: false },
            global: {
              fetch: (input, init) => {
                const headers = new Headers(init?.headers);
                if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
                  headers.delete("Authorization");
                }
                headers.set("apikey", key);
                return fetch(input, { ...init, headers });
              },
            },
          });
          const [products, categories] = await Promise.all([
            supabase.from("products").select("slug, updated_at").eq("is_published", true),
            supabase.from("categories").select("slug").eq("is_published", true),
          ]);
          for (const row of categories.data ?? []) {
            urls.push(entry(`/catalog?category=${row.slug}`, "0.6"));
          }
          for (const row of products.data ?? []) {
            urls.push(entry(`/products/${row.slug}`, "0.8", row.updated_at ?? undefined));
          }
        } catch (error) {
          console.error("sitemap product lookup failed", error);
        }

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>`;
        return new Response(xml, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
