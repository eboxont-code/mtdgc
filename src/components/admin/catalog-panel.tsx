import { CategoriesPanel } from "@/components/admin/categories-panel";
import { ProductForm } from "@/components/admin/product-form";
import { Button } from "@/components/ui/button";
import { formatNpr, STATUS_LABEL } from "@/lib/format";
import type { ProductRow } from "./panel-types";

type Props = {
 products: ProductRow[];
 draftsOnly: boolean;
 setDraftsOnly: (value: boolean) => void;
 editing: string | null;
 setEditing: (value: string | null) => void;
 onReload: () => void;
 onArchive: (id: string) => void;
};
export function CatalogPanel({ products, draftsOnly, setDraftsOnly, editing, setEditing, onReload, onArchive }: Props) {
 const lowStock = products.flatMap((product) => (product.product_variants ?? [])
  .filter((v) => v.status === "low_stock" || (v.stock_quantity !== null && v.stock_quantity <= 5))
  .map((v) => ({ product: product.name, ...v })));
 return <>
            <section className="mt-8">
              <h2 className="font-display text-lg font-medium">Catalog</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Products, categories, denominations and availability are stored in the database, so new lines can be
                added without changing the site design.
              </p>
              <div className="mt-3 max-w-full overflow-x-auto">
                <label className="mb-3 flex min-h-11 items-center gap-2 text-sm">
                  <input type="checkbox" checked={draftsOnly} onChange={(event) => setDraftsOnly(event.target.checked)} />
                  Drafts only
                </label>
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border font-display text-xs uppercase tracking-[0.1em] text-muted-foreground">
                      <th scope="col" className="py-2">Product</th>
                      <th scope="col" className="py-2">Status</th>
                      <th scope="col" className="py-2">Published</th>
                      <th scope="col" className="py-2">Options</th>
                     <th scope="col" className="py-2">From</th>
                     <th scope="col" className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.filter((product) => !draftsOnly || !product.is_published).map((product) => {
                      const prices = (product.product_variants ?? []).map((variant) => variant.price_minor);
                      return (
                        <tr key={product.id} className="border-b border-border">
                          <td className="py-2">{product.name}{!product.is_published && <span className="ml-2 inline-block rounded-md bg-secondary px-2 py-1 text-xs text-muted-foreground">Draft</span>}</td>
                          <td className="py-2">{STATUS_LABEL[product.status] ?? product.status}</td>
                          <td className="py-2">{product.is_published ? "Yes" : "No"}</td>
                          <td className="py-2">{prices.length}</td>
                          <td className="py-2">{prices.length ? formatNpr(Math.min(...prices)) : "Not set"}</td>
                          <td className="py-2">
                            <Button size="sm" variant="outline" className="mr-2" onClick={() => setEditing(product.id)}>Edit</Button>
                            {product.status !== "archived" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onArchive(product.id)}
                              >
                                Archive
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {products.length === 0 && (
                <p className="mt-3 text-sm text-muted-foreground">No products are in the catalog yet. Use Add product to create the first one.</p>
              )}
              {editing ? (
                <ProductForm
                  key={editing}
                  productId={editing === "new" ? undefined : editing}
                  onSaved={() => onReload()}
                  onCancel={() => setEditing(null)}
                />
              ) : (
                <Button size="sm" className="mt-3" onClick={() => setEditing("new")}>Add product</Button>
              )}
              <CategoriesPanel />
            </section>
            <section className="mt-8">
              <h2 className="font-display text-lg font-medium">Low stock</h2>
              {lowStock.length ? (
                <ul className="mt-2 divide-y divide-border text-sm">
                  {lowStock.map((v) => (
                    <li key={v.sku} className="flex flex-col gap-2 py-2 sm:flex-row sm:justify-between">
                      <span>{v.product}, {v.name} <span className="text-xs text-muted-foreground">({v.sku})</span></span>
                      <span>{v.stock_quantity === null ? "Marked low" : `${v.stock_quantity} left`}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">No options are low on stock or marked low.</p>
              )}
            </section>
 </>;
}
