-- Add application_sessions table for payment-linked form persistence
CREATE TABLE IF NOT EXISTS application_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id VARCHAR(255) UNIQUE NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255),
  travel_method VARCHAR(20) NOT NULL CHECK (travel_method IN ('Flight', 'Cruise')),
  travel_type VARCHAR(20) NOT NULL CHECK (travel_type IN ('arrival', 'departure')),
  form_session_token VARCHAR(255) UNIQUE NOT NULL,
  form_data JSONB NOT NULL DEFAULT '{}',
  current_step VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  completed BOOLEAN DEFAULT FALSE
);

-- Create additional indexes for the application_sessions table
CREATE INDEX IF NOT EXISTS idx_application_sessions_stripe ON application_sessions(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_application_sessions_token ON application_sessions(form_session_token);
CREATE INDEX IF NOT EXISTS idx_application_sessions_email ON application_sessions(customer_email);
CREATE INDEX IF NOT EXISTS idx_application_sessions_expires ON application_sessions(expires_at);

-- Create trigger for application_sessions updated_at
DROP TRIGGER IF EXISTS update_application_sessions_updated_at ON application_sessions;
CREATE TRIGGER update_application_sessions_updated_at
    BEFORE UPDATE ON application_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Update cleanup function to handle both tables
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM form_sessions WHERE expires_at < NOW();
    DELETE FROM application_sessions WHERE expires_at < NOW();
END;
$$ language 'plpgsql';
