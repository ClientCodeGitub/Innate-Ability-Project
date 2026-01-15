-- Supabase Database Schema for Innate Ability Project
-- Run this SQL in your Supabase SQL Editor

-- Create results table
CREATE TABLE IF NOT EXISTS results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  answers JSONB NOT NULL,
  computed_result JSONB NOT NULL,
  unlocked BOOLEAN DEFAULT FALSE NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  paddle_transaction_id TEXT,
  paddle_customer_id TEXT
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_results_unlocked ON results(unlocked);
CREATE INDEX IF NOT EXISTS idx_results_paddle_transaction ON results(paddle_transaction_id);

-- Enable Row Level Security (optional, adjust policies as needed)
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- Policy to allow service role to do everything (server-side)
-- Note: Adjust these policies based on your security requirements
CREATE POLICY "Service role can do everything" ON results
  FOR ALL
  USING (true)
  WITH CHECK (true);
