-- Migration: Enhance rbac_group_peers table to support user-based peers
-- This adds columns to track user-based peers vs manual peers

-- Add new columns to existing rbac_group_peers table
ALTER TABLE rbac_group_peers ADD COLUMN peer_type VARCHAR(20) DEFAULT 'manual'; -- user, manual
ALTER TABLE rbac_group_peers ADD COLUMN user_id INTEGER; -- Reference to users table

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_rbac_group_peers_user_id ON rbac_group_peers(user_id);
CREATE INDEX IF NOT EXISTS idx_rbac_group_peers_type ON rbac_group_peers(peer_type);

-- Update existing records to have peer_type = 'manual'
UPDATE rbac_group_peers SET peer_type = 'manual' WHERE peer_type IS NULL;



