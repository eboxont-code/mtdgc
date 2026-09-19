import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartLine = {
  sku: string;
  productSlug: string;
  productName: string;
  variantName: string;
  priceMinor: number;
  image: string | null;
  quantity: number;
  fields?: Record<string, string>;
};

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotalMinor: number;
  add: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  setQuantity: (sku: string, quantity: number) => void;
  remove: (sku: string) => void;
  clear: () => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  hydrated: boolean;
};

const STORAGE_KEY = "mtdgc.cart.v1";
const MAX_QTY = 20;

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) setLines(parsed as CartLine[]);
      }
    } catch {
      // ignore unreadable storage
    }
    setHydrated(true);
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
  }, []);

  const setQuantity = useCallback((sku: string, quantity: number) => {
    setLines((current) =>
      quantity <= 0
        ? current.filter((item) => item.sku !== sku)
        : current.map((item) => (item.sku === sku ? { ...item, quantity: Math.min(MAX_QTY, quantity) } : item)),
    );
  }, []);

  const remove = useCallback((sku: string) => {
    setLines((current) => current.filter((item) => item.sku !== sku));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((sum, line) => sum + line.quantity, 0);
    const subtotalMinor = lines.reduce((sum, line) => sum + line.priceMinor * line.quantity, 0);
    return { lines, count, subtotalMinor, add, setQuantity, remove, clear, drawerOpen, setDrawerOpen, hydrated };
  }, [lines, add, setQuantity, remove, clear, drawerOpen, hydrated]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
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
