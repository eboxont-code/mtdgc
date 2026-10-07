import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { archiveVariant, saveVariant } from "@/lib/admin.functions";

const STATUSES = ["available", "low_stock", "coming_soon", "out_of_stock", "temporarily_unavailable", "archived"] as const;
type Status = (typeof STATUSES)[number];
type Row = { id?: string; sku: string; name: string; price: string; stock: string; status: Status; is_default: boolean; sort_order: string };

const blank = (): Row => ({ sku: "", name: "", price: "", stock: "", status: "available", is_default: false, sort_order: "0" });

export function VariantsEditor({ productId }: { productId: string }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [reload, setReload] = useState(0);
  const save = useServerFn(saveVariant);
  const archive = useServerFn(archiveVariant);

  useEffect(() => {
    supabase
      .from("product_variants")
      .select("id, sku, name, price_minor, stock_quantity, status, is_default, sort_order")
      .eq("product_id", productId)
      .order("sort_order")
      .then(({ data }) =>
        setRows([
          ...(data ?? []).map((v) => ({
            id: v.id, sku: v.sku, name: v.name, price: String(v.price_minor / 100),
            stock: v.stock_quantity === null ? "" : String(v.stock_quantity), status: v.status,
            is_default: v.is_default, sort_order: String(v.sort_order),
          })),
          blank(),
        ]),
      );
  }, [productId, reload]);

  const update = (i: number, patch: Partial<Row>) => setRows((r) => r.map((row, j) => (j === i ? { ...row, ...patch } : row)));

  const saveRow = async (row: Row) => {
    const price = Number(row.price);
    const stock = row.stock.trim() === "" ? null : Number(row.stock);
    if (row.sku.trim().length < 2 || !row.name.trim() || !Number.isFinite(price) || price < 0 || (stock !== null && (!Number.isInteger(stock) || stock < 0))) {
      setMessage("Check the SKU, name, price in NPR and stock before saving.");
      return;
    }
    try {
      await save({
        data: {
          ...(row.id ? { id: row.id } : {}), product_id: productId, sku: row.sku.trim(), name: row.name.trim(),
          price_minor: Math.round(price * 100), stock_quantity: stock, status: row.status, is_default: row.is_default,
          sort_order: Number(row.sort_order) || 0,
        },
      });
      setMessage("Option saved.");
      setReload((k) => k + 1);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not save the option.");
    }
  };

  const cell = "h-8 w-full rounded border border-border bg-card px-1 text-sm";
  return (
    <div className="md:col-span-2">
      <h3 className="font-display text-sm font-medium">Options</h3>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="text-xs text-muted-foreground">
              <th className="py-1">SKU</th><th>Name</th><th>Price (NPR)</th><th>Stock</th><th>Status</th><th>Default</th><th>Order</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id ?? "new"}>
                <td className="pr-1"><input aria-label="SKU" className={cell} value={row.sku} onChange={(e) => update(i, { sku: e.target.value })} /></td>
                <td className="pr-1"><input aria-label="Name" className={cell} value={row.name} onChange={(e) => update(i, { name: e.target.value })} /></td>
                <td className="pr-1"><input aria-label="Price in NPR" inputMode="decimal" className={cell} value={row.price} onChange={(e) => update(i, { price: e.target.value })} /></td>
                <td className="pr-1"><input aria-label="Stock, empty for untracked" inputMode="numeric" className={cell} value={row.stock} onChange={(e) => update(i, { stock: e.target.value })} /></td>
                <td className="pr-1">
                  <select aria-label="Status" className={cell} value={row.status} onChange={(e) => update(i, { status: e.target.value as Status })}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                  </select>
                </td>
                <td className="text-center"><input aria-label="Default option" type="checkbox" checked={row.is_default} onChange={(e) => update(i, { is_default: e.target.checked })} /></td>
                <td className="pr-1"><input aria-label="Sort order" inputMode="numeric" className={cell} value={row.sort_order} onChange={(e) => update(i, { sort_order: e.target.value })} /></td>
                <td className="whitespace-nowrap">
                  <Button type="button" size="sm" variant="outline" onClick={() => saveRow(row)}>{row.id ? "Save" : "Add option"}</Button>
                  {row.id && row.status !== "archived" && (
                    <Button
                      type="button" size="sm" variant="ghost"
                      onClick={async () => {
                        try { await archive({ data: { id: row.id! } }); setMessage("Option archived."); setReload((k) => k + 1); }
                        catch { setMessage("Could not archive the option."); }
                      }}
                    >Archive</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {message && <p role="status" className="mt-1 text-sm">{message}</p>}
    </div>
  );
}
