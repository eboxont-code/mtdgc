-- F6: plan fields on product_variants. All values left empty.
-- HOLD: do not apply until the move to Boxont's own Supabase.
ALTER TABLE public.product_variants
  ADD COLUMN IF NOT EXISTS duration_months integer CHECK (duration_months > 0),
  ADD COLUMN IF NOT EXISTS account_type text CHECK (account_type IN ('private','shared','own_account','licence_key')),
  ADD COLUMN IF NOT EXISTS device_limit integer CHECK (device_limit > 0),
  ADD COLUMN IF NOT EXISTS compare_at_minor integer,
  ADD COLUMN IF NOT EXISTS sale_ends_at timestamptz;
ALTER TABLE public.product_variants ADD CONSTRAINT product_variants_compare_at_gt_price CHECK (compare_at_minor IS NULL OR compare_at_minor > price_minor);
-- RLS unchanged: existing "Published variants read" and "Admin variants" policies cover the new columns.
