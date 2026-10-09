CREATE TABLE public.payment_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  qr_image_path text,
  bank_name text,
  account_name text,
  account_number text,
  instructions text,
  fonepay_enabled boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);
GRANT SELECT ON public.payment_settings TO authenticated;
GRANT ALL ON public.payment_settings TO service_role;
ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin payment settings read" ON public.payment_settings FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Payment QR public read" ON storage.objects FOR SELECT USING (bucket_id = 'payment-qr');
CREATE POLICY "Payment QR admin insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'payment-qr' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Payment QR admin update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'payment-qr' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Payment QR admin delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'payment-qr' AND public.has_role(auth.uid(), 'admin'));