
-- Create the inventory table
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_name TEXT NOT NULL,
  category TEXT,
  stock_level NUMERIC DEFAULT 0,
  unit TEXT,
  min_stock_level NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the project_materials table to link inventory items to projects
CREATE TABLE project_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  item_id UUID REFERENCES inventory(id) ON DELETE RESTRICT,
  quantity NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add a new role for the factory manager
-- This is a placeholder, actual role management might be handled elsewhere
-- INSERT INTO pg_roles (rolname) VALUES ('factory_mgr') ON CONFLICT DO NOTHING;
