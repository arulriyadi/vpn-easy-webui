-- Migration script to add assigned_at column to existing user_groups table
-- This script is safe to run multiple times (uses IF NOT EXISTS logic)

-- Add assigned_at column to user_groups table
ALTER TABLE user_groups ADD COLUMN assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Add indexes for performance (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_user_groups_user_id ON user_groups(user_id);
CREATE INDEX IF NOT EXISTS idx_user_groups_group_id ON user_groups(group_id);
CREATE INDEX IF NOT EXISTS idx_user_groups_vpn_generated ON user_groups(vpn_peer_generated);
