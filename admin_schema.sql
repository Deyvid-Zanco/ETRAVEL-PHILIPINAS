-- Complete Admin System Setup for Philippines eTravel

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'super_admin')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Create admin_sessions table
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Add status and admin management columns to application_sessions
ALTER TABLE application_sessions 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending' 
CHECK (status IN ('pending', 'in_review', 'approved', 'rejected', 'completed'));

ALTER TABLE application_sessions 
ADD COLUMN IF NOT EXISTS admin_notes TEXT;

ALTER TABLE application_sessions 
ADD COLUMN IF NOT EXISTS assigned_admin_id UUID REFERENCES admin_users(id);

-- Create indexes for admin tables
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_id ON admin_sessions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_application_sessions_status ON application_sessions(status);
CREATE INDEX IF NOT EXISTS idx_application_sessions_assigned ON application_sessions(assigned_admin_id);

-- Create trigger for admin_users updated_at
CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to clean up expired admin sessions
CREATE OR REPLACE FUNCTION cleanup_expired_admin_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM admin_sessions WHERE expires_at < NOW();
END;
$$ language 'plpgsql';

-- Update main cleanup function to include admin sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM form_sessions WHERE expires_at < NOW();
    DELETE FROM application_sessions WHERE expires_at < NOW();
    DELETE FROM admin_sessions WHERE expires_at < NOW();
END;
$$ language 'plpgsql';

-- Insert initial admin user (password is base64 encoded "admin123philippines_salt_2024")
INSERT INTO admin_users (email, password_hash, name, role, is_active)
VALUES (
  'admin@immi-center.com',
  'YWRtaW4xMjNwaGlsaXBwaW5lc19zYWx0XzIwMjQ=',
  'System Administrator',
  'super_admin',
  true
)
ON CONFLICT (email) DO NOTHING;

-- Create a view for admin dashboard statistics
CREATE OR REPLACE VIEW admin_dashboard_stats AS
SELECT 
  COUNT(*) as total_applications,
  COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
  COUNT(*) FILTER (WHERE status = 'in_review') as in_review_count,
  COUNT(*) FILTER (WHERE status = 'approved') as approved_count,
  COUNT(*) FILTER (WHERE status = 'rejected') as rejected_count,
  COUNT(*) FILTER (WHERE completed = true) as completed_count,
  COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) as today_count,
  COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as week_count
FROM application_sessions;
