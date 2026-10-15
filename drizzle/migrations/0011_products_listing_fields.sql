-- F5: listing fields on products. New values are left empty for the admin (no invented warranty or delivery times).
-- HOLD: do not apply until the move to Boxont's own Supabase.
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS product_type text NOT NULL DEFAULT 'game_topup' CHECK (product_type IN ('software_key','subscription','gift_card','game_topup')),
  ADD COLUMN IF NOT EXISTS delivery_channel text NOT NULL DEFAULT 'email_and_order_page' CHECK (delivery_channel IN ('email','order_page','email_and_order_page')),
  ADD COLUMN IF NOT EXISTS activation_steps jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(activation_steps) = 'array' AND jsonb_array_length(activation_steps) <= 8),
  ADD COLUMN IF NOT EXISTS warranty_days integer CHECK (warranty_days >= 0),
  ADD COLUMN IF NOT EXISTS warranty_note text,
  ADD COLUMN IF NOT EXISTS system_requirements text,
  ADD COLUMN IF NOT EXISTS delivery_time_label text,
  ADD COLUMN IF NOT EXISTS region_locked boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS refund_note text,
  ADD COLUMN IF NOT EXISTS collection text,
  ADD COLUMN IF NOT EXISTS pairs_with text[] NOT NULL DEFAULT '{}';
UPDATE public.products p SET product_type = CASE c.slug
    WHEN 'software' THEN 'software_key'
    WHEN 'subscriptions' THEN 'subscription'
    WHEN 'ai-tools' THEN 'subscription'
    WHEN 'gift-cards' THEN 'gift_card'
    ELSE 'game_topup' END
  FROM public.categories c WHERE c.id = p.category_id;
CREATE INDEX IF NOT EXISTS products_type_collection_idx ON public.products (product_type, collection);
-- RLS unchanged: existing "Published products read" and "Admin products" policies cover the new columns.
