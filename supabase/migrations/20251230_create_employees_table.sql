CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  role TEXT NOT NULL,
  email TEXT,
  hourly_rate NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
