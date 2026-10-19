import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { saveCategory as saveCategoryServer } from "@/lib/admin.functions";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  sort_order: number;
  is_published: boolean;
};

type Draft = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  sort_order: string;
  is_published: boolean;
};

const EMPTY: Draft = { name: "", slug: "", description: "", sort_order: "0", is_published: false };

function toDraft(row: CategoryRow): Draft {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    sort_order: String(row.sort_order),
    is_published: row.is_published,
  };
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function CategoriesPanel() {
  const [rows, setRows] = useState<CategoryRow[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const saveCategory = useServerFn(saveCategoryServer);

  useEffect(() => {
    let active = true;
    void (async () => {
      const { data } = await supabase
        .from("categories")
        .select("id, name, slug, description, sort_order, is_published")
        .order("sort_order");
      if (!active) return;
      setRows((data ?? []) as CategoryRow[]);
      setLoaded(true);
    })();
    return () => {
      active = false;
    };
  }, []);

  const startEdit = (row: CategoryRow) => {
    setEditingId(row.id);
    setDraft(toDraft(row));
    setError(null);
    setSaved(false);
  };

  const startNew = () => {
    setEditingId("new");
    setDraft({ ...EMPTY, sort_order: String((rows.at(-1)?.sort_order ?? 0) + 1) });
    setError(null);
    setSaved(false);
  };

  const save = async () => {
    if (saving) return;
    const name = draft.name.trim();
    const slug = draft.slug.trim() || slugify(name);
    const sortOrder = Number.parseInt(draft.sort_order, 10);
    if (name.length < 2) {
      setError("The name needs at least 2 characters.");
      return;
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      setError("The slug can only use lowercase letters, numbers and hyphens.");
      return;
    }
    if (!Number.isInteger(sortOrder) || sortOrder < 0 || sortOrder > 1000) {
      setError("Sort order must be a whole number between 0 and 1000.");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await saveCategory({
        data: {
          ...(draft.id ? { id: draft.id } : {}),
          name,
          slug,
          description: draft.description.trim(),
          sort_order: sortOrder,
          is_published: draft.is_published,
        },
      });
      setRows((current) => {
        const next: CategoryRow = {
          id: draft.id ?? `new-${slug}`,
          name,
          slug,
          description: draft.description.trim(),
          sort_order: sortOrder,
          is_published: draft.is_published,
        };
        const rest = current.filter((row) => row.id !== next.id);
        return [...rest, next].sort((a, b) => a.sort_order - b.sort_order);
      });
      setEditingId(null);
      setSaved(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save the category. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "mt-1 min-h-11 w-full rounded-md border border-input bg-card px-3 font-display text-sm focus:border-primary";

  const editor = (
    <div className="mt-3 grid gap-3 rounded-lg border border-border bg-card p-4 sm:grid-cols-2">
      <label className="block">
        <span className="font-display text-xs text-muted-foreground">Name</span>
        <input
          value={draft.name}
          onChange={(event) => setDraft((d) => ({ ...d, name: event.target.value }))}
          className={inputClass}
        />
      </label>
      <label className="block">
        <span className="font-display text-xs text-muted-foreground">Slug</span>
        <input
          value={draft.slug}
          onChange={(event) => setDraft((d) => ({ ...d, slug: event.target.value }))}
          placeholder={slugify(draft.name) || "category-slug"}
          className={inputClass}
        />
      </label>
      <label className="block sm:col-span-2">
        <span className="font-display text-xs text-muted-foreground">Description</span>
        <textarea
          value={draft.description}
          onChange={(event) => setDraft((d) => ({ ...d, description: event.target.value }))}
          rows={2}
          className="mt-1 w-full rounded-md border border-input bg-card p-3 font-display text-sm focus:border-primary"
        />
      </label>
      <label className="block">
        <span className="font-display text-xs text-muted-foreground">Sort order</span>
        <input
          value={draft.sort_order}
          onChange={(event) => setDraft((d) => ({ ...d, sort_order: event.target.value }))}
          inputMode="numeric"
          className={inputClass}
        />
      </label>
      <label className="flex min-h-11 items-center gap-2 self-end font-display text-sm">
        <input
          type="checkbox"
          checked={draft.is_published}
          onChange={(event) => setDraft((d) => ({ ...d, is_published: event.target.checked }))}
          className="size-4"
        />
        Published
      </label>
      {error && (
        <p role="alert" className="text-sm text-destructive sm:col-span-2">
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-2 sm:col-span-2">
        <Button size="sm" onClick={save} disabled={saving}>
          {saving ? "Saving" : "Save category"}
        </Button>
        <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
          Cancel
        </Button>
      </div>
    </div>
  );

  return (
    <section className="mt-8">
      <h3 className="font-display text-base font-medium">Categories</h3>
      {!loaded ? (
        <p className="mt-2 text-sm text-muted-foreground">Loading categories.</p>
      ) : (
        <>
          <ul className="mt-3 divide-y divide-border">
            {rows.map((row) => (
              <li key={row.id} className="py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-sm font-medium">{row.name}</span>
                  <span className="text-xs text-muted-foreground">/{row.slug}</span>
                  <span className="text-xs text-muted-foreground">Order {row.sort_order}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 font-display text-xs ${row.is_published ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"}`}
                  >
                    {row.is_published ? "Published" : "Hidden"}
                  </span>
                  <Button size="sm" variant="outline" className="ml-auto min-h-11" onClick={() => startEdit(row)}>
                    Edit
                  </Button>
                </div>
                {row.description && <p className="mt-1 text-sm text-muted-foreground">{row.description}</p>}
                {editingId === row.id && editor}
              </li>
            ))}
          </ul>
          {saved && <p className="mt-2 text-sm text-success">Category saved.</p>}
          {editingId === "new" ? (
            editor
          ) : (
            <Button size="sm" variant="outline" className="mt-3 min-h-11" onClick={startNew}>
              Add category
            </Button>
          )}
        </>
      )}
    </section>
  );
}
