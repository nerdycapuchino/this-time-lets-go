BEGIN;

ALTER TABLE public.kanban_cards
ADD COLUMN IF NOT EXISTS budgeted_hours NUMERIC(10, 2);

-- Note: The get_monthly_financials function needs to be created in the Supabase SQL editor,
-- as migrations don't handle function creation/replacement idempotently as well as table alterations.
-- We will proceed assuming the function will be created manually by the user.

COMMIT;
