CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  date DATE NOT NULL,
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
