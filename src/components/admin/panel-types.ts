export type ProductRow = {
  id: string;
  name: string;
  slug: string;
  status: string;
  is_published: boolean;
  product_variants: { sku: string; name: string; price_minor: number; stock_quantity: number | null; status: string }[] | null;
};
export type OrderRow = { id: string; order_number: string; status: string; total_minor: number; created_at: string };
export type TicketRow = { id: string; order_number: string | null; issue_type: string; status: string; created_at: string };
export type ReviewRow = { id: string; rating: number; body: string; created_at: string };

