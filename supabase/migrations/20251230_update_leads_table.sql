CREATE TYPE public.lead_pipeline_stage AS ENUM (
  'inquiry',
  'meeting',
  'proposal',
  'negotiation',
  'closed_won',
  'closed_lost'
);

ALTER TABLE public.leads
ADD COLUMN pipeline_stage public.lead_pipeline_stage NOT NULL DEFAULT 'inquiry',
ADD COLUMN deal_value NUMERIC;
