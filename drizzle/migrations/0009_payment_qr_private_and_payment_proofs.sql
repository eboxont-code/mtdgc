DROP POLICY IF EXISTS "Payment QR public read" ON storage.objects;
CREATE POLICY "Payment QR admin read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'payment-qr' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TABLE public.payment_proofs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  transaction_ref text NOT NULL,
  amount_minor integer NOT NULL,
  status text NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted','verified','rejected')),
  resubmit_requested boolean NOT NULL DEFAULT false,
  review_note text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX payment_proofs_order_idx ON public.payment_proofs(order_id, created_at DESC);
GRANT SELECT ON public.payment_proofs TO authenticated;
GRANT ALL ON public.payment_proofs TO service_role;
ALTER TABLE public.payment_proofs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner or admin read proofs" ON public.payment_proofs FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = payment_proofs.order_id AND o.user_id = auth.uid()) OR public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Payment proofs owner or admin read" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'payment-proofs' AND (public.has_role(auth.uid(), 'admin'::public.app_role) OR EXISTS (SELECT 1 FROM public.orders o WHERE o.id::text = (storage.foldername(name))[1] AND o.user_id = auth.uid())));