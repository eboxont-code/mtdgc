ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS access_token_hash text;
DROP POLICY IF EXISTS "Own orders insert" ON public.orders;
REVOKE INSERT ON public.orders FROM authenticated;