import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { saveProduct } from "@/lib/admin.functions";
import { VariantsEditor } from "./variants-editor";

const STATUSES = ["available", "low_stock", "coming_soon", "out_of_stock", "temporarily_unavailable", "archived"] as const;

type Form = {
  name: string; slug: string; brand: string; summary: string; description: string; category_id: string;
  region: string; platform: string; delivery_method: string; delivery_time: string; requirements: string;
  image_url: string; seo_title: string; seo_description: string; status: (typeof STATUSES)[number]; is_published: boolean;
};

const EMPTY: Form = {
  name: "", slug: "", brand: "", summary: "", description: "", category_id: "", region: "Global", platform: "",
  delivery_method: "Manual digital fulfilment", delivery_time: "Confirmed after order review", requirements: "",
  image_url: "", seo_title: "", seo_description: "", status: "coming_soon", is_published: false,
};

function validate(f: Form): Partial<Record<keyof Form, string>> {
  const e: Partial<Record<keyof Form, string>> = {};
  if (f.name.trim().length < 2) e.name = "Add a name of at least 2 characters.";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(f.slug.trim())) e.slug = "Use lowercase letters, numbers and dashes.";
  if (!f.brand.trim()) e.brand = "Add the brand.";
  if (!f.summary.trim() || f.summary.length > 300) e.summary = "Add a summary of up to 300 characters.";
  if (!f.description.trim()) e.description = "Add a description.";
  if (!f.region.trim()) e.region = "Add a region.";
  if (!f.delivery_method.trim()) e.delivery_method = "Add a delivery method.";
  if (!f.delivery_time.trim()) e.delivery_time = "Add a delivery time.";
  if (f.image_url.trim() && !/^https?:\/\//.test(f.image_url.trim())) e.image_url = "Use a full https link or leave empty.";
  if (!f.seo_title.trim() || f.seo_title.length > 70) e.seo_title = "Add an SEO title of up to 70 characters.";
  if (!f.seo_description.trim() || f.seo_description.length > 170) e.seo_description = "Add an SEO description of up to 170 characters.";
  return e;
}

export function ProductForm({ productId, onSaved, onCancel }: { productId?: string | undefined; onSaved: () => void; onCancel: () => void }) {
  const [form, setForm] = useState<Form>(EMPTY);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const save = useServerFn(saveProduct);

  useEffect(() => {
    supabase.from("categories").select("id, name").order("sort_order").then(({ data }) => setCategories(data ?? []));
    if (!productId) return;
    supabase.from("products").select("*").eq("id", productId).single().then(({ data }) => {
      if (!data) return;
      setForm({
        name: data.name, slug: data.slug, brand: data.brand, summary: data.summary, description: data.description,
        category_id: data.category_id ?? "", region: data.region, platform: data.platform ?? "",
        delivery_method: data.delivery_method, delivery_time: data.delivery_time,
        requirements: Array.isArray(data.requirements) ? (data.requirements as string[]).join(", ") : "",
        image_url: data.image_url ?? "", seo_title: data.seo_title, seo_description: data.seo_description,
        status: data.status, is_published: data.is_published,
      });
    });
  }, [productId]);

  const set = (k: keyof Form, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (saving) return;
    const e = validate(form);
    setErrors(e);
    setMessage(null);
    if (Object.keys(e).length) return;
    setSaving(true);
    try {
      await save({
        data: {
          ...(productId ? { id: productId } : {}),
          name: form.name.trim(), slug: form.slug.trim(), brand: form.brand.trim(), summary: form.summary.trim(),
          description: form.description.trim(), category_id: form.category_id || null, region: form.region.trim(),
          platform: form.platform.trim() || null, delivery_method: form.delivery_method.trim(), delivery_time: form.delivery_time.trim(),
          requirements: form.requirements.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 8),
          image_url: form.image_url.trim() || null, seo_title: form.seo_title.trim(), seo_description: form.seo_description.trim(),
          status: form.status, is_published: form.is_published,
        },
      });
      setMessage("Product saved.");
      onSaved();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not save the product.");
    } finally {
      setSaving(false);
    }
  };

  const field = (k: keyof Form, label: string, multiline = false) => (
    <label className="block">
      <span className="font-display text-xs text-muted-foreground">{label}</span>
      {multiline ? (
        <textarea value={form[k] as string} onChange={(e) => set(k, e.target.value)} rows={3} aria-invalid={Boolean(errors[k])} className="mt-1 w-full rounded-md border border-border bg-card p-2 text-sm" />
      ) : (
        <input value={form[k] as string} onChange={(e) => set(k, e.target.value)} aria-invalid={Boolean(errors[k])} className="mt-1 h-9 w-full rounded-md border border-border bg-card px-2 text-sm" />
      )}
      {errors[k] && <span className="mt-1 block text-xs text-destructive">{errors[k]}</span>}
    </label>
  );

  return (
    <form onSubmit={submit} noValidate className="mt-3 grid gap-3 rounded-lg border border-border bg-panel p-4 md:grid-cols-2">
      {field("name", "Name")}
      {field("slug", "Slug")}
      {field("brand", "Brand")}
      <label className="block">
        <span className="font-display text-xs text-muted-foreground">Category</span>
        <select value={form.category_id} onChange={(e) => set("category_id", e.target.value)} className="mt-1 h-9 w-full rounded-md border border-border bg-card px-2 text-sm">
          <option value="">None</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </label>
      {field("summary", "Summary", true)}
      {field("description", "Description", true)}
      {field("region", "Region")}
      {field("platform", "Platform")}
      {field("delivery_method", "Delivery method")}
      {field("delivery_time", "Delivery time")}
      {field("requirements", "Required details, separated by commas")}
      {field("image_url", "Image URL")}
      {field("seo_title", "SEO title")}
      {field("seo_description", "SEO description", true)}
      <label className="block">
        <span className="font-display text-xs text-muted-foreground">Status</span>
        <select value={form.status} onChange={(e) => set("status", e.target.value)} className="mt-1 h-9 w-full rounded-md border border-border bg-card px-2 text-sm">
          {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
        </select>
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.is_published} onChange={(e) => set("is_published", e.target.checked)} />
        Published
      </label>
      <div className="flex flex-wrap items-center gap-2 md:col-span-2">
        <Button type="submit" size="sm" disabled={saving}>{saving ? "Saving" : "Save product"}</Button>
        <Button type="button" size="sm" variant="outline" onClick={onCancel}>Close</Button>
        {message && <span role="status" className="text-sm">{message}</span>}
      </div>
      {productId && <VariantsEditor productId={productId} />}
    </form>
  );
}
