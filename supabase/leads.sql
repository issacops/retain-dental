CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT,
  phone TEXT,
  country_code TEXT DEFAULT '+1',
  clinic_name TEXT,
  practice_type TEXT,
  locations INT,
  source TEXT DEFAULT 'landing-page',
  status TEXT DEFAULT 'incomplete',
  form_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert_leads" ON leads FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_leads" ON leads FOR UPDATE TO anon USING (true);
CREATE POLICY "authenticated_read_leads" ON leads FOR SELECT TO authenticated USING (true);
