BEGIN;

-- Update the storage_object_id to store the path, not a UUID
ALTER TABLE public.drawing_revisions
ALTER COLUMN storage_object_id TYPE TEXT;

-- Add drawing_revision to the commentable_type enum
-- Note: This is a safe way to add a value to an enum in PostgreSQL
ALTER TYPE public.commentable_type ADD VALUE IF NOT EXISTS 'drawing_revision';

COMMIT;
