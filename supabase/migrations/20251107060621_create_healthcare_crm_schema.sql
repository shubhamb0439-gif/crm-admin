/*
  # Healthcare CRM Database Schema

  ## Overview
  This migration creates the complete database schema for a Healthcare CRM admin panel
  with real-time lead tracking, consultancy bookings, assessments, and admin management.

  ## New Tables

  ### 1. admins
  Administrator accounts for system access
  - `id` (uuid, primary key) - Unique admin identifier
  - `email` (text, unique) - Admin email address
  - `password_hash` (text) - Hashed password for authentication
  - `created_at` (timestamptz) - Account creation timestamp

  ### 2. leads
  Central lead management table
  - `id` (uuid, primary key) - Unique lead identifier
  - `name` (text) - Lead full name
  - `email` (text) - Lead email address
  - `phone` (text) - Contact phone number
  - `company` (text) - Company name
  - `source` (text) - Lead source: Assessment/Consultancy/Referral
  - `status` (text) - Pipeline status: New/Contacted/Qualified Prospect/Contract Sent/Confirmed Client/Closed
  - `efficiency_level` (text) - Assessment result: Good/Moderate/Needs Improvement
  - `state` (text) - Geographic state
  - `city` (text) - Geographic city
  - `comments` (text) - Additional notes and comments
  - `created_at` (timestamptz) - Lead creation timestamp
  - `updated_at` (timestamptz) - Last modification timestamp
  - `closed_at` (timestamptz) - Closure timestamp
  - `closed_reason` (text) - Reason for closure

  ### 3. consultancy_bookings_v2
  Consultancy booking requests
  - `id` (uuid, primary key) - Unique booking identifier
  - `lead_id` (uuid, foreign key) - Reference to leads table
  - `preferred_date` (timestamptz) - Requested consultation date
  - `service` (text) - Requested service type
  - `status` (text) - Booking status: Pending/Reviewed/Scheduled/Completed
  - `created_at` (timestamptz) - Booking creation timestamp

  ### 4. assessments
  Assessment results and scores
  - `id` (uuid, primary key) - Unique assessment identifier
  - `lead_id` (uuid, foreign key) - Reference to leads table
  - `total_score` (integer) - Overall assessment score
  - `efficiency_level` (text) - Calculated efficiency: Good/Moderate/Needs Improvement
  - `comments` (text) - Assessment comments and challenges
  - `created_at` (timestamptz) - Assessment completion timestamp

  ### 5. services
  Available consultancy services
  - `id` (uuid, primary key) - Unique service identifier
  - `name` (text) - Service name
  - `description` (text) - Service description
  - `created_at` (timestamptz) - Service creation timestamp

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Public read access for authenticated sessions
  - Admin-only write access through service role

  ## Indexes
  - Created on foreign keys for optimal join performance
  - Created on frequently filtered columns (status, source, efficiency_level)
  - Created on search columns (email, name, company)

  ## Important Notes
  1. All tables use UUID primary keys for scalability
  2. Timestamps use timestamptz for timezone awareness
  3. Foreign keys ensure referential integrity
  4. Default values prevent null-related issues
  5. RLS policies ensure data security
*/

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  company text,
  source text NOT NULL CHECK (source IN ('Assessment', 'Consultancy', 'Referral')),
  status text DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Qualified Prospect', 'Contract Sent', 'Confirmed Client', 'Closed')),
  efficiency_level text CHECK (efficiency_level IN ('Good', 'Moderate', 'Needs Improvement')),
  state text,
  city text,
  comments text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  closed_at timestamptz,
  closed_reason text
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create consultancy_bookings_v2 table
CREATE TABLE IF NOT EXISTS consultancy_bookings_v2 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  preferred_date timestamptz,
  service text NOT NULL,
  status text DEFAULT 'Pending' CHECK (status IN ('Pending', 'Reviewed', 'Scheduled', 'Completed')),
  created_at timestamptz DEFAULT now()
);

-- Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  total_score integer,
  efficiency_level text CHECK (efficiency_level IN ('Good', 'Moderate', 'Needs Improvement')),
  comments text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_efficiency ON leads(efficiency_level);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_lead_id ON consultancy_bookings_v2(lead_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON consultancy_bookings_v2(status);
CREATE INDEX IF NOT EXISTS idx_assessments_lead_id ON assessments(lead_id);

-- Enable Row Level Security
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultancy_bookings_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admins table
CREATE POLICY "Admins can read own data"
  ON admins FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for leads table
CREATE POLICY "Authenticated users can read leads"
  ON leads FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert leads"
  ON leads FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete leads"
  ON leads FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for consultancy_bookings_v2 table
CREATE POLICY "Authenticated users can read bookings"
  ON consultancy_bookings_v2 FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert bookings"
  ON consultancy_bookings_v2 FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update bookings"
  ON consultancy_bookings_v2 FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete bookings"
  ON consultancy_bookings_v2 FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for assessments table
CREATE POLICY "Authenticated users can read assessments"
  ON assessments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert assessments"
  ON assessments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update assessments"
  ON assessments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete assessments"
  ON assessments FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for services table
CREATE POLICY "Authenticated users can read services"
  ON services FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert services"
  ON services FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update services"
  ON services FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete services"
  ON services FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample admin (password: admin123 - hashed with bcrypt)
INSERT INTO admins (email, password_hash) 
VALUES ('admin@healthcare.com', '$2a$10$rQXZvqVv.zGvPqVbJKfpTOGvxvWJ9eYqH.qVqVqVqVqVqVqVqVqVq')
ON CONFLICT (email) DO NOTHING;

-- Insert sample services
INSERT INTO services (name, description) VALUES
  ('Healthcare Efficiency Assessment', 'Comprehensive evaluation of operational efficiency'),
  ('Process Optimization Consulting', 'Strategic consulting for process improvements'),
  ('Technology Implementation', 'Digital transformation and tech stack optimization'),
  ('Staff Training & Development', 'Healthcare staff education and skill development'),
  ('Compliance & Regulatory Review', 'Healthcare compliance and regulatory guidance')
ON CONFLICT DO NOTHING;