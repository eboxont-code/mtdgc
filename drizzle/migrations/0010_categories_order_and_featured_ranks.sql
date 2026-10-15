-- F1: category names, order and descriptions; featured_rank. No product prices touched.
-- HOLD: do not apply until the move to Boxont's own Supabase.
UPDATE public.categories SET name = 'Software', sort_order = 1, is_published = true, description = 'Licence keys and activations for Windows, Office, antivirus, VPN and design or productivity tools. Each listing shows what you receive, how it is delivered and how to activate it.' WHERE slug = 'software';
UPDATE public.categories SET sort_order = 2, description = 'Streaming, music, AI tools and cloud storage on prepaid plans. Each plan shows its duration and whether the account is private or shared.' WHERE slug = 'subscriptions';
UPDATE public.categories SET sort_order = 3, description = 'Gift cards and wallet codes, sent as a code you redeem on the official site.' WHERE slug = 'gift-cards';
UPDATE public.categories SET sort_order = 4, description = 'Game currency and passes, credited to the player ID you give us.' WHERE slug = 'game-top-ups';
UPDATE public.categories SET name = 'AI tools', is_published = false WHERE slug = 'ai-tools';
UPDATE public.products SET featured_rank = v.rank FROM (VALUES
  ('netflix-subscription', 1), ('roblox-gift-card', 20), ('steam-wallet-code', 21), ('pubg-mobile-uc', 30),
  ('free-fire-diamonds', 31), ('mobile-legends-diamonds', 32), ('clash-of-clans-passes', 33)
) AS v(slug, rank) WHERE public.products.slug = v.slug;
