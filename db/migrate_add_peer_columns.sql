-- Migration script to add missing columns to existing rbac_group_peers table
-- This script is safe to run multiple times (uses IF NOT EXISTS logic)

-- Add missing columns to rbac_group_peers table
ALTER TABLE rbac_group_peers ADD COLUMN peer_type VARCHAR(20) DEFAULT 'manual';
ALTER TABLE rbac_group_peers ADD COLUMN user_id INTEGER;

-- Add indexes for new columns
CREATE INDEX IF NOT EXISTS idx_rbac_group_peers_user_id ON rbac_group_peers(user_id);
CREATE INDEX IF NOT EXISTS idx_rbac_group_peers_type ON rbac_group_peers(peer_type);
