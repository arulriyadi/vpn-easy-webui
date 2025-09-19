-- Migration: Add user_groups table to users.db
-- This table stores the relationship between users and RBAC groups

-- Create user_groups table
CREATE TABLE IF NOT EXISTS user_groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    vpn_peer_generated BOOLEAN DEFAULT 0,
    peer_ip VARCHAR(50),
    peer_status VARCHAR(20) DEFAULT 'pending', -- pending, active, inactive
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, group_id)
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_user_groups_user_id ON user_groups(user_id);
CREATE INDEX IF NOT EXISTS idx_user_groups_group_id ON user_groups(group_id);
CREATE INDEX IF NOT EXISTS idx_user_groups_vpn_generated ON user_groups(vpn_peer_generated);

-- Insert sample data (optional - for testing)
-- INSERT INTO user_groups (user_id, group_id, assigned_at, vpn_peer_generated, peer_status) 
-- VALUES (1, 1, CURRENT_TIMESTAMP, 0, 'pending');



