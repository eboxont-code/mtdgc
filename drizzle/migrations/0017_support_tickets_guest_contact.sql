-- Item 21: guest support requests. Inserts go through the createSupportTicket server function (service_role); no anon insert policy.
-- HOLD: do not apply until the move to Boxont's own Supabase.
ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS contact text;
ALTER TABLE public.support_tickets ADD CONSTRAINT support_tickets_status_check CHECK (status IN ('open','in_progress','resolved'));
