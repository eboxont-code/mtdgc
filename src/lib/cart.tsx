import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { MAX_QTY, parseStoredCart, type CartLine } from "./cart-storage";

export { MAX_QTY } from "./cart-storage";
export type { CartLine } from "./cart-storage";


type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotalMinor: number;
  add: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  setQuantity: (sku: string, quantity: number) => void;
  remove: (sku: string) => void;
  updateFields: (sku: string, fields: Record<string, string>) => void;
  updateSnapshot: (sku: string, snapshot: Pick<CartLine, "productName" | "variantName" | "priceMinor" | "image" | "categorySlug">) => void;
  clear: () => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  hydrated: boolean;
};

const STORAGE_KEY = "mtdgc.cart.v1";

/** Sample and coming-soon items have no public price and can never sit in the cart. */
function cartable(line: Pick<CartLine, "productSlug" | "priceMinor">): boolean {
  return typeof line.productSlug === "string" && line.productSlug.trim().length > 0 && !line.productSlug.startsWith("sample-") && Number.isSafeInteger(line.priceMinor) && line.priceMinor > 0;
}
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    try {
      setLines(parseStoredCart(window.localStorage.getItem(STORAGE_KEY)));
    } catch {
      // ignore unreadable storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY && event.key !== null) return;
      setLines(parseStoredCart(event.newValue));
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // storage can be unavailable in private modes
    }
  }, [lines, hydrated]);

  const add = useCallback((line: Omit<CartLine, "quantity">, quantity = 1) => {
    if (!cartable(line)) return;
    setLines((current) => {
      const existing = current.find((item) => item.sku === line.sku);
      if (existing) {
        return current.map((item) =>
          item.sku === line.sku
            ? { ...item, ...line, quantity: Math.min(MAX_QTY, item.quantity + quantity) }
            : item,
        );
      }
      return [...current, { ...line, quantity: Math.min(MAX_QTY, quantity) }];
    });
    setAnnouncement(`${line.productName} added to your cart.`);
  }, []);

  const setQuantity = useCallback((sku: string, quantity: number) => {
    setLines((current) =>
      quantity <= 0
        ? current.filter((item) => item.sku !== sku)
        : current.map((item) => (item.sku === sku ? { ...item, quantity: Math.min(MAX_QTY, quantity) } : item)),
    );
  }, []);

  const remove = useCallback((sku: string) => {
    setLines((current) => {
      const removed = current.find((item) => item.sku === sku);
      if (removed) setAnnouncement(`${removed.productName} removed from your cart.`);
      return current.filter((item) => item.sku !== sku);
    });
  }, []);

  const updateFields = useCallback((sku: string, fields: Record<string, string>) => {
    setLines((current) => current.map((item) => (item.sku === sku ? { ...item, fields } : item)));
  }, []);

  const updateSnapshot = useCallback((sku: string, snapshot: Pick<CartLine, "productName" | "variantName" | "priceMinor" | "image" | "categorySlug">) => {
    setLines((current) => current.map((item) => item.sku === sku ? { ...item, ...snapshot } : item));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((sum, line) => sum + line.quantity, 0);
    const subtotalMinor = lines.reduce((sum, line) => sum + line.priceMinor * line.quantity, 0);
    return { lines, count, subtotalMinor, add, setQuantity, remove, updateFields, updateSnapshot, clear, drawerOpen, setDrawerOpen, hydrated };
  }, [lines, add, setQuantity, remove, updateFields, updateSnapshot, clear, drawerOpen, hydrated]);

  return (
    <CartContext.Provider value={value}>
      {children}
      <span className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</span>
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}

export function buildOrderMessage(lines: CartLine[], subtotalMinor: number, extra?: string[]): string {
  const rows = lines.map(
    (line) =>
      `${line.quantity} x ${line.productName} - ${line.variantName} (Rs ${((line.priceMinor * line.quantity) / 100).toLocaleString()})`,
  );
  return [
    "Hello MTDGC, I would like to place this order:",
    "",
    ...rows,
    ...(extra?.length ? ["", ...extra] : []),
    "",
    `Estimated total: Rs ${(subtotalMinor / 100).toLocaleString()}`,
    "Please confirm availability and payment instructions.",
  ].join("\n");
}
