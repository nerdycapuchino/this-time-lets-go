BEGIN;

-- Add project_id for direct querying and simpler RLS
ALTER TABLE public.drawing_revisions
ADD COLUMN project_id BIGINT REFERENCES public.projects(id) ON DELETE CASCADE;

-- Add file_name to easily group and version files by name
ALTER TABLE public.drawing_revisions
ADD COLUMN file_name TEXT;

-- Populate the new project_id for existing rows from the project_milestones table.
-- This ensures data integrity for records created before this change.
UPDATE public.drawing_revisions dr
SET project_id = pm.project_id
FROM public.project_milestones pm
WHERE dr.project_milestone_id = pm.id
AND dr.project_id IS NULL;

-- Now that existing rows are populated, enforce NOT NULL on project_id for all new rows.
ALTER TABLE public.drawing_revisions
ALTER COLUMN project_id SET NOT NULL;

-- For existing rows, provide a placeholder file_name.
-- This is necessary to enforce the NOT NULL constraint.
-- A manual backfill would be required for true historical accuracy.
UPDATE public.drawing_revisions
SET file_name = 'untitled-backfill.pdf'
WHERE file_name IS NULL;

-- Enforce NOT NULL on file_name for all new rows.
ALTER TABLE public.drawing_revisions
ALTER COLUMN file_name SET NOT NULL;

-- Add a new, more effective unique constraint for tracking file versions per project.
-- This is the core of the new versioning system.
ALTER TABLE public.drawing_revisions
ADD CONSTRAINT drawing_revisions_project_file_version_unique
UNIQUE (project_id, file_name, version);

COMMIT;
