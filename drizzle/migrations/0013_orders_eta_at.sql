-- P7 / P6-ETA: admin-set ETA on orders.
-- HOLD: do not apply until the move to Boxont's own Supabase.
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS eta_at timestamptz;
