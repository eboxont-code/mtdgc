CREATE TABLE public.order_lookup_attempts (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), ip_hash text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
GRANT ALL ON public.order_lookup_attempts TO service_role;
ALTER TABLE public.order_lookup_attempts ENABLE ROW LEVEL SECURITY;
CREATE INDEX order_lookup_attempts_ip_time ON public.order_lookup_attempts (ip_hash, created_at);