-- F19: delivered keys / credentials / invites. Read: order owner or admin. No client insert/update; writes go through service_role in admin server functions.
-- HOLD: do not apply until the move to Boxont's own Supabase.
CREATE TABLE public.order_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  order_item_id uuid NOT NULL REFERENCES public.order_items(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('key','credentials','invite','note')),
  content text NOT NULL,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  revealed_at timestamptz
);
CREATE INDEX order_deliveries_order_idx ON public.order_deliveries (order_id, created_at);
GRANT SELECT ON public.order_deliveries TO authenticated;
GRANT ALL ON public.order_deliveries TO service_role;
ALTER TABLE public.order_deliveries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner or admin read deliveries" ON public.order_deliveries FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_deliveries.order_id AND o.user_id = auth.uid()) OR public.has_role(auth.uid(), 'admin'::public.app_role));
