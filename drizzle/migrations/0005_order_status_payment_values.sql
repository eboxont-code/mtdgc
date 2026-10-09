ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'pending_payment';
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'payment_submitted';
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'verified';
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'rejected';
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'delivered';