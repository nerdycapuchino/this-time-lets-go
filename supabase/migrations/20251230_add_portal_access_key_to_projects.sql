
ALTER TABLE projects
ADD COLUMN portal_access_key UUID DEFAULT uuid_generate_v4();

UPDATE projects
SET portal_access_key = uuid_generate_v4()
WHERE portal_access_key IS NULL;
