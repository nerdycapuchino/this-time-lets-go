BEGIN;

-- Makes the project_milestone_id column nullable in the drawing_revisions table.
-- This is a required change to support the project-level "Revision Hub" feature,
-- allowing for assets that are not tied to a specific milestone.
ALTER TABLE public.drawing_revisions
ALTER COLUMN project_milestone_id DROP NOT NULL;

COMMIT;
