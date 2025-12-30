CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  service_requested TEXT DEFAULT 'Online Business Launchpad',
  status TEXT DEFAULT 'new', -- new, contacted, qualified, converted, lost
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
