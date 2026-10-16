-- Catch-up: storage buckets exist on live Lovable Cloud but were not in drizzle 0000-0009
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES
 ('payment-proofs','payment-proofs',false,5242880,NULL),
 ('payment-qr','payment-qr',false,2097152,NULL)
ON CONFLICT (id) DO UPDATE SET public=false, file_size_limit=EXCLUDED.file_size_limit;
