CREATE TABLE public.order_status_events (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE, status text NOT NULL, note text, created_by uuid, created_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT ON public.order_status_events TO authenticated;
GRANT ALL ON public.order_status_events TO service_role;
ALTER TABLE public.order_status_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin status events" ON public.order_status_events FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE INDEX order_status_events_order ON public.order_status_events (order_id, created_at);