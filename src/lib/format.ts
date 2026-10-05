export function formatNpr(minor: number): string {
  return `Rs ${(minor / 100).toLocaleString("en-NP", { maximumFractionDigits: 0 })}`;
}

// The only place the WhatsApp number is set. Leave empty until the owner provides a real number.
export const WHATSAPP_NUMBER: string = "";

export function whatsappLink(message?: string): string | null {
  if (!WHATSAPP_NUMBER) return null;
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const STATUS_LABEL: Record<string, string> = {
  available: "Available",
  low_stock: "Low stock",
  coming_soon: "Coming soon",
  out_of_stock: "Out of stock",
  temporarily_unavailable: "Temporarily unavailable",
  archived: "Archived",
};

export function isOrderable(status: string): boolean {
  return status === "available" || status === "low_stock";
}

export const SITE_URL = "https://mtdgc.lovable.app";
