-- Migration: Add user_vpn_peers table to users.db
-- This table tracks VPN peer configurations for users

-- Create user_vpn_peers table
CREATE TABLE IF NOT EXISTS user_vpn_peers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    vpn_server_name VARCHAR(50) NOT NULL,
    peer_ip VARCHAR(50) NOT NULL,
    public_key TEXT NOT NULL,
    private_key TEXT NOT NULL,
    config_generated BOOLEAN DEFAULT 0,
    config_downloaded BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_user_vpn_peers_user_id ON user_vpn_peers(user_id);
CREATE INDEX IF NOT EXISTS idx_user_vpn_peers_group_id ON user_vpn_peers(group_id);
CREATE INDEX IF NOT EXISTS idx_user_vpn_peers_vpn_server ON user_vpn_peers(vpn_server_name);
CREATE INDEX IF NOT EXISTS idx_user_vpn_peers_peer_ip ON user_vpn_peers(peer_ip);



